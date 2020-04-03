---
title: "Spark specific configurations"
id: "spark-configs"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Properties of Spark tables

When materializing a model as `table`, you may include several optional configs:

| Option  | Description                                        | Required?               | Example                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| file_format | The file format to use when creating tables (`parquet`, `delta`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` or `libsvm`). | Optional | `parquet`|
| location_root  | The created table uses the specified directory to store its data. The table alias is appended to it. | Optional                | `/mnt/root`              |
| partition_by  | Partition the created table by the specified columns. A directory is created for each partition. | Optional                | `partition_1`              |
| clustered_by  | Each partition in the created table will be split into a fixed number of buckets by the specified columns. | Optional               | `cluster_1`              |
| buckets  | The number of buckets to create while clustering | Required if `clustered_by` is specified                | `8`              |

## Incremental Models

The [`incremental_strategy` config](configuring-incremental-models#what-is-an-incremental_strategy) controls how dbt builds incremental models, and it can be set to one of two values:
 - `insert_overwrite` (default)
 - `merge` (Delta Lake only)

### The `insert_overwrite` strategy

Apache Spark does not natively support `delete`, `update`, or `merge` statements. As such, [incremental models](configuring-incremental-models) are implemented differently than usual in this plugin. To use incremental models, specify a `partition_by` clause in your model config. dbt will run an `insert overwrite` statement to dynamically overwrite the partitions included in your query. Be sure to re-select _all_ of the relevant data for a partition when using incremental models.

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

### The `merge` strategy

<Callout type="info" title="New in dbt-spark v0.15.3"></Callout>

There are three prerequisites for the `merge` incremental strategy:
- Delta file format
- Databricks Runtime 5.1 and above
- Specify a `unique_key`

dbt will run an atomic `merge` statement which looks nearly identical to the default merge behavior on Snowflake and BigQuery.

<File name='delta_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta',
    unique_key='user_id',
    incremental_strategy='merge'
) }}

select
    user_id,
    max(date_day) as last_seen

from {{ ref('events') }}
where date_day::date >= '2019-01-01'
group by 1
```

</File>

## Persisting model descriptions

<Callout type="info" title="New in dbt-spark v0.15.3"></Callout>

The `persist_docs` config can be used to persist the dbt `description` supplied for a model to the resulting Spark table or view. The `persist_docs` config is not yet supported for objects other than tables and views.

The `persist_docs` config can be specified in the `dbt_project.yml` file, or in a specific model.

<File name='dbt_project.yml'>

```yaml

models:
  # enable docs persistence for all models
  persist_docs:
    relation: true
```

</File>

or:

<File name='models/my_model.sql'>

```sql
{{
  config(persist_docs={"relation": true})
}}

select ...
```

</File>

When the `persist_docs` option is configured appropriately, you'll be able to see your model descriptions
in the `Comment` field of `describe [table] extended` or `show table extended in [database] like '*'`.
