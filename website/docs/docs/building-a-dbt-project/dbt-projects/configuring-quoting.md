---
title: "Configuring quoting"
id: "configuring-quoting"
---

## Overview

Different databases handle quoting in different ways. Depending on your database and your team's quoting conventions, you may either want to enable or disable quoting for your dbt models.

dbt makes it possible to configure its quoting behavior through a configuration block in the `dbt_project.yml` file. These quoting configurations are used when models are created or `ref`'d. To configure quoting, add the following to your `dbt_project.yml` file:

<Callout type="info" title="BigQuery Terminology">

Note that for BigQuery quoting configuration, `database` and `schema` should be used here, though these configs will apply to `project` and `dataset` names respectively

</Callout>



<File name='dbt_project.yml'>

```yaml

# To toggle model quoting, set `database`, `identifier`
# and `schema` to `true` or `false`.

quoting:
  database: true
  identifier: true
  schema: true


models:
  ...
```

</File>

If a `quoting` block is not specified, dbt will use its default quoting behavior which can vary by database. These defaults may change in future releases of dbt. To avoid issues with future releases, you should explicitly configure your desired quoting policy in your `dbt_project.yml` file.

## Snowflake

Whereas most databases will _lowercase_ unquoted identifiers, Snowflake will _uppercase_ unquoted identifiers. If a model name is lowercased _and quoted_, then it cannot be referred to without quotes! Check out the example below for more information.

<File name='snowflake_casing.sql'>

```sql
/*
    You can run the following queries against your database
    to build an intution for how quoting works on Snowflake.
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
