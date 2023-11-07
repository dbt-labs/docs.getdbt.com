---
sidebar_label: "database"
resource_types: [models, seeds, tests]
datatype: string
description: "Override the default database when dbt creates resources in your data platform."
---

<Tabs>
<TabItem value="model" label="Model">

Specify a custom database for a model in your `dbt_project.yml` file. 

For example, if you have a model that you want to load into a database other than the target database, you can configure it like this:

<File name='dbt_project.yml'>

```yml
models:
  your_project:
    sales_metrics:
      +database: reporting
```
</File>

This would result in the generated relation being located in the `reporting` database, so the full relation name would be `reporting.finance.sales_metrics` instead of the default target database.
</TabItem>

<TabItem value="seeds" label="Seeds">

Configure a database in your `dbt_project.yml` file. 

For example, to load a seed into a database called `staging` instead of the target database, you can configure it like this:

<File name='dbt_project.yml'>

```yml
seeds:
  your_project:
    product_categories:
      +database: staging
```

This would result in the generated relation being located in the `staging` database, so the full relation name would be `staging.finance.product_categories_data`.

</File>
</TabItem>
</Tabs>


## Definition

Optionally specify a custom database for a [model](/docs/build/sql-models) or [seed](/docs/build/seeds). (To specify a database for a [snapshot](/docs/build/snapshots), use the [`target_database` config](/reference/resource-configs/target_database)).

When dbt creates a relation (<Term id="table" />/<Term id="view" />) in a database, it creates it as: `{{ database }}.{{ schema }}.{{ identifier }}`, e.g. `analytics.finance.payments`

The standard behavior of dbt is:
* If a custom database is _not_ specified, the database of the relation is the target database (`{{ target.database }}`).
* If a custom database is specified, the database of the relation is the `{{ database }}` value.

To learn more about changing the way that dbt generates a relation's `database`, read [Using Custom Databases](/docs/build/custom-databases)

## Usage

### Load seeds into the RAW database
<File name='dbt_project.yml'>

```yml
seeds:
  +database: RAW

```

</File>

## Warehouse specific information
* BigQuery: `project` and `database` are interchangeable

