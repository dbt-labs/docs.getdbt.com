---
title: "Microsoft Fabric DWH configurations"
id: "fabric-configs"
---

## Materializations

Ephemeral materialization is not supported due to T-SQL not supporting nested CTEs. It may work in some cases when you're working with very simple ephemeral models.

### Tables

Tables are default materialization.

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

## Seeds

By default, `dbt-fabric` will attempt to insert seed files in batches of 400 rows.
If this exceeds Microsoft Fabric Synapse Data Warehouse 2100 parameter limit, the adapter will automatically limit to the highest safe value possible.

To set a different default seed value, you can set the variable `max_batch_size` in your project configuration.

<File name="dbt_project.yml">

```yaml
vars:
  max_batch_size: 200 # Any integer less than or equal to 2100 will do.
```

</File>

## Snapshots

Columns in source tables can not have any constraints.
If, for example, any column has a `NOT NULL` constraint, an error will be thrown.

## Indexes

Indexes are not supported by Microsoft Fabric Synapse Data Warehouse. Any Indexes provided as a configuration is ignored by the adapter.

## Grants with auto provisioning

Grants with auto provisioning is not supported by Microsoft Fabric Synapse Data Warehouse at this time.

## Permissions

The AAD identity (user or service principal) must be a Fabric Workspace admin to work on the database level at this time. Fine grain access control will be incorporated in the future.

## cross-database macros

Not supported at this time.

## dbt-utils

Not supported at this time
