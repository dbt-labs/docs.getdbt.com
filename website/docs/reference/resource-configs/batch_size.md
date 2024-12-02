---
title: "batch_size"
id: "batch-size"
sidebar_label: "batch_size"
resource_types: [models]
description: "dbt uses `batch_size` to detrmine how large batches are when running a microbatch incremental model."
datatype: hour | day | month | year
---

Available in dbt Cloud Versionless and dbt Core v1.9 and higher.

## Definition

Set the `batch_size` either `hour`, `day`, `month`, or `year`. You can configure `batch_size` for a [model](/docs/build/models) in your `dbt_project.yml` file, property YAML file, or config block.

## Examples

<Tabs> 

<TabItem value="model" label="Models">

Here's an example in the `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yml
models:
  my_project:
    user_sessions:
      +batch_size: day
```
</File>

Example in a properties YAML file:

<File name='models/properties.yml'>

```yml
models:
  - name: user_sessions
    config:
      batch_size: day
```

</File>

Example in sql model config block:

<File name="models/user_sessions.sql">

```sql
{{ config(
    lookback='day
) }}
```

</File> 

This setup sets `day` as the `batch_size` for the `user_sessions` model.
</TabItem> 
</Tabs>
