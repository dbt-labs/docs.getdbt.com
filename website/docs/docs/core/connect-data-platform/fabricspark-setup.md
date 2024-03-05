---
title: "Microsoft Fabric Spark setup"
description: "Read this guide to learn about the Microsoft Fabric Spark lakehouse setup in dbt."
id: "fabricspark-setup"
meta:
  maintained_by: Microsoft
  authors: 'Pradeep Srikakolapu'
  github_repo: 'microsoft/dbt-fabricspark'
  pypi_package: 'dbt-fabricspark'
  min_core_version: 'v1.7.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: 'db-fabric-synapse'
  slack_channel_link: 'https://app.slack.com/client/T0VLPD22H/C01DRQ178LQ'
  platform_name: 'Fabric Spark'
  config_page: '/reference/resource-configs/fabricspark-configs'
---


<Snippet path="warehouse-setups-cloud-callout" />
<Snippet path="dbt-fabricspark-for-fabricspark" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

```zsh
# livy connections
$ python -m pip install "dbt-fabricspark"
```

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specific configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Connection Methods

dbt-fabricspark can connect to Spark clusters using livy connections:

- [`livy`](#livy) is the supported method to connect to Microsoft Fabric Data Engineering experience. It supports connecting to a job cluster.

### LIVY

Use the `livy` connection method to connect to Microsoft Fabric data engineering experience.

<File name='~/.dbt/profiles.yml'>

```yaml
fabric-spark-profile:
  target: fabricspark-dev
    fabricspark-dev:
        authentication: CLI
        method: livy
        endpoint: https://api.fabric.microsoft.com/v1
        workspaceid: [workspace id]
        lakehouseid: [lakehouse id]
        lakehouse: [lakehouse name]
        schema: [lakehouse name]
        threads: 1
        type: fabricspark
        livy_session_parameter:
          "spark.driver.memory": "4g" 
```

</File>


## Optional configurations

### Retries

Intermittent errors can crop up unexpectedly while running queries against Microsoft Fabric Spark. If `retry_all` is enabled, dbt-spark will naively retry any query that fails, based on the configuration supplied by `connect_timeout` and `connect_retries`. It does not attempt to determine if the query failure was transient or likely to succeed on retry. This configuration is recommended in production environments, where queries ought to be succeeding.

For instance, this will instruct dbt to retry all failed queries up to 3 times, with a 5 second delay between each retry:

<File name='~/.dbt/profiles.yml'>

```yaml
retry_all: true
connect_timeout: 5
connect_retries: 3
```

</File>



<VersionBlock firstVersion="1.7">

### Server side configuration (Livy Session Parameters)

Fabric Spark can be customized using [Application Properties](https://spark.apache.org/docs/latest/configuration.html). Using these properties the execution can be customized, for example, to allocate more memory to the driver process. Also, the Spark SQL runtime can be set through these properties. For example, this allows the user to [set a Spark catalogs](https://spark.apache.org/docs/latest/configuration.html#spark-sql).
</VersionBlock>

## Caveats

### Supported Functionality

Delta-only features:
1. Incremental model updates by `unique_key` instead of `partition_by` (see [`merge` strategy](/reference/resource-configs/spark-configs#the-merge-strategy))
2. [Snapshots](/docs/build/snapshots)
3. [Persisting](/reference/resource-configs/persist_docs) column-level descriptions as database comments
