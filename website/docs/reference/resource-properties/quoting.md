---
title: "Configuring quoting in sources"
sidebar_label: "quoting"
datatype: boolean # -ish, it's actually a dictionary of bools
default: true
---
<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: jaffle_shop
    quoting:
      database: true | false
      schema: true | false
      identifier: true | false
    tables:
      - name: orders
        quoting:
          database: true | false
          schema: true | false
          identifier: true | false

```

</File>

## Definition
Optionally configure whether dbt should quote databases, schemas, and identifiers when resolving a `{{ source() }}` function to a direct relation reference.

This config can be specified for all tables in a source, or for a specific source <Term id="table" />. Quoting configs defined for a specific source table override the quoting configs specified for the top-level source.

:::info BigQuery Terminology

Note that for BigQuery quoting configuration, `database` and `schema` should be used here, though these configs will apply to `project` and `dataset` names respectively

:::


## Default
The default values vary by database. 

For most adapters, quoting is set to _true_ by default.

Why? It's equally easy to select from relations with quoted or unquoted identifiers. Quoting allows you to use reserved words and special characters in those identifiers, though we recommend avoiding this whenever possible.

On Snowflake, quoting is set to _false_ by default.

Creating relations with quoted identifiers also makes those identifiers case sensitive. It's much more difficult to select from them. You can re-enable quoting for relations identifiers that are case sensitive, reserved words, or contain special characters, but we recommend you avoid this as much as possible.

## Example

<File name='models/<filename>.yml'>

```yaml
version: 2

sources:
  - name: jaffle_shop
    database: raw
    quoting:
      database: true
      schema: true
      identifier: true

    tables:
      - name: orders
      - name: customers
        # This overrides the `jaffle_shop` quoting config
        quoting:
          identifier: false


```

</File>

In a downstream model:

<File name='models/<filename>.yml'>

```sql
select
  ...

-- this should be quoted
from {{ source('jaffle_shop', 'orders') }}

-- here, the identifier should be unquoted
left join {{ source('jaffle_shop', 'customers') }} using (order_id)

```

</File>


This will get compiled to:

```sql
select
  ...

-- this should be quoted
from "raw"."jaffle_shop"."orders"

-- here, the identifier should be unquoted
left join "raw"."jaffle_shop".customers using (order_id)

```
