---
title: "Spark"
description: "Installation and profile configuration instructions for Spark"
---
[block:callout]
{
  "type": "info",
  "title": "New in 0.13.0",
  "body": "Support for Spark was added in dbt v0.13.0"
}
[/block]
# Set up a Spark target
There are two supported connection methods for Spark targets: `http` and `thrift`.

## method: thrift
Use the `thrift` connection method if you are connecting to a Thrift server sitting in front of a Spark cluster.
[block:code]
{
  "codes": [
    {
      "code": "your_profile_name:\n  target: dev\n  outputs:\n    dev:\n      type: spark\n      method: thrift\n      schema: analytics\n      host: 127.0.0.1\n      port: 10001\n      user: hadoop",
      "language": "yaml",
      "name": "~/.dbt/profiles.yml"
    }
  ]
}
[/block]
## method: http
Use the `http` method if your Spark provider supports connections over HTTP (eg. DataBricks Spark).
[block:code]
{
  "codes": [
    {
      "code": "your_profile_name:\n  target: dev\n  outputs:\n    dev:\n      type: spark\n      method: http\n      schema: analytics\n      host: yourorg.sparkhost.com\n      port: 443\n      token: abc123\n      cluster: 01234-23423-coffeetime",
      "language": "yaml",
      "name": "~/.dbt/profiles.yml"
    }
  ]
}
[/block]
# Installation and Distribution

dbt's Spark adapter is managed in its own repository, [dbt-spark](https://github.com/fishtown-analytics/dbt-spark). To use the Spark adapter, you must install the `dbt-spark` package in addition to installing `dbt` on your system.

### Using pip
The following command will install `dbt-spark` as well as `dbt-core`.

```
pip install dbt-spark
```

See the [repo](https://github.com/fishtown-analytics/dbt-spark) for the latest information on installing the dbt-spark plugin.

# Caveats

## Usage with EMR
To connect to Spark running on an Amazon EMR cluster, you will need to run `sudo /usr/lib/spark/sbin/start-thriftserver.sh` on the master node of the cluster to start the Thrift server (see https://aws.amazon.com/premiumsupport/knowledge-center/jdbc-connection-emr/ for further context). You will also need to connect to port 10001, which will connect to the Spark backend Thrift server; port 10000 will instead connect to a Hive backend, which will not work correctly with dbt.

## Incremental Models

Spark does not natively support `delete`, `update`, or `merge` statements. As such, [incremental models](doc:configuring-incremental-models) are implemented differently than usual in this plugin. To use incremental models, specify a `partition_by` clause in your model config. dbt will use an `insert overwrite` query to overwrite the partitions included in your query. Be sure to re-select _all_ of the relevant data for a partition when using incremental models.
[block:code]
{
  "codes": [
    {
      "code": "{{ config(\n    materialized='incremental',\n    partition_by=['date_day'],\n    file_format='parquet'\n) }}\n\n/*\n  Every partition returned by this query will be overwritten\n  when this model runs\n*/\n\nselect\n    date_day,\n    count(*) as users\n\nfrom {{ ref('events') }}\nwhere date_day::date >= '2019-01-01'\ngroup by 1",
      "language": "sql",
      "name": "spark_incremental.sql"
    }
  ]
}
[/block]
