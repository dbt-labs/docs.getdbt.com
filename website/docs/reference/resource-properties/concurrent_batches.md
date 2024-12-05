---
title: "concurrent_batches"
resource_types: [models]
datatype: model_name
description: "concurrent_batches - Read this in-depth guide to learn about concurrent_batches in dbt."
---

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

## [`{{ this }}`](/reference/dbt-jinja-functions/this)

dbt automatically detects if a model uses the `{{ this }}` Jinja function. When `{{ this }}` is referenced, the batches execute sequentially because `{{ this }}` points to the current model's database relation, and referencing the same relation can lead to conflicts. If `{{ this }}` is not detected, and the concurrent_batches value is not explicitly set (along with other conditions being met), the batches will execute in parallel.

For more information, refer to [how batch execution works](/docs/build/incremental-microbatch#how-parallel-batch-execution-works)


