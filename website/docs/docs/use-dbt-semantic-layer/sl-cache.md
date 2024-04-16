## Caching

The Semantic Layer allows you to cache common queries in order to speed up performance and reduce compute on expensive queries. We have two layers of caching in the Semantic Layer:  Result Caching and Declarative Caching

## **Result Caching**

This caching layer leverages your data platform’s built in caching layer. The SQL MetricFlow generates is identical for multiple query requests which means we can take advantage of your data platform’s cache. The following query patterns are used to illustrate when a user will hit the cache on Snowflake. The flow should be similar across other data platforms.

1. **Run from cold cache:** A user runs a semantic layer query from their BI tool. This query has not been run in the past 24 hours. This query will scan the entire data set and will not hit the cache
2. **Run from warm cache:** The user returns after 1 hour and re-runs the same query.  The SQL generated and executed on Snowflake will be the same. Since the result cache on snowflake is per user and retained for 24 hours, the query will hit the cache and should return much faster

The exact layers of caching and cache invalidation logic for the result cache will be specific to each data platform. Below are a list of resources on how caching works on our most common data platforms: 

- [Snowflake](https://community.snowflake.com/s/article/Caching-in-the-Snowflake-Cloud-Data-Platform)
- **[Redshift](https://docs.aws.amazon.com/redshift/latest/dg/c_challenges_achieving_high_performance_queries.html#result-caching)**
- [BigQuery](https://cloud.google.com/bigquery/docs/cached-results)
- [DataBricks](https://docs.databricks.com/en/optimizations/disk-cache.html)

## **Declarative Caching**

Declarative Caching allows users to pre-warm the cache using Saved Queries by setting the cache enabled config to `true.` This is useful for optimizing the performance of key dashboards or common ad-hoc query requests. When you run your Saved Query, the semantic layer will build a cached table from a Saved Query in the customer's data platform. Any query requests with the same inputs as the Saved Query will hit the cache and return much more quickly. We’ll automatically invalidate the cache when we detect fresh data in any of the models upstream of metrics in your cached table. We’ll rebuild the cache the next time your Saved Query is run. The following diagram illustrates what happens when we receive a query request:

![Declarative Cache Query Flow (1).png](/Users/jordanstein/Dev/docs.getdbt.com/website/static/img/docs/dbt-cloud/semantic-layer/declarative-cache-query-flow.png)


### **Populating the cache by running Exprts**

To populate the cache, you must setup an Export on your Saved Query **and** set the cache config on to true. 

```yaml
saved_queries:
	- name: my_saved_query
		...
		config:
		  cache:
		    enabled: true|false
		exports:
		  - name: order_data_key_metrics
				  config:
			      export_as: table
```

When this Saved Query is run, we'll build a cache table in the user's data warehouse in a dedicated `dbt_sl_cache` schema. You can set up a job to run an Saved Query in dbt cloud. For step-by-step instructions [refer to this guide](https://docs.getdbt.com/docs/use-dbt-semantic-layer/exports). Your cache will be refreshed on the same schedule as the Saved Query job.

![Cache Creation Flow.png](website/static/img/docs/dbt-cloud/semantic-layer/cache-creation-flow.png)

### How we manage cache invalidation, eviction and writing

We use the metadata from your dbt model runs to smartly manage cache invalidation. When you kick off a dbt job, we’ll keep track of when the model last ran and check the freshness of the metrics upstream of your cache. When an upstream model has data in it that was created after the cache was created, we will invalidate the cache. This means queries will not use the cache, and will instead query directly from the source data. Stale cache tables will be periodically dropped. We’ll write a new cache the next time your Saved Query runs.