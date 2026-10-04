---
title: "Microsoft Fabric Data Warehouse configurations"
description: "Configure Microsoft Fabric Data Warehouse settings in dbt, including materializations, IDENTITY columns, incremental strategies, scalar SQL UDFs, and cross-warehouse references."
id: "fabric-configs"
---

This page describes configuration options specific to the `dbt-fabric` adapter for Microsoft Fabric Data Warehouse. It outlines supported materializations, incremental strategies (including [merge](#merge) and [microbatch](#microbatch)), cross-warehouse references, warehouse snapshots, and profile setup.

## Materializations

Ephemeral materialization is not supported due to T-SQL not supporting nested CTEs. It may work in some cases when you're working with very simple ephemeral models.

### Tables

Tables are the default materialization in dbt-fabric. When you configure a model as a table, dbt will create or replace the table in Fabric Data Warehouse on each run.

<Tabs
defaultValue="model"
values={[
{label: 'Model config', value: 'model'},
{label: 'Project config', value: 'project'}
]}
>

<TabItem value="model">

<File name="models/example.sql">

```sql
{{
    config(
        materialized='table'
        )
}}

select *
from ...
```

</File>

</TabItem>

<TabItem value="project">

<File name="dbt_project.yml">

```yaml
models:
  your_project_name:
    materialized: view
    staging:
      materialized: table
```

</File>

</TabItem>

</Tabs>

> **Limitation:** Nested <Term id="cte"/> aren't supported in model materialization. Models using multiple nested CTEs may fail during compilation or execution.

#### Clustered tables

Set `cluster_by` on a table model to create it with a `CLUSTER BY` physical layout:

```sql
{{ config(materialized='table', cluster_by=['customer_id', 'order_date']) }}
select * from ...
```

`cluster_by` accepts a single column name or a list of column names.

#### Statistics

Set `statistics` on a table model to have dbt create or update column statistics after the table is built:

```sql
{{
  config(
    materialized='table',
    statistics=['customer_id', 'order_date'],  -- or `true` for all columns, or a single column name
    statistics_sample_percent=25               -- optional; defaults to a full scan when omitted
  )
}}
select * from ...
```

#### IDENTITY columns

A contract-enforced table model (`contract.enforced: true`) can declare a single `bigint` column as a Fabric `IDENTITY` column via that column's `meta.identity` property:

```yaml
models:
  - name: my_model
    config:
      contract:
        enforced: true
    columns:
      - name: id
        data_type: bigint
        meta:
          identity: auto   # or: insert
```

* `auto`: Fabric assigns the value. The column is excluded from the model's own INSERT column list.
* `insert`: the model's query supplies explicit values, written through `SET IDENTITY_INSERT ... ON/OFF` and reseeded with `DBCC CHECKIDENT` so later `auto` inserts don't collide.

Only one `IDENTITY` column is allowed per table, and it must be `bigint`. Declaring, changing, or removing the identity column forces a full table replace. Not currently supported on incremental models — see [#462](https://github.com/microsoft/dbt-fabric/issues/462) for tracking.

#### Schema-aware full refresh

Table and incremental models run with `--full-refresh` preserve the existing table object (an atomic `TRUNCATE` + full reload, retaining object-bound metadata and optimization history) when its ordered schema, `IDENTITY` properties, and `cluster_by` layout are unchanged. Named primary-key, unique, and foreign-key constraints are reconciled transactionally. A schema, identity, or physical-layout change instead uses an atomic CTAS/drop/rename replacement.

## Table Clone
The `table_clone` materialization creates a physical copy of an existing table using Fabric’s cloning capabilities. This is useful for versioning, branching, or snapshot-like workflows.

```sql
{{ config(materialized='table_clone', clone_from='staging_table') }}
select * from staging_table
```

**Notes:**
- The source table must exist in the target warehouse.
- Cloning preserves the schema and data state at the time of creation.
- Ideal for scenarios requiring fast, zero-copy duplication for testing or rollback.

## Seeds

By default, `dbt-fabric` will attempt to insert seed files in batches of 400 rows.
If this exceeds Microsoft Fabric Data Warehouse 2100 parameter limit, the adapter will automatically limit to the highest safe value possible.

To set a different default seed value, you can set the variable `max_batch_size` in your project configuration.

<File name="dbt_project.yml">

```yaml
vars:
  max_batch_size: 200 # Any integer less than or equal to 2100 will do.
```

</File>

## Views
You can create views using the `view` materialization:

```sql
{{ config(materialized='view') }}
select * from source_data
```

You can set this globally as well:

```yaml
models:
  my_project:
    +materialized: view
```

> **Limitation:** Nested CTEs (Common Table Expressions) are not supported in model materialization. Models using multiple nested CTEs may fail during compilation or execution.


## Snapshots

Columns in source tables can not have any constraints.
If, for example, any column has a `NOT NULL` constraint, an error will be thrown.

## Indexes

Indexes are not supported by Microsoft Fabric Data Warehouse. Any Indexes provided as a configuration is ignored by the adapter.

## Grants with auto provisioning

Grants with auto provisioning is not supported by Microsoft Fabric Data Warehouse at this time.

## Incremental models

Incremental materializations are supported with multiple strategies. In **dbt-fabric**, the **default strategy is `merge`**, introduced in v1.9.7. Other supported strategies include `append`, `delete+insert`, and `microbatch`.

### Merge (default)
The `merge` strategy automatically updates existing records and inserts new ones based on the configured `unique_key`.

```sql
{{
  config(
    materialized='incremental',
    unique_key='id'
  )
}}
select * from source_table
{% if is_incremental() %}
  where updated_at > (select max(updated_at) from {{ this }})
{% endif %}
```

#### Deleting rows with `merge`

Two additional options can be combined with `incremental_strategy: merge` to delete target rows as part of the same run. They're mutually exclusive — use one or the other.

* **`delete_not_matched_by_source`** — adds `WHEN NOT MATCHED BY SOURCE THEN DELETE` to the generated `MERGE` statement, deleting target rows whose `unique_key` is absent from the source. Use this when the incremental model's query returns the complete current dataset (not just a delta):

  ```sql
  {{
    config(
      materialized='incremental',
      incremental_strategy='merge',
      unique_key='id',
      delete_not_matched_by_source=true
    )
  }}
  select * from source_table
  ```

* **`delete_condition`** — issues a follow-up `DELETE ... FROM ... INNER JOIN ... WHERE` after the `MERGE`, removing target rows that match the source on `unique_key` and satisfy a user-supplied SQL expression. Use this for soft-delete patterns where the source carries a delete-flag column:

  ```sql
  {{
    config(
      materialized='incremental',
      incremental_strategy='merge',
      unique_key='id',
      delete_condition='DBT_INTERNAL_SOURCE.is_deleted = 1'
    )
  }}
  select * from source_table
  ```

### Append
Appends new records to the existing dataset.

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='append'
  )
}}
select * from new_data
```
### Delete+Insert
Deletes and re-inserts based on `unique_key`.

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='delete+insert',
    unique_key='id'
  )
}}
select * from updated_data
```

