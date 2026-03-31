---
title: "Lambda views for near real-time dashboards"
id: "4-lambda-views"
description: Combine batch and real-time data in a single view for operational dashboards
hoverSnippet: Learn the lambda view pattern for near real-time operational dashboards
---

:::info Snowflake examples ahead
This page uses Snowflake for code examples, but you can adapt the lambda view pattern to other warehouses.
:::

A lambda view pattern combines a batch / incremental fact table with a small near real-time (NRT) slice of very recent data and exposes them through a single view. This is a legacy-but-still-useful pattern some teams have used to deliver near real‑time operational dashboards on top of dbt and a warehouse.

## When to use lambda views

- You need fresher reads than your normal incremental schedule, but
- You can't (or don't want to) use [dynamic tables](/reference/resource-configs/snowflake-configs#dynamic-tables) or [materialized views](/docs/build/materializations#materialized-view), or you want to keep logic entirely in dbt SQL.
The examples used in this page assume the following setup:
### Assumptions
The examples used in this page assume the following setup:
- Raw events land continuously into `raw.events` using your warehouse's streaming ingestion feature (like Snowpipe, Databricks Auto Loader, Kafka, or a similar ingestion mechanism).
- You already maintain an [incremental fact table](/best-practices/how-we-handle-real-time-data/2-incremental-patterns#incremental-merge-from-append-only-tables) that is rebuilt every few minutes using `incremental_strategy='merge'`.
- Most dashboards are fine reading from that incremental table, but a small set of operational dashboards want "as‑of‑now" data (for example, the last few minutes of events).

### How this pattern works

- The base incremental table is rebuilt every few minutes using `incremental_strategy='merge'`.
- The NRT view is a view that selects only events newer than the max `event_ts` already persisted in the base incremental table.
- The lambda view `UNION ALL`s the base table and the NRT view, de-duplicating rows based on primary key semantics.

Downstream BI or dashboards query only the lambda view.

## Base incremental table

You can reuse the incremental `merge` from [Snowflake pattern 1](/best-practices/how-we-handle-real-time-data/2-incremental-patterns#incremental-merge-from-append-only-tables) as your base table; for completeness:

```sql
-- models/fct_events.sql
{{ config(
    materialized = 'incremental',
    incremental_strategy = 'merge',
    unique_key = 'event_id',
    cluster_by = ['event_date'],
    snowflake_warehouse = 'TRANSFORM_WH'
) }}

with source_events as (

    select
        event_id,
        event_ts::timestamp_ntz       as event_ts,
        to_date(event_ts)            as event_date,
        user_id,
        event_type,
        payload
    from {{ source('raw', 'events') }}

    {% if is_incremental() %}
      -- Only pull new/changed rows since last successful load
      where event_ts >
            (select max(event_ts) from {{ this }})
    {% endif %}

)

select *
from source_events;
```

Schedule this model to run, for example, every 5–15 minutes as part of your near real‑time job.

## NRT view: rows more recent than the base table

The NRT view returns only events with `event_ts` greater than the maximum timestamp in the base table, so there is no overlap or double counting:

```sql
-- models/fct_events_nrt.sql
{{ config(
    materialized = 'view'
) }}

with base_max as (
    select max(event_ts) as max_event_ts
    from {{ ref('fct_events') }}
),

fresh_events as (
    select
        e.event_id,
        e.event_ts::timestamp_ntz   as event_ts,
        to_date(e.event_ts)         as event_date,
        e.user_id,
        e.event_type,
        e.payload
    from {{ source('raw', 'events') }} as e
    cross join base_max
    where e.event_ts > base_max.max_event_ts
)

select *
from fresh_events;
```

Characteristics:

- No scheduling required &mdash; it's just a view over `raw.events` filtered by `max(event_ts)` from `fct_events`.
- Every query against `fct_events_nrt` scans only "since last batch" data, which should be a small time window (for example, a few minutes or hours, depending on your job cadence).

### Lambda view: single read path for BI

The lambda view combines historical data from the base incremental table with the most recent events from the NRT view.

```sql
-- models/fct_events_lambda.sql
{{ config(
    materialized = 'view'
) }}

select
    event_id,
    event_ts,
    event_date,
    user_id,
    event_type,
    payload
from {{ ref('fct_events') }}

union all

select
    event_id,
    event_ts,
    event_date,
    user_id,
    event_type,
    payload
from {{ ref('fct_events_nrt') }};
```

Point your BI tools and dashboards to `analytics.fct_events_lambda`. Most data comes from the pre-computed incremental table, while the most recent events (since the last dbt run) come from a live query against `raw.events`.

This approach is outlined in [this original dbt lambda view blog post](https://discourse.getdbt.com/t/how-to-create-near-real-time-models-with-just-dbt-sql/1457) which describes how teams like JetBlue wired near real‑time operational dashboards on Snowflake and dbt.

## Considerations
Take the following into consideration when using this pattern:

- **Cost profile**
    - Every query against `fct_events_lambda` must read the NRT slice from `raw.events` in addition to the base table.
    - Use this pattern only for truly operational dashboards that justify the extra per‑query cost.
- **Freshness**
    - Freshness is bounded by:
        - Your dbt incremental job frequency (age of `fct_events`), plus
        - Ingestion latency into `raw.events` (Snowpipe / streaming layer).
- **Complexity vs alternatives**
    - For many modern Snowflake implementations, a [dynamic table](/reference/resource-configs/snowflake-configs#dynamic-tables) or [materialized view](/docs/build/materializations#materialized-view) with a small `target_lag` can provide similar "always within X minutes" service level agreements with less custom SQL and warehouse‑managed incremental logic.
    - Lambda views are best positioned as an _advanced / legacy pattern_ you can still use for when you:
        - Want all logic in dbt SQL
        - Lack the right warehouse feature in your environment
        - Are extending an existing implementation already built this way
