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

The microbatch strategy offers the benefit of updating a model in smaller, more manageable batches.

Parallel batch execution means that multiple batches are processed at the same time, instead of one after the other (sequentially) for faster processing of your microbatch models.

dbt automatically detects whether a batch can be run in parallel in most cases, which means you don’t need to configure this setting. However, the concurrent_batches config is available as an override (not a gate), allowing you to specify whether batches should or shouldn’t be run in parallel in specific cases.

For example, if you have a microbatch model with 12 batches, you can execute those batches to run in parallel. Specifically they'll run in parallel limited by the number of [available threads](https://docs-getdbt-com-git-nfiann-rbip-dbt-labs.vercel.app/docs/running-a-dbt-project/using-threads).

A batch can run in parallel only if it meets the [following conditions](/docs/build/incremental-microbatch#how-parallel-batch-execution-works):

- It is not the first batch.
- It is not the last batch.
- The adapter supports parallel batch execution.
## [`{{ this }}`](/reference/dbt-jinja-functions/this)

dbt automatically detects if a model uses the `{{ this }}` Jinja function. When `{{ this }}` is referenced, the batches execute sequentially because `{{ this }}` points to the current model's database relation, and referencing the same relation can lead to conflicts. If `{{ this }}` is not detected, and the concurrent_batches value is not explicitly set (along with other conditions being met), the batches will execute in parallel.



