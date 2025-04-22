---
title: "Microsoft Fabric Lakehouse setup"
description: "Read this guide to learn about the Microsoft Fabric spark setup for Lakehouse in dbt."
id: "fabricspark-setup"
meta:
  maintained_by: Microsoft
  authors: Microsoft
  github_repo: 'microsoft/dbt-fabricspark'
  pypi_package: 'dbt-fabricspark'
  min_core_version: 'v1.7'
  cloud_support: 'Not supported'
  min_supported_version: 'n/a'
  slack_channel_name: 'db-fabric-synapse'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Microsoft Fabric'
  config_page: '/reference/resource-configs/fabricspark-configs'
---


<Snippet path="warehouse-setups-cloud-callout" />


Below is a guide for use with [Fabric Data Engineering](https://learn.microsoft.com/en-us/fabric/data-engineering/data-engineering-overview), a new product within Microsoft Fabric. This adapter currently supports connecting to a  lakehouse endpoint.

To learn how to set up dbt using Fabric Warehouse, refer to [Microsoft Fabric Data Warehouse](/docs/core/connect-data-platform/fabric-setup).


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Connection methods

dbt-fabricspark can connect to Fabric Spark runtime using Fabric Livy API method. The Fabric Livy API allows submitting jobs in two different modes:  

- [`session-jobs`](#session-jobs) A Livy session job entails establishing a Spark session that remains active throughout the spark session. A spark session, can run multiple jobs (each job is an action), sharing state and cached data between jobs.
- batch jobs entails submitting a Spark application for a single job execution. In contrast to a Livy session job, a batch job doesn't sustain an ongoing Spark session. With Livy batch jobs, each job initiates a new Spark session that ends when the job finishes.

:::info Supported mode
To share the session state among jobs and reduce the overhead of session management,  dbt-fabricspark adapter supports only `session-jobs` mode.
:::

### session-jobs

session-jobs is the preferred method when connecting to Fabric Lakehouse.

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabricspark
      method: livy
      authentication: CLI
      endpoint: https://api.fabric.microsoft.com/v1
      workspaceid: [Fabric Workspace GUID]
      lakehouseid: [Lakehouse GUID]
      lakehouse: [Lakehouse Name]
      schema: [Lakehouse Name]
      spark_config:
        name: [Application Name]
        # optional
        archives:
          - "example-archive.zip"
        conf:
            spark.executor.memory: "2g"
            spark.executor.cores: "2"
        tags:
          project: [Project Name]
          user: [User Email]
          driverMemory: "2g"
          driverCores: 2
          executorMemory: "4g"
          executorCores: 4
          numExecutors: 3
      # optional
      connect_retries: 0
      connect_timeout: 10
      retry_all: true
```

</File>

## Optional configurations

### Retries

Intermittent errors can crop up unexpectedly while running queries against Fabric Spark. If `retry_all` is enabled, dbt-fabricspark will naively retry any queries that fails, based on the configuration supplied by `connect_timeout` and `connect_retries`. It does not attempt to determine if the query failure was transient or likely to succeed on retry. This configuration is recommended in production environments, where queries ought to be succeeding. The default `connect_retries` configuration is 2. 

For instance, this will instruct dbt to retry all failed queries up to 3 times, with a 5 second delay between each retry:

<File name='~/.dbt/profiles.yml'>

```yaml
retry_all: true
connect_timeout: 5
connect_retries: 3
```
</File>



### Spark configuration

Spark can be customized using [Application Properties](https://spark.apache.org/docs/latest/configuration.html). Using these properties the execution can be customized, for example, to allocate more memory to the driver process. Also, the Spark SQL runtime can be set through these properties. For example, this allows the user to [set a Spark catalogs](https://spark.apache.org/docs/latest/configuration.html#spark-sql).


### Supported functionality

Most <Constant name="core" /> functionality is supported, Please refer to [Delta Lake interoporability](https://learn.microsoft.com/en-us/fabric/fundamentals/delta-lake-interoperability).

Delta-only features:
1. Incremental model updates by `unique_key` instead of `partition_by` (see [`merge` strategy](/reference/resource-configs/spark-configs#the-merge-strategy))
2. [Snapshots](/docs/build/snapshots)
3. [Persisting](/reference/resource-configs/persist_docs) column-level descriptions as database comments

### Limitations

1. Lakehouse schemas are not supported. Refer to [limitations](https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-schemas#public-preview-limitations)
2. Service Principal Authentication is not supported yet by Livy API.
3. Only Delta, CSV & Parquet table data formats are supported by Fabric Lakehouse.
