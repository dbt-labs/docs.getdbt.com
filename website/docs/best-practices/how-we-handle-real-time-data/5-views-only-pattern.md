---
title: "Views-only pattern for maximum freshness"
id: "5-views-only-pattern"
description: Preserve source table latency with lightweight view transformations
hoverSnippet: Learn when views-only patterns provide maximum data freshness
---

For some workloads, the simplest and most "real-time" pattern is to materialize everything as views on top of a continuously updated source table. When transformations are very lightweight and the source is already being updated in near real-time, this can preserve the source's latency almost perfectly.

:::warning Use with caution
This pattern only works for very specific use cases. For most transformations, use [incremental models](/best-practices/how-we-handle-real-time-data/2-incremental-patterns) or [warehouse-native features](/best-practices/how-we-handle-real-time-data/3-warehouse-native-features) instead.
:::

## When this pattern fits

Use this pattern when *all* of the following are true:

- Source freshness is already "good enough" (ingestion writes into a warehouse table every few seconds or minutes)
- You have very lightweight transformations: simple projections/renames, 1–2 joins to small reference tables, minimal aggregations
- You care most about preserving the source table's latency and are willing to trade off some query performance at read time
- The source table is small to medium-sized (or queries are highly selective)

*Typical examples*:
- Operational dashboards on continuously updated small tables (active sessions, queue depth, device heartbeats)
- Pass-through event feeds where downstream tools mostly need raw data with light normalization
- Real-time monitoring views over streaming data

## Pattern structure

Thin view layers stacked on top of a continuously updated source:

```text
BI / Dashboard
     ↓
Domain View (lightweight enrichment)
     ↓
Staging View (basic cleanup)
     ↓
Source Table (continuously updated)
```

No dbt model in this path is materialized as a table or incremental; they are all views.

## Implementation example

### Source definition

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

Simple cleanup and standardization:

```sql
-- models/staging/stg_realtime_events.sql
{{ config(
    materialized = 'view'
) }}

select
    event_id,
    event_ts::timestamp_ntz   as event_ts,
    to_date(event_ts)         as event_date,
    user_id,
    event_type,
    payload
from {{ source('raw', 'realtime_events') }};
```

### Lightweight enriched view

Add minimal enrichment with small dimension joins:

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

Downstream tools query the enriched view. As long as the source table is continuously updated, this view stack is as fresh as the source.

## Benefits

- *Maximum freshness*: There's no dbt job between the source and the view; freshness is limited only by write latency and view-evaluation time
- *Simple operations*: No incremental strategies to tune, no dbt Cloud schedule required purely for transformation freshness
- *Great for very small tables*: When row counts are modest and queries are simple, computing the view on the fly is cheap and fast

## Limitations and risks

### Doesn't scale to heavy transformations

If your logic evolves into large joins, deep view chains, or expensive aggregations, you'll quickly run into performance issues. Every query must re-execute all the logic.

*When this happens, migrate to*:
- [Incremental tables](/best-practices/how-we-handle-real-time-data/2-incremental-patterns)
- [Dynamic tables or materialized views](/best-practices/how-we-handle-real-time-data/3-warehouse-native-features)

### No "frozen" intermediate tables

Because everything is a view:
- There's no persisted intermediate layer to debug or profile
- You can't easily "rerun yesterday's logic" if upstream data changes—everything always reflects the current state

### Schema-change sensitivity

Schema changes in the source table propagate immediately through the view stack:
- Can break downstream BI if columns are dropped or types change
- Tests and model contracts become more important, since there's no batch boundary to catch issues before users see them

*Mitigation*:
- Implement [dbt contracts](/docs/collaborate/govern/model-contracts) to catch breaking changes
- Use source freshness tests
- Monitor schema changes in source systems

### Potential impact on operational systems

If the continuously-updated source is itself a live operational store (not a warehouse landing table), be careful not to overload it with analytics queries.

*Best practice*: Replicate operational data into a warehouse table first, then apply this views-only pattern within the warehouse, not directly on the OLTP system.

### Query performance variability

- Query performance depends entirely on source table performance
- No query result caching (every query re-executes)
- Can cause "query of death" scenarios where one complex query slows down the entire system

## When to use views-only

Use this pattern when:
- The source table is already continuously updated and small-to-medium in size
- Transformations are truly lightweight and unlikely to grow significantly
- You care most about minimizing latency added by dbt itself
- Query volume is predictable and manageable

Transition to incremental models when:
- Transform logic becomes heavier
- Multiple teams depend on the same data
- You need better cost/performance control
- Query volume increases significantly

## Hybrid approach: Views for hot path, tables for cold path

A common compromise is to use both views and incremental tables:

- *Hot path (views)*: For the most recent data (last few hours/days)
- *Cold path (incremental tables)*: For historical data

```sql
-- Recent data as a view
{{ config(materialized = 'view') }}
select *
from {{ source('raw', 'realtime_events') }}
where event_ts >= current_timestamp() - interval '24 hours';
```

```sql
-- Historical data as incremental table
{{ config(materialized = 'incremental', incremental_strategy = 'append') }}
select *
from {{ source('raw', 'realtime_events') }}
where event_ts < current_timestamp() - interval '24 hours'
{% if is_incremental() %}
  and event_ts > (select max(event_ts) from {{ this }})
{% endif %};
```

```sql
-- Union for complete view
{{ config(materialized = 'view') }}
select * from {{ ref('fct_events_recent') }}
union all
select * from {{ ref('fct_events_historical') }};
```

This gives you maximum freshness for recent data (view), better performance for historical queries (pre-computed table), and cost control (only recent data queried live).

## Monitoring and observability

When using views-only patterns, implement extra monitoring:

### Source freshness tests

```yaml
sources:
  - name: raw
    tables:
      - name: realtime_events
        loaded_at_field: event_ts
        freshness:
          warn_after: {count: 5, period: minute}
          error_after: {count: 15, period: minute}
```

### Query performance monitoring

- Monitor query execution times in your warehouse
- Set up alerts for slow queries against your views
- Track warehouse credit consumption

### Schema change detection

```yaml
models:
  - name: stg_realtime_events
    config:
      contract:
        enforced: true
    columns:
      - name: event_id
        data_type: varchar
      - name: event_ts
        data_type: timestamp
```

## Rule of thumb

Start with views-only if:
- Source is continuously updated
- Transformations are genuinely lightweight
- Table is small (less than 10M rows)
- Query patterns are simple and selective

Migrate to incremental models when:
- Query performance degrades
- Transformation complexity increases
- Multiple downstream dependencies emerge
- Cost becomes unpredictable

The views-only pattern is a *gateway pattern*: it's easy to start with, but you should be ready to migrate to incremental models or dynamic tables as your needs evolve.
