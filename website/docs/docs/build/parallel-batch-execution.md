---
title: "Parallel microbatch execution"
sidebar_label: "Parallel microbatch execution"
description: "Learn about the 'parallel batch execution' strategy for incremental models."
intro_text: "Use parallel batch execution to process your microbatch models faster."
---

The microbatch strategy offers the benefit of updating a model in smaller, more manageable batches. Depending on your use case, configuring your microbatch models to run in parallel offers faster processing, in comparison to running batches sequentially.

Parallel batch execution means that multiple batches are processed at the same time, instead of one after the other (sequentially) for faster processing of your microbatch models.  

dbt automatically detects whether a batch can be run in parallel in most cases, which means you don’t need to configure this setting. However, the [`concurrent_batches` config](/reference/resource-properties/concurrent_batches) is available as an override (not a gate), allowing you to specify whether batches should or shouldn’t be run in parallel in specific cases.

For example, if you have a microbatch model with 12 batches, you can execute those batches to run in parallel. Specifically they'll run in parallel limited by the number of [available threads](/docs/running-a-dbt-project/using-threads).

## Prerequisites

To use parallel execution, you must meet the following prerequisites:

- Use Snowflake as a supported adapter.
  - More adapters are coming soon!
  - We'll continue to test and add concurrency support for more adapters in the future.
- A batch can only be run in parallel if:
  - The batch is _not_ the first batch.
  - The batch is _not_ the last batch.

## How parallel batch execution works

After checking for the conditions in the [prerequisites](#prerequisites), and if `concurrent_batches` value isn't set, dbt will intelligently auto-detect if the model invokes the [`{{ this }}`](/reference/dbt-jinja-functions/this) Jinja function. If it references `{{ this }}`, the batches will run sequentially since  `{{ this }}` represents the database of the current model and referencing the same relation causes conflict. 

Otherwise, if `{{ this }}` isn't detected (and other conditions are met), the batches will run in parallel, which can be overriden when you [set a value for `concurrent_batches`](/reference/resource-properties/concurrent_batches).

## Parallel or sequential execution

Choosing between parallel batch execution and sequential processing depends on the specific requirements of your use case. 

- Parallel batch execution is faster but requires logic independent of batch execution order. For example, if you're developing a data pipeline for a system that processes user transactions in batches, each batch is executed in parallel for better performance. However, the logic used to process each transaction shouldn't depend on the order of how batches are executed or completed.
- Sequential processing is slower but essential for calculations like [cumulative metrics](/docs/build/cumulative)  in microbatch models. It processes data in the correct order, allowing each step to build on the previous one.

## Configure `concurrent_batches` 

By default, dbt auto-detects whether batches can run in parallel for microbatch models, and this works correctly in most cases. However, you can override dbt's detection by setting the [`concurrent_batches` config](/reference/resource-properties/concurrent_batches) in your `dbt_project.yml` or model `.sql` file to specify parallel or sequential execution, given you meet all the [conditions](#prerequisites):

<Tabs>
<TabItem value="yaml" label="dbt_project.yml">

<File name='dbt_project.yml'>

```yaml
models:
  +concurrent_batches: true # value set to true to run batches in parallel
```

</File>
</TabItem>

<TabItem value="sql" label="my_model.sql">

<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='microbatch',
    event_time='session_start',
    begin='2020-01-01',
    batch_size='day',
    concurrent_batches=true, # value set to true to run batches in parallel
    ...
  )
}}

select ...
```
</File>
</TabItem>
</Tabs>
