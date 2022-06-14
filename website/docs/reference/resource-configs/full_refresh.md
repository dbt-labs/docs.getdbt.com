---
resource_types: [models, seeds]
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
  [<resource-path>](resource-path):
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
  [<resource-path>](resource-path):
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

This logic is encoded in the [`should_full_refresh()`](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/materializations/helpers.sql#L68) macro.

## Usage

### Incremental models

* [How do I rebuild an incremental model?](configuring-incremental-models#how-do-i-rebuild-an-incremental-model)
* [What if the columns of my incremental model change?](configuring-incremental-models#what-if-the-columns-of-my-incremental-model-change)

### Seeds

<FAQ src="Seeds/full-refresh-seed" />

## Recommendation
Set `full_refresh: false` for models of especially large datasets, which you would _never_ want dbt to fully drop and recreate.
