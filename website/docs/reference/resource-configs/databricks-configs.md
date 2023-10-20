---
title: "Databricks configurations"
id: "databricks-configs"
---

## Configuring tables

When materializing a model as `table`, you may include several optional configs that are specific to the dbt-databricks plugin, in addition to the standard [model configs](/reference/model-configs).

<VersionBlock lastVersion="1.5">

| Option              | Description                                                                                                                                                                                                        | Required?                               | Example        |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|----------------|
| file_format         | The file format to use when creating tables (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` or `libsvm`).                                                                                | Optional                                | `delta`        |
| location_root       | The created table uses the specified directory to store its data. The table alias is appended to it.                                                                                                               | Optional                                | `/mnt/root`    |
| partition_by        | Partition the created table by the specified columns. A directory is created for each partition.                                                                                                                   | Optional                                | `date_day`     |
| liquid_clustered_by | Cluster the created table by the specified columns. Clustering method is based on [Delta's Liquid Clustering feature](https://docs.databricks.com/en/delta/clustering.html). Available since dbt-databricks 1.6.2. | Optional                                | `date_day`     |
| clustered_by        | Each partition in the created table will be split into a fixed number of buckets by the specified columns.                                                                                                         | Optional                                | `country_code` |
| buckets             | The number of buckets to create while clustering                                                                                                                                                                   | Required if `clustered_by` is specified | `8`            |

</VersionBlock>

<VersionBlock firstVersion="1.6">

 
| Option              | Description                                                                                                                                                                                                        | Required?                               | Model Support | Example        |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|---------------|----------------|
| file_format         | The file format to use when creating tables (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` or `libsvm`).                                                                                | Optional                                | SQL, Python   | `delta`        |
| location_root       | The created table uses the specified directory to store its data. The table alias is appended to it.                                                                                                               | Optional                                | SQL, Python   | `/mnt/root`    |
| partition_by        | Partition the created table by the specified columns. A directory is created for each partition.                                                                                                                   | Optional                                | SQL, Python   | `date_day`     |
| liquid_clustered_by | Cluster the created table by the specified columns. Clustering method is based on [Delta's Liquid Clustering feature](https://docs.databricks.com/en/delta/clustering.html). Available since dbt-databricks 1.6.2. | Optional                                | SQL           | `date_day`     |
| clustered_by        | Each partition in the created table will be split into a fixed number of buckets by the specified columns.                                                                                                         | Optional                                | SQL, Python   | `country_code` |
| buckets             | The number of buckets to create while clustering                                                                                                                                                                   | Required if `clustered_by` is specified | SQL, Python   | `8`            |


</VersionBlock>

## Incremental models

dbt-databricks plugin leans heavily on the [`incremental_strategy` config](/docs/build/incremental-models#about-incremental_strategy). This config tells the incremental materialization how to build models in runs beyond their first. It can be set to one of four values:
 - **`append`** (default): Insert new records without updating or overwriting any existing data.
 - **`insert_overwrite`**: If `partition_by` is specified, overwrite partitions in the <Term id="table" /> with new data. If no `partition_by` is specified, overwrite the entire table with new data.
 - **`merge`** (Delta and Hudi file format only): Match records based on a `unique_key`, updating old records, and inserting new ones. (If no `unique_key` is specified, all new data is inserted, similar to `append`.)
 - **`replace_where`** (Delta file format only): Match records based on `incremental_predicates`, replacing all records that match the predicates from the existing table with records matching the predicates from the new data. (If no `incremental_predicates` are specified, all new data is inserted, similar to `append`.)
 
Each of these strategies has its pros and cons, which we'll discuss below. As with any model config, `incremental_strategy` may be specified in `dbt_project.yml` or within a model file's `config()` block.

### The `append` strategy

Following the `append` strategy, dbt will perform an `insert into` statement with all new data. The appeal of this strategy is that it is straightforward and functional across all platforms, file types, connection methods, and Apache Spark versions. However, this strategy _cannot_ update, overwrite, or delete existing data, so it is likely to insert duplicate records for many data sources.

Specifying `append` as the incremental strategy is optional, since it's the default strategy used when none is specified.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>
<TabItem value="source">

<File name='databricks_incremental.sql'>

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

<File name='databricks_incremental.sql'>

```sql
create temporary view databricks_incremental__dbt_tmp as

    select * from analytics.events

    where event_ts >= (select max(event_ts) from {{ this }})

;

insert into table analytics.databricks_incremental
    select `date_day`, `users` from databricks_incremental__dbt_tmp
```

</File>
</TabItem>
</Tabs>

### The `insert_overwrite` strategy

This strategy is most effective when specified alongside a `partition_by` clause in your model config. dbt will run an [atomic `insert overwrite` statement](https://spark.apache.org/docs/3.0.0-preview/sql-ref-syntax-dml-insert-overwrite-table.html) that dynamically replaces all partitions included in your query. Be sure to re-select _all_ of the relevant data for a partition when using this incremental strategy.

If no `partition_by` is specified, then the `insert_overwrite` strategy will atomically replace all contents of the table, overriding all existing data with only the new records. The column schema of the table remains the same, however. This can be desirable in some limited circumstances, since it minimizes downtime while the table contents are overwritten. The operation is comparable to running `truncate` + `insert` on other databases. For atomic replacement of Delta-formatted tables, use the `table` materialization (which runs `create or replace`) instead.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>
<TabItem value="source">

<File name='databricks_incremental.sql'>

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

from new_events
group by 1
```

</File>
</TabItem>
<TabItem value="run">

<File name='databricks_incremental.sql'>

```sql
create temporary view databricks_incremental__dbt_tmp as

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

insert overwrite table analytics.databricks_incremental
    partition (date_day)
    select `date_day`, `users` from databricks_incremental__dbt_tmp
```

</File>
</TabItem>
</Tabs>

### The `merge` strategy

The `merge` incremental strategy requires:
- `file_format: delta or hudi`
- Databricks Runtime 5.1 and above for delta file format
- Apache Spark for hudi file format

dbt will run an [atomic `merge` statement](https://docs.databricks.com/spark/latest/spark-sql/language-manual/merge-into.html) which looks nearly identical to the default merge behavior on Snowflake and BigQuery. If a `unique_key` is specified (recommended), dbt will update old records with values from new records that match on the key column. If a `unique_key` is not specified, dbt will forgo match criteria and simply insert all new records (similar to `append` strategy).

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
]
}>
<TabItem value="source">

<File name='merge_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta', # or 'hudi'
    unique_key='user_id',
    incremental_strategy='merge'
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
<TabItem value="run">

<File name='target/run/merge_incremental.sql'>

```sql
create temporary view merge_incremental__dbt_tmp as

    with new_events as (

        select * from analytics.events


        where date_day >= date_add(current_date, -1)


    )

    select
        user_id,
        max(date_day) as last_seen

    from events
    group by 1

;

merge into analytics.merge_incremental as DBT_INTERNAL_DEST
    using merge_incremental__dbt_tmp as DBT_INTERNAL_SOURCE
    on DBT_INTERNAL_SOURCE.user_id = DBT_INTERNAL_DEST.user_id
    when matched then update set *
    when not matched then insert *
```

</File>

</TabItem>
</Tabs>

### The `replace_where` strategy

The `replace_where` incremental strategy requires:
- `file_format: delta`
- Databricks Runtime 12.0 and above

dbt will run an [atomic `replace where` statement](https://docs.databricks.com/en/delta/selective-overwrite.html#arbitrary-selective-overwrite-with-replacewhere) which selectively overwrites data matching one or more `incremental_predicates` specified as a string or array.  Only rows matching the predicates will be inserted.  If no `incremental_predicates` are specified, dbt will perform an atomic insert, as with `append`.  

:::caution

`replace_where` inserts data into columns in the order provided, rather than by column name.  If you reorder columns and the data is compatible with the existing schema, you may silently insert values into an unexpected column.  If the incoming data is incompatible with the existing schema, you will instead receive an error.

:::

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
]
}>
<TabItem value="source">

<File name='replace_where_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta',
    incremental_strategy = 'replace_where'
    incremental_predicates = 'user_id >= 10000' # Never replace users with ids < 10000
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
<TabItem value="run">

<File name='target/run/replace_where_incremental.sql'>

```sql
create temporary view replace_where__dbt_tmp as

    with new_events as (

        select * from analytics.events


        where date_day >= date_add(current_date, -1)


    )

    select
        user_id,
        max(date_day) as last_seen

    from events
    group by 1

;

insert into analytics.replace_where_incremental
    replace where user_id >= 10000
    table `replace_where__dbt_tmp`
```

</File>

</TabItem>
</Tabs>


## Persisting model descriptions

Relation-level docs persistence is supported in dbt v0.17.0. For more
information on configuring docs persistence, see [the docs](/reference/resource-configs/persist_docs).

When the `persist_docs` option is configured appropriately, you'll be able to
see model descriptions in the `Comment` field of `describe [table] extended`
or `show table extended in [database] like '*'`.


## Default file format configurations

To access advanced incremental strategies features, such as 
[snapshots](/reference/commands/snapshot) and the `merge` incremental strategy, you will want to
use the Delta or Hudi file format as the default file format when materializing models as tables.

It's quite convenient to do this by setting a top-level configuration in your
project file:

<File name='dbt_project.yml'>

```yml
models:
  +file_format: delta # or hudi
  
seeds:
  +file_format: delta # or hudi
  
snapshots:
  +file_format: delta # or hudi
```

</File>

<VersionBlock firstVersion="1.6">

## Materialized views and streaming tables

Starting with version 1.6.0, the dbt-databricks adapter supports [materialized views](https://docs.databricks.com/en/sql/user/materialized-views.html) and [streaming tables](https://docs.databricks.com/en/sql/load-data-streaming-table.html), as alternatives to incremental tables that are powered by [Delta Live Tables](https://docs.databricks.com/en/delta-live-tables/index.html).
See [What are Delta Live Tables?](https://docs.databricks.com/en/delta-live-tables/index.html#what-are-delta-live-tables-datasets) for more information and use cases.
These features are still in preview, and the support in the dbt-databricks adapter should, for now, be considered _experimental_.
In order to adopt these materialization strategies, you will need a workspace that is enabled for Unity Catalog and serverless SQL Warehouses.

<File name='materialized_view.sql'>

```sql
{{ config(
   materialized = 'materialized_view'
 ) }}
```

</File>

or

<File name='streaming_table.sql'>

```sql
{{ config(
   materialized = 'streaming_table'
 ) }}
```

</File>

When dbt detects a pre-existing relation of one of these types, it issues a `REFRESH` [command](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-refresh-full.html).

### Limitations

As mentioned above, support for these materializations in the Databricks adapter is still limited.
At this time the following configuration options are not available:

* Specifying a refresh schedule for these materializations
* Specifying `on_configuration_change` settings.

Additionally, if you change the model definition of your materialized view or streaming table, you will need to drop the materialization in your warehouse directly before running dbt again; otherwise, you will get a refresh error.

We plan to address these limitations during the 1.7.x timeframe.
</VersionBlock>
