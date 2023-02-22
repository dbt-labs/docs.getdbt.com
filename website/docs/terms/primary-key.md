---
id: primary-key
title: Primary key
description: A primary key is a non-null column in a database object that uniquely identifies each row. Primary keys take the form of a natural or surrogate key.
displayText: primary key  
hoverSnippet: A primary key is a non-null column in a database object that uniquely identifies each row.
---

<head>
  <title>Primary key in SQL (AKA Constraints) — dbt Labs</title>
</head>

A primary key is a non-null column in a database object that uniquely identifies each row. Primary keys take the form of a natural or <Term id="surrogate-key" />. It’s important to note that for each <Term id="table" /> or <Term id="view" /> in your database, there must only be one primary key column per database object.

At their core, you create and use these row-level unique identifiers to:

* Ensure a lack of duplicate rows in your tables
* Identify table <Term id="grain">grains</Term> easily
* Help unpack how tables join together
* Establish a consistent naming system for primary keys across your data models

One of the great things about data modeling is that there are very few rules to it. You have the flexibility to create the models and columns that are applicable to your business and the SQL you use to accomplish that is pretty much up to you and your team. _Having a primary key in each data model is pretty much the one rule you can’t break._ Without primary keys that are tested for non-nullness and uniqueness, duplicate or null records can slip undetected into your data models and cause counts to be incorrect. These two reasons coupled together can create a sense of distrust in the data and data team.

Use this glossary page to understand the importance of primary keys, how natural keys and surrogate keys differ, and how <Term id="data-warehouse" /> support for primary keys varies.

## Types of primary keys

Primary keys can be established two ways: naturally or derived through the data in a surrogate key.

* A **natural key** is a primary key that is innate to the data. Perhaps in tables there’s a unique `id` field in each table that would act as the natural key. You can use documentation like entity relationship diagrams (ERDs) to help understand natural keys in APIs or tables. In a perfect world, all of our primary keys would be natural keys… _but this is an imperfect world!_
* A **surrogate key** is a hashed value of multiple fields in a dataset that create a uniqueness constraint on that dataset. You’ll essentially need to make a surrogate key in every table that lacks a natural key. An example of this could be a custom table that reports daily performance per `ad_id` from an ad platform. You can derive a surrogate key by hashing the `date` and `ad_id` fields to create a unique value per row.

A note on primary key data types: natural keys will often  take the form of an integer or other numeric value (ex. 45932). Surrogate keys, on the other hand, are usually alphanumeric strings since they are hashed values (ex. ‘62aef884fbe3470ce7d9a92140b09b17’).

