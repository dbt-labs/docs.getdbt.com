---
title: "Defining a database source property"
sidebar_label: "database"
resource_types: sources
datatype: database_name
---

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <source_name>
    database: <database_name>
    tables:
      - name: <table_name>
      - ...

```

</File>

## Definition
The database that your source is stored in.

Note that to use this parameter, your warehouse must allow cross-database queries.

:::info

#### BigQuery terminology
If you're using BigQuery, use the _project_ name as the `database:` property.

:::

## Default
By default, dbt will search in your target database (i.e. the database that you are creating tables and <Term id="view">views</Term>).

## Examples
### Define a source that is stored in the `raw` database

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: jaffle_shop
    database: raw
    tables:
      - name: orders
      - name: customers

```

</File>
