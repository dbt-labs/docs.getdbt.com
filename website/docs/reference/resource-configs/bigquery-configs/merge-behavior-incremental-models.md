---
title: "Merge behavior (incremental models)"
sidebar_label: "Merge behavior"
description: "How the incremental_strategy config controls incremental model builds on BigQuery using merge, insert_overwrite, or microbatch."
---

The [`incremental_strategy` config](/docs/build/incremental-strategy) controls how dbt builds incremental models. dbt uses a [merge statement](https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax) on BigQuery to refresh incremental tables.

The `incremental_strategy` config can be set to one of the following values:
- `merge` (default)
- `insert_overwrite`
- [`microbatch`](/docs/build/incremental-microbatch)

### Change history

The `enable_change_history` parameter enables [BigQuery's change history feature](https://cloud.google.com/bigquery/docs/change-history) which tracks changes made to a BigQuery table. When enabled, you can use the change history to audit and debug the behavior of your incremental models. 

`enable_change_history` is set to `<boolean>` values.

### Performance and cost

The operations performed by dbt while building a BigQuery incremental model can
be made cheaper and faster by using a [clustering clause](/reference/resource-configs/bigquery-configs/using-table-partitioning-and-clustering#clustering-clause) in your
model configuration. See [this guide](https://discourse.getdbt.com/t/benchmarking-incremental-strategies-on-bigquery/981) for more information on performance tuning for BigQuery incremental models.

**Note:** These performance and cost benefits are applicable to incremental models
built with either the `merge` or the `insert_overwrite` incremental strategy.

### The `merge` strategy
 The `merge` incremental strategy will generate a `merge` statement that looks
 something like:

```merge
merge into {{ destination_table }} DEST
using ({{ model_sql }}) SRC
on SRC.{{ unique_key }} = DEST.{{ unique_key }}

when matched then update ...
when not matched then insert ...
```

The 'merge' approach automatically updates new data in the destination incremental table but requires scanning all source tables referenced in the model SQL, as well as destination tables. This can be slow and expensive for large data volumes. [Partitioning and clustering](/reference/resource-configs/bigquery-configs/using-table-partitioning-and-clustering) techniques mentioned earlier can help mitigate these issues.

**Note:** The `unique_key` configuration is required when the `merge` incremental
strategy is selected.

### The `insert_overwrite` strategy

The `insert_overwrite` strategy generates a merge statement that replaces entire partitions
in the destination table. **Note:** this configuration requires that the model is configured
with a [Partition clause](/reference/resource-configs/bigquery-configs/using-table-partitioning-and-clustering#partition-clause). The `merge` statement that dbt generates
when the `insert_overwrite` strategy is selected looks something like:

```sql
/*
  Create a temporary table from the model SQL
*/
create temporary table {{ model_name }}__dbt_tmp as (
  {{ model_sql }}
);

/*
  If applicable, determine the partitions to overwrite by
  querying the temp table.
*/

declare dbt_partitions_for_replacement array<date>;
set (dbt_partitions_for_replacement) = (
    select as struct
        array_agg(distinct date(max_tstamp))
    from `my_project`.`my_dataset`.{{ model_name }}__dbt_tmp
);

/*
  Overwrite partitions in the destination table which match
  the partitions in the temporary table
*/
merge into {{ destination_table }} DEST
using {{ model_name }}__dbt_tmp SRC
on FALSE

when not matched by source and {{ partition_column }} in unnest(dbt_partitions_for_replacement)
then delete

when not matched then insert ...
```

For a complete writeup on the mechanics of this approach, see
[this explainer post](https://discourse.getdbt.com/t/bigquery-dbt-incremental-changes/982).

#### Determining partitions to overwrite

dbt is able to determine the partitions to overwrite dynamically from the values
present in the temporary table, or statically using a user-supplied configuration.

The "dynamic" approach is simplest (and the default), but the "static" approach
will reduce costs by eliminating multiple queries in the model build script.

#### Static partitions

To supply a static list of partitions to overwrite, use the `partitions` configuration.

<File name="models/session.sql">

```sql
{% set partitions_to_replace = [
  'timestamp(current_date)',
  'timestamp(date_sub(current_date, interval 1 day))'
] %}

{{
  config(
    materialized = 'incremental',
    incremental_strategy = 'insert_overwrite',
    partition_by = {'field': 'session_start', 'data_type': 'timestamp'},
    partitions = partitions_to_replace
  )
}}

with events as (

    select * from {{ref('events')}}

    {% if is_incremental() %}
        -- recalculate yesterday + today
        where timestamp_trunc(event_timestamp, day) in ({{ partitions_to_replace | join(',') }})
    {% endif %}

),

... rest of model ...
```

</File>

This example model serves to replace the data in the destination table for both
_today_ and _yesterday_ every day that it is run. It is the fastest and cheapest
way to incrementally update a table using dbt. If we wanted this to run more dynamically—
let’s say, always for the past 3 days—we could leverage dbt’s baked-in [datetime macros](https://github.com/dbt-labs/dbt-core/blob/dev/octavius-catto/core/dbt/include/global_project/macros/etc/datetime.sql) and write a few of our own.

Think of this as "full control" mode. You must ensure that expressions or literal values in the `partitions` config have proper quoting when templated, and that they match the `partition_by.data_type` (`timestamp`, `datetime`, `date`, or `int64`). Otherwise, the filter in the incremental `merge` statement will raise an error.

#### Dynamic partitions

If no `partitions` configuration is provided, dbt will instead:

1. Create a temporary table for your model SQL
2. Query the temporary table to find the distinct partitions to be overwritten
3. Query the destination table to find the _max_ partition in the database

When building your model SQL, you can take advantage of the introspection performed
by dbt to filter for only _new_ data. The maximum value in the partitioned field in the destination table
will be available using the `_dbt_max_partition` BigQuery scripting variable. **Note:**
this is a BigQuery SQL variable, not a dbt Jinja variable, so no Jinja brackets are
required to access this variable.

**Example model SQL:**

```sql
{{
  config(
    materialized = 'incremental',
    partition_by = {'field': 'session_start', 'data_type': 'timestamp'},
    incremental_strategy = 'insert_overwrite'
  )
}}

with events as (

  select * from {{ref('events')}}

  {% if is_incremental() %}

    -- recalculate latest day's data + previous
    -- NOTE: The _dbt_max_partition variable is used to introspect the destination table
    where date(event_timestamp) >= date_sub(date(_dbt_max_partition), interval 1 day)

{% endif %}

),

... rest of model ...
```

#### Copying partitions

If you are replacing entire partitions in your incremental runs, you can opt to do so with the [copy table API](https://cloud.google.com/bigquery/docs/managing-tables#copy-table) and partition decorators rather than a `merge` statement. While this mechanism doesn't offer the same visibility and ease of debugging as the SQL `merge` statement, it can yield significant savings in time and cost for large datasets because the copy table API does not incur any costs for inserting the data - it's equivalent to the `bq cp` gcloud command line interface (CLI) command.

You can enable this by switching on `copy_partitions: True` in the `partition_by` configuration. This approach works only in combination with "dynamic" partition replacement.

<File name='bigquery_table.sql'>

```sql
{{ config(
    materialized="incremental",
    incremental_strategy="insert_overwrite",
    partition_by={
      "field": "created_date",
      "data_type": "timestamp",
      "granularity": "day",
      "time_ingestion_partitioning": true,
      "copy_partitions": true
    }
) }}

select
  user_id,
  event_name,
  created_at,
  -- values of this column must match the data type + granularity defined above
  timestamp_trunc(created_at, day) as created_date

from {{ ref('events') }}
```

</File>

<File name='logs/dbt.log'>

```
...
[0m16:03:13.017641 [debug] [Thread-3 (]: BigQuery adapter: Copying table(s) "/projects/projectname/datasets/analytics/tables/bigquery_table__dbt_tmp$20230112" to "/projects/projectname/datasets/analytics/tables/bigquery_table$20230112" with disposition: "WRITE_TRUNCATE"
...
```

</File>
