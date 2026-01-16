---
title: "Views-only pattern for maximum freshness"
description: Preserve source table latency with lightweight view transformations
hoverSnippet: Learn when views-only patterns provide maximum data freshness
---

For some workloads, the simplest and most "real-time" pattern is to **materialize everything as views** on top of a **continuously updated source table**. When transformations are very lightweight and the source is already being updated in near real-time, this can preserve the source's latency almost perfectly.

This pattern is essentially a cleaned-up, modernized version of "materialize everything as views" from the original lambda-views blog, with clearer constraints around when it's safe to use.

:::warning Use with caution
This pattern only works for very specific use cases. For most transformations, use [incremental models](/best-practices/how-we-handle-freshness/2-incremental-patterns) or [warehouse-native features](/best-practices/how-we-handle-freshness/3-warehouse-native-features) instead.
:::

---

## When this pattern fits

Use this pattern when **all** of the following are true:

- **Source freshness is already "good enough"** (for example, ingestion service or operational system writes into a warehouse table every few seconds or minutes)
- You have **very lightweight transformations**:
    - Simple projections/renames
    - 1–2 joins to small reference tables
    - Minimal or no heavy aggregations/window functions
- You care most about **preserving the source table's latency** and are willing to trade off some query performance at read time
- The source table is **small to medium-sized** (or queries are highly selective)

**Typical examples:**
- Operational dashboards on a small table that's continuously updated (e.g., active sessions, queue depth, device heartbeats)
- "Pass-through" event feeds where downstream tools mostly need the raw data with just a bit of normalization
- Real-time monitoring views over streaming data

---

## Pattern structure

The pattern consists of thin view layers stacked on top of a continuously updated source:

```
┌──────────────────────┐
│  BI / Dashboard      │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│  Domain View         │  ← Lightweight enrichment
│  (view)              │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│  Staging View        │  ← Basic cleanup
│  (view)              │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│  Source Table        │  ← Continuously updated
│  (external system)   │     by non-dbt process
└──────────────────────┘
```

**Key characteristic:** No dbt model in this path is materialized as a table or incremental; they are **all views**.

---

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

Downstream tools query `ANALYTICS.VW_REALTIME_EVENTS_ENRICHED`. As long as `RAW.REALTIME_EVENTS` is continuously updated, this view stack is **as fresh as the source**.

---

## Benefits

✅ **Maximum freshness**
- There's no dbt job between the source and the view; freshness is limited only by the write latency into the source table and view-evaluation time

✅ **Simple operations**
- No incremental strategies to tune
- No dbt Cloud schedule required purely for transformation freshness (you still schedule jobs for tests, docs, etc.)

✅ **Great for very small tables**
- When row counts are modest and queries are simple, computing the view on the fly is cheap and fast

✅ **Perfect for pass-through scenarios**
- When you mostly need to expose raw data with light normalization

---

## Limitations and risks

This pattern has significant limitations and is only safe under tight constraints.

### ❌ Doesn't scale to heavy transformations

If your logic evolves into **large joins, deep view chains, or expensive aggregations**, you'll quickly run into performance issues:

- Every query must re-execute all the logic
- The warehouse has to optimize and execute the full stack of views every time
- Query costs and latency become unpredictable

**When this happens, migrate to:**
- [Incremental tables](/best-practices/how-we-handle-freshness/2-incremental-patterns) (patterns 1–3), or
- [Dynamic Tables/materialized views](/best-practices/how-we-handle-freshness/3-warehouse-native-features)

### ❌ No "frozen" intermediate tables

Because everything is a view:
- There's no persisted intermediate layer to debug or profile
- You can't easily "rerun yesterday's logic" if upstream data changes—everything always reflects the current state
- Auditing and troubleshooting become harder

### ❌ Schema-change sensitivity

Schema changes in the source table propagate **immediately** through the view stack:
- Can break downstream BI if columns are dropped or types change
- Tests and model contracts become more important, since there's no batch boundary to catch issues before users see them
- No opportunity to handle migrations gracefully