:::tip Tip
dbt supports [packages](https://docs.getdbt.com/docs/build/packages), libraries of open-source macros and data models, to help data teams avoid doing duplicative work. One of these packages, [dbt_utils](https://github.com/dbt-labs/dbt-utils), contains a series of macros that are built to alleviate common struggles in data modeling. The [surrogate_key](https://github.com/dbt-labs/dbt-utils#surrogate_key-source) macro offers a DRY (don’t repeat yourself) solution to creating surrogate keys across different data warehouses in the event that your data doesn’t contain natural keys.
:::

## Data warehouse support for primary keys

What do we mean when we say a primary key is supported in a database? What does it mean if primary keys are enforced?

* **Support**: If a primary key is supported in a database, that means they allow you to explicitly let the system know if a specific field is a primary key. This will happen in the <Term id="ddl">DDL (data definition language)</Term> to create the table, like in the example below, or an `ALTER` statement that specifies which field is the primary key.
* **Enforcement**: If a database enforces primary keys, that means it would raise an error if one of the constraints on primary keys (uniqueness and non-null) was broken during an `INSERT` or `UPDATE` statement.

The table below gives an overview of primary key support and enforcement in some of the major data warehouses. Below the table you’ll additionally see a breakdown of some details around primary key implementation for these data warehouses.

<table>
  <tr>
   <td>
   </td>
   <td><strong>Supports primary keys?</strong>
   </td>
   <td><strong>Fully enforces primary keys?</strong>
   </td>
  </tr>
  <tr>
   <td><a href="https://docs.snowflake.com/en/sql-reference/constraints-overview.html">Snowflake</a>
   </td>
   <td>✅
   </td>
   <td>❌
   </td>
  </tr>
  <tr>
   <td><a href="https://docs.aws.amazon.com/redshift/latest/dg/t_Defining_constraints.html">Amazon Redshift</a>
   </td>
   <td>✅
   </td>
   <td>❌
   </td>
  </tr>
  <tr>
   <td><a href="https://docs.getdbt.com/blog/primary-key-testing#bigquery-primary-keys">Google BigQuery</a>
   </td>
   <td>❌
   </td>
   <td>❌
   </td>
  </tr>
  <tr>
   <td><a href="https://docs.databricks.com/delta/delta-constraints.html">Databricks</a>
   </td>
   <td>✅
   </td>
   <td>❌
   </td>
  </tr>
  <tr>
   <td><a href="https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-primary-key/">Postgres</a>
   </td>
   <td>✅
   </td>
   <td>✅
   </td>
  </tr>
</table>

### Snowflake

Snowflake allows for data folks to explicitly identify primary keys during table creation or using an `ALTER` statement. To see identified primary keys in your database, you can run the `SHOW PRIMARY KEYS` command. It’s important to note, however, that Snowflake primary key indicators are purely descriptive–meaning they don’t enforce either non-nullness or uniqueness requirements. However, Snowflake offers a separate `NOT NULL` constraint that will be enforced for specified fields.

### Amazon Redshift

With Redshift, you can specify primary keys constraints on tables, but Redshift won’t provide out-of-the-box primary key enforcement. Similar to Snowflake, Redshift does allow users to add a [`NOT NULL` constraint](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_TABLE_NEW.html) that is actually enforced.

In general for Redshift, it’s still good practice to define your primary keys (regardless of the lack of uniqueness enforcement) because they can help the [query planner](https://docs.getdbt.com/blog/redshift-configurations-dbt-model-optimizations) more quickly identify uniqueness and foreign key relationships.

### Google BigQuery

BigQuery is pretty unique here in that it doesn’t support or enforce primary keys. If your team is on BigQuery, you’ll need to have some [pretty solid testing](/docs/build/tests) in place to ensure your primary key fields are unique and non-null.

### Databricks

Databricks’ Delta tables in Unity Catalog provide support for declaring [informational primary keys](https://docs.databricks.com/tables/constraints.html#declare-primary-key-and-foreign-key-relationships). These primary key constraints are not enforced. Databricks currently offers [two enforced constraint](https://docs.databricks.com/tables/constraints.html#enforced-constraints-on-databricks) types: `not-null` and `check`. The `not-null` one is pretty straightforward, but the `check` constraint is more unique to Databricks. With the `check` constraint, you can test that a certain boolean expression executes as `true` for each row in a table. This constraint is more likely to be helpful for ensuring accepted values are met for fields rather than for primary key requirements.

### Postgres

Postgres is the true standout here in that it both supports and enforces primary keys! However, you shouldn’t be too surprised about this. One of the primary use cases for Postgres is that it often serves as the home for backend application tables and is usually managed by a [team of backend developers](https://docs.getdbt.com/blog/when-backend-devs-spark-joy). Since these tables often act as a source of truth for many businesses, it’s critical that primary key fields must exist, be non-null, and unique.

## How to indicate primary keys

For data warehouses that support primary keys (like Snowflake, Amazon Redshift, and Postgres), you can add a primary key indicator to the column you want to use as a primary key in the DDL to create the table. You may also use an `ALTER` DDL statement to set a column as a primary key if the table is already created. 

In the example below, you can add a new `jaffles` table to the [jaffle_shop](https://github.com/dbt-labs/jaffle_shop) project and make the `id` field the primary key.

```sql
CREATE TABLE prod.jaffle_shop.jaffles (
	id varchar(255) primary key,
	jaffle_name varchar(255)
	created_at timestamp,
	ingredients_list varchar(255),
	is_active boolean
);
```

:::note Note
If you don't have a field in your table that would act as a natural primary key, you’ll need to[ create a surrogate key](https://docs.getdbt.com/blog/sql-surrogate-keys) for it.
:::

If your data warehouse doesn’t provide out-of-the box support and enforcement for primary keys, it’s important to clearly label and put your own constraints on primary key fields. This could look like:

* **Creating a consistent naming convention for your primary keys**: You may see an `id` field or fields prefixed with `pk_` (ex. `pk_order_id`) to identify primary keys. You may also see the primary key be named as the obvious table grain (ex. In the jaffle shop’s `orders` table, the primary key is called `order_id`).
* **Adding automated [tests](/docs/build/tests) to your data models**: Use a data tool, such as dbt, to create not null and unique tests for your primary key fields.

## Testing primary keys

When we talk about testing our primary keys, we really mean testing their uniqueness and non-nullness. Given that not all modern data warehouses support or enforce primary key constraints, your data team will likely fall under two scenarios:

1. For databases that support primary key enforcement, you should receive failures when your constraints are broken.
2.  For databases that don’t offer support and enforcement of primary keys, you’re going to need to regularly test that primary keys aren’t violating their golden rule of uniqueness and non-nullness. To do this, we recommend implementing a tool like dbt that allows you to define version-controlled and code-based tests on your data models. Using these tests, you should create <code>[not null](https://docs.getdbt.com/reference/resource-properties/tests#not_null)</code> and <code>[unique](https://docs.getdbt.com/reference/resource-properties/tests#unique)</code> tests for every primary key field throughout your dbt project. Other methods for primary key testing may look like writing custom tests or ad hoc queries that check for uniqueness and non-nullness.

:::tip Tip
You can use dbt’s [documentation](https://docs.getdbt.com/docs/collaborate/documentation) and [testing](https://docs.getdbt.com/reference/resource-properties/tests) capabilities to clearly identify and QA primary keys in your data models. For your primary key column, you should mention that the field is the unique identifier for that table and test for uniqueness and non-nullness.
:::

## Conclusion

Say it with me or get it tattooed on your lower back: every database object in your data warehouse needs a primary key. At their core, primary keys are fields that uniquely identify each row in a table and help ensure there are no duplicates in the data. Primary keys take shape as either natural keys, fields that are innate to the data, or as surrogate keys, hashed column values that create a uniqueness constraint on the data. Not every modern data warehouse provides explicit support or enforcement of primary keys, so it’s incredibly important to have a method to test that your primary keys are unique and not null.

## Further reading

* [Testing primary keys in dbt](https://docs.getdbt.com/blog/primary-key-testing)
* [Surrogate keys and dbt](https://docs.getdbt.com/blog/sql-surrogate-keys)
* [dbt Constraints Snowflake Labs package](https://hub.getdbt.com/snowflake-labs/dbt_constraints/latest/)
