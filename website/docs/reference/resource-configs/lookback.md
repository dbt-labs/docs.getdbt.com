---
title: "lookback"
id: "lookback"
sidebar_label: "lookback"
resource_types: [models]
description: "dbt uses `lookback` to detrmine how many 'batches' of `batch_size` to reprocesses when a microbatch incremental model is running incrementally."
datatype: int
---

<VersionCallout version="1.9" />
## Definition

Set the `lookback` to an integer greater than or equal to zero. The default value is `1`.  You can configure `lookback` for a [model](/docs/build/models) in your `dbt_project.yml` file, property YAML file, or config block.

## Examples

The following examples set `2` as the `lookback` config for the `user_sessions` model.

Example in the `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yml
models:
  my_project:
    user_sessions:
      +lookback: 2
```
</File>

Example in a properties YAML file:

<File name='models/properties.yml'>

```yml
models:
  - name: user_sessions
    config:
      lookback: 2
```

</File>

Example in sql model config block:

<File name="models/user_sessions.sql">

```sql
{{ config(
    lookback=2
) }}
```

</File> 
