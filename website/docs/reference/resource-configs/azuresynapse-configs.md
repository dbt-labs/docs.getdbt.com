---
title: "Microsoft Azure Synapse DWH configurations"
id: "azuresynapse-configs"
---

All [configuration options for the Microsoft SQL Server adapter](mssql-configs) also apply to this adapter.

Additionally, the configuration options below are available.

### Indices and distributions

The main index and the distribution type can be set for models that are materialized to tables.

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
        index='HEAP',
        dist='ROUND_ROBIN'
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
      index: HEAP
```

</File>

</TabItem>

</Tabs>

The following are the supported index types:

* `CLUSTERED COLUMNSTORE INDEX` (default)
* `HEAP`
* `CLUSTERED INDEX (COLUMN_NAME)`
* `CLUSTERED COLUMNSTORE INDEX ORDER(COLUMN_NAME)`

The following are the supported distribution types:

* `ROUND_ROBIN` (default)
* `HASH(COLUMN_NAME)`
* `REPLICATE`
