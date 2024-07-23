---
sidebar_label: "schema"
resource_types: [models, seeds, tests]
description: "Override the default schema when dbt creates resources in your data platform."
datatype: string
---

<Tabs>
<TabItem value="model" label="Model">

Specify a custom schema for a group of models in your `dbt_project.yml` file or a [config block](/reference/resource-configs/schema#models). 

For example, if you have a group of marketing-related models and you want to place them in a separate schema called `marketing`, you can configure it like this:

<File name='dbt_project.yml'>

```yml
models:
  your_project:
    marketing: #  Grouping or folder for set of models
      +schema: marketing
```
</File>

This would result in the generated relations for these models being located in the  `marketing` schema, so the full relation names would be `analytics.marketing.model_name`. 
</TabItem>

<TabItem value="seeds" label="Seeds">

Configure a custom schema in your `dbt_project.yml` file. 

For example, if you have a seed that should be placed in a separate schema called `mappings`, you can configure it like this:

<File name='dbt_project.yml'>

```yml
seeds:
  your_project:
    product_mappings:
      +schema: mappings
```

This would result in the generated relation being located in the `mappings` schema, so the full relation name would be `analytics.mappings.product_mappings`. 
</File>
</TabItem>

<TabItem value="snapshots" label="Snapshots">

<VersionBlock lastVersion="1.8">

Select v1.9 or newer from the version dropdown to view the configs.

</VersionBlock>

<VersionBlock firstVersion="1.9">

Specify a custom schema for a snapshot in your `dbt_project.yml` or config file. 

For example, if you have a snapshot that you want to load into a schema other than the target schema, you can configure it like this:

<File name='dbt_project.yml'>

```yml
snapshots:
  your_project:
    your_snapshot:
      +schema: snapshots
```
</File>

This would result in the generated relation being located in the `snapshots` schema, so the full relation name would be `analytics.snapshots.your_snapshot` instead of the default target schema.

</VersionBlock>

</TabItem>

<TabItem value="tests" label="Test">

Customize the schema for storing test results in your `dbt_project.yml` file. 

For example, to save test results in a specific schema, you can configure it like this:


<File name='dbt_project.yml'>

```yml
tests:
  +store_failures: true
  +schema: test_results
```

This would result in the test results being stored in the `test_results` schema.
</File>
</TabItem>
</Tabs>

Refer to [Usage](#usage) for more examples.

## Definition
Optionally specify a custom schema for a [model](/docs/build/sql-models) or [seed](/docs/build/seeds). (To specify a schema for a [snapshot](/docs/build/snapshots), use the [`target_schema` config](/reference/resource-configs/target_schema)).

When dbt creates a relation (<Term id="table" />/<Term id="view" />) in a database, it creates it as: `{{ database }}.{{ schema }}.{{ identifier }}`, e.g. `analytics.finance.payments`

The standard behavior of dbt is:
* If a custom schema is _not_ specified, the schema of the relation is the target schema (`{{ target.schema }}`).
* If a custom schema is specified, by default, the schema of the relation is `{{ target.schema }}_{{ schema }}`.

To learn more about changing the way that dbt generates a relation's `schema`, read [Using Custom Schemas](/docs/build/custom-schemas)

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

Customize the name of the schema in which tests [configured to store failures](/reference/resource-configs/store_failures) will save their results:

<File name='dbt_project.yml'>

```yml
tests:
  +store_failures: true
  +schema: the_island_of_misfit_tests
```

</File>

## Warehouse specific information
* BigQuery: `dataset` and `schema` are interchangeable
