---
title: "Microsoft Fabric Data Warehouse configurations"
id: "fabric-configs"
---

This page describes configuration options specific to the `dbt-fabric` adapter for Microsoft Fabric Data Warehouse. It outlines supported materializations, incremental strategies (including [merge](#merge) and ]microbatch](#microbatch)), cross-warehouse references, warehouse snapshots, and profile setup.

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

Microsoft Fabric warehouse snapshots are read-only copies of your warehouse at a specific moment, kept for up to 30 days. They allow analysts query a stable dataset, even while ELT processes are updating the warehouse. By moving the snapshot’s timestamp forward, changes are applied all at once (atomically).

dbt-fabric supports warehouse snapshots, which helps track changes in Fabric Data Warehouse objects between dbt runs. Fabric automatically creates snapshots _before_ and _after_ you run the `dbt run`, `dbt build`, or `dbt snapshot` commands.

To use them, your `profiles.yml` must include the `workspace_id` and the warehouse snapshot name so dbt can create the snapshot as a child item of your warehouse. 

Learn more [here](https://learn.microsoft.com/en-us/fabric/data-warehouse/warehouse-snapshot)

```yaml
fabric_dw:
  target: dev
  outputs:
    dev:
      type: fabric
      server: "<your-fabric-server-name>"
      database: "<your-warehouse-name>"
      schema: "<default-schema>"
      authentication: CLI
      workspace_id: e4487eff-d67d-4b58-917c-ffbb61a5c05f
      warehouse_snapshot_name: dbt-dwtests-snpshot
      
### Behavior
- Before a dbt operation (`run`, `build`, `snapshot`), the adapter captures the pre-state of affected tables.
- After execution, the warehouse snapshot is created with snapshot timestamp.

For additional details:
- [dbt snapshot documentation](/docs/build/snapshots)
- [Fabric adapter snapshots reference](/reference/resource-configs/fabric-configs)


## dbt-utils

Not supported at this time. However, dbt-fabric offers some dbt-utils macros. Please check out the [tsql-utils package](https://github.com/dbt-msft/tsql-utils).

