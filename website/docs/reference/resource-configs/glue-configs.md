---
title: "AWS Glue configurations"
description: "AWS Glue Configurations - Read this in-depth guide to learn about configurations in dbt."
id: "glue-configs"
---

<!----
To-do:
- use the reference doc structure for this article/split into separate articles
--->

## Configuring tables

When materializing a model as `table`, you may include several optional configs that are specific to the dbt-glue plugin, in addition to the [Apache Spark model configuration](/reference/resource-configs/spark-configs#configuring-tables).

| Option  | Description                                        | Required?               | Example                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| custom_location  | By default, the adapter will store your data in the following path: `location path`/`database`/`table`. If you don't want to follow that default behaviour, you can use this parameter to set your own custom location on S3 | No | `s3://mycustombucket/mycustompath`              |

## Incremental models

dbt seeks to offer useful, intuitive modeling abstractions by means of its built-in configurations and materializations.

For that reason, the dbt-glue plugin leans heavily on the [`incremental_strategy` config](/docs/build/incremental-models#about-incremental_strategy). This config tells the incremental materialization how to build models in runs beyond their first. It can be set to one of three values:
 - **`append`** (default): Insert new records without updating or overwriting any existing data.
 - **`insert_overwrite`**: If `partition_by` is specified, overwrite partitions in the table with new data. If no `partition_by` is specified, overwrite the entire table with new data.
 - **`merge`** (Apache Hudi only): Match records based on a `unique_key`; update old records, insert new ones. (If no `unique_key` is specified, all new data is inserted, similar to `append`.)

Each of these strategies has its pros and cons, which we'll discuss below. As with any model config, `incremental_strategy` may be specified in `dbt_project.yml` or within a model file's `config()` block.

**Notes:**
The default strategie is **`insert_overwrite`**

### The `append` strategy

Following the `append` strategy, dbt will perform an `insert into` statement with all new data. The appeal of this strategy is that it is straightforward and functional across all platforms, file types, connection methods, and Apache Spark versions. However, this strategy _cannot_ update, overwrite, or delete existing data, so it is likely to insert duplicate records for many data sources.


<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>
<TabItem value="source">

<File name='glue_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    incremental_strategy='append',
) }}

--  All rows returned by this query will be appended to the existing table

select * from {{ ref('events') }}
{% if is_incremental() %}
  where event_ts > (select max(event_ts) from {{ this }})
{% endif %}
```
</File>
</TabItem>
<TabItem value="run">

<File name='glue_incremental.sql'>

```sql
create view spark_incremental__dbt_tmp as

    select * from analytics.events

    where event_ts >= (select max(event_ts) from {{ this }})

;

insert into table analytics.spark_incremental
    select `date_day`, `users` from spark_incremental__dbt_tmp
```

;

drop view spark_incremental__dbt_tmp

</File>
</TabItem>
</Tabs>

### The `insert_overwrite` strategy

This strategy is most effective when specified alongside a `partition_by` clause in your model config. dbt will run an [atomic `insert overwrite` statement](https://spark.apache.org/docs/3.1.2/sql-ref-syntax-dml-insert-overwrite-table.html) that dynamically replaces all partitions included in your query. Be sure to re-select _all_ of the relevant data for a partition when using this incremental strategy.

If no `partition_by` is specified, then the `insert_overwrite` strategy will atomically replace all contents of the table, overriding all existing data with only the new records. The column schema of the table remains the same, however. This can be desirable in some limited circumstances, since it minimizes downtime while the table contents are overwritten. The operation is comparable to running `truncate` + `insert` on other databases. For atomic replacement of Delta-formatted tables, use the `table` materialization (which runs `create or replace`) instead.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>
<TabItem value="source">

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

with new_events as (

    select * from {{ ref('events') }}

    {% if is_incremental() %}
    where date_day >= date_add(current_date, -1)
    {% endif %}

)

select
    date_day,
    count(*) as users

from events
group by 1
```

</File>
</TabItem>
<TabItem value="run">

<File name='spark_incremental.sql'>

```sql
create view spark_incremental__dbt_tmp as

    with new_events as (

        select * from analytics.events


        where date_day >= date_add(current_date, -1)


    )

    select
        date_day,
        count(*) as users

    from events
    group by 1

;

insert overwrite table analytics.spark_incremental
    partition (date_day)
    select `date_day`, `users` from spark_incremental__dbt_tmp

;

drop view spark_incremental__dbt_tmp
```

</File>
</TabItem>
</Tabs>

Specifying `insert_overwrite` as the incremental strategy is optional, since it's the default strategy used when none is specified.

### The `merge` strategy

**Usage notes:** The `merge` incremental strategy requires:
- `file_format: hudi`
- AWS Glue runtime 2 with hudi libraries as extra jars

You can add hudi libraries as extra jars in the classpath using extra_jars options in your profiles.yml.
Here is an example:
```yml
extra_jars: "s3://dbt-glue-hudi/Dependencies/hudi-spark.jar,s3://dbt-glue-hudi/Dependencies/spark-avro_2.11-2.4.4.jar"
```

dbt will run an [atomic `merge` statement](https://hudi.apache.org/docs/writing_data#spark-datasource-writer) which looks nearly identical to the default merge behavior on Snowflake and BigQuery. If a `unique_key` is specified (recommended), dbt will update old records with values from new records that match on the key column. If a `unique_key` is not specified, dbt will forgo match criteria and simply insert all new records (similar to `append` strategy).

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
  ]
}>
<TabItem value="source">

<File name='hudi_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    incremental_strategy='merge',
    unique_key='user_id',
    file_format='hudi'
) }}

with new_events as (

    select * from {{ ref('events') }}

    {% if is_incremental() %}
    where date_day >= date_add(current_date, -1)
    {% endif %}

)

select
    user_id,
    max(date_day) as last_seen

from events
group by 1
```

</File>
</TabItem>
</Tabs>


## Persisting model descriptions

Relation-level docs persistence is inherited from dbt-spark, for more details, check [Apache Spark model configuration](/reference/resource-configs/spark-configs#persisting-model-descriptions).

## Always `schema`, never `database`

This section is also inherited from dbt-spark, for more details, check [Apache Spark model configuration](/reference/resource-configs/spark-configs#always-schema-never-database).
