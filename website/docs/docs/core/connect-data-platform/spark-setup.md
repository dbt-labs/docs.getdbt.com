---
title: "Apache Spark setup"
description: "Read this guide to learn about the Apache Spark warehouse setup in dbt."
id: "spark-setup"
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-spark'
  pypi_package: 'dbt-spark'
  min_core_version: 'v0.15.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: 'db-databricks-and-spark'
  slack_channel_link: 'https://getdbt.slack.com/archives/CNGCW8HKL'
  platform_name: 'Spark'
  config_page: '/reference/resource-configs/spark-configs'
---


<Snippet path="warehouse-setups-cloud-callout" />
<Snippet path="dbt-databricks-for-databricks" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


If connecting to Databricks via ODBC driver, it requires `pyodbc`. Depending on your system, you can install it seperately or via pip. See the [`pyodbc` wiki](https://github.com/mkleehammer/pyodbc/wiki/Install) for OS-specific installation details.

If connecting to a Spark cluster via the generic thrift or http methods, it requires `PyHive`.

```zsh
# odbc connections
$ python -m pip install "dbt-spark[ODBC]"

# thrift or http connections
$ python -m pip install "dbt-spark[PyHive]"
```

```zsh
# session connections
$ python -m pip install "dbt-spark[session]"
```

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specific configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Connection methods

dbt-spark can connect to Spark clusters by four different methods:

- [`odbc`](#odbc) is the preferred method when connecting to Databricks. It supports connecting to a SQL Endpoint or an all-purpose interactive cluster.
- [`thrift`](#thrift) connects directly to the lead node of a cluster, either locally hosted / on premise or in the cloud (e.g. Amazon EMR).
- [`http`](#http) is a more generic method for connecting to a managed service that provides an HTTP endpoint. Currently, this includes connections to a Databricks interactive cluster.


- [`session`](#session) connects to a pySpark session, running locally or on a remote machine.

:::info Advanced functionality
The `session` connection method is intended for advanced users and experimental dbt development. This connection method is not supported by dbt Cloud.
:::


### ODBC

Use the `odbc` connection method if you are connecting to a Databricks SQL endpoint or interactive cluster via ODBC driver. (Download the latest version of the official driver [here](https://databricks.com/spark/odbc-driver-download).)

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: odbc
      driver: [path/to/driver]
      schema: [database/schema name]
      host: [yourorg.sparkhost.com]
      organization: [org id]    # Azure Databricks only
      token: [abc123]
      
      # one of:
      endpoint: [endpoint id]
      cluster: [cluster id]
      
      # optional
      port: [port]              # default 443
      user: [user]
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

### Thrift

Use the `thrift` connection method if you are connecting to a Thrift server sitting in front of a Spark cluster, e.g. a cluster running locally or on Amazon EMR.

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: thrift
      schema: [database/schema name]
      host: [hostname]
      
      # optional
      port: [port]              # default 10001
      user: [user]
      auth: [e.g. KERBEROS]
      kerberos_service_name: [e.g. hive]
      use_ssl: [true|false]   # value of hive.server2.use.SSL, default false
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

### HTTP

Use the `http` method if your Spark provider supports generic connections over HTTP (e.g. Databricks interactive cluster).

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: http
      schema: [database/schema name]
      host: [yourorg.sparkhost.com]
      organization: [org id]    # Azure Databricks only
      token: [abc123]
      cluster: [cluster id]
      
      # optional
      port: [port]              # default: 443
      user: [user]
      connect_timeout: 60       # default 10
      connect_retries: 5        # default 0
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

Databricks interactive clusters can take several minutes to start up. You may
include the optional profile configs `connect_timeout` and `connect_retries`,
and dbt will periodically retry the connection.

### Session

Use the `session` method if you want to run `dbt` against a pySpark session. 

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: session
      schema: [database/schema name]
      host: NA                           # not used, but required by `dbt-core`
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

## Optional configurations

### Retries

Intermittent errors can crop up unexpectedly while running queries against Apache Spark. If `retry_all` is enabled, dbt-spark will naively retry any query that fails, based on the configuration supplied by `connect_timeout` and `connect_retries`. It does not attempt to determine if the query failure was transient or likely to succeed on retry. This configuration is recommended in production environments, where queries ought to be succeeding.

For instance, this will instruct dbt to retry all failed queries up to 3 times, with a 5 second delay between each retry:

<File name='~/.dbt/profiles.yml'>

```yaml
retry_all: true
connect_timeout: 5
connect_retries: 3
```

</File>

### Server side configuration

Spark can be customized using [Application Properties](https://spark.apache.org/docs/latest/configuration.html). Using these properties the execution can be customized, for example, to allocate more memory to the driver process. Also, the Spark SQL runtime can be set through these properties. For example, this allows the user to [set a Spark catalogs](https://spark.apache.org/docs/latest/configuration.html#spark-sql).

## Caveats

When facing difficulties, run `poetry run dbt debug --log-level=debug`. The logs are saved at `logs/dbt.log`.

### Usage with EMR
To connect to Apache Spark running on an Amazon EMR cluster, you will need to run `sudo /usr/lib/spark/sbin/start-thriftserver.sh` on the master node of the cluster to start the Thrift server (see [the docs](https://aws.amazon.com/premiumsupport/knowledge-center/jdbc-connection-emr/) for more information). You will also need to connect to port 10001, which will connect to the Spark backend Thrift server; port 10000 will instead connect to a Hive backend, which will not work correctly with dbt.

### Supported functionality

Most dbt Core functionality is supported, but some features are only available
on Delta Lake (Databricks).

Delta-only features:
1. Incremental model updates by `unique_key` instead of `partition_by` (see [`merge` strategy](/reference/resource-configs/spark-configs#the-merge-strategy))
2. [Snapshots](/docs/build/snapshots)
3. [Persisting](/reference/resource-configs/persist_docs) column-level descriptions as database comments

### Default namespace with Thrift connection method

To run metadata queries in dbt, you need to have a namespace named `default` in Spark when connecting with Thrift. You can check available namespaces by using Spark's `pyspark` and running `spark.sql("SHOW NAMESPACES").show()`. If the default namespace doesn't exist, create it by running `spark.sql("CREATE NAMESPACE default").show()`.

If there's a network connection issue, your logs will display an error like `Could not connect to any of [('127.0.0.1', 10000)]` (or something similar).
