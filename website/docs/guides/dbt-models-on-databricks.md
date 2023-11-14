---
title: Optimize and troubleshoot dbt models on Databricks
id: optimize-dbt-models-on-databricks
description: "Learn more about optimizing and troubleshooting your dbt models on Databricks"
displayText: Optimizing and troubleshooting your dbt models on Databricks
hoverSnippet: Learn how to optimize and troubleshoot your dbt models on Databricks.
# time_to_complete: '30 minutes' commenting out until we test
icon: 'databricks'
hide_table_of_contents: true
tags: ['Databricks', 'dbt Core','dbt Cloud']
level: 'Intermediate'
recently_updated: true
---

## Introduction

Building on the [Set up your dbt project with Databricks](/guides/set-up-your-databricks-dbt-project) guide, we'd like to discuss performance optimization. In this follow-up post, we outline simple strategies to optimize for cost, performance, and simplicity when you architect data pipelines. We’ve encapsulated these strategies in this acronym-framework:

- Platform Components
- Patterns & Best Practices
- Performance Troubleshooting

## Platform Components

As you start to develop your dbt projects, one of the first decisions you will make is what kind of backend infrastructure to run your models against. Databricks offers SQL warehouses, All-Purpose Compute, and Jobs Compute, each optimized to workloads they are catered to. Our recommendation is to use Databricks SQL warehouses for all your SQL workloads. SQL warehouses are optimized for SQL workloads when compared to other compute options, additionally, they can scale both vertically to support larger workloads and horizontally to support concurrency. Also, SQL warehouses are easier to manage and provide out-of-the-box features such as query history to help audit and optimize your SQL workloads. Between Serverless, Pro, and Classic SQL Warehouse types that Databricks offers, our standard recommendation for you is to leverage Databricks serverless warehouses. You can explore features of these warehouse types in the [Compare features section](https://www.databricks.com/product/pricing/databricks-sql?_gl=1*2rsmlo*_ga*ZmExYzgzZDAtMWU0Ny00N2YyLWFhYzEtM2RhZTQzNTAyZjZi*_ga_PQSEQ3RZQC*MTY3OTYwMDg0Ni4zNTAuMS4xNjc5NjAyMDMzLjUzLjAuMA..&_ga=2.104593536.1471430337.1679342371-fa1c83d0-1e47-47f2-aac1-3dae43502f6b) on the Databricks pricing page.

With serverless warehouses, you greatly decrease spin-up time waiting for the cluster to warm up and scale time when your cluster needs to horizontally scale. This mitigates the need to keep clusters idle as serverless warehouses will spin up quickly when the workload begins and then spin down when the workload is complete. Plus, serverless warehouses leverage our Photon engine out of the box for optimal performance in both ELT and serving workloads.

The next step would be to decide how big to make your serverless SQL warehouse. This is not an exact science but these subsections provide you with some quick tips that will drive huge improvements in performance.

### Sizing your SQL warehouses

To select the appropriate size of your SQL warehouse, consider the use case and workload you are running and its corresponding latency requirements. You can select a T-shirt size based on the amount of data and auto-scaling based on concurrency needs. A good rule of thumb to follow is to start with a Medium warehouse and work from there. For large and complex workloads, bigger warehouses are the way to go and that won’t necessarily mean higher costs. This is because larger warehouses take a shorter time to complete a unit of work. For example, if a Small warehouse takes an hour to complete a pipeline, it will only take half an hour with a Medium. This linear trend continues as long as there’s enough work for the warehouse to perform.

### Provision warehouses by workload

Another technique worth implementing is to provision separate SQL warehouses for building dbt pipelines instead of ad hoc, interactive SQL analysis. This is because the query design patterns and compute usage are different for these two types of workloads. Choose T-shirt sizes based on data volumes and SLAs (scale-up principle), and choose auto-scaling based on concurrency requirements (scale-out principle). For larger deployments, this approach could be expanded to map different workload sizes to multiple “pipeline” warehouses, if needed. On the dbt side, take into account the [number of threads you have](/docs/core/connect-data-platform/connection-profiles#understanding-threads), meaning how many dbt models you can run in parallel. The higher the thread count, the more compute you will require.

### Configure auto-stop

Because of the ability of serverless warehouses to spin up in a matter of seconds, setting your auto-stop configuration to a lower threshold will not impact SLAs and end-user experience. From the SQL Workspace UI, the default value is 10 minutes and  you can set it to 5 minutes for a lower threshold with the UI. If you would like more custom settings, you can set the threshold to as low as 1 minute with the [API](https://docs.databricks.com/sql/api/sql-endpoints.html#).

## Patterns & Best Practices

Now that we have a solid sense of the infrastructure components, we can shift our focus to best practices and design patterns on pipeline development.  We recommend the staging/intermediate/mart approach which is analogous to the medallion architecture bronze/silver/gold approach that’s recommended by Databricks. Let’s dissect each stage further.

dbt has guidelines on how you can [structure your dbt project](/best-practices/how-we-structure/1-guide-overview) which you can learn more about.

### Bronze / Staging Layer:

There are a few different options for materializing bronze delta tables on Databricks. In the recommended dbt workflow, you should load your flat files into a table first before using dbt to transform on it. To do so, you can use an EL tool to handle this ingestion.

However, we know this isn't always possible so for data sets in cloud storage, we recommend that you either leverage our `COPY INTO` functionality or stage the external table. In terms of the `COPY INTO` approach, you would have a few different options. The first option would be to run the `COPY INTO` logic as a pre-hook before building your silver/intermediate models. The second option would be to invoke the databricks `COPY INTO` macro with `dbt run-operation` and then subsequently execute your model runs. You can see an example implementation of the [COPY INTO macro](https://github.com/databricks/dbt-databricks/blob/main/docs/databricks-copy-into-macro-aws.md) in the dbt-databricks docs.

The main benefit of leveraging `COPY INTO` is that it's an incremental operation and it ensures that data is written in Delta format (when we refer to Delta, we are simply referring to the open Parquet tables with a transaction log). If you instead opt to stage an external table, the bronze table retains its raw structure (whether it is CSV, Parquet, JSON, etc.). This would prevent the ability to leverage the performance, reliability, and governance advantages inherent in Delta. Further, external Parquet tables require additional manual work such as running repair operations to ensure new partition metadata is accounted for. Nevertheless, staging external tables could be a feasible option if you are migrating to Databricks from another cloud warehouse system, where you heavily leveraged this functionality.

### Silver / Intermediate Layer

Now that we have our bronze table taken care of, we can proceed with the silver layer.

For cost and performance reasons, many customers opt to implement an incremental pipeline approach. The main benefit with this approach is that you process a lot less data when you insert new records into the silver layer, rather than re-create the table each time with all the data from the bronze layer. However it should be noted that by default, [dbt recommends using views and tables](/best-practices/materializations/1-guide-overview) to start out with and then moving to incremental as you require more performance optimization.

dbt has an [incremental model materialization](/reference/resource-configs/spark-configs#the-merge-strategy) to facilitate this framework. How this works at a high level is that Databricks will create a temp view with a snapshot of data and then merge that snapshot into the silver table. You can customize the time range of the snapshot to suit your specific use case by configuring the `where` conditional in your `is_incremental` logic. The most straightforward implementation is to merge data using a timestamp that’s later than the current max timestamp in the silver table, but there are certainly valid use cases for increasing the temporal range of the source snapshot.

While merge should be fairly performant out of the box but if you have particularly tight SLAs, there are some more advanced tuning techniques that you can incorporate into your logic. Let us discuss several examples in further detail.

### File Compaction 

Most compute engines work best when file sizes are between 32 MB and 256 MB. In Databricks, we take care of optimal file sizing under the hood with our [auto optimize](https://docs.databricks.com/optimizations/auto-optimize.html) features. Auto optimize consists of two distinct features: auto compaction and optimized writes. In Databricks SQL warehouses, optimized writes are enabled by default. We recommend that you [opt in to auto compaction](https://docs.databricks.com/optimizations/auto-optimize.html#when-to-opt-in-to-auto-compaction).

### Data skipping

Under the hood, Databricks will naturally [cluster data based on when it was ingested](https://www.databricks.com/blog/2022/11/18/introducing-ingestion-time-clustering-dbr-112.html). Since many queries include timestamps in `where` conditionals, this will naturally lead to a large amount of file skipping for enhanced performance. Nevertheless, if you have other high cardinality columns (basically columns with a large amount of distinct values such as id columns) that are frequently used in `join` keys or `where` conditionals, performance can typically be augmented further by leveraging Z-order.

The SQL syntax for the Z-Order command is `OPTIMIZE TABLE Z-ORDER BY (col1,col2,col3,etc)`. One caveat to be aware of is that you will rarely want to Z-Order by more than three columns. You will likely want to either run Z-order on run end after your model builds or run Z-Order as a separate scheduled job on a consistent cadence, whether it is daily, weekly, or monthly.

```sql
config(

materialized='incremental',

zorder="column_A" | ["column_A", "column_B"]

)
```

### Analyze Table

The `ANALYZE TABLE` command ensures that our system has the most up-to-date statistics to select the optimal join plan. You will likely want to either run analyze table posthook after your model builds or run analyze table as a separate scheduled dbt job on a consistent cadence, whether it is daily, weekly, or monthly.  The SQL syntax for this is:

```sql 
ANALYZE TABLE mytable COMPUTE STATISTICS FOR

COLUMNS col1, col2, col3
```

An important item to clarify is that you will want to prioritize statistics for columns that are frequently used in joins.

### Vacuum

When you delete a record from a Delta table, it is a soft delete. What this means is that the record is deleted from the transaction log and is not included in subsequent queries, but the underlying file still remains in cloud storage. If you want to delete the underlying files as well (whether for reducing storage cost or augmenting performance on merges), you can run a vacuum command. The factor you will want to be very cognizant of is restoring older versions of the table. Let’s say  you vacuum a table to delete all unused files that’s older than 7 days. You won’t be  able to restore versions of the table from over 7 days ago that rely on those deleted  files, so use with caution. If/when you choose to leverage vacuum, you will likely want to run vacuum using the dbt functionality [on-run-end](/reference/project-configs/on-run-start-on-run-end) after your model builds or run vacuum as a separate scheduled dbt job on a consistent cadence (whether it is daily, weekly, or monthly) using the dbt [run-operation](/reference/commands/run-operation) command (with the vaccum statement in a macro).

### Gold / Marts Layer

Now onto the most final layer &mdash; the gold marts that business stakeholders typically interact with from their preferred BI tool. The considerations here will be fairly similar to the silver layer except that these marts are more likely to handling aggregations. Further, you will likely want to be even more intentional about Z-Ordering these tables as SLAs tend to be lower with these direct stakeholder facing tables.

In addition, these tables are well suited for defining [dbt metrics](/docs/build/metrics) on to ensure simplicity and consistency across your key business KPIs! Using the [dbt_metrics package](https://hub.getdbt.com/dbt-labs/metrics/latest/), you can query the metrics inside of your own dbt project even. With the upcoming Semantic Layer Integration, you can also then query the metrics in any of the partner integrated tools.

### Filter rows in target and/or source

It can be done using `incremental_predicates` like in this example: 

```sql
{{

config(

materialized='incremental',

incremental_strategy = 'merge',

unique_key = 'id',

incremental_predicates = [

"dbt_internal_target.create_at >= '2023-01-01'",	"dbt_internal_source.create_at >= '2023-01-01'"],

)

}}
```

## Performance Troubleshooting

Performance troubleshooting refers to the process of identifying and resolving issues that impact the performance of your dbt models and overall data pipelines. By improving the speed and performance of your Lakehouse platform, you will be able to process data faster, process large and complex queries more effectively, and provide faster time to market.  Let’s go into detail the three effective strategies that you can implement.

### SQL warehouse query profile

The SQL warehouse query profile is an effective tool found inside the Databricks SQL workspace. It’s used to troubleshoot slow-running queries, optimize query execution plans, and analyze granular metrics to see where compute resources are being spent. The query profile includes these high level capability areas:

- Detailed information about the three main components of query execution, which are time spent in tasks, number of rows processed, and memory consumption.
- Two types of graphical representations. A tree view to easily spot slow operations at a glance, and a graph view that breaks down how data is transformed across tasks.
- Ability to understand mistakes and performance bottlenecks in queries.

The three common examples of performance bottlenecks that can be surfaced by the query profile are:

### Inefficient file pruning

By default, Databricks Delta tables collect statistics on the _first 32 columns_ defined in your table schema. When transforming data from the Bronze/staging layer to the Silver/intermediate layer, it is advised to reorder your columns to account for these file-level stats and improve overall performance. Move numerical keys and high cardinality query predicates to the left of the 32nd ordinal position, and move strings and complex data types after the 32nd ordinal position of the table. It is worth mentioning that while you can change the default table property to collect statistics on more columns, it will add more overhead as you write files. You may change this default value by using the [table property](https://docs.databricks.com/delta/table-properties.html), `delta.dataSkippingNumIndexedCols`.

### Full Table Scans

The Query Profile provides metrics that allow you to identify the presence of full table scans. Full table scans is a query operation that involves scanning the entire table to retrieve records. It can be a performance issue especially for large tables with billions or trillions of rows. This is because scanning an entire table can be time-consuming and resource-intensive, leading to high memory and CPU usage and slower response times. Table layout techniques such as file compaction and Z-Ordering described in the earlier section of this article will help alleviate this problem.

### Exploding Joins

The concept of _exploding joins_ refers to a `join` operation that produces a much larger table result set than either of the input tables used, resulting in a Cartesian product. This performance issue can be determined by enabling the verbose mode setting in the Query Profile, by looking at the number of records produced by a join operator. There are several steps you can take to prevent exploding joins. As a first step, make the join conditions more specific to reduce the number of rows that are being matched. Another step is to utilize data preprocessing techniques such as aggregating, filtering, and performing data sampling before the join operation. These techniques can reduce the size of the input tables and help prevent exploding joins.

### Materialization Best Practices  

Remember that data is stored as files, so the unit of I/O work is a file, not a row. That’s a lot of work if we’re dealing with TBs of data. Therefore we recommend relying on merge strategy as the recommended strategy for the majority of incremental models.

Databricks is committed to continuously improving its performance. For example, in Delta and DBSQL, we’ve greatly improved performance of MERGE operations recently with [low-shuffle merge and Photon](https://www.databricks.com/blog/2022/10/17/faster-merge-performance-low-shuffle-merge-and-photon.html). With many future implementations in the pipeline such as deletion vectors for efficient deletes & upserts.Here’s the basic strategies to speed it up:

1. Only read partitions that are important by pushing down filters to scan source and target using filters in *model* and *incremental_predicates*
2. Only update important rows
3. Improve key lookup by defining only *one* materialized key
4. Only update important columns

### dbt Cloud Discovery API

Now you might be wondering, how do you identify opportunities for performance improvement inside of dbt? Well, with each job run, dbt Cloud generates metadata on the timing, configuration, and freshness of models in your dbt project. The [dbt Discovery API](/docs/dbt-cloud-apis/discovery-api) is a GraphQL service that supports queries on this metadata, using  the [graphical explorer](https://metadata.cloud.getdbt.com/graphiql) or the endpoint itself. Teams can pipe this data into their data warehouse and analyze it like any other data source in a business intelligence platform. dbt Cloud users can also use the data from the [Model Timing tab](/docs/deploy/run-visibility#model-timing) to visually identify models that take the most time and may require refactoring.

### dbt Cloud Admin API

With the [dbt Cloud Admin API](/docs/dbt-cloud-apis/admin-cloud-api), you can  pull the dbt artifacts from your dbt Cloud run,  put the generated `manifest.json` into an S3 bucket, stage it, and model the data using the [dbt artifacts package](https://hub.getdbt.com/brooklyn-data/dbt_artifacts/latest/). That package can help you identify inefficiencies in your dbt models and pinpoint where opportunities for improvement are.

### Conclusion

This builds on the content in [Set up your dbt project with Databricks](/guides/set-up-your-databricks-dbt-project).

We welcome you to try these strategies on our example open source TPC-H implementation and to provide us with thoughts/feedback as you start to incorporate these features into production. Looking forward to your feedback on [#db-databricks-and-spark](https://getdbt.slack.com/archives/CNGCW8HKL) Slack channel!
