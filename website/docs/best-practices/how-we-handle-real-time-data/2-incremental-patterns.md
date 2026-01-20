---
title: "Incremental patterns for near real-time data"
id: "2-incremental-patterns"
description: Learn how to implement incremental models with MERGE, CDC, and microbatch strategies for near real-time data processing
hoverSnippet: Learn incremental patterns for near real-time data with dbt
---

:::info Snowflake examples ahead
This page uses Snowflake for code examples. The concepts apply across data warehouses, but syntax and specific features (like Streams) may vary by platform.
:::

This page covers three core incremental patterns for achieving near real-time data freshness:

1. [Incremental MERGE from append-only tables](#pattern-1-incremental-merge-from-append-only-tables)
2. [CDC with Snowflake Streams](#pattern-2-cdc-with-snowflake-streams)
3. [Microbatch for large time-series tables](#pattern-3-microbatch-for-large-time-series-tables)

## Pattern 1: Incremental MERGE from append-only tables

Use this pattern when raw events continuously land into a staging table and you want a near real-time fact table updated every few minutes.

### When to use MERGE

- Raw events are continuously landed (via streaming ingestion or frequent batch loads)
- You want a fact table updated every few minutes
- Source data may contain duplicates or late-arriving updates

### Model example

```sql
{{ config(
    materialized = 'incremental',
    incremental_strategy = 'merge',         -- default on Snowflake
    unique_key = 'event_id',
    cluster_by = ['event_date'],            -- helps MERGE performance
    snowflake_warehouse = 'TRANSFORM_WH'
) }}

with source_events as (

    select
        event_id,
        event_ts::timestamp_ntz       as event_ts,
        to_date(event_ts)             as event_date,
        user_id,
        event_type,
        payload
    from {{ source('raw', 'events') }}

    {% if is_incremental() %}
      -- Only pull new/changed rows since last successful load
      where event_ts >
            (select max(event_ts) from {{ this }})
    {% endif %}

),

deduped as (

    -- optional: if the raw feed can produce duplicates
    select *
    from (
        select
            *,
            row_number() over (
                partition by event_id
                order by event_ts desc
            ) as _rn
        from source_events
    )
    where _rn = 1

)

select
    event_id,
    event_ts,
    event_date,
    user_id,
    event_type,
    payload
from deduped;
```

### Why this works

- The incremental filter only scans rows newer than the latest timestamp already in the target
- `incremental_strategy='merge'` with `unique_key` gives you idempotent upserts (inserts + updates)
- Clustering by date helps with query pruning during MERGE operations
- Running this model every few minutes gives you freshness measured in minutes

### Best practices

- Use clustering keys wisely for better MERGE performance
- Monitor MERGE performance as your table grows
- Consider adding a lookback window (e.g., `event_ts > max(event_ts) - interval '1 hour'`) to handle late-arriving data

## Pattern 2: CDC with Snowflake Streams

:::info Snowflake-specific pattern
This pattern uses Snowflake Streams, a Snowflake-specific feature. Other warehouses have similar CDC capabilities with different implementations.
:::

This pattern leverages Snowflake's native CDC capabilities through Streams, which track changes (inserts, updates, deletes) to source tables.

### When to use CDC

- You have source tables that receive frequent updates (not just appends)
- You need to capture both new records and changes to existing records
- You want to avoid full table scans on large source tables

### Setup

First, create the stream (one-time, outside dbt):

```sql
create or replace stream RAW.EVENTS_STREAM
on table RAW.EVENTS;
```

Define the stream as a source in dbt:

```yaml
# models/sources.yml
version: 2

sources:
  - name: raw
    schema: raw
    tables:
      - name: events_stream
        description: "Stream tracking changes to RAW.EVENTS"
```

### Model consuming the stream

```sql
{{ config(
    materialized = 'incremental',
    incremental_strategy = 'merge',
    unique_key = 'event_id',
    cluster_by = ['event_date'],
    snowflake_warehouse = 'TRANSFORM_WH'
) }}

with changes as (

    select
        event_id,
        event_ts::timestamp_ntz        as event_ts,
        to_date(event_ts)              as event_date,
        user_id,
        event_type,
        payload,
        metadata$action                as change_type
    -- points at the STREAM, not the table
    from {{ source('raw', 'events_stream') }}

),

filtered as (

    select *
    from changes
    where change_type in ('INSERT', 'UPDATE')
    -- If you want to physically delete, you could also handle 'DELETE' here

)

select
    event_id,
    event_ts,
    event_date,
    user_id,
    event_type,
    payload
from filtered;
```

### Key differences from Pattern 1

- No `is_incremental()` time filter needed - the stream only exposes changed rows
- Stream offset management happens automatically
- Captures INSERT, UPDATE, and DELETE operations

### Considerations

- Once consumed, data is removed from the stream - handle errors carefully to avoid data loss
- If multiple processes need the same changes, use separate streams or table clones
- Streams have minimal latency (typically seconds)

## Pattern 3: Microbatch for large time-series tables

For massive fact tables where backfills or long lookback windows are challenging, use `incremental_strategy='microbatch'` (dbt Core ≥ 1.9).

### When to use microbatch

- You have massive time-series tables (billions of rows)
- Backfills are slow and risky with traditional incremental approaches
- You need to reprocess data in manageable chunks
- Late-arriving data is common

### Model configuration

```sql
{{ config(
    materialized        = 'incremental',
    incremental_strategy= 'microbatch',
    event_time          = 'event_ts',   -- time column in this model
    batch_size          = 'hour',       -- process in hourly chunks
    lookback            = 1,            -- reprocess 1 prior batch to catch late data
    unique_key          = 'event_id',
    cluster_by          = ['event_date'],
    full_refresh        = false
) }}

select
    event_id,
    event_ts::timestamp_ntz   as event_ts,
    to_date(event_ts)         as event_date,
    user_id,
    event_type,
    payload
from {{ ref('stg_events') }};
```

### Key behavior

- No `is_incremental()` block needed - dbt automatically generates time-based predicates per batch
- Each run processes multiple smaller queries (one per batch)
- The `lookback` parameter automatically reprocesses recent batches to catch late-arriving data

### Critical requirement

Every upstream model feeding this microbatch model must also be configured with `event_time` so dbt can push time-filters upstream. Otherwise, each batch could re-scan full upstream tables.

Example upstream staging model:

```sql
{{ config(
    materialized = 'view',
    event_time = 'event_ts'
) }}

select
    event_id,
    event_ts::timestamp_ntz as event_ts,
    user_id,
    event_type,
    payload
from {{ source('raw', 'events') }};
```

### Typical usage

- Use microbatch for massive fact tables (clickstream, IoT, point-of-sale) with multi-year history
- Schedule jobs based on your SLA
- `lookback` handles late-arriving data automatically
- Safer backfills - process large historical periods in manageable chunks

## Choosing the right incremental pattern

| Pattern | Best for | Key benefit |
| ------- | -------- | ----------- |
| MERGE from append-only | Most standard use cases | Simple, widely understood |
| CDC with Streams | Tables with frequent updates | Efficient change capture |
| Microbatch | Massive time-series tables | Safe backfills, late-data handling |

Start with Pattern 1 (MERGE) for most use cases. Upgrade to Pattern 2 (Streams) when you need efficient CDC. Reach for Pattern 3 (Microbatch) when dealing with massive scale.

For more information, refer to:
- [Incremental models](/docs/build/incremental-models-overview)
- [Microbatch incremental models](/docs/build/incremental-microbatch)
- [Configuring incremental models in dbt](/docs/build/incremental-models)
