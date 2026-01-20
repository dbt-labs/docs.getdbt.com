---
title: "Choosing the right freshness pattern"
id: "7-conclusion"
description: Decision framework and resources for implementing near real-time data with dbt
hoverSnippet: Choose the right pattern for your near real-time data requirements
---

You've now seen multiple patterns for achieving near real-time data freshness with dbt. This page provides a decision framework to help you choose the right approach and links to helpful resources.

## Quick decision tree

```text
Start here: What's your freshness requirement?
│
├─ Hourly or slower
│  └─> Use standard incremental models with hourly/daily schedules
│
├─ 15-30 minutes
│  └─> Incremental models with frequent scheduling
│     └─> Start with Pattern 1 (MERGE)
│
├─ 5-15 minutes (near real-time)
│  ├─> Do you have heavy aggregations or complex logic?
│  │   ├─ Yes → Incremental models (Pattern 1-3) + high-frequency scheduling
│  │   └─ No → Consider dynamic tables for simplicity
│  │
│  └─> Do you have frequent updates (not just inserts)?
│      └─> Consider CDC patterns if your warehouse supports it
│
├─ 1-5 minutes (near real-time)
│  ├─> Warehouse supports dynamic tables → Consider dynamic tables with low target_lag
│  ├─> Need full dbt control → Lambda views (Pattern 5)
│  └─> Very lightweight transforms → Views-only (Pattern 6)
│
└─ Sub-second (true real-time)
   └─> dbt is not the right tool
       └─> Use streaming database (ClickHouse, Materialize, Rockset)
           dbt can still handle historical/analytical tables
```

## Pattern comparison

| Pattern | Freshness | Complexity | Cost | Control | Best for |
| ------- | --------- | ---------- | ---- | ------- | -------- |
| Standard incremental | Hours | Low | Low | High | Most use cases |
| Pattern 1: MERGE | 5-15 min | Medium | Medium | High | General near real-time |
| Pattern 2: CDC | 5-15 min | Medium | Medium | High | Frequent updates |
| Pattern 3: Microbatch | 5-15 min | Medium | Medium | High | Massive time-series tables |
| Pattern 4: Dynamic tables/MVs | 1-15 min | Low | Medium-High | Low | Simple logic |
| Pattern 5: Lambda views | 1-5 min | High | High | High | Custom dbt-only solution |
| Pattern 6: Views-only | less than 1 min | Low | Medium | High | Very lightweight transforms |

## Pattern selection guide

### Start with Pattern 1 (Incremental MERGE) if

- You're new to near real-time patterns
- You need 5-15 minute freshness
- You want a well-understood, portable solution
- You have standard fact table workloads

### Consider Pattern 2 (CDC) if

- Your warehouse supports CDC features (like Snowflake Streams)
- You have tables with frequent updates (not just inserts)
- You need efficient change capture

### Reach for Pattern 3 (Microbatch) if

- You have massive tables (billions of rows)
- Backfills are slow and risky
- You need systematic late-data handling
- You can coordinate `event_time` across upstream models

### Consider Pattern 4 (Dynamic tables/MVs) if

- Your warehouse supports them
- You want simple, declarative freshness
- You're okay with less control over scheduling
- Transformation logic is relatively straightforward

### Use Pattern 5 (Lambda views) only if

- Patterns 1-4 don't meet your needs
- You need 1-5 minute freshness
- You can't use dynamic tables
- Your team can handle the complexity

### Use Pattern 6 (Views-only) only if

- Transformations are truly lightweight
- Source is continuously updated
- Table is small-to-medium sized
- You need maximum freshness preservation

## Common anti-patterns to avoid

*Making everything real-time*: Not all data needs the same freshness. Making everything near real-time adds cost and complexity without proportional value. Use tiered freshness instead.

*Over-scheduling jobs*: Scheduling jobs more frequently than they can complete leads to queue buildup and cancelled runs. Ensure job runtime is < 50% of schedule interval.

*Ignoring costs*: Near real-time patterns can increase warehouse costs by 5-10x. Model costs upfront and monitor actual vs. expected costs weekly.

*No monitoring*: High-frequency jobs fail in new ways. Without monitoring, small issues become big problems. Implement comprehensive monitoring from day one.

*Premature optimization*: Building complex near real-time patterns before validating the business need. Start with hourly updates, let users experience it, then upgrade if there's demonstrated value.

*Views everywhere*: Starting with views-only pattern for complex transformations leads to performance issues. Use incremental models as the default.

## Additional resources

### Incremental models

- [Incremental models overview](/docs/build/incremental-models-overview)
- [Microbatch incremental models](/docs/build/incremental-microbatch)
- [Configuring incremental models in dbt](/docs/build/incremental-models)

### Snowflake

- [dbt docs: Dynamic tables configurations](/reference/resource-configs/snowflake-configs#dynamic-tables)
- [dbt docs: Snowflake materialized views](/reference/resource-configs/snowflake-configs#materialized-views)
- [Snowflake docs: Dynamic tables intro](https://docs.snowflake.com/en/user-guide/dynamic-tables-intro)
- [Snowflake docs: Understanding target lag](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh#understanding-target-lag)
- [Snowflake docs: Dynamic table limitations](https://docs.snowflake.com/en/user-guide/dynamic-tables-limitations)
- [Snowflake blog: Dynamic tables for streaming pipelines](https://www.snowflake.com/en/blog/dynamic-tables-delivering-declarative-streaming-data-pipelines/)
- [Snowflake docs: Materialized views](https://docs.snowflake.com/en/user-guide/views-materialized)
- [Snowflake docs: Streams intro](https://docs.snowflake.com/en/user-guide/streams-intro)
- [Snowflake docs: Snowpipe](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-intro)

### BigQuery

- [dbt docs: BigQuery materialized views](/reference/resource-configs/bigquery-configs#materialized-views)
- [BigQuery docs: Materialized views intro](https://cloud.google.com/bigquery/docs/materialized-views-intro)
- [BigQuery docs: Streaming inserts](https://cloud.google.com/bigquery/docs/streaming-data-into-bigquery)
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
- [How to create near real-time models with just dbt + SQL](https://discourse.getdbt.com/t/how-to-create-near-real-time-models-with-just-dbt-sql/1457) (lambda views pattern)

### Monitoring and observability

- [Source freshness](/docs/deploy/source-freshness)
- [dbt test documentation](/docs/build/data-tests)
- [Model contracts](/docs/collaborate/govern/model-contracts)

## Getting help

If you're implementing near real-time patterns and need help:

- [dbt Community Slack](https://www.getdbt.com/community/join-the-community/) - `#advice-dbt-for-data-modeling` channel
- [dbt Discourse](https://discourse.getdbt.com/) - Search for "real-time" or "incremental"
- [dbt Community](https://www.getdbt.com/community/) - Join community events and resources
- dbt Labs Professional Services - For complex implementations

## What's next?

Now that you understand the patterns for near real-time data:

1. Assess your requirements: Do you really need minute-level freshness?
2. Start conservative: Begin with hourly or 15-minute schedules
3. Measure baseline: Establish costs and performance before optimizing
4. Choose a pattern: Use the decision tree above to select your starting pattern
5. Implement monitoring: Set up comprehensive observability from day one
6. Iterate gradually: Increase frequency only when business value is proven

Remember: *The best freshness pattern is the simplest one that meets your business requirements.*
