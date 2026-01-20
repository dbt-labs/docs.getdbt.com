---
title: "Warehouse-native features for real-time data"
description: Learn when to use Dynamic Tables and Materialized Views instead of incremental models for near real-time data
hoverSnippet: Use Dynamic Tables and Materialized Views for simplified near real-time data
---

Modern data warehouses offer native features that can simplify near real-time data patterns. Instead of managing incremental logic yourself, you can declare the desired freshness and let the warehouse handle the refresh mechanics.

This page covers when and how to use warehouse-native features like **Dynamic Tables** (Snowflake) and **Materialized Views** instead of custom incremental models.

---

## When to consider warehouse-native features

Use Dynamic Tables or Materialized Views when:

- Your requirement is **"data always within X minutes of real time"** and you don't need precise scheduling control
- You want to **simplify operational complexity** by offloading refresh logic to the warehouse
- Your transformations are **relatively straightforward** (not highly complex multi-stage incremental logic)
- You're willing to **trade some control for convenience**

Stick with incremental models when:

- You need **fine-grained control** over scheduling and refresh logic
- You have **complex business rules** that require custom incremental strategies
- You need to **coordinate refreshes** across multiple models in a specific order
- You want **dbt-managed orchestration** via dbt Cloud or external orchestrators

---

## Snowflake Dynamic Tables

Dynamic Tables are Snowflake's declarative approach to incremental data pipelines. You define the target state with SQL, and Snowflake automatically handles incremental refreshes.

### Basic example

```sql
{{ config(
    materialized = 'dynamic_table',
    target_lag = '5 minutes',
    snowflake_warehouse = 'TRANSFORM_WH'
) }}

select
    event_id,
    event_ts::timestamp_ntz   as event_ts,
    to_date(event_ts)         as event_date,
    user_id,
    event_type,
    payload
from {{ source('raw', 'events') }}
where event_ts >= current_timestamp() - interval '7 days';
```

### Key configuration: `target_lag`

The `target_lag` parameter tells Snowflake how fresh the data should be:

- `target_lag = '1 minute'` - Data will be refreshed to be within 1 minute of the source
- `target_lag = '5 minutes'` - Data will be within 5 minutes
- `target_lag = 'downstream'` - Refresh when downstream Dynamic Tables need it

Snowflake automatically determines:
- When to refresh the table
- Whether to do a full refresh or incremental update
- How to optimize the refresh query

### Dynamic Tables in transformation chains

You can chain Dynamic Tables together, and Snowflake will coordinate refreshes:

```sql
-- Staging layer
{{ config(
    materialized = 'dynamic_table',
    target_lag = '2 minutes',
    snowflake_warehouse = 'TRANSFORM_WH'
) }}

select
    event_id,
    event_ts,
    user_id,
    event_type
from {{ source('raw', 'events') }};
```

```sql
-- Mart layer
{{ config(
    materialized = 'dynamic_table',
    target_lag = '5 minutes',
    snowflake_warehouse = 'TRANSFORM_WH'
) }}

select
    user_id,
    count(*) as event_count,
    max(event_ts) as last_event_ts
from {{ ref('stg_events') }}
group by user_id;
```

Snowflake manages the dependency chain and ensures upstream tables refresh before downstream ones.

### Benefits of Dynamic Tables

- **Declarative freshness**: Specify "how fresh" not "when to refresh"
- **Warehouse-managed optimization**: Snowflake handles incremental logic automatically
- **Cost predictability**: Refreshes run only when needed to meet `target_lag`
- **Simple setup**: No complex incremental strategies to configure

### Limitations and considerations

- **Less control**: You can't control exact timing or orchestration logic
- **Cost visibility**: Refresh costs can be harder to predict and monitor than scheduled dbt jobs
- **Debugging**: Less visibility into refresh decisions compared to dbt's explicit incremental logic
- **Feature maturity**: Some edge cases and complex scenarios may not be well-supported yet
- **Warehouse-specific**: Currently Snowflake-only (other warehouses have similar features but different implementations)

### When to use Dynamic Tables

✅ **Good fit:**
- Operational dashboards that need "always fresh within X minutes"
- Simple transformation logic
- You want warehouse-managed optimization
- Cost of constant refresh is acceptable

❌ **Not ideal:**
- Complex multi-stage transformations with intricate dependencies
- Need precise scheduling coordination with other jobs
- Require detailed logging and observability of each refresh
- Working across multiple data warehouses

---

## Materialized Views

Materialized Views are another warehouse-native option available in most modern data warehouses (Snowflake, BigQuery, Redshift, Databricks).

### Basic concept

