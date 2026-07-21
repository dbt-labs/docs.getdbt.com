---
title: "Connect Microsoft Fabric Lakehouse to dbt Core"
sidebar_label: "Microsoft Fabric Lakehouse"
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

To learn how to set up dbt using Fabric Warehouse, refer to [Microsoft Fabric Data Warehouse](/docs/local/connect-data-platform/fabric-setup).


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Supported authentication types

The Fabric Lakehouse adapter (`dbt-fabricspark`) connects to Fabric Spark through the Livy API. Choose the authentication method that matches where you run <Constant name="core" />.

<Tabs>

<TabItem value="Azure CLI">

Use Azure CLI for self-hosted dbt installations. This lets <Constant name="core" /> use credentials from an active `az login` session. To use this method, set `authentication: CLI` in your `profiles.yml` file and run `az login`.

When you authenticate, Azure CLI may open a browser window or prompt you to complete sign-in on the [Microsoft device login](https://microsoft.com/devicelogin) page and enter a one-time code to complete sign-in. Once authentication is successful, dbt automatically reuses the active Azure CLI session for subsequent commands.

#### Example Azure CLI configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: fabricspark
      method: livy
      endpoint: https://api.fabric.microsoft.com/v1
      workspaceid: WORKSPACE_ID
      lakehouseid: LAKEHOUSE_ID
      lakehouse: LAKEHOUSE_NAME
      schema: LAKEHOUSE_OR_SCHEMA_NAME
      threads: 1

      # Authentication (CLI for self-hosted dbt installations)
      authentication: CLI
```

</File>

</TabItem>

<TabItem value="Service principal">

Use a Microsoft Entra ID service principal for CI/CD and other automated workloads. This method uses app registration credentials, not an active az login session. To use this method, set `authentication: SPN` in your `profiles.yml` file and provide the service principal's client ID, tenant ID, and client secret.

Before you run with service principal authentication, make sure:

- The service principal has access to the Fabric workspace and lakehouse.
- Service principals can use Fabric APIs is enabled in the Fabric Admin port.

#### Example service principal configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: fabricspark
      method: livy
      endpoint: https://api.fabric.microsoft.com/v1
      workspaceid: WORKSPACE_ID
      lakehouseid: LAKEHOUSE_ID
      lakehouse: LAKEHOUSE_NAME
      schema: LAKEHOUSE_OR_SCHEMA_NAME
      threads: 1

      # Authentication (SPN for CI/CD)
      authentication: SPN
      client_id: SPN_CLIENT_ID
      tenant_id: MICROSOFT_ENTRA_TENANT_ID
      client_secret: SPN_CLIENT_SECRET
```

</File>

</TabItem>

<TabItem value="Fabric notebook">

You can authenticate through the Livy API from a Fabric notebook for production workloads and orchestration use cases within the Microsoft Fabric ecosystem. This method uses [`notebookutils.credentials`](https://learn.microsoft.com/en-us/fabric/data-engineering/notebookutils/notebookutils-credentials?tabs=python).

Use Python notebooks instead of PySpark notebooks to minimize compute costs because the Livy API starts its own Spark sessions.

#### Example Fabric notebook configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: fabricspark
      method: livy
      endpoint: https://api.fabric.microsoft.com/v1
      workspaceid: WORKSPACE_ID
      lakehouseid: LAKEHOUSE_ID
      lakehouse: LAKEHOUSE_NAME
      schema: LAKEHOUSE_OR_SCHEMA_NAME
      threads: 1

      # Authentication (fabric_notebook for execution from a Fabric notebook)
      authentication: fabric_notebook
```

</File>

</TabItem>

<TabItem value="Custom TokenCredential">

Use `token_credential` when you need <Constant name="core" /> to load a custom [`azure.core.credentials.TokenCredential`](https://learn.microsoft.com/en-us/python/api/azure-core/azure.core.credentials.tokencredential) implementation, such as a workload identity federation or token broker flow. To use this method, set `authentication: token_credential` and provide the dotted path to your credential class.

#### Example custom TokenCredential configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: fabricspark
      method: livy
      endpoint: https://api.fabric.microsoft.com/v1
      workspaceid: WORKSPACE_ID
      lakehouseid: LAKEHOUSE_ID
      lakehouse: LAKEHOUSE_NAME
      schema: LAKEHOUSE_OR_SCHEMA_NAME
      threads: 1

      # Authentication (custom TokenCredential)
      authentication: token_credential
      credential_class: my_package.auth.ExternalTokenCredential
      credential_kwargs:
        tenant_id: MICROSOFT_ENTRA_TENANT_ID
```

</File>

Replace `credential_class` and `credential_kwargs` with the class path and keyword arguments your custom credential implementation expects.

</TabItem>

</Tabs>

## Connection methods

`dbt-fabricspark` can connect to Fabric Spark runtime using Fabric Livy API method. The Fabric Livy API allows submitting jobs in two different modes:  

- [`session-jobs`](#session-jobs) A Livy session job entails establishing a Spark session that remains active throughout the Spark session. A Spark session, can run multiple jobs (each job is an action), sharing state and cached data between jobs.
- batch jobs entails submitting a Spark application for a single job execution. In contrast to a Livy session job, a batch job doesn't sustain an ongoing Spark session. With Livy batch jobs, each job initiates a new Spark session that ends when the job finishes.

:::info Supported mode
To share the session state among jobs and reduce the overhead of session management,  `dbt-fabricspark` adapter supports only `session-jobs` mode.
:::

### session-jobs

`session-jobs` is the preferred method when connecting to Fabric Lakehouse.

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

Intermittent errors can crop up unexpectedly while running queries against Fabric Spark. If `retry_all` is enabled, `dbt-fabricspark` will naively retry any queries that fails, based on the configuration supplied by `connect_timeout` and `connect_retries`. It does not attempt to determine if the query failure was transient or likely to succeed on retry. This configuration is recommended in production environments, where queries ought to be succeeding. The default `connect_retries` configuration is 2. 

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

1. Only Delta, CSV, and Parquet table data formats are supported by Fabric Lakehouse.
