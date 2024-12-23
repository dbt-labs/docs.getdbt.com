---
title: "batch_size"
id: "batch-size"
sidebar_label: "batch_size"
resource_types: [models]
description: "dbt uses `batch_size` to determine how large batches are when running a microbatch incremental model."
datatype: hour | day | month | year
---

<VersionCallout version="1.9" />

## Definition

The`batch_size` config determines how large batches are when running a microbatch. Accepted values are `hour`, `day`, `month`, or `year`. You can configure `batch_size` for a [model](/docs/build/models) in your `dbt_project.yml` file, property YAML file, or config block.

## Examples

The following examples set `day` as the `batch_size` for the `user_sessions` model.

Example of the `batch_size` config in the `dbt_project.yml` file:

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

