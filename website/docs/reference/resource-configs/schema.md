---
resource_types: [models, seeds, tests]
datatype: string
---

:::caution Heads up!
This is a work in progress document. While this configuration applies to multiple resource types, the documentation has only been written for seeds.

:::

## Definition
Optionally specify a custom schema for a [model](docs/building-a-dbt-project/building-models) or [seed](docs/building-a-dbt-project/seeds). (To specify a schema for a [snapshot](snapshots), use the [`target_schema` config](target_schema)).

When dbt creates a relation (table/view) in a database, it creates it as: `{{ database }}.{{ schema }}.{{ identifier }}`, e.g. `analytics.finance.payments`

The standard behavior of dbt is:
* If a custom schema is _not_ specified, the schema of the relation is the target schema (`{{ target.schema }}`).
* If a custom schema is specified, by default, the schema of the relation is `{{ target.schema }}_{{ schema }}`.

To learn more about changing the way that dbt generates a relation's `schema`, read [Using Custom Schemas](docs/building-a-dbt-project/building-models/using-custom-schemas)

## Usage

### Models

Configure groups of models from the `dbt_project.yml` file.

<File name='dbt_project.yml'>

```yml
models:
  jaffle_shop: # the name of a project
    marketing:
      +schema: marketing
```

</File>

Configure individual models using a config block:

<File name='models/my_model.sql'>

```sql
{{ config(
    schema='marketing'
) }}
```

</File>

### Seeds
<File name='dbt_project.yml'>

```yml
seeds:
  +schema: mappings
```

</File>

### Tests

Customize the name of the schema in which tests [configured to store failures](resource-configs/store_failures) will save their results:

<File name='dbt_project.yml'>

```yml
tests:
  +store_failures: true
  +schema: the_island_of_misfit_tests
```

</File>

## Warehouse specific information
* BigQuery: `dataset` and `schema` are interchangeable
