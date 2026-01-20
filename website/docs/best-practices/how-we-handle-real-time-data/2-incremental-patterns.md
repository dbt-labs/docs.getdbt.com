---
title: "Incremental patterns for near real-time data"
description: Learn how to implement incremental models with MERGE, CDC, and microbatch strategies for near real-time data processing
hoverSnippet: Learn incremental patterns for near real-time data with dbt
---

This page covers three core incremental patterns for achieving near real-time data freshness with dbt:

1. [Incremental MERGE from append-only tables](#pattern-1-incremental-merge-from-append-only-tables)
2. [CDC with Snowflake Streams](#pattern-2-cdc-with-snowflake-streams)
3. [Microbatch for large time-series tables](#pattern-3-microbatch-for-large-time-series-tables)

---

## Pattern 1: Incremental MERGE from append-only tables

This pattern is ideal when:
- Raw events are continuously landed into a staging table (via Snowpipe, Fivetran, or similar)
- You want a near real-time fact table updated every few minutes
- Source data may contain duplicates or late-arriving updates

### Assumptions

- Raw events are continuously landed into `RAW.EVENTS` (Snowpipe or similar)
- You want a **near real-time fact table** `ANALYTICS.FCT_EVENTS` updated every few minutes
- The table has a unique key that can be used for deduplication

### Model: `models/fct_events.sql`

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

### Why this works for near real-time

- The **incremental filter** only scans rows newer than the latest `event_ts` already in the target
- `incremental_strategy='merge'` plus `unique_key='event_id'` gives you **idempotent upserts** (inserts + updates)
- `cluster_by=['event_date']` allows Snowflake to **micro-partition prune** during MERGE, dramatically improving performance on large tables
- Running this model every few minutes gives you a **freshness SLA measured in minutes**, bounded by your job schedule and ingestion latency

### Best practices

- **Use clustering keys wisely**: Clustering by date columns helps with query pruning during MERGE operations
- **Monitor MERGE performance**: As your table grows, MERGE operations can become expensive. Consider partitioning strategies or switching to append-only patterns where appropriate
- **Handle late-arriving data**: The `where event_ts > max(event_ts)` filter may miss late-arriving events. Consider adding a lookback window (e.g., `event_ts > max(event_ts) - interval '1 hour'`)

---

## Pattern 2: CDC with Snowflake Streams

This pattern leverages Snowflake's native CDC capabilities through Streams, which track changes (inserts, updates, deletes) to source tables.

### When to use this pattern

- You have source tables that receive frequent updates (not just appends)
- You need to capture both new records and changes to existing records
- You want to avoid full table scans on large source tables
- You're using Snowflake (Streams are Snowflake-specific)

### Setup

1. **Create the stream** (one-time, outside dbt):
    
```sql
create or replace stream RAW.EVENTS_STREAM
on table RAW.EVENTS;
```
    
2. **Define the stream as a source** in dbt:

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

3. **dbt model** consuming the stream:
    
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

- **No `is_incremental()` time filter needed**: The stream only exposes changed rows, so you don't need to filter by timestamp
- **Stream offset management**: Each dbt run advances the stream's offset and processes the changes accumulated since the last run
- **Handles all DML operations**: Streams capture INSERT, UPDATE, and DELETE operations, not just new records

### Benefits

- **Efficient change capture**: Streams only return changed rows, avoiding full table scans
- **CDC-like behavior**: Track updates and deletes, not just inserts
- **Warehouse-native**: Leverages Snowflake's built-in CDC capabilities
- **Automatic offset management**: Snowflake manages the stream offset for you

### Considerations

- **Stream consumption**: Once consumed, data is removed from the stream. Failed dbt runs may cause data loss unless you handle errors carefully
- **Multiple consumers**: If multiple processes read from the same stream, consider using separate streams or table clones
- **Stream latency**: Streams have minimal latency (typically seconds), making them excellent for near real-time patterns

---

## Pattern 3: Microbatch for large time-series tables

For very large fact tables where backfills or long lookback windows are painful, use **`incremental_strategy='microbatch'`** (dbt Core ≥ 1.9).

### When to use this pattern

- You have massive time-series tables (billions of rows)
- Backfills are slow and risky with traditional incremental approaches
- You need to reprocess data in manageable chunks
- Late-arriving data is common and needs systematic handling

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

- **No `is_incremental()` block needed**: dbt automatically generates the appropriate `WHERE event_ts BETWEEN …` predicates per batch based on `event_time`, `batch_size`, `begin`, `lookback`, etc.
- **Multiple smaller queries**: Each run is decomposed into multiple smaller queries, one per batch (e.g., each hour), which makes large backfills safer and easier to retry
- **Automatic late-data handling**: The `lookback` parameter automatically reprocesses recent batches to catch late-arriving data

### Critical requirement: Upstream event_time

To avoid huge scans, **every upstream model feeding this microbatch model must also be configured with `event_time`** so dbt can push time-filters all the way upstream. Otherwise, each batch could re-scan full upstream tables.

Example upstream staging model:

```sql
{{ config(
    materialized = 'view',
    event_time = 'event_ts'  -- Required for proper filter pushdown
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

- Use microbatch for **"mega" fact tables** (clickstream, IoT, POS) with multi-year history
- Schedule jobs every N minutes/hours depending on SLA
- `lookback` parameter handles late-arriving facts automatically
- Perfect for backfills: reprocessing 2 years of data in hourly chunks is much safer than one massive operation

### Benefits

- **Safer backfills**: Process large historical periods in manageable chunks
- **Better observability**: See progress batch-by-batch during long runs
- **Automatic retry logic**: If a batch fails, you can retry just that batch
- **Built-in late-data handling**: `lookback` parameter systematically reprocesses recent periods

### Considerations

- **Requires dbt Core 1.9+**: This is a newer feature
- **Upstream coordination**: All upstream models need `event_time` configured for optimal performance
- **Batch size tuning**: Too small = many queries, too large = back to original performance issues

---

## Choosing the right incremental pattern

| Pattern | Best For | Key Benefit | Main Limitation |
|---------|----------|-------------|-----------------|
| **MERGE from append-only** | Most standard use cases | Simple, widely understood | May process more data than needed |
| **CDC with Streams** | Tables with frequent updates | Efficient change capture | Snowflake-specific |
| **Microbatch** | Massive time-series tables | Safe backfills, late-data handling | Requires upstream coordination |

Start with **Pattern 1 (MERGE)** for most use cases. Upgrade to **Pattern 2 (Streams)** when you need efficient CDC. Reach for **Pattern 3 (Microbatch)** when you're dealing with truly massive scale and need better backfill safety.

For more information, refer to:
- [Incremental models](/docs/build/incremental-models-overview)
- [Microbatch incremental models](/docs/build/incremental-microbatch)
- [Configuring incremental models in dbt](/docs/build/incremental-models)
