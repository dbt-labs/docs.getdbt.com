---
title: "Incremental models"
description: "Read this tutorial to learn how to use incremental models when building in dbt."
id: "incremental-models"
---

Incremental models are built as tables in your <Term id="data-warehouse" />. The first time a model is run, the <Term id="table" /> is built by transforming _all_ rows of source data. On subsequent runs, dbt transforms _only_ the rows in your source data that you tell dbt to filter for, inserting them into the target table which is the table that has already been built.

Often, the rows you filter for on an incremental run will be the rows in your source data that have been created or updated since the last time dbt ran. As such, on each dbt run, your model gets built incrementally.

Using an incremental model limits the amount of data that needs to be transformed, vastly reducing the runtime of your transformations. This improves warehouse performance and reduces compute costs.

## Using incremental materializations

Like the other <Term id="materialization">materializations</Term> built into dbt, incremental models are defined with `select` statements, with the materialization defined in a config block.
```sql
{{
    config(
        materialized='incremental'
    )
}}

select ...

```

To use incremental models, you also need to tell dbt:

* How to filter the rows on an incremental run
* The unique key of the model (if any)

### Filtering rows on an incremental run

To tell dbt which rows it should transform on an incremental run, wrap valid SQL that filters for these rows in the `is_incremental()` macro.

Often, you'll want to filter for "new" rows, as in, rows that have been created since the last time dbt ran this model. The best way to find the timestamp of the most recent run of this model is by checking the most recent timestamp in your target table. dbt makes it easy to query your target table by using the "[{{ this }}](/reference/dbt-jinja-functions/this)" variable.

Also common is wanting to capture both new and updated records. For updated records, you'll need to [define a unique key](#defining-a-unique-key-optional) to ensure you don't bring in modified records as duplicates. Your `is_incremental()` code will check for rows created *or modified* since the last time dbt ran this model.

For example, a model that includes a computationally slow transformation on a column can be built incrementally, as follows:

<File name='models/stg_events.sql'>

```sql
{{
    config(
        materialized='incremental'
    )
}}

select
    *,
    my_slow_function(my_column)

from raw_app_data.events

{% if is_incremental() %}

  -- this filter will only be applied on an incremental run
  -- (uses > to include records whose timestamp occurred since the last run of this model)
  where event_time > (select max(event_time) from {{ this }})

{% endif %}
```

</File>



:::tip Optimizing your incremental model

For more complex incremental models that make use of Common Table Expressions (CTEs), you should consider the impact of the position of the `is_incremental()` macro on query performance. In some warehouses, filtering your records early can vastly improve the run time of your query!

:::

### Defining a unique key (optional)

