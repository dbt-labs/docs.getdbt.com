---
title: "Materializations"
sidebar_label: "Materializations"
description: "Learn how materializations work in Microsoft SQL Server, including columnstore tables and ephemeral limitations."
---

Ephemeral materialization is not supported due to T-SQL not supporting nested CTEs. It may work in some cases when you're working with very simple ephemeral models.

### Tables

Tables will, by default, be materialized as a columnstore tables.
This requires SQL Server 2017 or newer for on-premise instances or service tier S2 or higher for Azure.

This behaviour can be disabled by setting the `as_columnstore` configuration option to `False`.

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
        as_columnstore=false
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
      as_columnstore: False
```

</File>

</TabItem>

</Tabs>
