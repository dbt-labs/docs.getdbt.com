---
title: "Spark Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-spark
**Maintained by:** core dbt maintainers    
**Author:** Fishtown Analytics    
**Source:** https://github.com/fishtown-analytics/dbt-spark    
**Core version:** v0.13.0 and newer     
**dbt Cloud:** Preview

![dbt-spark stars](https://img.shields.io/github/stars/fishtown-analytics/dbt-spark?style=for-the-badge)

## Connection Methods

dbt-spark can connect to Spark clusters by three different methods:

- `odbc` is the preferred method when connecting to Databricks. It supports connecting to a SQL Endpoint or an all-purpose interactive cluster.
- `http` is a more generic method for connecting to a managed service that provides an HTTP endpoint. Currently, this includes connections to a Databricks interactive cluster.
- `thrift` connects directly to the lead node of a cluster, either locally hosted / on premise or in the cloud (e.g. Amazon EMR).

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

## Installation and Distribution

dbt's Spark adapter is managed in its own repository, [dbt-spark](https://github.com/fishtown-analytics/dbt-spark). To use the Spark adapter, you must install the `dbt-spark` plugin.

### Using pip
The following commands will install the latest version of `dbt-spark` as well as the requisite version of `dbt-core`.

If connecting to Databricks via ODBC driver, it requires `pyodbc`. Depending on your system, you can install it seperately or via pip. See the [`pyodbc` wiki](https://github.com/mkleehammer/pyodbc/wiki/Install) for OS-specific installation details.

If connecting to a Spark cluster via the generic thrift or http methods, it requires `PyHive`.

```
# odbc connections
$ pip install "dbt-spark[ODBC]"

# thrift or http connections
$ pip install "dbt-spark[PyHive]"
```

## Caveats

### Usage with EMR
To connect to Spark running on an Amazon EMR cluster, you will need to run `sudo /usr/lib/spark/sbin/start-thriftserver.sh` on the master node of the cluster to start the Thrift server (see [the docs](https://aws.amazon.com/premiumsupport/knowledge-center/jdbc-connection-emr/) for more information). You will also need to connect to port 10001, which will connect to the Spark backend Thrift server; port 10000 will instead connect to a Hive backend, which will not work correctly with dbt.

### Supported Functionality

Most dbt Core functionality is supported, but some features are only available
on Delta Lake (Databricks).

Delta-only features:
1. Incremental model updates by `unique_key` instead of `partition_by` (see [`merge` strategy](https://docs.getdbt.com/reference/resource-configs/spark-configs/#the-merge-strategy))
2. [Snapshots](snapshots)

Some dbt features, available on the core adapters, are not yet supported on Spark:
1. [Persisting](persist_docs) column-level descriptions as database comments
