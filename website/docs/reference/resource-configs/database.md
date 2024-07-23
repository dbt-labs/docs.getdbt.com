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

This would result in the generated relation being located in the `staging` database, so the full relation name would be `staging.finance.product_categories`.

</File>
</TabItem>

<TabItem value="snapshots" label="Snapshots">

<VersionBlock lastVersion="1.8">

Available for versionless dbt Cloud or dbt Core v1.9+. Select v1.9 or newer from the version dropdown to view the configs.

</VersionBlock>

<VersionBlock firstVersion="1.9">

Specify a custom database for a snapshot in your `dbt_project.yml` or config file. 

For example, if you have a snapshot that you want to load into a database other than the target database, you can configure it like this:

<File name='dbt_project.yml'>

```yml
snapshots:
  your_project:
    your_snapshot:
      +database: staging
```
</File>

This would result in the generated relation being located in the `staging` database, so the full relation name would be `staging.finance.your_snapshot` instead of the default target database.

</VersionBlock>

</TabItem>



<TabItem value="test" label="Tests">

Configure a database in your `dbt_project.yml` file. 

For example, to load a test into a database called `reporting` instead of the target database, you can configure it like this:

<File name='dbt_project.yml'>

```yml
tests:
  - my_not_null_test:
      column_name: order_id
      type: not_null
      +database: reporting
```

This would result in the generated relation being located in the `reporting` database, so the full relation name would be `reporting.finance.my_not_null_test`.

</File>
</TabItem>
</Tabs>


## Definition

Optionally specify a custom database for a [model](/docs/build/sql-models), [seed](/docs/build/seeds), or [data test](/docs/build/data-tests). (To specify a database for a [snapshot](/docs/build/snapshots), use the [`target_database` config](/reference/resource-configs/target_database)).

When dbt creates a relation (<Term id="table" />/<Term id="view" />) in a database, it creates it as: `{{ database }}.{{ schema }}.{{ identifier }}`, e.g. `analytics.finance.payments`

The standard behavior of dbt is:
* If a custom database is _not_ specified, the database of the relation is the target database (`{{ target.database }}`).
* If a custom database is specified, the database of the relation is the `{{ database }}` value.

To learn more about changing the way that dbt generates a relation's `database`, read [Using Custom Databases](/docs/build/custom-databases)



## Warehouse specific information
* BigQuery: `project` and `database` are interchangeable

