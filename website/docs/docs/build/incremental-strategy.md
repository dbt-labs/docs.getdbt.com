---
title: "About incremental strategy"
description: "Learn about the various ways (strategies) to implement incremental materializations."
id: "incremental-strategy"
---

There are various strategies to implement the concept of incremental materializations. The value of each strategy depends on:

* The volume of data.
* The reliability of your `unique_key`.
* The support of certain features in your data platform.

An optional `incremental_strategy` config is provided in some adapters that controls the code that dbt uses to build incremental models.

:::info Microbatch <Lifecycle status="beta" />

The [`microbatch` incremental strategy](/docs/build/incremental-microbatch) is intended for large time-series datasets. dbt will process the incremental model in multiple queries (or "batches") based on a configured `event_time` column. Depending on the volume and nature of your data, this can be more efficient and resilient than using a single query for adding new data.

:::

### Supported incremental strategies by adapter

This table represents the availability of each incremental strategy, based on the latest version of dbt Core and each adapter.

Click the name of the adapter in the below table for more information about supported incremental strategies.

| Data platform adapter | `append` | `merge` | `delete+insert` | `insert_overwrite` | `microbatch` <Lifecycle status="beta"/> |
|-----------------------|:--------:|:-------:|:---------------:|:------------------:|:-------------------:|
| [dbt-postgres](/reference/resource-configs/postgres-configs#incremental-materialization-strategies) |     ✅    |    ✅   |        ✅        |                    |      ✅            |
| [dbt-redshift](/reference/resource-configs/redshift-configs#incremental-materialization-strategies) |     ✅    |    ✅   |        ✅        |                    |      ✅        |
| [dbt-bigquery](/reference/resource-configs/bigquery-configs#merge-behavior-incremental-models)      |           |    ✅   |                 |          ✅         |      ✅            |
| [dbt-spark](/reference/resource-configs/spark-configs#incremental-models)                           |     ✅    |    ✅   |                 |          ✅         |      ✅            |
| [dbt-databricks](/reference/resource-configs/databricks-configs#incremental-models)                 |     ✅    |    ✅   |                 |          ✅         |                    |
| [dbt-snowflake](/reference/resource-configs/snowflake-configs#merge-behavior-incremental-models)    |     ✅    |    ✅   |        ✅        |                    |      ✅            |
| [dbt-trino](/reference/resource-configs/trino-configs#incremental)                                  |     ✅    |    ✅   |        ✅        |                    |                    |
| [dbt-fabric](/reference/resource-configs/fabric-configs#incremental)                                |     ✅    |    ✅   |        ✅          |                    |                    |
| [dbt-athena](/reference/resource-configs/athena-configs#incremental-models)                         |     ✅    |    ✅   |                 |          ✅         |                    |

### Configuring incremental strategy

The `incremental_strategy` config can either be defined in specific models or
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

### Strategy-specific configs

If you use the `merge` strategy and specify a `unique_key`, by default, dbt will entirely overwrite matched rows with new values.

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

### About incremental_predicates

`incremental_predicates` is an advanced use of incremental models, where data volume is large enough to justify additional investments in performance. This config accepts a list of any valid SQL expression(s). dbt does not check the syntax of the SQL statements. 

This an example of a model configuration in a `yml` file you might expect to see on Snowflake:

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
        where session_start >= dateadd(day, -3, current_date)
    {% endif %}

),

...
```

:::info
The syntax depends on how you configure your `incremental_strategy`:
- If using the `merge` strategy, you may need to explicitly alias any columns with either `DBT_INTERNAL_DEST` ("old" data) or `DBT_INTERNAL_SOURCE` ("new" data). 
- There's a decent amount of conceptual overlap with the `insert_overwrite` incremental strategy.
:::

### Built-in strategies

Before diving into [custom strategies](#custom-strategies), it's important to understand the built-in incremental strategies in dbt and their corresponding macros:

| `incremental_strategy` | Corresponding macro                    |
|------------------------|----------------------------------------|
| `append`               | `get_incremental_append_sql`           |
| `delete+insert`        | `get_incremental_delete_insert_sql`    |
| `merge`                | `get_incremental_merge_sql`            |
| `insert_overwrite`     | `get_incremental_insert_overwrite_sql` |
| `microbatch`  <Lifecycle status="beta"/>         | `get_incremental_microbatch_sql`       |


For example, a built-in strategy for the `append` can be defined and used with the following files:

<File name='macros/append.sql'>

```sql
{% macro get_incremental_append_sql(arg_dict) %}

  {% do return(some_custom_macro_with_sql(arg_dict["target_relation"], arg_dict["temp_relation"], arg_dict["unique_key"], arg_dict["dest_columns"], arg_dict["incremental_predicates"])) %}

{% endmacro %}


{% macro some_custom_macro_with_sql(target_relation, temp_relation, unique_key, dest_columns, incremental_predicates) %}

    {%- set dest_cols_csv = get_quoted_csv(dest_columns | map(attribute="name")) -%}

    insert into {{ target_relation }} ({{ dest_cols_csv }})
    (
        select {{ dest_cols_csv }}
        from {{ temp_relation }}
    )

{% endmacro %}
```
</File>

Define a model models/my_model.sql:

```sql
{{ config(
    materialized="incremental",
    incremental_strategy="append",
) }}

select * from {{ ref("some_model") }}
```

### Custom strategies

Starting from dbt version 1.2 and onwards, users have an easier alternative to [creating an entirely new materialization](/guides/create-new-materializations). They define and use their own "custom" incremental strategies by:

1. Defining a macro named `get_incremental_STRATEGY_sql`. Note that `STRATEGY` is a placeholder and you should replace it with the name of your custom incremental strategy.
2. Configuring `incremental_strategy: STRATEGY` within an incremental model.

dbt won't validate user-defined strategies, it will just look for the macro by that name, and raise an error if it can't find one.

For example, a user-defined strategy named `insert_only` can be defined and used with the following files:

<File name='macros/my_custom_strategies.sql'>

```sql
{% macro get_incremental_insert_only_sql(arg_dict) %}

  {% do return(some_custom_macro_with_sql(arg_dict["target_relation"], arg_dict["temp_relation"], arg_dict["unique_key"], arg_dict["dest_columns"], arg_dict["incremental_predicates"])) %}

{% endmacro %}


{% macro some_custom_macro_with_sql(target_relation, temp_relation, unique_key, dest_columns, incremental_predicates) %}

    {%- set dest_cols_csv = get_quoted_csv(dest_columns | map(attribute="name")) -%}

    insert into {{ target_relation }} ({{ dest_cols_csv }})
    (
        select {{ dest_cols_csv }}
        from {{ temp_relation }}
    )

{% endmacro %}
```

</File>

<File name='models/my_model.sql'>

```sql
{{ config(
    materialized="incremental",
    incremental_strategy="insert_only",
    ...
) }}

...
```

</File>

### Custom strategies from a package

To use the `merge_null_safe` custom incremental strategy from the `example` package:
- [Install the package](/docs/build/packages#how-do-i-add-a-package-to-my-project)
- Add the following macro to your project:

<File name='macros/my_custom_strategies.sql'>

```sql
{% macro get_incremental_merge_null_safe_sql(arg_dict) %}
    {% do return(example.get_incremental_merge_null_safe_sql(arg_dict)) %}
{% endmacro %}
```

</File>

<Snippet path="discourse-help-feed-header" />
<DiscourseHelpFeed tags="incremental"/>
