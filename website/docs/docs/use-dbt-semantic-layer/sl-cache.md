---
title: "Cache common queries"
id: "sl-cache"
description: "Cache common queries to speed up performance and reduce query computation."
tags: [Semantic Layer]
sidebar_label: "Cache common queries"
---


The dbt Semantic Layer allows you to cache common queries in order to speed up performance and reduce compute on expensive queries.

There are two different types of caching:

- [**Result caching**](#result-caching) leverages your data platform's built-in caching layer.
- [**Declarative caching**](#declarative-caching) allows you to pre-warm the cache using saved queries.

Use caching to speed up your queries and reduce compute time. The difference between the two is that result caching happens automatically by leveraging your data platform's cache. While declarative caching allows you to 'declare' the queries you specifically want to cache. With declarative caching, you need to anticipate which queries you want to cache.

## Prerequisites
- dbt Cloud [Team or Enterprise](https://www.getdbt.com/) plan.
- dbt Cloud environments on dbt version 1.6 or higher. Or  select [Keep on latest version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#keep-on-latest-version).
- A successful job run and [production environment](/docs/deploy/deploy-environments#set-as-production-environment).
- For declarative caching, you need to have [exports](/docs/use-dbt-semantic-layer/exports) defined in your [saved queries](/docs/build/saved-queries) YAML file configuration.

## Result caching

Result caching leverages your data platform’s built-in caching layer and features. [MetricFlow](/docs/build/about-metricflow) generates the same SQL for multiple query requests, this means it can take advantage of your data platform’s cache. Double-check your data platform's specifications.

Here's how caching works, using Snowflake as an example, and should be similar across other data platforms:

1. **Run from cold cache** &mdash; When you run a semantic layer query from your BI tool that hasn't been executed in the past 24 hours, the query scans the entire dataset and doesn't use the cache.
2. **Run from warm cache** &mdash; If you rerun the same query after 1 hour, the SQL generated and executed on Snowflake remains the same. On Snowflake, the result cache is set per user for 24 hours, which allows the repeated query to use the cache and return results faster.

Different data platforms might have different caching layer and cache invalidation rules. Here's a list of resources on how caching works on some common data platforms:

- [BigQuery](https://cloud.google.com/bigquery/docs/cached-results)
- [DataBricks](https://docs.databricks.com/en/optimizations/disk-cache.html)
- [Redshift](https://docs.aws.amazon.com/redshift/latest/dg/c_challenges_achieving_high_performance_queries.html#result-caching)
- [Snowflake](https://community.snowflake.com/s/article/Caching-in-the-Snowflake-Cloud-Data-Platform)

## Declarative caching

Declarative caching enables you to pre-warm the cache using [saved queries](/docs/build/saved-queries) by setting the cache config to `true` in your `saved_queries` settings. This is useful for optimizing performance for key dashboards or common ad-hoc query requests.

How declarative caching works:
- Configuration &mdash; Ensure your saved queries YAML configuration file has [exports](/docs/use-dbt-semantic-layer/exports) defined.
- Execution &mdash; When you run a saved query:
  - The dbt Semantic Layer builds a cached table from a saved query, with exports defined, into your data platform.
  - Any query requests that match the saved query's inputs will use the cache, returning results more quickly.
  - The dbt Semantic Layer automatically invalidates the cache when it detects new, fresh data in any upstream models related to the metrics in your cached table.
  - The cache refreshes (or rebuilds) the next time you run the saved query.

Refer to the following diagram, which illustrates what happens when the dbt Semantic Layer receives a query request:

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/declarative-cache-query-flow.jpg" width="70%" title="Declarative cache query flow" />

### Declarative caching setup

To populate the cache, you need to configure an export in your saved query YAML file configuration _and_ set the `cache config` to `true`. You can't cache a saved query without an export defined.

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

When you run a saved query:
- The dbt Semantic Layer builds a cache table in your data platform in a dedicated `dbt_sl_cache` schema. 
- The cache schema and tables are created using your deployment credentials. You need to grant read access to this schema for your Semantic Layer user.
- Use [exports to set up a job](/docs/use-dbt-semantic-layer/exports) to run a saved query dbt Cloud.
- The cache refreshes (or rebuilds) on the same schedule as the saved query job.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/cache-creation-flow.jpg" width="70%" title="Create cache flow" />

## Cache management

dbt Cloud uses the metadata from your dbt model runs to intelligently manage cache invalidation. When you start a dbt job, it keeps track of the last model runtime and checks the freshness of the metrics upstream of your cache.

If an upstream model has data in it that was created after the cache was created, dbt Cloud invalidates the cache. This means queries won't use outdated cases and will instead query directly from the source data. Stale, outdated cache tables are periodically dropped and dbt Cloud will write a new cache the next time your saved query runs.

You can manually invalidate the cache through the [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) using the `InvalidateCacheResult` field.

## FAQs
<detailsToggle alt_header="How is my data stored?" >

Your data remains within your own data platform. This ensures privacy as dbt Cloud uses this existing infrastructure for caching

</detailsToggle>