**Mitigation:**
- Implement [dbt contracts](/docs/collaborate/govern/model-contracts) to catch breaking changes
- Use source freshness tests
- Monitor schema changes in source systems

### ❌ Potential impact on operational systems

If the continuously-updated source is itself a **live operational store** (not a warehouse landing table), you must be careful not to overload it with analytics queries.

**Best practice:**
- Replicate operational data into a warehouse table first (Snowflake, BigQuery, Databricks, etc.)
- Apply this views-only pattern **within the warehouse**, not directly on the OLTP system

### ❌ Query performance variability

- Query performance depends entirely on source table performance
- No query result caching (every query re-executes)
- Can cause "query of death" scenarios where one complex query slows down the entire system

---

## When to use views-only

Use this pattern when:
- ✅ The source table is already **continuously updated** and small-to-medium in size
- ✅ Transformations are **truly lightweight** and unlikely to grow significantly
- ✅ You care most about **minimizing latency added by dbt itself**
- ✅ Query volume is predictable and manageable

Transition to incremental models when:
- ❌ Transform logic becomes heavier
- ❌ Multiple teams depend on the same data
- ❌ You need better cost/performance control
- ❌ Query volume increases significantly

---

## Hybrid approach: Views for hot path, tables for cold path

A common compromise is to use **both** views and incremental tables:

- **Hot path (views)**: For the most recent data (last few hours/days)
- **Cold path (incremental tables)**: For historical data

Example:

```sql
-- Recent data as a view
-- models/marts/fct_events_recent.sql
{{ config(
    materialized = 'view'
) }}

select *
from {{ source('raw', 'realtime_events') }}
where event_ts >= current_timestamp() - interval '24 hours';
```

```sql
-- Historical data as incremental table
-- models/marts/fct_events_historical.sql
{{ config(
    materialized = 'incremental',
    incremental_strategy = 'append'
) }}

select *
from {{ source('raw', 'realtime_events') }}
where event_ts < current_timestamp() - interval '24 hours'
{% if is_incremental() %}
  and event_ts > (select max(event_ts) from {{ this }})
{% endif %};
```

```sql
-- Union for complete view
-- models/bi/fct_events_complete.sql
{{ config(
    materialized = 'view'
) }}

select * from {{ ref('fct_events_recent') }}
union all
select * from {{ ref('fct_events_historical') }};
```

This gives you:
- Maximum freshness for recent data (view)
- Better performance for historical queries (pre-computed table)
- Cost control (only recent data queried live)

---

## Monitoring and observability

When using views-only patterns, implement extra monitoring:

### Source freshness tests

```yaml
# models/sources.yml
version: 2

sources:
  - name: raw
    schema: raw
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
# models/staging/stg_realtime_events.yml
version: 2

models:
  - name: stg_realtime_events
    config:
      contract:
        enforced: true
    columns:
      - name: event_id
        data_type: varchar
      - name: event_ts
        data_type: timestamp_ntz
      - name: user_id
        data_type: number
```

---

## Rule of thumb

**Start with views-only if:**
- Source is continuously updated
- Transformations are genuinely lightweight
- Table is small (less than 10M rows)
- Query patterns are simple and selective

**Migrate to incremental models when:**
- Query performance degrades
- Transformation complexity increases
- Multiple downstream dependencies emerge
- Cost becomes unpredictable

The views-only pattern is a **gateway pattern**: it's easy to start with, but you should be ready to migrate to incremental models or Dynamic Tables as your needs evolve.

---

## Related patterns

- [Incremental patterns](/best-practices/how-we-handle-freshness/2-incremental-patterns) - For when you need to persist intermediate transformations
- [Lambda views](/best-practices/how-we-handle-freshness/4-lambda-views) - Combines views with incremental tables
- [Warehouse-native features](/best-practices/how-we-handle-freshness/3-warehouse-native-features) - For warehouse-managed freshness
