---
title: "concurrent_batches"
resource_types: [models]
datatype: model_name
description: "concurrent_batches - Read this in-depth guide to learn about concurrent_batches in dbt."
---
Available from dbt v1.9 or with [the dbt Cloud "Latest" release track](https://docs.getdbt.com/docs/dbt-versions/cloud-release-tracks) dbt Cloud.
<Tabs>
<TabItem value="Project file">


<File name='dbt_project.yml'>

```yaml
models:
  +concurrent_batches: True
```

</File>

</TabItem>


<TabItem value="sql file">

<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized='incremental',
    concurrent_batches=True,
    incremental_strategy='microbatch'
        ...
  )
}}
select ...
```

</File>

</TabItem>
</Tabs>

## Definition

`concurrent_batches` is an override which allows users to decide whether or not they want to run their batches in parallel or sequentially (one at a time).

For more information, refer to [how batch execution works](/docs/build/incremental-microbatch#how-parallel-batch-execution-works).
## Example

By default, dbt auto-detects whether batches can run in parallel for microbatch models. However, you can override dbt's detection by setting the concurrent_batches config in your dbt_project.yml or model .sql file to specify parallel or sequential execution, given you meet all the conditions. 

If you've configured a microbatch incremental strategy and you're working with cumulative metrics or any logic that depends on batch order, you can override the default by setting concurrent_batches: false. 









