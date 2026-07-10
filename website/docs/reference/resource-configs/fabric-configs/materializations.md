---
title: "Materializations"
sidebar_label: "Materializations"
description: "Tables are the default materialization in dbt-fabric, while ephemeral materialization is not supported because T-SQL lacks nested CTEs."
---

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
