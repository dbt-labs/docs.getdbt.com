---
title: "Incremental models"
sidebar_label: "Incremental models"
description: "Choose an incremental strategy for Databricks models, such as append, merge, insert_overwrite, replace_where, or microbatch."
---

_Available in versions 1.9 or higher_

:::caution Breaking change in v1.11.0

<details> 
<summary>dbt-databricks v1.11.0 requires Databricks Runtime 12.2 LTS or higher for incremental models</summary>

This version introduces a fix for column order mismatches in incremental models by using Databricks' `INSERT BY NAME` syntax (available since DBR 12.2). This prevents data corruption that could occur when column order changed in models using `on_schema_change: sync_all_columns`.

If you're using an older runtime:
- Pin your `dbt-databricks` version to `1.10.x` 
- Or upgrade to DBR 12.2 LTS or higher

This breaking change affects all incremental strategies: `append`, `insert_overwrite`, `replace_where`, `delete+insert`, and `merge` (via intermediate table creation).

For more details on v1.11.0 changes, see the [dbt-databricks v1.11.0 changelog](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md).

</details> 

:::

dbt-databricks plugin leans heavily on the [`incremental_strategy` config](/docs/build/incremental-strategy). This config tells the incremental materialization how to build models in runs beyond their first. It can be set to one of six values:
 - `append`: Insert new records without updating or overwriting any existing data.
 - `insert_overwrite`: If `partition_by` is specified, overwrite partitions in the <Term id="table" /> with new data. If no `partition_by` is specified, overwrite the entire table with new data.
 - `merge`(default; Delta and Hudi file format only): Match records based on a `unique_key`, updating old records, and inserting new ones. (If no `unique_key` is specified, all new data is inserted, similar to `append`.)
 - `replace_where` (Delta file format only): Match records based on `incremental_predicates`, replacing all records that match the predicates from the existing table with records matching the predicates from the new data. (If no `incremental_predicates` are specified, all new data is inserted, similar to `append`.)
 - `delete+insert` (Delta file format only, available in v1.11+): Match records based on a required `unique_key`, delete matching records, and insert new records. Optionally filter using `incremental_predicates`.
 - `microbatch` (Delta file format only): Implements the [microbatch strategy](/docs/build/incremental-microbatch) using `replace_where` with predicates generated based `event_time`.
 
Each of these strategies has its pros and cons, which we'll discuss below. As with any model config, `incremental_strategy` may be specified in `dbt_project.yml` or within a model file's `config()` block.

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

