---
title: "Apache Spark Profile"
id: "spark-profile"
---

## Overview of dbt-spark

**Maintained by:** core dbt maintainers    
**Author:** dbt Labs    
**Source:** [Github](https://github.com/dbt-labs/dbt-spark)    
**dbt Cloud:** Supported    
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/archives/CNGCW8HKL)     


![dbt-spark stars](https://img.shields.io/github/stars/dbt-labs/dbt-spark?style=for-the-badge)

## Connection Methods

dbt-spark can connect to Spark clusters by three different methods:

- [`odbc`](#odbc) is the preferred method when connecting to Databricks. It supports connecting to a SQL Endpoint or an all-purpose interactive cluster.
- [`thrift`](#thrift) connects directly to the lead node of a cluster, either locally hosted / on premise or in the cloud (e.g. Amazon EMR).
- [`http`](#http) is a more generic method for connecting to a managed service that provides an HTTP endpoint. Currently, this includes connections to a Databricks interactive cluster.

<VersionBlock firstVersion="1.1">

- [`session`](#session) connects to a pySpark session, running locally or on a remote machine.

:::info Advanced functionality
The `session` connection method is intended for advanced users and experimental dbt development. This connection method is not supported by dbt Cloud.
:::

</VersionBlock>

### ODBC

<Changelog>New in v0.18.1</Changelog>

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
        # cluster configuration parameters, otherwise applied via `SET` statements
        # for example:
        # "spark.databricks.delta.schema.autoMerge.enabled": True
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
```

</File>

Databricks interactive clusters can take several minutes to start up. You may
include the optional profile configs `connect_timeout` and `connect_retries`,
and dbt will periodically retry the connection.

<VersionBlock firstVersion="1.1">

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
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.0">

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

</VersionBlock>

## Installation and Distribution

dbt's adapter for Apache Spark and Databricks is managed in its own repository, [dbt-spark](https://github.com/dbt-labs/dbt-spark). To use it, 
you must install the `dbt-spark` plugin.

### Using pip
The following commands will install the latest version of `dbt-spark` as well as the requisite version of `dbt-core`.

If connecting to Databricks via ODBC driver, it requires `pyodbc`. Depending on your system, you can install it seperately or via pip. See the [`pyodbc` wiki](https://github.com/mkleehammer/pyodbc/wiki/Install) for OS-specific installation details.

If connecting to a Spark cluster via the generic thrift or http methods, it requires `PyHive`.

```
# odbc connections
$ pip install "dbt-spark[ODBC]"
```
```
# thrift or http connections
$ pip install "dbt-spark[PyHive]"
```

<VersionBlock firstVersion="1.1">

```
# session connections
$ pip install "dbt-spark[session]"
```

</VersionBlock>

## Caveats

### Usage with EMR
To connect to Apache Spark running on an Amazon EMR cluster, you will need to run `sudo /usr/lib/spark/sbin/start-thriftserver.sh` on the master node of the cluster to start the Thrift server (see [the docs](https://aws.amazon.com/premiumsupport/knowledge-center/jdbc-connection-emr/) for more information). You will also need to connect to port 10001, which will connect to the Spark backend Thrift server; port 10000 will instead connect to a Hive backend, which will not work correctly with dbt.

### Supported Functionality

Most dbt Core functionality is supported, but some features are only available
on Delta Lake (Databricks).

Delta-only features:
1. Incremental model updates by `unique_key` instead of `partition_by` (see [`merge` strategy](spark-configs#the-merge-strategy))
2. [Snapshots](snapshots)
3. [Persisting](persist_docs) column-level descriptions as database comments