### Microbatch
The `microbatch` strategy processes data in bounded time intervals using an event timestamp column.

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='microbatch',
    event_time='event_timestamp',
    batch_size='1 day'
  )
}}

select * from raw_events
```
#### Notes
- [`event_time`](/reference/resource-configs/event-time) must be a valid timestamp column.
- dbt processes each batch independently, allowing efficient incremental refresh of large time-series datasets.
- If you don't specify a `unique_key`, dbt-fabric defaults to `append`.

For more details, see [Incremental models](/docs/build/incremental-models).
## Functions (scalar SQL UDFs)

Starting with dbt Core 1.11, `dbt-fabric` supports first-class SQL scalar UDF (`function`) resources. Functions participate in the DAG, can be referenced from models with the `function()` Jinja function, support default arguments, and are discoverable through the adapter's relation cache.

<File name="functions/price_for_xlarge.sql">

```sql
SELECT @price * 2
```

</File>

<File name="functions/price_for_xlarge.yml">

```yaml
functions:
  - name: price_for_xlarge
    arguments:
      - name: price
        data_type: int
    returns:
      data_type: int
```

</File>

Reference the function from a model or an ad hoc query:

```sql
select {{ function('price_for_xlarge') }}(100)
```

> **Note:** Fabric Data Warehouse does not support function volatility hints (`VOLATILE`/`STABLE`/`IMMUTABLE`); specifying one on a function logs a warning and is otherwise ignored. Only the `sql` language is supported — `python` functions raise a compile error.

## Permissions

The Microsoft Entra identity (user or service principal) must be a Fabric Workspace admin to work on the database level at this time. Fine grain access control will be incorporated in the future.

## Cross-warehouse references

The dbt-fabric adapter supports cross-warehouse queries using `source()` or `ref()` macros.

```sql
select * from {{ source('sales_dw', 'transactions') }}
union all
select * from {{ ref('customer_dim') }}
```

Ensure that the corresponding model or source definitions specify the correct `database:` parameter to reference another Fabric Warehouse.

Example `sources.yml`:
```yaml
sources:
  - name: sales_dw
    database: saleswarehouse
    schema: sales
    tables:
      - name: transactions
```
> To use cross-warehouse references or warehouse snapshots, ensure the identity configured here has access to all referenced Fabric Warehouses.

## Warehouse snapshots

Microsoft Fabric warehouse snapshots are read-only copies of your warehouse at a specific moment, kept for up to 30 days. They let analysts query a stable dataset even while ELT processes are updating the warehouse. By moving the snapshot's timestamp forward, changes are applied all at once (atomically).

`dbt-fabric` exposes warehouse snapshot creation/refresh as the `create_or_update_fabric_warehouse_snapshot(snapshot_name, description=none)` macro, callable from `on-run-start`, `on-run-end`, a `post-hook`, or any other Jinja context — it is **not** a `profiles.yml` setting. Calling it with a name that already exists updates that snapshot (moving its point-in-time forward) instead of creating a new one.

This uses the Fabric REST API, so your profile must resolve a workspace — set `workspace_id` or `workspace_name` (in addition to `server`/`database`).

<File name="dbt_project.yml">

```yaml
on-run-end:
  - "{{ create_or_update_fabric_warehouse_snapshot('dbt-run-snapshot', 'Snapshot after dbt run') }}"
```

</File>

Learn more about warehouse snapshots [in the Microsoft Fabric docs](https://learn.microsoft.com/en-us/fabric/data-warehouse/warehouse-snapshot).

For additional details, see [dbt hooks documentation](/reference/resource-configs/pre-hook-post-hook).


## dbt-utils

Not supported at this time. However, dbt-fabric offers some dbt-utils macros. Please check out the [tsql-utils package](https://github.com/dbt-msft/tsql-utils).

