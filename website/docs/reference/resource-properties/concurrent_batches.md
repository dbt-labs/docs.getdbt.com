---
title: "concurrent_batches"
resource_types: [models]
datatype: model_name
description: "Learn about concurrent_batches in dbt."
---

<VersionCallout version="1.9" />

<Tabs>
<TabItem value="Project file">


<File name='dbt_project.yml'>

```yaml
models:
  +concurrent_batches: true
```

</File>

</TabItem>


<TabItem value="sql file">

<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized='incremental',
    concurrent_batches=true,
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

`concurrent_batches` is an override which allows you to decide whether or not you want to run batches in parallel or sequentially (one at a time).

For more information, refer to [how batch execution works](/docs/build/incremental-microbatch#how-parallel-batch-execution-works).
## Example

By default, dbt auto-detects whether batches can run in parallel for microbatch models. However, you can override dbt's detection by setting the `concurrent_batches` config to `false` in your `dbt_project.yml` or model `.sql` file to specify parallel or sequential execution, given you meet these conditions: 
* You've configured a microbatch incremental strategy.
* You're working with cumulative metrics or any logic that depends on batch order.

Set `concurrent_batches` config to `false` to ensure batches are processed sequentially. For example: 

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    cumulative_metrics_model:
      +concurrent_batches: false
```
</File>


<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='microbatch'
    concurrent_batches=false
  )
}}
select ...

```
</File>


