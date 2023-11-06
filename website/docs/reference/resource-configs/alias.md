---
resource_types: [models, seeds, snapshots, tests]
description: "Read this guide to understand the alias configuration in dbt."
datatype: string
---


<Tabs>
<TabItem value="model" label="Model">

Specify a custom alias for a model in your `dbt_project.yml` file. 

For example, if you have a model that calculates `sales_metric`s and want to give it a more user-friendly alias, you can alias it like this:

<File name='dbt_project.yml'>

```yml
models:
  your_project:
    sales_metrics:
      +alias: sales_dashboard
```
</File>

This would return `analytics.finance.sales_dashboard` in the database, instead of the default `analytics.finance.sales_metrics`.
</TabItem>

<TabItem value="seeds" label="Seeds">

Configure a seed's alias in your `dbt_project.yml` file. 

For example, if you have a seed that represents `product_categories` and want to alias it as `categories_data`, you would alias like this:

<File name='dbt_project.yml'>

```yml
seeds:
  your_project:
    product_categories:
      +alias: categories_data
```

This would return the name `analytics.finance.categories_data` in the database.

</File>
</TabItem>
</Tabs>

## Definition

Optionally specify a custom alias for a [model](/docs/build/models) or [seed](/docs/build/seeds).

When dbt creates a relation (<Term id="table" />/<Term id="view" />) in a database, it creates it as: `{{ database }}.{{ schema }}.{{ identifier }}`, e.g. `analytics.finance.payments`

The standard behavior of dbt is:
* If a custom alias is _not_ specified, the identifier of the relation is the resource name (i.e. the filename).
* If a custom alias is specified, the identifier of the relation is the `{{ alias }}` value.

To learn more about changing the way that dbt generates a relation's `identifier`, read [Using Aliases](/docs/build/custom-aliases).


## Usage

### Seeds

In this example, the seed at `seeds/country_codes.csv` will be built as a <Term id="table" /> named `country_mappings`.

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    country_codes:
      +alias: country_mappings

```

</File>
