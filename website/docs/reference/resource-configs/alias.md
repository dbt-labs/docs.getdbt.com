---
resource_types: [models, seeds, snapshots, tests]
description: "Read this guide to understand the alias configuration in dbt."
datatype: string
---

:::caution Heads up!
This is a work in progress document. While this configuration applies to multiple resource types, the documentation has only been written for seeds.

:::

## Definition

Optionally specify a custom alias for a [model](/docs/build/models) or [seed](/docs/build/seeds).

When dbt creates a relation (<Term id="table" />/<Term id="view" />) in a database, it creates it as: `{{ database }}.{{ schema }}.{{ identifier }}`, e.g. `analytics.finance.payments`

The standard behavior of dbt is:
* If a custom alias is _not_ specified, the identifier of the relation is the resource name (i.e. the filename).
* If a custom alias is specified, the identifier of the relation is the `{{ alias }}` value.

To learn more about changing the way that dbt generates a relation's `identifier`, read [Using Aliases](/docs/build/custom-aliases).


## Usage

### Seeds
Configure a seed's alias in your `dbt_project.yml` file.

The seed at `seeds/country_codes.csv` will be built as a <Term id="table" /> named `country_mappings`.

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    country_codes:
      +alias: country_mappings

```

</File>