A Materialized View is a view that caches query results and automatically refreshes when underlying data changes:

```sql
{{ config(
    materialized = 'materialized_view',
    snowflake_warehouse = 'TRANSFORM_WH'
) }}

select
    user_id,
    date_trunc('hour', event_ts) as event_hour,
    count(*) as event_count
from {{ source('raw', 'events') }}
group by 1, 2;
```

### How they work

- **Automatic refresh**: The warehouse detects changes to source tables and refreshes the materialized view
- **Incremental maintenance**: Many warehouses can incrementally update the view rather than recomputing everything
- **Query acceleration**: Queries against the materialized view read cached results, not the underlying tables

### Platform-specific behavior

Each warehouse implements Materialized Views differently:

**Snowflake:**
- Refreshes automatically when queried (if stale)
- Can be manually refreshed
- Supports clustering for performance

**BigQuery:**
- Automatically and incrementally refreshes
- Queries may read slightly stale data
- Best for aggregations and filtered views

**Databricks:**
- Uses "incremental refresh" for updates
- Can specify refresh schedule
- Integrates with Delta Lake

**Redshift:**
- Manual or scheduled refresh
- Good for aggregations
- Can specify sort/dist keys

### When to use Materialized Views

✅ **Good fit:**
- Simple aggregations or filters on large tables
- Read-heavy workloads where query performance is critical
- Warehouse has good materialized view support
- Acceptable to let warehouse manage refresh timing

❌ **Not ideal:**
- Complex multi-stage transformations
- Need explicit scheduling and orchestration
- Require dbt's testing, documentation, and lineage features
- Need fine-grained control over refresh logic

---

## Rule of thumb: Incremental models vs. warehouse features

| Requirement | Recommendation |
|-------------|----------------|
| **Need fine-grained control / strict scheduling / complex business logic** | Use incremental models (merge or microbatch) |
| **Need "always fresh within X minutes" with simpler logic** | Consider Dynamic Tables or Materialized Views |
| **Multi-warehouse compatibility** | Use incremental models (portable across platforms) |
| **Maximum simplicity and warehouse-native optimization** | Use Dynamic Tables or Materialized Views |
| **Need dbt's testing, docs, and lineage** | Use dbt materializations (works with all approaches) |
| **Cost optimization through precise scheduling** | Use incremental models with dbt Cloud scheduling |

---

## Combining approaches

You don't have to choose just one approach. A common pattern is:

1. **Use incremental models** for most transformations (staging, marts)
2. **Use Dynamic Tables/MVs** for the final presentation layer where BI tools query

This gives you:
- Control and observability in dbt for core transformations
- Warehouse-managed freshness for the last mile to dashboards
- Best of both worlds

Example:

```sql
-- Incremental model (dbt-managed)
-- models/marts/fct_orders.sql
{{ config(
    materialized = 'incremental',
    incremental_strategy = 'merge',
    unique_key = 'order_id'
) }}

select * from {{ ref('stg_orders') }}
{% if is_incremental() %}
where updated_at > (select max(updated_at) from {{ this }})
{% endif %};
```

```sql
-- Dynamic Table for BI (warehouse-managed)
-- models/bi/orders_dashboard.sql
{{ config(
    materialized = 'dynamic_table',
    target_lag = '2 minutes'
) }}

select
    order_date,
    customer_segment,
    sum(order_amount) as total_revenue,
    count(*) as order_count
from {{ ref('fct_orders') }}
group by 1, 2;
```

---

## Helpful resources

### Dynamic Tables (Snowflake)

- [Dynamic Tables: Delivering Declarative Streaming Data Pipelines](https://www.snowflake.com/en/blog/dynamic-tables-delivering-declarative-streaming-data-pipelines/)
- [Snowflake docs on Dynamic Tables](https://docs.snowflake.com/en/user-guide/dynamic-tables-intro)
- [Understanding dynamic table initialization and refresh](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh#understanding-target-lag)
- [Dynamic table limitations](https://docs.snowflake.com/en/user-guide/dynamic-tables-limitations)
- [Dynamic tables configurations in dbt](https://docs.getdbt.com/reference/resource-configs/snowflake-configs#dynamic-tables)

### Materialized Views

- [Optimizing Materialized Views with dbt](https://docs.getdbt.com/blog/announcing-materialized-views)
- [Snowflake Materialized Views](https://docs.snowflake.com/en/user-guide/views-materialized)
- [BigQuery Materialized Views](https://cloud.google.com/bigquery/docs/materialized-views-intro)
- [Databricks Materialized Views](https://docs.databricks.com/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view.html)
