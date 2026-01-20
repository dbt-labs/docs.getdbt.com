---
title: "Warehouse-native features for real-time data"
id: "3-warehouse-native-features"
description: Learn when to use dynamic tables and materialized views instead of incremental models for near real-time data
hoverSnippet: Use dynamic tables and materialized views for simplified near real-time data
---

Modern data warehouses offer native features that can simplify near real-time data patterns. Instead of managing incremental logic yourself, you can declare the desired freshness and let the warehouse handle the refresh mechanics.

## When to consider warehouse-native features

Use dynamic tables or materialized views when:

- Your requirement is "data always within X minutes of real time" and you don't need precise scheduling control
- You want to simplify operational complexity by offloading refresh logic to the warehouse
- Your transformations are relatively straightforward
- You're willing to trade some control for convenience

Stick with incremental models when:

- You need fine-grained control over scheduling and refresh logic
- You have complex business rules requiring custom incremental strategies
- You need to coordinate refreshes across multiple models in a specific order
- You want dbt-managed orchestration via dbt Cloud or external orchestrators

## Dynamic tables

:::info Warehouse support
Dynamic tables are currently supported in Snowflake, with similar features available in other warehouses under different names. Check your warehouse documentation for availability.
:::

Dynamic tables let you define the target state with SQL, and the warehouse automatically handles incremental refreshes.

### Basic example

```sql
{{ config(
    materialized = 'dynamic_table',
    target_lag = '5 minutes',
    snowflake_warehouse = 'TRANSFORM_WH'
) }}

select
    event_id,
    event_ts::timestamp_ntz as event_ts,
    to_date(event_ts) as event_date,
    user_id,
    event_type,
    payload
from {{ source('raw', 'events') }}
where event_ts >= current_timestamp() - interval '7 days';
```

### Key configuration: target_lag

The `target_lag` parameter tells the warehouse how fresh the data should be:

- `target_lag = '1 minute'` - Data refreshed to be within 1 minute of the source
- `target_lag = '5 minutes'` - Data within 5 minutes
- `target_lag = 'downstream'` - Refresh when downstream tables need it

The warehouse automatically determines when to refresh, whether to do a full or incremental update, and how to optimize the refresh query.

### Benefits

- Declarative freshness: specify "how fresh" not "when to refresh"
- Warehouse-managed optimization
- Cost predictability: refreshes run only when needed to meet `target_lag`
- Simple setup

### Limitations

- Less control over exact timing or orchestration logic
- Cost visibility can be harder to predict than scheduled dbt jobs
- Less visibility into refresh decisions compared to dbt's explicit incremental logic
- Currently warehouse-specific (implementation varies by platform)

## Materialized views

Materialized views are available in most modern data warehouses and cache query results that automatically refresh when underlying data changes.

### Basic concept

```sql
{{ config(
    materialized = 'materialized_view'
) }}

select
    user_id,
    date_trunc('hour', event_ts) as event_hour,
    count(*) as event_count
from {{ source('raw', 'events') }}
group by 1, 2;
```

### How they work

- The warehouse detects changes to source tables and refreshes the materialized view
- Many warehouses can incrementally update the view rather than recomputing everything
- Queries against the materialized view read cached results, not the underlying tables

### Platform-specific behavior

Each warehouse implements materialized views differently:

- *Snowflake*: Refreshes automatically when queried (if stale), supports clustering
- *BigQuery*: Automatically and incrementally refreshes, queries may read slightly stale data
- *Databricks*: Uses incremental refresh, integrates with Delta Lake
- *Redshift*: Manual or scheduled refresh, good for aggregations
- *Postgres*: Manual refresh required, good for read-heavy workloads

### When to use

Use materialized views for:
- Simple aggregations or filters on large tables
- Read-heavy workloads where query performance is critical
- When your warehouse has good materialized view support
- When it's acceptable to let the warehouse manage refresh timing

Avoid for:
- Complex multi-stage transformations
- When you need explicit scheduling and orchestration
- When you require dbt's full testing, documentation, and lineage features

## Rule of thumb

| Requirement | Recommendation |
| ----------- | -------------- |
| Fine-grained control / strict scheduling / complex logic | Incremental models (merge or microbatch) |
| "Always fresh within X minutes" with simpler logic | Dynamic tables or materialized views |
| Multi-warehouse compatibility | Incremental models |
| Maximum simplicity and warehouse-native optimization | Dynamic tables or materialized views |

## Combining approaches

You don't have to choose just one. A common pattern:

1. Use incremental models for most transformations (staging, marts)
2. Use dynamic tables or materialized views for the final presentation layer where BI tools query

This gives you control and observability in dbt for core transformations, plus warehouse-managed freshness for the last mile to dashboards.

## Resources by warehouse

### Snowflake

- [dbt docs: Dynamic tables configurations](/reference/resource-configs/snowflake-configs#dynamic-tables)
- [Snowflake docs: Dynamic tables intro](https://docs.snowflake.com/en/user-guide/dynamic-tables-intro)
- [Snowflake docs: Understanding target lag](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh#understanding-target-lag)
- [Snowflake docs: Dynamic table limitations](https://docs.snowflake.com/en/user-guide/dynamic-tables-limitations)
- [Snowflake blog: Dynamic tables for streaming pipelines](https://www.snowflake.com/en/blog/dynamic-tables-delivering-declarative-streaming-data-pipelines/)
- [dbt docs: Snowflake materialized views](/reference/resource-configs/snowflake-configs#materialized-views)
- [Snowflake docs: Materialized views](https://docs.snowflake.com/en/user-guide/views-materialized)

### BigQuery

- [dbt docs: BigQuery materialized views](/reference/resource-configs/bigquery-configs#materialized-views)
- [BigQuery docs: Materialized views intro](https://cloud.google.com/bigquery/docs/materialized-views-intro)
- [BigQuery materialized views cheat sheet](https://docs.google.com/document/d/1rEiaXELayPXYDHtICu8ObRt-kr84D-lNr33UGCqJm7M/edit?usp=drive_link)

### Databricks

- [dbt docs: Databricks materialized views and streaming tables](/reference/resource-configs/databricks-configs#materialized-views-and-streaming-tables-1)
- [Databricks docs: Materialized views](https://docs.databricks.com/en/views/materialized.html)
- [Databricks materialized views cheat sheet](https://docs.google.com/document/d/1pnH56CxNLEAv0qWHjb_AAjCnfp3Wi_faFMVkx_vUMOI/edit?usp=sharing)

### Redshift

- [dbt docs: Redshift materialized views](/reference/resource-configs/redshift-configs#materialized-views)
- [Redshift docs: Materialized views overview](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-overview.html)
- [Redshift materialized views cheat sheet](https://docs.google.com/document/d/15NJmvK4zT4Uy87KO1yNpvbmrGnzyyi6exyW5ba9L1YE/edit?usp=sharing)

### Postgres

- [dbt docs: Postgres materialized views](/reference/resource-configs/postgres-configs#materialized-views)
- [Postgres docs: Materialized views](https://www.postgresql.org/docs/current/rules-materializedviews.html)
- [Postgres materialized views cheat sheet](https://docs.google.com/document/d/1UiWGTSLQKiKIkVSuzJkwYpPbhLpvxkKbunWFHatFQTs/edit?usp=sharing)

### General resources

- [dbt blog: Announcing materialized views](/blog/announcing-materialized-views)
- [dbt blog: Optimizing query run time with materialization schedules](https://www.getdbt.com/blog/optimizing-query-run-time-with-materialization-schedules/)
