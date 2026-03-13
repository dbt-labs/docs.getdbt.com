---
title: "Warehouse-native features for real-time data"
id: "3-warehouse-native-features"
description: Learn when to use dynamic tables and materialized views instead of incremental models for near real-time data
hoverSnippet: Use dynamic tables and materialized views for simplified near real-time data
---

Modern data warehouses offer native features that can simplify near real-time data patterns. Instead of managing incremental logic yourself, you can declare the desired freshness and let the warehouse handle the refresh mechanics.

This section covers when to use dynamic tables and materialized views instead of incremental models for near real-time data. 

- [Dynamic tables](/reference/resource-configs/snowflake-configs#dynamic-tables) are a warehouse-specific feature in Snowflake that lets the warehouse keep a table updated for you. You define what the table should look like, and the warehouse keeps the table fresh automatically.
- [Materialized views](/docs/build/materializations#materialized-view) are a warehouse-specific feature that lets the warehouse save the results of a query so they’re faster to read, and refresh them as the underlying data changes. Note that the exact behavior depends on the warehouse.
- [Incremental models](/docs/build/incremental-models) are a dbt feature that lets dbt update a table by processing only new data. You tell dbt how new data should be added using your incremental logic SQL, and dbt runs the right SQL when the model is built.


#### When to consider warehouse-native features

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px'}}>

<div>

**Use dynamic tables or materialized views when:**

- Your requirement is "data always within X minutes of real time" and you don't need precise scheduling control.
- You want to simplify operational complexity by offloading refresh logic to the warehouse.
- Your transformations are relatively straightforward.
- You're willing to trade some control for convenience.

</div>

<div>

**Stick with incremental models when:**

- You need fine-grained control over scheduling and refresh logic,
- You have complex business rules requiring custom incremental strategies (like microbatching).
- You need to coordinate refreshes across multiple models in a specific order.

</div>

</div>

## Dynamic tables

:::info Warehouse support
Dynamic tables are currently supported in Snowflake, with similar features available in other warehouses under different names. Check your warehouse documentation for availability.
:::

With dynamic tables, you can define the target state with SQL, and the warehouse automatically handles incremental refreshes.

For example, the following SQL model uses a dynamic table to keep a table up to date for you:

```sql
{{ config(
    materialized = 'dynamic_table',
    target_lag = '5 minutes',
    snowflake_warehouse = 'TRANSFORM_WH'  -- Snowflake syntax
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

#### target_lag config

The [`target_lag` parameter](/reference/resource-configs/snowflake-configs#target-lag) tells the warehouse the maximum acceptable staleness of the dynamic table relative to its sources, and helps determine when the table should be refreshed.

For example:

- `target_lag = '1 minute'` - Warehouse keeps the table within one minute of its source data, refreshing automatically as needed.

- `target_lag = '5 minutes'` - Table may lag up to five minutes behind its sources.

- `target_lag = 'downstream'` - Table refreshes only when a downstream table depends on it.

- `target_lag = '1 minute'` - Data refreshed to be within 1 minute of the source
- `target_lag = '5 minutes'` - Data within 5 minutes
- `target_lag = 'downstream'` - Refresh when downstream tables need it

The warehouse automatically determines when to refresh, whether to do a full or incremental update, and how to optimize the refresh query.

#### Benefits

- Declarative freshness: specify "how fresh" not "when to refresh"
- Warehouse-managed optimization
- Cost predictability: refreshes run only when needed to meet `target_lag`
- Simple setup

#### Limitations

- Less control over exact timing or orchestration logic
- Cost visibility can be harder to predict than scheduled dbt jobs
- Less visibility into refresh decisions compared to dbt's explicit incremental logic
- Currently warehouse-specific (implementation varies by platform)

## Materialized views

Materialized views are available in most modern data warehouses and cache query results that automatically refresh when underlying data changes.

Materialized views work like this:
- The warehouse detects changes to source tables and refreshes the materialized view.
- Many warehouses can incrementally update the view rather than recomputing everything.
- Queries against the materialized view read cached results, not the underlying tables.


For example, the following sql model uses a materialized view to keep a table up to date for you:

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


## Resources by warehouse

Here are some resources for each warehouse:


#### BigQuery

- [dbt developer docs: BigQuery materialized views](/reference/resource-configs/bigquery-configs#materialized-views)
- [BigQuery docs: Materialized views intro](https://cloud.google.com/bigquery/docs/materialized-views-intro)
- [BigQuery docs: Streaming API](https://docs.cloud.google.com/bigquery/docs/write-api)

#### Databricks

- [dbt developer docs: Databricks materialized views and streaming tables](/reference/resource-configs/databricks-configs#materialized-views-and-streaming-tables)
- [Databricks docs: Materialized views](https://docs.databricks.com/en/views/materialized.html)

#### Postgres

- [dbt developer docs: Postgres materialized views](/reference/resource-configs/postgres-configs#materialized-views)
- [Postgres docs: Materialized views](https://www.postgresql.org/docs/current/rules-materializedviews.html)

#### Redshift

- [dbt developer docs: Redshift materialized views](/reference/resource-configs/redshift-configs#materialized-views)
- [Redshift docs: Materialized views overview](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-overview.html)
- [Redshift docs: Streaming ingestion to a materialized view](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-streaming-ingestion.html)

#### Snowflake

- [dbt developer docs: Dynamic tables configurations](/reference/resource-configs/snowflake-configs#dynamic-tables)
- [Snowflake docs: Dynamic tables intro](https://docs.snowflake.com/en/user-guide/dynamic-tables-intro)
- [Snowflake blog: Dynamic tables for streaming pipelines](https://www.snowflake.com/en/blog/dynamic-tables-delivering-declarative-streaming-data-pipelines/)
- [Snowflake docs: Materialized views](https://docs.snowflake.com/en/user-guide/views-materialized)


## Related docs

- [dbt blog: Announcing materialized views](/blog/announcing-materialized-views)
- [dbt blog: Optimizing query run time with materialization schedules](https://www.getdbt.com/blog/optimizing-query-run-time-with-materialization-schedules/)
