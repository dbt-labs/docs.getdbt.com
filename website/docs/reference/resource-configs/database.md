---
sidebar_label: "database"
resource_types: [models, seeds, tests]
datatype: string
description: "Read this guide to understand the database configuration in dbt."
---

:::caution Heads up!
This is a work in progress document. While this configuration applies to multiple resource types, the documentation has only been written for seeds.

:::

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