The `insert_overwrite` strategy updates data in a table by replacing existing records instead of just adding new ones. This strategy is most effective when specified alongside a `partition_by` or `liquid_clustered_by` clause in your model config, which helps identify the specific partitions or clusters affected by your query. dbt will run an [atomic `insert into ... replace on` statement](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-dml-insert-into#replace-on) that dynamically replaces all partitions/clusters included in your query, instead of rebuilding the entire table. 

**Important!** Be sure to re-select _all_ of the relevant data for a partition or cluster when using this incremental strategy. 

When using `liquid_clustered_by`, the `replace on` keys used will be the same as the `liquid_clustered_by` keys (same as `partition_by` behavior). 

When you set [`use_replace_on_for_insert_overwrite`](/reference/global-configs/databricks-changes#use-replace-on-for-insert_overwrite-strategy) to `true` (in SQL warehouses or when using cluster computes) dbt dynamically overwrites partitions and only replaces the partitions or clusters returned by your model query. dbt runs a [partitionOverwriteMode='dynamic' `insert overwrite` statement](https://docs.databricks.com/aws/en/delta/selective-overwrite#dynamic-partition-overwrites-with-partitionoverwritemode-legacyl), which helps reduce unnecessary overwrites and improves performance. 

When you set [`use_replace_on_for_insert_overwrite`](/reference/global-configs/databricks-changes#use-replace-on-for-insert_overwrite-strategy) to `false` in SQL warehouses, dbt truncates (empties) the entire table before inserting new data. This replaces all rows in the table each time the model runs, which can increase run time and cost for large datasets

If you don't specify `partition_by` or `liquid_clustered_by`, then the `insert_overwrite` strategy will atomically replace all contents of the table, overriding all existing data with only the new records. The column schema of the table remains the same, however. This can be desirable in some limited circumstances, since it minimizes downtime while the table contents are overwritten. The operation is comparable to running `truncate` and `insert` on other databases. For atomic replacement of Delta-formatted tables, use the `table` materialization (which runs `create or replace`) instead.

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

The Databricks adapter will run an [atomic `merge` statement](https://docs.databricks.com/spark/latest/spark-sql/language-manual/merge-into.html) similar to the default merge behavior on Snowflake and BigQuery. If a `unique_key` is specified (recommended), dbt will update old records with values from new records that match on the key column. If a `unique_key` is not specified, dbt will forgo match criteria and simply insert all new records (similar to `append` strategy).

Specifying `merge` as the incremental strategy is optional since it's the default strategy used when none is specified.

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

Beginning with 1.9, `merge` behavior can be modified with the following additional configuration options:

- `target_alias`, `source_alias`: Aliases for the target and source to allow you to describe your merge conditions more naturally.  These default to `DBT_INTERNAL_DEST` and `DBT_INTERNAL_SOURCE`, respectively.
- `skip_matched_step`: If set to `true`, the 'matched' clause of the merge statement will not be included.
- `skip_not_matched_step`: If set to `true`, the 'not matched' clause will not be included.
- `matched_condition`: Condition to apply to the `WHEN MATCHED` clause.  You should use the `target_alias` and `source_alias` to write a conditional expression, such as `DBT_INTERNAL_DEST.col1 = hash(DBT_INTERNAL_SOURCE.col2, DBT_INTERNAL_SOURCE.col3)`.  This condition further restricts the matched set of rows.
- `not_matched_condition`: Condition to apply to the `WHEN NOT MATCHED [BY TARGET]` clause.  This condition further restricts the set of rows in the target that do not match the source that will be inserted into the merged table.
- `not_matched_by_source_condition`: Condition to apply to the further filter `WHEN NOT MATCHED BY SOURCE` clause.  Only used in conjunction with `not_matched_by_source_action`.
- `not_matched_by_source_action`: The action to apply when the condition is met. Configure as an expression. For example: `not_matched_by_source_action: "update set t.attr1 = 'deleted', t.tech_change_ts = current_timestamp()"`.
- `merge_with_schema_evolution`: If set to `true`, the merge statement includes the `WITH SCHEMA EVOLUTION` clause.

For more details on the meaning of each merge clause, please see [the Databricks documentation](https://docs.databricks.com/en/sql/language-manual/delta-merge-into.html).

The following is an example demonstrating the use of these new options:

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
]
}>
<TabItem value="source">

<File name='merge_incremental_options.sql'>

```sql
{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    incremental_strategy='merge',
    target_alias='t',
    source_alias='s',
    matched_condition='t.tech_change_ts < s.tech_change_ts',
    not_matched_condition='s.attr1 IS NOT NULL',
    not_matched_by_source_condition='t.tech_change_ts < current_timestamp()',
    not_matched_by_source_action='delete',
    merge_with_schema_evolution=true
) }}

select
    id,
    attr1,
    attr2,
    tech_change_ts
from
    {{ ref('source_table') }} as s
```

</File>
</TabItem>
<TabItem value="run">

<File name='target/run/merge_incremental_options.sql'>

```sql
create temporary view merge_incremental__dbt_tmp as

    select
        id,
        attr1,
        attr2,
        tech_change_ts
    from upstream.source_table
;

merge 
    with schema evolution
into
    target_table as t
using (
    select
        id,
        attr1,
        attr2,
        tech_change_ts
    from
        source_table as s
)
on
    t.id <=> s.id
when matched
    and t.tech_change_ts < s.tech_change_ts
    then update set
        id = s.id,
        attr1 = s.attr1,
        attr2 = s.attr2,
        tech_change_ts = s.tech_change_ts

when not matched
    and s.attr1 IS NOT NULL
    then insert (
        id,
        attr1,
        attr2,
        tech_change_ts
    ) values (
        s.id,
        s.attr1,
        s.attr2,
        s.tech_change_ts
    )
    
when not matched by source
    and t.tech_change_ts < current_timestamp()
    then delete
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

### The `delete+insert` strategy

_Available in versions 1.11 or higher_

The `delete+insert` incremental strategy requires:
- `file_format: delta`
- A required `unique_key` configuration
- Databricks Runtime 12.2 LTS or higher

The `delete+insert` strategy is a simpler alternative to the `merge` strategy for cases where you want to replace matching records without the complexity of updating specific columns. This strategy works in two steps:

1. **Delete**: Remove all rows from the target table where the `unique_key` matches rows in the new data.
2. **Insert**: Insert all new rows from the staging data.

This strategy is particularly useful when:
- You want to replace entire records rather than update specific columns
- Your business logic requires a clean "remove and replace" approach
- You need a simpler incremental strategy than `merge` for full record replacement

When using Databricks Runtime 17.1 or higher, dbt uses the efficient [`INSERT INTO ... REPLACE ON` syntax](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-dml-insert-into#replace-on) to perform this operation atomically. For older runtime versions, dbt executes separate `DELETE` and `INSERT` statements.

You can optionally use `incremental_predicates` to further filter which records are processed, providing more control over which rows are deleted and inserted.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code (DBR 17.1+)', value: 'run_new', },
    { label: 'Run code (DBR < 17.1)', value: 'run_legacy', },
]
}>
<TabItem value="source">

<File name='delete_insert_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta',
    incremental_strategy='delete+insert',
    unique_key='user_id'
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

from new_events
group by 1
```

</File>
</TabItem>
<TabItem value="run_new">

<File name='target/run/delete_insert_incremental.sql'>

```sql
create temporary view delete_insert_incremental__dbt_tmp as

    with new_events as (

        select * from analytics.events

        where date_day >= date_add(current_date, -1)

    )

    select
        user_id,
        max(date_day) as last_seen

    from new_events
    group by 1

;

insert into table analytics.delete_insert_incremental as target
replace on (target.user_id <=> temp.user_id)
(select `user_id`, `last_seen`
   from delete_insert_incremental__dbt_tmp where date_day >= date_add(current_date, -1)) as temp
```

</File>

</TabItem>
<TabItem value="run_legacy">

<File name='target/run/delete_insert_incremental.sql'>

```sql
create temporary view delete_insert_incremental__dbt_tmp as

    with new_events as (

        select * from analytics.events

        where date_day >= date_add(current_date, -1)

    )

    select
        user_id,
        max(date_day) as last_seen

    from new_events
    group by 1

;

-- Step 1: Delete matching rows
delete from analytics.delete_insert_incremental
where analytics.delete_insert_incremental.user_id IN (SELECT user_id FROM delete_insert_incremental__dbt_tmp)
  and date_day >= date_add(current_date, -1);

-- Step 2: Insert new rows
insert into analytics.delete_insert_incremental by name
select `user_id`, `last_seen`
from delete_insert_incremental__dbt_tmp
where date_day >= date_add(current_date, -1)
```

</File>

</TabItem>
</Tabs>


### The `microbatch` strategy

_Available in versions 1.9 or higher_

The Databricks adapter implements the `microbatch` strategy using `replace_where`. Note the requirements and caution statements for `replace_where` above. For more information about this strategy, see the [microbatch reference page](/docs/build/incremental-microbatch).

In the following example, the upstream table `events` have been annotated with an `event_time` column called `ts` in its schema file.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
]
}>
<TabItem value="source">

<File name='microbatch_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta',
    incremental_strategy = 'microbatch'
    event_time='date' # Use 'date' as the grain for this microbatch table
) }}

with new_events as (

    select * from {{ ref('events') }}

)

select
    user_id,
    date,
    count(*) as visits

from events
group by 1, 2
```

</File>
</TabItem>
<TabItem value="run">

<File name='target/run/replace_where_incremental.sql'>

```sql
create temporary view replace_where__dbt_tmp as

    with new_events as (

        select * from (select * from analytics.events where ts >= '2024-10-01' and ts < '2024-10-02')

    )

    select
        user_id,
        date,
        count(*) as visits
    from events
    group by 1, 2
;

insert into analytics.replace_where_incremental
    replace where CAST(date as TIMESTAMP) >= '2024-10-01' and CAST(date as TIMESTAMP) < '2024-10-02'
    table `replace_where__dbt_tmp`
```

</File>

</TabItem>
</Tabs>
