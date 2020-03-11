---
title: "Spark"
id: "profile-spark"
---

## Authentication Methods
There are two supported connection methods for Spark targets: `http` and `thrift`.

### thrift
Use the `thrift` connection method if you are connecting to a Thrift server sitting in front of a Spark cluster. 

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: thrift
      schema: analytics
      host: 127.0.0.1
      port: 10001
      user: hadoop
```

</File>

### http
Use the `http` method if your Spark provider supports connections over HTTP (eg. DataBricks Spark).

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: http
      schema: analytics
      host: yourorg.sparkhost.com
      port: 443
      token: abc123
      cluster: 01234-23423-coffeetime
```

</File>

## Installation and Distribution

dbt's Spark adapter is managed in its own repository, [dbt-spark](https://github.com/fishtown-analytics/dbt-spark). To use the Spark adapter, you must install the `dbt-spark` package in addition to installing `dbt` on your system.

### Using pip
The following command will install `dbt-spark` as well as `dbt-core`.

```
pip install dbt-spark
```

See the [repo](https://github.com/fishtown-analytics/dbt-spark) for the latest information on installing the dbt-spark plugin.

## Caveats

### Usage with EMR
To connect to Spark running on an Amazon EMR cluster, you will need to run `sudo /usr/lib/spark/sbin/start-thriftserver.sh` on the master node of the cluster to start the Thrift server (see [the docs](https://aws.amazon.com/premiumsupport/knowledge-center/jdbc-connection-emr/) for more information). You will also need to connect to port 10001, which will connect to the Spark backend Thrift server; port 10000 will instead connect to a Hive backend, which will not work correctly with dbt.

### Incremental Models

Spark does not natively support `delete`, `update`, or `merge` statements. As such, [incremental models](configuring-incremental-models) are implemented differently than usual in this plugin. To use incremental models, specify a `partition_by` clause in your model config. dbt will use an `insert overwrite` query to overwrite the partitions included in your query. Be sure to re-select _all_ of the relevant data for a partition when using incremental models.

<File name='spark_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    partition_by=['date_day'],
    file_format='parquet'
) }}

/*
  Every partition returned by this query will be overwritten
  when this model runs
*/

select
    date_day,
    count(*) as users

from {{ ref('events') }}
where date_day::date >= '2019-01-01'
group by 1
```

</File>
