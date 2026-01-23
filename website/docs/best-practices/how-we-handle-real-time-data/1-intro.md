---
title: "Near real-time data in dbt"
id: "1-intro"
description: Learn how to achieve near real-time data freshness with dbt through streaming ingestion and frequent transformations
hoverSnippet: Learn how to achieve near real-time data freshness with dbt
---

By design, dbt is batch-oriented with jobs having a defined start and end time. But did you know that you can also use dbt to get near real-time data by combining your data warehouse's continuous ingestion with frequent dbt transformations?

No worries, this guide covers multiple patterns for achieving near real-time data freshness with dbt:

1. [Incremental patterns](/best-practices/how-we-handle-real-time-data/2-incremental-patterns) - MERGE strategies, CDC, and microbatch processing
2. [Warehouse-native features](/best-practices/how-we-handle-real-time-data/3-warehouse-native-features) - When to use dynamic tables and materialized views
3. [Lambda views pattern](/best-practices/how-we-handle-real-time-data/4-lambda-views) - Combining batch and real-time data in a single view
4. [Views-only pattern](/best-practices/how-we-handle-real-time-data/5-views-only-pattern) - Maximum freshness for lightweight transformations
5. [Operational considerations](/best-practices/how-we-handle-real-time-data/6-operational-considerations) - Challenges, risks, and cost management
6. [Choosing the right pattern](/best-practices/how-we-handle-real-time-data/7-conclusion) - Decision framework and additional resources

Each pattern includes practical code examples, use cases, and tradeoffs to help you choose the right approach.

Anyone can check out this guide, but it's primarily for data engineers and architects who are looking to achieve near real-time data freshness with dbt.

## Where does dbt fit?

There are two main ways to use dbt to get near real-time data:

- For near real-time (1-15 minutes) &mdash; dbt excels at this and is well-suited for most operational dashboards.
- For true real-time (sub-second) &mdash; This requires dedicated streaming databases (ClickHouse, Materialize, Rockset, and so on) in front of or alongside dbt; dbt still owns “analytic” tables and history but not the ultra‑low‑latency read path.

## How dbt achieves near real-time data
To achieve real-time data with dbt, we recommend using a two-layer architecture:

#### Ingestion layer

Continuous data landing using your data warehouse's streaming ingestion features. 
   
Streaming ingestion features like [streaming tables](https://docs.databricks.com/en/sql/load-data-streaming-table.html), [Snowpipe](https://docs.snowflake.com/en/user-guide/snowpipe-streaming/data-load-snowpipe-streaming-overview), or [Storage Write API](https://docs.cloud.google.com/bigquery/docs/write-api-streaming) are a great way to do this. To check streaming ingestion features for your warehouse, check the [additional resources](#additional-resources) section.

#### dbt transformation layer

Run dbt transformations every few minutes to transform that data, and you can use materialized views or dynamic tables for the lowest-latency reporting.

Specific transformation approaches include:
- [Incremental models](/docs/build/incremental-models-overview) with merge or append strategies
- [Microbatch incremental strategy](/docs/build/incremental-microbatch) for large time-series tables
- Jobs scheduled very frequently (like every 5 minutes)
- Use [dynamic tables](/reference/resource-configs/snowflake-configs#dynamic-tables) or [materialized views](/reference/resource-configs/snowflake-configs#materialized-views) with short refresh intervals

## Key recommendations

Here are some key recommendations to help you achieve near real-time data freshness with dbt:

- Ingest data continuously &mdash; Use your warehouse's native streaming or micro-batch ingestion to land raw data as soon as it arrives.
- Transform with dbt on a frequent schedule &mdash; Schedule dbt jobs to run as often as your business needs allow (e.g., every 1–15 minutes). Balance freshness with cost and resource constraints.
- Materialized views & dynamic tables &mdash; For the lowest-latency reporting, use materialized views or dynamic tables. These can be refreshed as frequently as every minute.
- Incremental models & microbatching &mdash; Use dbt's incremental models to process only new or changed data, keeping transformations efficient and scalable.
- Decouple ingestion from transformation &mdash; Keep data acquisition and transformation flows separate. This allows you to optimize each independently.
- Monitor and test data freshness &mdash; Implement data quality checks and freshness monitoring to ensure your near real-time pipelines deliver accurate, up-to-date results.
- Cost and complexity considerations &mdash; Running dbt jobs more frequently drives up compute costs and operational complexity. Always weigh the business value against these trade-offs.
