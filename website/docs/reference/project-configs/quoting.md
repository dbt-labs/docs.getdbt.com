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
  snowflake_ignore_case: true | false  # Fusion-only config. Aligns with Snowflake's session parameter QUOTED_IDENTIFIERS_IGNORE_CASE behavior. 
                                       # Ignored by dbt Core and other adapters.
```

</File>

## Definition

You can optionally enable quoting in a dbt project to control whether dbt wraps database, schema, or identifier names in quotes when generating SQL. dbt uses this configuration when:

* Creating relations (For example, tables or views)
* Resolving a `ref()` function to a direct relation reference

:::info BigQuery terminology

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

Why? It's equally easy to select from relations with quoted or unquoted identifiers. Quoting allows you to use reserved words and special characters in those identifiers, though we recommend avoiding reserved words and special characters in identifiers whenever possible.

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

For Snowflake, quoting is set to `false` by default.

Creating relations with quoted identifiers also makes those identifiers case sensitive. It's much more difficult to select from them. You can re-enable quoting for relations identifiers that are case sensitive, reserved words, or contain special characters, but we recommend you avoid this as much as possible.

<File name='dbt_project.yml'>

```yml
quoting:
  database: false
  schema: false
  identifier: false
  snowflake_ignore_case: false  # Fusion-only config. Aligns with Snowflake's session parameter QUOTED_IDENTIFIERS_IGNORE_CASE behavior. 
                                # Ignored by dbt Core and other adapters.
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
  snowflake_ignore_case: false  # Fusion-only config. Aligns with Snowflake's session parameter QUOTED_IDENTIFIERS_IGNORE_CASE behavior. 
                                # Ignored by dbt Core and other adapters.
```

dbt will then create relations without quotes:

```sql
create table analytics.dbt_alice.dim_customers
```

</File>


## Recommendations

### Snowflake

If you're using Snowflake, we recommend:

- Setting all quoting configs to `False` in your [`dbt_project.yml`](/reference/dbt_project.yml) to avoid quoting model and column names unnecessarily and to help prevent case sensitivity issues.
  - Setting all quoting configs to `False` also means you cannot use reserved words as identifiers, such as model or table names. We recommend you avoid using these reserved words anyway.  
- If you're using Fusion and your Snowflake environment sets the session parameter `QUOTED_IDENTIFIERS_IGNORE_CASE = true` (for example, in an orchestrator or pre-hook), you should also enable quoting and `snowflake_ignore_case` in your `dbt_project.yml` to preserve the exact case of database, schema, and identifier:

  ```yml
  quoting:
    database: true
    schema: true
    identifier: true
    snowflake_ignore_case: true  # Fusion-only config. Aligns with Snowflake's session parameter QUOTED_IDENTIFIERS_IGNORE_CASE behavior. 
                                 # Ignored by dbt Core and other adapters.
  ```

  Setting `snowflake_ignore_case: true` ensures that dbt compiles column and identifier names match Snowflake’s behavior at runtime, preserving parity between compile-time and runtime logic. Without this, you may encounter "column not found" errors.

:::info Quoting a source
If a Snowflake source table uses a quoted database, schema, or table identifier, you can configure this in the source.yml file. Refer to [configuring quoting](/reference/resource-properties/quoting) for more information.
:::

#### Explanation

dbt skips quoting on Snowflake so lowercase model names work seamlessly in downstream queries and BI tools without worrying about case or quotes.

Unlike most databases (which lowercase unquoted identifiers), Snowflake uppercases them. When you quote identifiers, Snowflake will preserve their case and make them case-sensitive. This means when you create a table with quoted, lowercase identifiers, the table should always be referenced with quotes and use the exact same case, which can easily break downstream queries in BI tools or ad-hoc SQL. 

Because dbt conventions use lowercase model and file names, quoting them in Snowflake risks breaking downstream queries in BI tools or ad-hoc SQL. If dbt instead used uppercase names by convention, the safe defaults for other databases would be at risk of breaking downstream queries.


<File name='snowflake_casing.sql'>

```sql
/*
  Run these queries to understand how Snowflake handles casing and quoting.
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
    won't be able to use reserved words as model names, but you should avoid that anyway! Assuming schema and identifier quoting is
    disabled, the following query would indeed work:
*/

select * from analytics.orders;
```

</File>



### Other warehouses

Leave the default values for your warehouse.
