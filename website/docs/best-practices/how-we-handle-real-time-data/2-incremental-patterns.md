---
title: "Incremental patterns for near real-time data"
id: "2-incremental-patterns"
description: Learn how to implement incremental models with MERGE, CDC, and microbatch strategies for near real-time data processing
hoverSnippet: Learn incremental patterns for near real-time data with dbt
---

This section covers three core incremental patterns for achieving near real-time data freshness:

1. [Incremental MERGE from append-only tables](#incremental-merge-from-append-only-tables)
2. [CDC with Snowflake Streams](#cdc-with-snowflake-streams)
3. [Microbatch for large time-series tables](#microbatch-for-large-time-series-tables)


:::info Snowflake-specific pattern
Some patterns on this guide uses Snowflake-specific features. Other warehouses have similar features with different implementations. Refer to the [additional resources](/best-practices/how-we-handle-real-time-data/3-warehouse-native-features#resources-by-warehouse) section for adapter-specific documentation.  
:::

## Pattern 1: Incremental MERGE from append-only tables {#incremental-merge-from-append-only-tables}

This pattern uses the `merge` incremental strategy to upsert (insert + update) new and updated rows into a target table. Most data platforms support the `merge` strategy. See the [supported incremental strategies by adapter](/docs/build/incremental-strategy#supported-incremental-strategies-by-adapter) for details.

"Append-only tables" refers to a data pattern where source data continuously receives new rows without updates or deletes.

### When to use the merge strategy

Use this pattern when raw events continuously land into a staging table and you want a near real-time fact table updated every few minutes.

### Example model

In this example, assume you have raw events continuously landing into `raw.events` (using Snowpipe, Databricks Auto Loader, Kafka, or a similar ingestion mechanism) and you're looking for a near real‑time fact table `analytics.fct_events` updated every few minutes.

Configure the SQL model with the following settings:

- Use the `incremental` filter to only scan rows newer than the latest timestamp already in the target.
- Use `incremental_strategy='merge'` with `unique_key=event_id` to give you idempotent upserts (inserts + updates).
- Cluster by date using `cluster_by=['event_date']` helps with query pruning during `MERGE` operations (syntax varies by warehouse).
- Run the model every few minutes to achieve a freshness service level agreement (SLA) measured in minutes, depending on ingestion and job scheduling.

The following example uses Snowflake SQL syntax (`::`  type casting, `timestamp_ntz`, `cluster_by` config). Make sure you adapt the SQL and clustering syntax for your warehouse.

<File name="models/fct_events.sql">

```sql
{{ config(
    materialized = 'incremental',
    incremental_strategy = 'merge',         -- default on Snowflake
    unique_key = 'event_id',
    cluster_by = ['event_date']             -- helps MERGE performance (syntax varies by warehouse)
) }}

with source_events as (

    select
        event_id,
        event_ts::timestamp_ntz       as event_ts,  -- Snowflake syntax for type casting
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
</File>

To ensure the best results:

- Use clustering keys wisely for better `MERGE` performance.
- Monitor `MERGE` performance as your table grows.
- Consider adding a lookback window (for example, `event_ts > max(event_ts) - interval '1 hour'`) to handle late-arriving data.

## Pattern 2: CDC with Snowflake Streams {#cdc-with-snowflake-streams}

This pattern leverages Snowflake's native Change Data Capture (CDC) capabilities through [Streams](https://docs.snowflake.com/en/user-guide/streams-intro), a Snowflake-specific feature which tracks changes (inserts, updates, deletes) to source tables.

### When to use CDC

Use CDC when:

- You have source tables that receive frequent updates (not just appends).
- You need to capture both new records and changes to existing records.
- You want to avoid full table scans on large source tables.

### Setup
To use this pattern, set up the stream in your data warehouse and then create a model to consume the stream.

1. Create the stream (one-time, outside dbt):

```sql
create or replace stream RAW.EVENTS_STREAM
on table RAW.EVENTS;
```

2. Create a model consuming the stream:

<File name="models/fct_events_cdc.sql">

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
</File>

### Pattern distinctions
There are some key differences from [pattern 1](#incremental-merge-from-append-only-tables):

- Streams only return changed rows, so you don’t need an `is_incremental()` time filter. Each run processes only the changes available at the moment.
- Run the model every few minutes to pull new changes and merge them into `fct_events`.
- This gives you a CDC-style pipeline. Snowflake Streams captures changes, and dbt handles transformations, tests, and lineage.

## Pattern 3: Microbatch for large time-series tables {#microbatch-for-large-time-series-tables}

For large `fact` tables where backfills or long lookback windows are challenging, use `incremental_strategy='microbatch'` (available in <Constant name="core" /> v1.9 or higher and Latest release track in <Constant name="dbt_platform" />). Refer to [incremental microbatch](/docs/build/incremental-microbatch) for more details. Note that Microsoft Fabric doesn't support microbatch yet. See [incremental strategy by adapter](/docs/build/incremental-strategy#supported-incremental-strategies-by-adapter) for more details.

:::info microbatch must have event_time

Every upstream model feeding this microbatch model must also be configured with `event_time` so dbt can push time-filters upstream. Otherwise, each batch could re-scan full upstream tables.
:::

### When to use microbatch

- You have massive time-series tables (billions of rows).
- Backfills are slow and risky with traditional incremental approaches.
- You need to reprocess data in manageable chunks.
- Late-arriving data is common.

### Model configuration

Let's say you have a `fact_events` table with a `event_ts` column and you want to process it in hourly chunks. You can configure the model as follows:

<File name="models/fct_events_microbatch.sql">

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
</File>

### Key behavior

- Use microbatch for massive fact tables (clickstream, IoT, point-of-sale) with multi-year history.
- No `is_incremental() block` needed &mdash; dbt automatically generates the appropriate `WHERE event_ts BETWEEN..` predicates per batch based on `event_time`, `batch_size`, `begin`, `lookback`, and so on.
- Each run processes multiple smaller queries (one per batch), making larger backfills safer and easier to retry.
- The `lookback` parameter automatically handles late-arriving data by reprocessing recent batches.
- Schedule jobs based on your SLA.

## Choosing the right incremental pattern

The pattern you select will depend on your use case. Start with [pattern 1](#incremental-merge-from-append-only-tables) (`MERGE`), since it's appropriate for most use cases. Upgrade to [pattern 2](#cdc-with-snowflake-streams) (use your data warehouse's native CDC features) when you need efficient CDC. Reach for [pattern 3](#microbatch-for-large-time-series-tables) (Microbatch) when dealing with massive scale.


Use the following table to help you choose the right pattern:

| Pattern | Best for | Key benefit |
| ------- | -------- | ----------- |
| `merge` from append-only | Most standard use cases | Simple, widely understood |
| CDC with Streams | Tables with frequent updates | Efficient change capture |
| Microbatch | Massive time-series tables | Safe backfills, late-data handling |


## Related docs
- [Incremental models](/docs/build/incremental-models-overview)
- [Microbatch incremental models](/docs/build/incremental-microbatch)
- [Configuring incremental models in dbt](/docs/build/incremental-models)
