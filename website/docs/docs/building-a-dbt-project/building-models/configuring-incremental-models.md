---
title: "Configuring incremental models"
id: "configuring-incremental-models"
---

## What is an incremental model?
Incremental models are built as tables in your data warehouse – the first time a model is run, the table is built by transforming _all_ rows of source data. On subsequent runs, dbt transforms _only_ the rows in your source data that you tell dbt to filter for, inserting them into the table that has already been built (the target table).

Often, the rows you filter for on an incremental run will be the rows in your source data that have been created or updated since the last time dbt ran. As such, on each dbt run, your model gets built incrementally.

Using an incremental model limits the amount of data that needs to be transformed, vastly reducing the runtime of your transformations. This improves warehouse performance and reduces compute costs.

## How do I use the incremental materialization?
Like the other materializations built into dbt, incremental models are defined with `select` statements, with the the materialization defined in a config block.
```sql
{{
    config(
        materialized='incremental'
    )
}}

select ...

```

To use incremental models, you also need to tell dbt:
* how to filter the rows on an incremental run.
* the uniqueness constraint of the model (if any).


### Filtering rows on an incremental run
To tell dbt which rows it should transform on an incremental run, wrap valid SQL that filters for these rows in the `is_incremental()` macro.

Often, you'll want to filter for "new" rows, as in, rows that have been created since the last time dbt ran this model. The best way to find the timestamp of the most recent run of this model is by checking the most recent timestamp in your target table. dbt makes it easy to query your target table by using the "[{{ this }}](this)" variable.

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
  where event_time > (select max(event_time) from {{ this }})

{% endif %}
```

</File>



:::tip Optimizing your incremental model

For more complex incremental models that make use of CTEs, you should consider the impact of the position of the `is_incremental()` macro on query performance. On some warehouses, filtering your records early can vastly improve the run time of your query!

:::

### Defining a uniqueness constraint (optional)
`unique_key` is an optional parameter for incremental models that specifies a field which should be unique within your model. If the unique key of an existing row in your target table matches one of your incrementally transformed rows, the existing row will be updated. This ensures that you don't have multiple rows in your target table for a single row in your source data.

You can define `unique_key` in a configuration block at the top of your model. The `unique_key` should be a single field name that is present in your model definition. While some databases support using expressions (eg. `concat(user_id, session_number)`), this syntax is not universally supported, so is not recommended. If you do not have a single field that is unique, consider first creating such a field in your model.

As an example, consider a model that calculates the number of daily active users (DAUs), based on an event stream. As source data arrives, you will want to recalculate the number of DAUs for both the day that dbt last ran, and any days since then. The model would look as follows:

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
$ dbt run --full-refresh --models my_incremental_model+
```
It's also advisable to rebuild any downstream models, as indicated by the trailing `+`.

For detailed usage instructions, check out the [dbt run](run) documentation.

# Understanding incremental models
## When should I use an incremental model?
It's often desirable to build models as tables in your data warehouse since downstream queries are more performant. While the `table` materialization also creates your models as tables, it rebuilds the table on each dbt run. These runs can become problematic in that they use a lot of compute when either:
* source data tables have millions, or even billions, of rows.
* the transformations on the source data are computationally expensive (that is, take a long time to execute), for example, complex Regex functions, or UDFs are being used to transform data.

Like many things in programming, incremental models are a trade-off between complexity and performance. While they are not as straightforward as the `view` and `table` materializations, they can lead to significantly better performance of your dbt runs.

## Understanding the is_incremental() macro
The `is_incremental()` macro will return `True` if:
* the destination table already exists in the database
* dbt is _not_ running in full-refresh mode
* the running model is configured with `materialized='incremental'`

Note that the SQL in your model needs to be valid whether `is_incremental()` evaluates to `True` or `False`.

## How do incremental models work behind the scenes?
dbt's incremental materialization works differently on different databases. Where supported, a `merge` statement is used to insert new records and update existing records.

On warehouses that do not support `merge` statements, a merge is implemented by first using a `delete` statement to delete records in the target table that are to be updated, and then an `insert` statement.

Transaction management is used to ensure this is executed as a single unit of work.

## What if the columns of my incremental model change?
If you add a column from your incremental model, and execute a `dbt run`, this column will _not_ appear in your target table.

Similarly, if you remove a column from your incremental model, and execute a `dbt run`, this column will _not_ be removed from your target table.

Instead, whenever the logic of your incremental changes, execute a full-refresh run of both your incremental model and any downstream models.

## What is an incremental_strategy?

On some adapters, an optional `incremental_strategy` config controls the code that dbt uses
to build incremental models. Different approaches may vary by effectiveness depending on the volume of data,
the reliability of your `unique_key`, or the availability of certain features.

* [Snowflake](snowflake-configs#merge-behavior-incremental-models): `merge` (default), `delete+insert` (optional)
* [BigQuery](bigquery-configs#merge-behavior-incremental-models): `merge` (default), `insert_overwrite` (optional)
* [Spark](spark-configs#incremental-models): `append` (default), `insert_overwrite` (optional), `merge` (optional, Delta-only)

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
    incremental_strategy='insert_overwrite',
    ...
  )
}}

select ...
```

</File>
