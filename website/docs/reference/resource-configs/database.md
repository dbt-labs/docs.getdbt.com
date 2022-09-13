---
resource_types: [models, seeds, tests]
datatype: string
---

:::caution Heads up!
This is a work in progress document. While this configuration applies to multiple resource types, the documentation has only been written for seeds.

:::

## Definition

Optionally specify a custom database for a [model](docs/building-a-dbt-project/building-models) or [seed](docs/building-a-dbt-project/seeds). (To specify a database for a [snapshot](snapshots), use the [`target_database` config](target_database)).

When dbt creates a relation (<Term id="table" />/<Term id="view" />) in a database, it creates it as: `{{ database }}.{{ schema }}.{{ identifier }}`, e.g. `analytics.finance.payments`

The standard behavior of dbt is:
* If a custom database is _not_ specified, the database of the relation is the target database (`{{ target.database }}`).
* If a custom database is specified, the database of the relation is the `{{ database }}` value.

To learn more about changing the way that dbt generates a relation's `database`, read [Using Custom Databases](using-custom-databases)

<Changelog>

* `v0.13.0`: Support for the `database` config is added
* `v0.16.0`: The `generate_database_name` macro was added to control how the `database` config is used by dbt

</Changelog>

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
* Redshift: Cross-database queries are not possible in Redshift. As such, dbt will return a Database Error if you use this configuration.
