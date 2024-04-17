---
title: "Caching in the dbt Semantic Layer"
id: "sl-cache"
description: "Cache common queries to speed up performance and reduce query computation."
tags: [Semantic Layer]
sidebar_label: "Cache common queries"
---


The dbt Semantic Layer allows you to cache common queries in order to speed up performance and reduce compute on expensive queries. 

There are two layers of caching:

- [**Result caching**](#result-caching) leverages your data platform's built-in caching layer.
- [**Declarative caching**](#declarative-caching) allows you to pre-warm the cache using saved queries.

## Result caching

Result caching leverages your data platform’s built-in caching layer and features. [MetricFlow](/docs/build/about-metricflow) generates the same SQL for multiple query requests, this means it can take advantage of your data platform’s cache.

Here's how caching works, using Snowflake as an example, and should be similar across other data platforms:

1. **Run from cold cache** &mdash; When a user runs a semantic layer query from their BI tool that hasn't been executed in the past 24 hours, the query scans the entire dataset and doesn't use the cache.
2. **Run from warm cache** &mdash; If a user reruns the same query after 1 hour, the SQL generated and executed on Snowflake remains the same. On Snowflake, the result cache is set per user for 24 hours, which allows the repeated query to use the cache and return results faster.

Different data platforms might have different caching layer and cache invalidation rules. Here's a list of resources on how caching works on some common data platforms:

- [BigQuery](https://cloud.google.com/bigquery/docs/cached-results)
- [DataBricks](https://docs.databricks.com/en/optimizations/disk-cache.html)
- [Redshift](https://docs.aws.amazon.com/redshift/latest/dg/c_challenges_achieving_high_performance_queries.html#result-caching)
- [Snowflake](https://community.snowflake.com/s/article/Caching-in-the-Snowflake-Cloud-Data-Platform)

## Declarative caching

Declarative Caching allows users to pre-warm the cache using Saved Queries by setting the cache enabled config to `true.` This is useful for optimizing the performance of key dashboards or common ad-hoc query requests. When you run your Saved Query, the semantic layer will build a cached table from a Saved Query in the customer's data platform. Any query requests with the same inputs as the Saved Query will hit the cache and return much more quickly. We’ll automatically invalidate the cache when we detect fresh data in any of the models upstream of metrics in your cached table. We’ll rebuild the cache the next time your Saved Query is run. The following diagram illustrates what happens when we receive a query request:

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/declarative-cache-query-flow.jpg" width="70%" title="Declarative cache query flow" />

### Populate cache with exports

To populate the cache, you must setup an Export on your Saved Query **and** set the cache config on to true. 

```yaml
saved_queries:
  - name: my_saved_query
    ...
    config:
      cache:
        enabled: true|false # Defaults to false
    exports:
      - name: order_data_key_metrics
        config:
          export_as: table
```

When this Saved Query is run, we'll build a cache table in the user's data warehouse in a dedicated `dbt_sl_cache` schema. You can set up a job to run an Saved Query in dbt cloud. For step-by-step instructions [refer to this guide](/docs/use-dbt-semantic-layer/exports). Your cache will be refreshed on the same schedule as the Saved Query job.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/cache-creation-flow.jpg" width="70%" title="Create cache flow" />

### Manage cache invalidation, eviction, and writing

We use the metadata from your dbt model runs to smartly manage cache invalidation. When you kick off a dbt job, we’ll keep track of when the model last ran and check the freshness of the metrics upstream of your cache. When an upstream model has data in it that was created after the cache was created, we will invalidate the cache. This means queries will not use the cache, and will instead query directly from the source data. Stale cache tables will be periodically dropped. We’ll write a new cache the next time your Saved Query runs.
