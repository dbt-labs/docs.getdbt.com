---
datatype: boolean # -ish, it's actually a dictionary of bools
default: true # is this right?
---

## Definition
Optionally configure whether dbt should quote databases, schemas, and identifiers when:
* creating relations (tables/views)
* resolving a `ref` function to a relation reference

<Callout type="info" title="BigQuery Terminology">

Note that for BigQuery quoting configuration, `database` and `schema` should be used here, though these configs will apply to `project` and `dataset` names respectively

</Callout>

## Default values

[ to-do ]

The default values vary by database.



## Recommendations
* Set quoting explicitly for your project as defaults may change in the future.

### Snowflake
* Set all quoting configs to `False`. This means that you cannot use reserved words as identifiers, however it's usually a good idea to avoid these reserved words anyway.

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



### BigQuery
??

## Changelog
* `???`: This parameter was introduced in v0.11.0
* `v0.11.0`: The default quoting config on Snowflake changed from `true` to `false`
* Future: the default values may change for each database.
