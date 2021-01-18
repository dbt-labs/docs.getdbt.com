---
title: "Apache Spark Profile"
id: "spark-profile"
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
There are three supported connection methods: `thrift`, `http`, and `odbc`.

### thrift
Use the `thrift` connection method if you are connecting to a Thrift server sitting in front of an Apache Spark cluster, e.g. a cluster running locally or on Amazon EMR.

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
      port: [port]
      user: [user]
```

</File>

### http
Use the `http` method if your Apache Spark provider supports connections over HTTP (e.g. Databricks interactive cluster).

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
      organization: [org id]    # required if Azure Databricks, exclude if AWS Databricks
      port: [port]
      token: [abc123]
      cluster: [cluster id]
      connect_timeout: 60   # optional, default 10
      connect_retries: 5    # optional, default 0
```

</File>

Databricks interactive clusters can take several minutes to start up. You may
include the optional profile configs `connect_timeout` and `connect_retries`,
and dbt will periodically retry the connection.

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
      organization: [org id]    # required if Azure Databricks, exclude if AWS Databricks
      port: [port]
      token: [abc123]
      
      # one of:
      endpoint: [endpoint id]
      cluster: [cluster id]
```

</File>

## Installation and Distribution

dbt's adapter for Apache Spark and Databricks is managed in its own repository, [dbt-spark](https://github.com/fishtown-analytics/dbt-spark). To use it, 
you must install the `dbt-spark` plugin.

### Using pip
The following command will install the latest version of `dbt-spark` as well as the requisite version of `dbt-core`:

```bash
pip install dbt-spark
```

If you are using the `odbc` connection method, you will need to install the extra `ODBC` requirement (includes `pyodbc`):

```bash
pip install "dbt-spark[ODBC]"
```

## Caveats

### Usage with EMR
To connect to Apache Spark running on an Amazon EMR cluster, you will need to run `sudo /usr/lib/spark/sbin/start-thriftserver.sh` on the master node of the cluster to start the Thrift server (see [the docs](https://aws.amazon.com/premiumsupport/knowledge-center/jdbc-connection-emr/) for more information). You will also need to connect to port 10001, which will connect to the Spark backend Thrift server; port 10000 will instead connect to a Hive backend, which will not work correctly with dbt.

### Supported Functionality

Most dbt Core functionality is supported, but some features are only available
on Delta Lake (Databricks).

Delta-only features:
1. Incremental model updates by `unique_key` instead of `partition_by` (see [`merge` strategy](https://docs.getdbt.com/reference/resource-configs/spark-configs/#the-merge-strategy))
2. [Snapshots](snapshots)

Some dbt features, available on the core adapters, are not yet supported on Spark:
1. [Persisting](persist_docs) column-level descriptions as database comments
