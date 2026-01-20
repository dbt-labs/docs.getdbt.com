---
title: "Lambda views for near real-time dashboards"
id: "4-lambda-views"
description: Combine batch and real-time data in a single view for operational dashboards
hoverSnippet: Learn the lambda view pattern for near real-time operational dashboards
---

:::info Snowflake examples ahead
This page uses Snowflake for code examples, but the lambda view pattern can be adapted to other warehouses.
:::

A lambda view pattern combines a batch/incremental fact table with a small near real-time (NRT) slice of very recent data and exposes them through a single view. This is a legacy-but-still-useful pattern some teams have used to deliver near real-time operational dashboards.

:::warning Advanced pattern
This is an advanced pattern with significant operational complexity. For most use cases, consider [dynamic tables](/best-practices/how-we-handle-real-time-data/3-warehouse-native-features) or standard [incremental models](/best-practices/how-we-handle-real-time-data/2-incremental-patterns) first.
:::

## When to use this pattern

Use lambda views only when:

- You need fresher reads than your normal incremental schedule
- You can't (or don't want to) use dynamic tables or materialized views, or you want to keep logic entirely in dbt SQL
- You have specific operational dashboards that justify the added complexity
- Standard incremental patterns running every 5-15 minutes aren't fresh enough

## How it works

The pattern consists of three layers:

1. *Base table (HIST)*: An incremental table that processes historical data on a schedule (e.g., every 5-15 minutes)
2. *NRT view (HOT)*: A view that queries only the very latest data not yet in the base table
3. *Lambda view*: A view that unions the base table and NRT view, giving you complete data

## Assumptions

- Raw events land continuously into a staging table via streaming ingestion
- You already maintain an incremental fact table that rebuilds every few minutes
- Most dashboards are fine reading from that incremental table, but a small set of operational dashboards want "as-of-now" data

## Implementation

### 1. Base incremental table (HIST)

This is your standard incremental model, scheduled to run every 5-15 minutes:

```sql
-- models/marts/fct_events.sql
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

)

select *
from source_events;
```

### 2. NRT view (HOT data)

The NRT view returns only events with timestamps greater than the max timestamp in the base table:

```sql
-- models/marts/fct_events_nrt.sql
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

*Key characteristics*:
- No scheduling required - it's a view over the raw table
- Each query scans only "since last batch" data, which should be a small time window

### 3. Lambda view (single read path)

The lambda view exposes a single relation with all data:

```sql
-- models/bi/fct_events_lambda.sql
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

Point your BI tools to this lambda view. Historical data comes from the pre-computed incremental table, while the most recent events come from a small live query.

## Benefits

- Always fresh: Data is as fresh as your ingestion pipeline, not limited by dbt job frequency
- Optimized reads: Most data is pre-computed; only the recent tail is queried live
- Pure dbt SQL: No external orchestration or warehouse-specific features required

## Operational considerations

### Cost profile

Every query against the lambda view must read the NRT slice from the raw table in addition to the base table. Use this pattern only for operational dashboards that justify the extra per-query cost.

### Freshness boundaries

Freshness is bounded by:
- Your dbt incremental job frequency (age of the base table)
- Ingestion latency into the raw table

Example: If your incremental job runs every 10 minutes and ingestion has 2-minute latency, your data can be 2-12 minutes old (average ~7 minutes).

### Timing gaps and correctness

A critical challenge: during a dbt run, the NRT view may start filtering on the *new* `max(event_ts)` before the incremental table has finished loading. This produces temporary holes in the unioned lambda view where recent data disappears briefly.

*Mitigation*:
- Introduce explicit dependency from NRT to incremental model (ensures NRT reads only after HIST completes)
- Add a time buffer in the NRT filter (e.g., `max(event_ts) - interval '1 minute'`)
- Document expected behavior for end users

### DAG complexity

Every "product" model now has at least three artifacts (HIST table, NRT view, Lambda union). This triples the number of models to maintain, test, and document.

## Complexity vs. alternatives

For many modern implementations, a dynamic table or materialized view with a small `target_lag` can provide similar "always within X minutes" SLAs with less custom SQL and warehouse-managed incremental logic.

Lambda views are best positioned as an advanced/legacy pattern you can reach for when:
- You want all logic in dbt SQL
- You lack the right warehouse feature in your environment
- You're extending an existing implementation already built this way

## Origin and further reading

This pattern was originally documented by the dbt community and popularized by teams like JetBlue who used it for operational dashboards.

- [How to create near real-time models with just dbt + SQL](https://discourse.getdbt.com/t/how-to-create-near-real-time-models-with-just-dbt-sql/1457) (dbt Discourse)
