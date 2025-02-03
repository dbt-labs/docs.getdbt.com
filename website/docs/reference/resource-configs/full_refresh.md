---
resource_types: [models, seeds]
description: "Setting the full_refresh config to false prevents a model or seed from being rebuilt, even when the `--full-refresh` flag is included in an invocation."
datatype: boolean
---

The `full_refresh` config allows you to control whether a resource will always or never perform a full-refresh. This config overrides the `--full-refresh` command-line flag.

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
  ]
}>

<TabItem value="models">

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +full_refresh: false | true 
```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
    full_refresh = false | true
) }}

select ...
```

</File>

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +full_refresh: false | true

```

</File>

</TabItem>

</Tabs>

## Description

The `full_refresh` config allows you to optionally configure whether a resource will always or never perform a full-refresh. This config is an override for the `--full-refresh` command line flag used when running dbt commands. 

You can set the `full_refresh` config in the `dbt_project.yml` file or in a resource config. 

| `full_refresh` value | Behavior |
| ---------------------------- | -------- |
| If set to `true` | The resource _always_ performs a full refresh, regardless of whether you pass the `--full-refresh` flag in the dbt command. |
| If set to `false` | The resource _never_ performs a full refresh, regardless of whether you pass the `--full-refresh` flag in the dbt command. |
| If set to `none` or omitted | The resource follows the behavior of the `--full-refresh` flag. If the flag is used, the resource will perform a full refresh; otherwise, it will not. |

#### Note
- The `--full-refresh` flag also supports a short name, `-f`.
- The [`should_full_refresh()`](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/materializations/configs.sql) macro has logic encoded.

## Usage

### Incremental models

* [How do I rebuild an incremental model?](/docs/build/incremental-models#how-do-i-rebuild-an-incremental-model)
* [What if the columns of my incremental model change?](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change)

### Seeds

<FAQ path="Seeds/full-refresh-seed" />

## Recommendation
Set `full_refresh: false` for models of especially large datasets, which you would _never_ want dbt to fully drop and recreate.

## Reference docs
* [on_configuration_change](/reference/resource-configs/on_configuration_change)