A `unique_key` enables updating existing rows instead of just appending new rows. If new information arrives for an existing `unique_key`, that new information can replace the current information instead of being appended to the table. If a duplicate row arrives, it can be ignored. Refer to [strategy specific configs](#strategy-specific-configs) for more options on managing this update behavior, like choosing only specific columns to update.

Not specifying a `unique_key` will result in append-only behavior, which means dbt inserts all rows returned by the model's SQL into the preexisting target table without regard for whether the rows represent duplicates.

The optional `unique_key` parameter specifies a field (or combination of fields) that define the grain of your model. That is, the field(s) identify a single unique row. You can define `unique_key` in a configuration block at the top of your model, and it can be a single column name or a list of column names.

The `unique_key` should be supplied in your model definition as a string representing a single column or a list of single-quoted column names that can be used together, for example, `['col1', 'col2', …])`. Columns used in this way should not contain any nulls, or the incremental model run may fail. Either ensure that each column has no nulls (for example with `coalesce(COLUMN_NAME, 'VALUE_IF_NULL')`), or define a single-column [surrogate key](/terms/surrogate-key) (for example with [`dbt_utils.generate_surrogate_key`](https://github.com/dbt-labs/dbt-utils#generate_surrogate_key-source)).

:::tip
In cases where you need multiple columns in combination to uniquely identify each row, we recommend you pass these columns as a list (`unique_key = ['user_id', 'session_number']`), rather than a string expression (`unique_key = 'concat(user_id, session_number)'`).

By using the first syntax, which is more universal, dbt can ensure that the columns will be templated into your incremental model materialization in a way that's appropriate to your database.
    
When you pass a list in this way, please ensure that each column does not contain any nulls, or the incremental model run may fail.
   
Alternatively, you can define a single-column [surrogate key](/terms/surrogate-key), for example with [`dbt_utils.generate_surrogate_key`](https://github.com/dbt-labs/dbt-utils#generate_surrogate_key-source).
:::

When you define a `unique_key`, you'll see this behavior for each row of "new" data returned by your dbt model:

* If the same `unique_key` is present in the "new" and "old" model data, dbt will update/replace the old row with the new row of data. The exact mechanics of how that update/replace takes place will vary depending on your database, [incremental strategy](#about-incremental_strategy), and [strategy specific configs](#strategy-specific-configs).
* If the `unique_key` is _not_ present in the "old" data, dbt will insert the entire row into the table.

Please note that if there's a unique_key with more than one row in either the existing target table or the new incremental rows, the incremental model may fail depending on your database and [incremental strategy](#about-incremental_strategy). If you're having issues running an incremental model, it's a good idea to double check that the unique key is truly unique in both your existing database table and your new incremental rows. You can [learn more about surrogate keys here](/terms/surrogate-key).

:::info
While common incremental strategies, such as`delete+insert` + `merge`, might use `unique_key`, others don't. For example, the `insert_overwrite` strategy does not use `unique_key`, because it operates on partitions of data rather than individual rows. For more information, see [About incremental_strategy](#about-incremental_strategy).
:::

#### `unique_key` example

Consider a model that calculates the number of daily active users (DAUs), based on an event stream. As source data arrives, you will want to recalculate the number of DAUs for both the day that dbt last ran, and any days since then. The model would look as follows:

<File name='models/staging/fct_daily_active_users.sql'>

```sql
{{
    config(
        materialized='incremental',
        unique_key='date_day'
    )
}}

select
    date_trunc('day', event_at) as date_day,
    count(distinct user_id) as daily_active_users

from raw_app_data.events


{% if is_incremental() %}

  -- this filter will only be applied on an incremental run
  -- (uses >= to include records arriving later on the same day as the last run of this model)
  where date_day >= (select max(date_day) from {{ this }})

{% endif %}

group by 1
```

</File>

Building this model incrementally without the `unique_key` parameter would result in multiple rows in the target table for a single day – one row for each time dbt runs on that day. Instead, the inclusion of the `unique_key` parameter ensures the existing row is updated instead.

## How do I rebuild an incremental model?
If your incremental model logic has changed, the transformations on your new rows of data may diverge from the historical transformations, which are stored in your target table. In this case, you should rebuild your incremental model.

To force dbt to rebuild the entire incremental model from scratch, use the `--full-refresh` flag on the command line. This flag will cause dbt to drop the existing target table in the database before rebuilding it for all-time.

```bash
$ dbt run --full-refresh --select my_incremental_model+
```
It's also advisable to rebuild any downstream models, as indicated by the trailing `+`.

For detailed usage instructions, check out the [dbt run](/reference/commands/run) documentation.

# Understanding incremental models
## When should I use an incremental model?
It's often desirable to build models as tables in your data warehouse since downstream queries are more performant. While the `table` materialization also creates your models as tables, it rebuilds the table on each dbt run. These runs can become problematic in that they use a lot of compute when either:
* source data tables have millions, or even billions, of rows.
* the transformations on the source data are computationally expensive (that is, take a long time to execute), for example, complex Regex functions, or UDFs are being used to transform data.

Like many things in programming, incremental models are a trade-off between complexity and performance. While they are not as straightforward as the `view` and `table` materializations, they can lead to significantly better performance of your dbt runs.

## Understanding the is_incremental() macro
The `is_incremental()` macro will return `True` if _all_ of the following conditions are met:
* the destination table already exists in the database
* dbt is _not_ running in full-refresh mode
* the running model is configured with `materialized='incremental'`

Note that the SQL in your model needs to be valid whether `is_incremental()` evaluates to `True` or `False`.

## How do incremental models work behind the scenes?

dbt's incremental materialization works differently on different databases. Where supported, a `merge` statement is used to insert new records and update existing records.

On warehouses that do not support `merge` statements, a merge is implemented by first using a `delete` statement to delete records in the target table that are to be updated, and then an `insert` statement.

Transaction management is used to ensure this is executed as a single unit of work.

## What if the columns of my incremental model change?

Incremental models can be configured to include an optional `on_schema_change` parameter to enable additional control when incremental model columns change. These options enable dbt to continue running incremental models in the presence of schema changes, resulting in fewer `--full-refresh` scenarios and saving query costs. 

You can configure the `on_schema_change` setting as follows.

<File name='dbt_project.yml'>

```yaml
models:
  +on_schema_change: "sync_all_columns"
```

</File>

<File name='models/staging/fct_daily_active_users.sql'>

```sql
{{
    config(
        materialized='incremental',
        unique_key='date_day',
        on_schema_change='fail'
    )
}}
```

</File>

The possible values for `on_schema_change` are:  

* `ignore`: Default behavior (see below).
* `fail`: Triggers an error message when the source and target schemas diverge  
* `append_new_columns`: Append new columns to the existing table. Note that this setting does *not* remove columns from the existing table that are not present in the new data.
* `sync_all_columns`: Adds any new columns to the existing table, and removes any columns that are now missing. Note that this is *inclusive* of data type changes. On BigQuery, changing column types requires a full <Term id="table" /> scan; be mindful of the trade-offs when implementing.

**Note**: None of the `on_schema_change` behaviors backfill values in old records for newly added columns. If you need to populate those values, we recommend running manual updates, or triggering a `--full-refresh`.

:::caution `on_schema_change` tracks top-level changes

Currently, `on_schema_change` only tracks top-level column changes. It does not track nested column changes. For example, on BigQuery, adding, removing, or modifying a nested column will not trigger a schema change, even if `on_schema_change` is set appropriately.

:::

### Default behavior

This is the behavior if `on_schema_change: ignore`, which is set by default, and on older versions of dbt.

If you add a column to your incremental model, and execute a `dbt run`, this column will _not_ appear in your target table.

Similarly, if you remove a column from your incremental model, and execute a `dbt run`, this column will _not_ be removed from your target table.

Instead, whenever the logic of your incremental changes, execute a full-refresh run of both your incremental model and any downstream models.

## About `incremental_strategy`

There are various ways (strategies) to implement the concept of an incremental materializations. The value of each strategy depends on:

* the volume of data,
* the reliability of your `unique_key`, and
* the support of certain features in your data platform

An optional `incremental_strategy` config is provided in some adapters that controls the code that dbt uses
to build incremental models.

### Supported incremental strategies by adapter

Click the name of the adapter in the below table for more information about supported incremental strategies.

The `merge` strategy is available in dbt-postgres and dbt-redshift beginning in dbt v1.6.

<VersionBlock lastVersion="1.5">

    
| data platform adapter   | default strategy | additional supported strategies    |
| :-------------------| ---------------- | -------------------- |
| [dbt-postgres](/reference/resource-configs/postgres-configs#incremental-materialization-strategies) | `append`         | `delete+insert`                          |
| [dbt-redshift](/reference/resource-configs/redshift-configs#incremental-materialization-strategies) | `append`         | `delete+insert`                          |
| [dbt-bigquery](/reference/resource-configs/bigquery-configs#merge-behavior-incremental-models)      | `merge`          | `insert_overwrite`                       |
| [dbt-spark](/reference/resource-configs/spark-configs#incremental-models)                           | `append`         | `merge` (Delta only)  `insert_overwrite` |
| [dbt-databricks](/reference/resource-configs/databricks-configs#incremental-models)                 | `merge`          | `append`, `insert_overwrite`             |
| [dbt-snowflake](/reference/resource-configs/snowflake-configs#merge-behavior-incremental-models)    | `merge`          | `append`, `delete+insert`                |
| [dbt-trino](/reference/resource-configs/trino-configs#incremental)                                  | `append`         | `merge` `delete+insert`                  |

</VersionBlock>

<VersionBlock firstVersion="1.6">

    
| data platform adapter  | default strategy | additional supported strategies  |
| :----------------- | :----------------| : ---------------------------------- |
| [dbt-postgres](/reference/resource-configs/postgres-configs#incremental-materialization-strategies) | `append`         | `merge` , `delete+insert`                  |
| [dbt-redshift](/reference/resource-configs/redshift-configs#incremental-materialization-strategies) | `append`         | `merge`, `delete+insert`                  |
| [dbt-bigquery](/reference/resource-configs/bigquery-configs#merge-behavior-incremental-models)      | `merge`          | `insert_overwrite`                       |
| [dbt-spark](/reference/resource-configs/spark-configs#incremental-models)                           | `append`         | `merge` (Delta only)  `insert_overwrite` |
| [dbt-databricks](/reference/resource-configs/databricks-configs#incremental-models)                 | `merge`          | `append`, `insert_overwrite`             |
| [dbt-snowflake](/reference/resource-configs/snowflake-configs#merge-behavior-incremental-models)    | `merge`          | `append`, `delete+insert`                |
| [dbt-trino](/reference/resource-configs/trino-configs#incremental)                                  | `append`         | `merge` `delete+insert`                  |

</VersionBlock>

<VersionBlock firstVersion="1.3">

:::note Snowflake Configurations

dbt v1.3 changed the default materialization for incremental table merges from `temporary table` to `view`. For more information about this change and instructions for setting the configuration to a temp table, please read about [Snowflake temporary tables](/reference/resource-configs/snowflake-configs#temporary-tables).

:::

</VersionBlock>

### Configuring incremental strategy

The `incremental_strategy` config can either be specified in specific models, or
for all models in your `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yaml
models:
  +incremental_strategy: "insert_overwrite"
```

</File>

or:

<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized='incremental',
    unique_key='date_day',
    incremental_strategy='delete+insert',
    ...
  )
}}

select ...
```

</File>

<VersionBlock firstVersion="1.3">

### Strategy-specific configs

If you are using the `merge` strategy and have specified a `unique_key`, by default, dbt will entirely overwrite matched rows with new values.

On adapters which support the `merge` strategy (including Snowflake, BigQuery, Apache Spark, and Databricks), you may optionally pass a list of column names to a `merge_update_columns` config. In that case, dbt will update _only_ the columns specified by the config, and keep the previous values of other columns.

<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized = 'incremental',
    unique_key = 'id',
    merge_update_columns = ['email', 'ip_address'],
    ...
  )
}}

select ...
```

</File>

Alternatively, you can specify a list of columns to exclude from being updated by passing a list of column names to a `merge_exclude_columns` config.

<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized = 'incremental',
    unique_key = 'id',
    merge_exclude_columns = ['created_at'],
    ...
  )
}}

select ...
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.4">

### About incremental_predicates

`incremental_predicates` is an advanced use of incremental models, where data volume is large enough to justify additional investments in performance. This config accepts a list of any valid SQL expression(s). dbt does not check the syntax of the SQL statements. 

This an example of a model configuration in a `yml` file we might expect to see on Snowflake:

```yml

models:
  - name: my_incremental_model
    config:
      materialized: incremental
      unique_key: id
      # this will affect how the data is stored on disk, and indexed to limit scans
      cluster_by: ['session_start']  
      incremental_strategy: merge
      # this limits the scan of the existing table to the last 7 days of data
      incremental_predicates: ["DBT_INTERNAL_DEST.session_start > dateadd(day, -7, current_date)"]
      # `incremental_predicates` accepts a list of SQL statements. 
      # `DBT_INTERNAL_DEST` and `DBT_INTERNAL_SOURCE` are the standard aliases for the target table and temporary table, respectively, during an incremental run using the merge strategy. 
```

Alternatively, here are the same configurations configured within a model file:

```sql
-- in models/my_incremental_model.sql

{{
  config(
    materialized = 'incremental',
    unique_key = 'id',
    cluster_by = ['session_start'],  
    incremental_strategy = 'merge',
    incremental_predicates = [
      "DBT_INTERNAL_DEST.session_start > dateadd(day, -7, current_date)"
    ]
  )
}}

...

```

This will template (in the `dbt.log` file) a `merge` statement like:
```sql
merge into <existing_table> DBT_INTERNAL_DEST
    from <temp_table_with_new_records> DBT_INTERNAL_SOURCE
    on
        -- unique key
        DBT_INTERNAL_DEST.id = DBT_INTERNAL_SOURCE.id
        and
        -- custom predicate: limits data scan in the "old" data / existing table
        DBT_INTERNAL_DEST.session_start > dateadd(day, -7, current_date)
    when matched then update ...
    when not matched then insert ...
```

Limit the data scan of _upstream_ tables within the body of their incremental model SQL, which will limit the amount of "new" data processed/transformed.

```sql
with large_source_table as (

    select * from {{ ref('large_source_table') }}
    {% if is_incremental() %}
        where session_start > dateadd(day, -3, current_date)
    {% endif %}

),

...
```

:::info
The syntax depends on how you configure your `incremental_strategy`:
- If using the `merge` strategy, you may need to explicitly alias any columns with either `DBT_INTERNAL_DEST` ("old" data) or `DBT_INTERNAL_SOURCE` ("new" data). 
- There's a decent amount of conceptual overlap with the `insert_overwrite` incremental strategy.
:::

</VersionBlock>

<Snippet path="discourse-help-feed-header" />
<DiscourseHelpFeed tags="incremental"/>
