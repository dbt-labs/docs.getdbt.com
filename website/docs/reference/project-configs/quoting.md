---
title: "Configuring quoting in projects"
sidebar_label: "quoting"
datatype: boolean # -ish, it's actually a dictionary of bools
description: "Read this guide to understand the quoting configuration in dbt."
default: true
---
<File name='dbt_project.yml'>

```yml
quoting:
  database: true | false
  schema: true | false
  identifier: true | false

```

</File>

## Definition
Optionally configure whether dbt should quote databases, schemas, and identifiers when:
* creating relations (tables/views)
* resolving a `ref` function to a direct relation reference

:::info BigQuery Terminology

Note that for BigQuery quoting configuration, `database` and `schema` should be used here, though these configs will apply to `project` and `dataset` names respectively

:::

## Default

The default values vary by database.
<Tabs
  defaultValue="default"
  values={[
    { label: 'Default', value: 'default', },
    { label: 'Snowflake', value: 'snowflake', },
  ]
}>
<TabItem value="default">

For most adapters, quoting is set to `true` by default.

Why? It's equally easy to select from relations with quoted or unquoted identifiers. Quoting allows you to use reserved words and special characters in those identifiers, though we recommend avoiding this whenever possible.

  <File name='dbt_project.yml'>

```yml
quoting:
  database: true
  schema: true
  identifier: true

```

</File>
</TabItem>
<TabItem value="snowflake">

On Snowflake, quoting is set to `false` by default.

Creating relations with quoted identifiers also makes those identifiers case sensitive. It's much more difficult to select from them. You can re-enable quoting for relations identifiers that are case sensitive, reserved words, or contain special characters, but we recommend you avoid this as much as possible.

<File name='dbt_project.yml'>

```yml
quoting:
  database: false
  schema: false
  identifier: false

```

</File>


</TabItem>

</Tabs>

## Examples
Set quoting to `false` for a project:
<File name='dbt_project.yml'>

```yml
quoting:
  database: false
  schema: false
  identifier: false

```

dbt will then create relations without quotes:

```sql
create table analytics.dbt_alice.dim_customers
```

</File>


## Recommendation

### Snowflake
Set all quoting configs to `False`. This means that you cannot use reserved words as identifiers, however it's usually a good idea to avoid these reserved words anyway.

If a Snowflake source table uses a quoted database, schema, or table identifier, you can configure it in the source.yml file. [Refer to configuring quoting for more info](/reference/resource-properties/quoting).



#### Explanation:

Whereas most databases will _lowercase_ unquoted identifiers, Snowflake will _uppercase_ unquoted identifiers. If a model name is lowercased _and quoted_, then it cannot be referred to without quotes! Check out the example below for more information.

<File name='snowflake_casing.sql'>

```sql
/*
    You can run the following queries against your database
    to build an intuition for how quoting works on Snowflake.
*/

-- This is the output of an example `orders.sql` model with quoting enabled
create table "analytics"."orders" as (

  select 1 as id

);

/*
    These queries WILL NOT work! Since the table above was created with quotes,
    Snowflake created the orders table with a lowercase schema and identifier.

    Since unquoted identifiers are automatically uppercased, both of the
    following queries are equivalent, and neither will work correctly.
*/

select * from analytics.orders;
select * from ANALYTICS.ORDERS;

/*
    To query this table, you'll need to quote the schema and table. This
    query should indeed complete without error.
*/

select * from "analytics"."orders";


/*
    To avoid this quoting madness, you can disable quoting for schemas
    and identifiers in your dbt_project.yml file. This means that you
    won't be able to use reserved words as model names, but you probably
    shouldn't be doing that anyway! Assuming schema and identifier quoting is
    disabled, the following query would indeed work:
*/

select * from analytics.orders;
```

</File>



### Other warehouses
Leave the default values for your warehouse.
