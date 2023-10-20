---
id: cast
title: SQL CAST
description: Executing the CAST function in a SELECT statement will return the column you specified as the newly specified data type.
slug: /sql-reference/cast
---

<head>
    <title>Working with the SQL CAST function</title>
</head>

Let’s set the scene: You are knee-deep in a new data model and cannot figure out why the join between `user_id` in` table a` is not successfully joining with the `user_id` in `table b`. You dig a little deeper and discover that `user_id` in `table a` is an integer and `user_id` in `table b` is a string. 

*Cue throwing hands in the air.*

It *will* happen: You’ll find column types in your source data or upstream models that will likely need to be cast into different data types; perhaps to make joins easier, calculations more intuitive, or data more readable. Regardless of the reason, you’ll find yourself inevitably casting some data as an analytics engineer and using the SQL CAST function to help you out.

## How to use SQL CAST function

The syntax for using the CAST function looks like the following:

```sql
cast(<column_name> as <new_data_type>)
```

Executing this function in a SELECT statement will return the column you specified as the newly specified data type. Analytics engineers will typically be casting fields to more appropriate or useful numeric, strings, and date types. You may additionally use the CAST function in WHERE clauses and in joins.

Below, we’ll walk through a practical example using the CAST function.

### SQL CAST function example

You can cast the `order_id` and `customer_id` fields of the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `orders` model from number types to strings using the following code:

```sql
select 
	cast(order_id as string) as order_id,
	cast(customer_id as string) as customer_id,
	order_date,
	status
from {{ ref('orders') }}
```

After running this query, the `orders` table will look a little something like this:

| order_id | customer_id | order_date | status |
|---|---|---|---|
| 1 | 1 | 2018-01-01 | returned |
| 2 | 3 | 2018-01-02 | completed |
| 3 | 94 | 2018-01-04 | completed |

Let’s be clear: the resulting data from this query looks exactly the same as the upstream `orders` model. However, the `order_id` and `customer_id` fields are now strings, meaning you could easily concat different string variables to them.

> Casting columns to their appropriate types typically happens in our dbt project’s [staging models](https://docs.getdbt.com/guides/best-practices/how-we-structure/2-staging). A few reasons for that: data cleanup and standardization, such as aliasing, casting, and lower or upper casing, should ideally happen in staging models to create downstream uniformity and improve downstream performance.

## SQL CAST function syntax in Snowflake, Databricks, BigQuery, and Redshift

Google BigQuery, Amazon Redshift, Snowflake, Postgres, and Databricks all support the ability to cast columns and data to different types. In addition, the syntax to cast is the same across all of them using the CAST function.

You may also see the CAST function replaced with a double colon (::), followed by the data type to convert to; `cast(order_id as string)` is the same thing as `order_id::string` in most data warehouses.

## CAST function use cases

You know at one point you’re going to need to cast a column to a different data type. But what are the scenarios folks run into that call for these conversions? At their core, these conversions need to happen because raw source data doesn’t match the analytics or business use case. This typically happens for a few reasons:

- Differences in needs or miscommunication from [backend developers](https://docs.getdbt.com/blog/when-backend-devs-spark-joy#signs-the-data-is-sparking-joy)
- <Term id="etl" /> tools [defaulting to certain data types](https://airbytehq.github.io/integrations/sources/google-sheets/)
- BI tools require certain fields to be specific data types

A key thing to remember when you’re casting data is the user experience in your end BI tool: are business users expecting `customer_id` to be filtered on 1 or '1'? What is more intuitive for them? If one `id` field is an integer, all `id` fields should be integers. Just like all data modeling, consistency and standardization is key when determining when and what to cast.