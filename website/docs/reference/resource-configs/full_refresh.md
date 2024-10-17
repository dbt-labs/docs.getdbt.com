---
resource_types: [models, seeds]
description: "Setting the full_refresh config to false prevents a model or seed from being rebuilt, even when the `--full-refresh` flag is included in an invocation."
datatype: boolean
---

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
    +full_refresh: false

```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
    full_refresh = false
) }}

select ...

```

</File>

The configured model(s) will not full-refresh when `dbt run --full-refresh` is invoked.

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +full_refresh: false

```

</File>

The configured seed(s) will not full-refresh when `dbt seed --full-refresh` is invoked.

</TabItem>

</Tabs>

## Description
Optionally set a resource to always or never full-refresh.
- If specified as `true` or `false`, the
`full_refresh` config will take precedence over the presence or absence of the `--full-refresh` flag.
- If the `full_refresh` config is `none` or omitted, the resource will use the value of the `--full-refresh` flag.

**Note:** The `--full-refresh` flag also supports a short name, `-f`.

This logic is encoded in the [`should_full_refresh()`](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/materializations/configs.sql) macro.

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
