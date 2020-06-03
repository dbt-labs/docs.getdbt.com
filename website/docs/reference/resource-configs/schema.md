---
resource_types: [models, seeds]
datatype: string
---

<Alert type='warning'>
<h4>Heads up!</h4>
This is a work in progress document. While this configuration applies to multiple resource types, the documentation has only been written for seeds.

</Alert>

## Definition
Optionally specify a custom schema for a [model](docs/docs/building-a-dbt-project/building-models.md) or [seed](docs/docs/building-a-dbt-project/seeds.md). (To specify a schema for a [snapshot](snapshots), use the [`target_schema` config](target_schema)).

When dbt creates a relation (table/view) in a database, it creates it as: `{{ database }}.{{ schema }}.{{ identifier }}`, e.g. `analytics.finance.payments`

The standard behavior of dbt is:
* If a custom schema is _not_ specified, the schema of the relation is the target schema (`{{ target.schema }}`).
* If a custom schema is specified, by default, the schema of the relation is `{{ target.schema }}_{{ schema }}`.

To learn more about changing the way that dbt generates a relation's `schema`, read [Using Custom Schemas](docs/docs/building-a-dbt-project/building-models/using-custom-schemas.md)

## Usage

### Models

Configure groups of models from the `dbt_project.yml` file.

<File name='dbt_project.yml'>

```
models:
  jaffle_shop: # the name of a project
    marketing:
      schema: marketing
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

```
seeds:
  schema: mappings
```

</File>

## Warehouse specific information
* BigQuery: `dataset` and `schema` are interchangeable
