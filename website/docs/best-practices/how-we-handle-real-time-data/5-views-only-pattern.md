---
title: "Views-only pattern for maximum freshness"
id: "5-views-only-pattern"
description: Preserve source table latency with lightweight view transformations
hoverSnippet: Learn when views-only patterns provide maximum data freshness
---

:::info Snowflake examples ahead
This page uses Snowflake for code examples, but you can adapt the views-only pattern to other warehouses.
:::

For some workloads, the simplest and most "real-time" pattern is to materialize everything as views on top of a continuously updated source table. When transformations are very lightweight and the source is already being updated in near real-time, this can preserve the source's latency almost perfectly.

## When to use the views-only pattern

Use this when:

- Source freshness is already "good enough" (for example, ingestion service or operational system writes into a warehouse table every few seconds or minutes).
- You have very lightweight transformations, such as:
  - Simple projections / renames
  - One to two joins to small reference table
  - Minimal or no heavy aggregations or window functions
- You care most about preserving the source table's latency and are willing to trade off some query performance at read time.
- This works best for small-to-medium tables with simple queries.

Typical examples:

- Dashboards showing current system status (like active user sessions, current queue depth, or recent device heartbeats) where you need to see the latest data immediately.
- Event data that you're forwarding to other tools with minimal transformation (raw data with just a bit of normalization, like cleaning up field names or adding a few reference fields).

If your transform logic becomes heavier, multiple teams depend on the data, or you need better cost and performance control, transition to [incremental models](/best-practices/how-we-handle-real-time-data/2-incremental-patterns) or [dynamic tables/materialized views](/best-practices/how-we-handle-real-time-data/3-warehouse-native-features). Reserve this pattern for the smallest, most latency‑sensitive use cases.

#### Assumptions
The examples used in this page assume the following setup:
- A non‑dbt system (ETL, streaming pipeline, app) is already writing into a warehouse‑resident table such as `raw.realtime_events` or `ops.active_sessions`, and that table meets your service level agreement for latency.
- Querying that table directly is acceptable from a performance and cost standpoint for your expected concurrency.
- You don't need dbt to persist intermediate tables; you mainly care about:
  - Consistent SQL logic (column naming, type casting)
  - Tests, contracts, and lineage
  - Exposures to BI / downstream tools

All dbt models in this path are materialized as views, not tables or incremental models.

## Example implementation
Here's an example implementation of the views-only pattern, which has the following pattern structure:

- [Source table](#source-table-definition) (continuously updated): `raw.realtime_events`
- [Thin staging view](#staging-view): `analytics.stg_realtime_events_v`
- [Domain view(s)](#domain-view-definition): `analytics.vw_realtime_events_enriched`

### Source table definition

```yaml
# models/sources.yml
version: 2

sources:
  - name: raw
    schema: raw
    tables:
      - name: realtime_events
        description: "Continuously updated event table from streaming pipeline."
        loaded_at_field: event_ts
```

### Staging view

```sql
-- models/staging/stg_realtime_events.sql
{{ config(
    materialized = 'view'
) }}

select
    event_id,
    event_ts::timestamp_ntz   as event_ts,  -- Snowflake syntax for type casting
    to_date(event_ts)         as event_date,
    user_id,
    event_type,
    payload
from {{ source('raw', 'realtime_events') }};
```

### Domain view definition

```sql
-- models/marts/vw_realtime_events_enriched.sql
{{ config(
    materialized = 'view'
) }}

with base as (
    select *
    from {{ ref('stg_realtime_events') }}
),

user_dim as (
    select
        user_id,
        user_segment,
        signup_date
    from {{ ref('dim_user') }}   -- can be a table or incremental model
)

select
    b.event_id,
    b.event_ts,
    b.event_date,
    b.user_id,
    u.user_segment,
    b.event_type,
    b.payload
from base as b
left join user_dim as u
  on b.user_id = u.user_id;
```

Downstream tools query `analytics.vw_realtime_events_enriched`. As long as `raw.realtime_events` is continuously updated, this view stack is as fresh as the source.

## Benefits

- Maximum freshness: The view reflects new data as soon as it lands in `raw.realtime_events`.
- Simple operations: No incremental logic to tune and no extra dbt job needed just to keep the data fresh. You still schedule jobs for tests, docs, and so on.
- Best for small datasets: Works well when tables are small and queries are simple. Computing the view on the fly is cheap and fast.

## Limitations and risks

This pattern is only safe under tight constraints and has several important limitations:
<!-- no toc -->
    - [Doesn't scale to heavy transformations](#doesnt-scale-to-heavy-transformations)
    - [No "frozen" intermediate tables](#no-frozen-intermediate-tables)
    - [Schema change sensitivity](#schema-change-sensitivity)
    - [Potential impact on operational systems](#potential-impact-on-operational-systems)

### Doesn't scale to heavy transformations

If your logic evolves into large joins, deep view chains, or expensive aggregations, you'll quickly run into performance issues:

- Every query must re‑execute all the logic.
- The warehouse has to optimize and execute the full stack of views every time.

In those cases, use either of the following:

- [Incremental models](/best-practices/how-we-handle-real-time-data/2-incremental-patterns)
- [Dynamic tables or materialized views](/best-practices/how-we-handle-real-time-data/3-warehouse-native-features), where appropriate

### No "frozen" intermediate tables

Because everything is a view:

- There's no persisted intermediate layer to debug or profile.
- You can't easily "rerun yesterday's logic" if upstream data changes—everything always reflects the current state.

### Schema change sensitivity

Schema changes in the source table propagate immediately through the view stack, which:

- Can break downstream BI if columns are dropped or types change.
- Make tests and model contracts more important, since there’s no batch boundary to catch issues before users see them.

### Potential impact on operational systems

If the continuously‑updated source is itself a live operational store (not a warehouse landing table), you must be careful not to overload it with analytics queries. In most cases, it is recommended to:

1. Replicate into a warehouse table first (Snowflake, BigQuery, Databricks, and so on).
2. Apply this views‑only pattern within the warehouse, not directly on the Online Transaction Processing system.
