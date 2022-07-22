---
title: "COALESCE SQL function: Why we love it"
description: "The COALESCE SQL function is an incredibly useful function that allows you to fill in unhelpful blank values that may show up in your data."
slug: coalesce-sql-love-letter

authors: [kira_furuichi]

tags: [SQL Magic]
hide_table_of_contents: false

date: 2022-05-08
is_featured: false
---

It’s inevitable in the field of analytics engineering: you’re going to encounter moments when there’s mysterious or unhelpful blank values in your data. Null values surely have their time and place, but when you need those null values filled with more meaningful data, COALESCE comes to the rescue.

COALESCE is an incredibly useful function that allows you to fill in unhelpful blank values that may show up in your data. In the words of analytics engineer [Lauren Benezra](https://docs.getdbt.com/author/lauren_benezra), you will probably almost never see a data model that doesn’t use COALESCE somewhere.

<!--truncate-->

> **What is a SQL Function?**
> At a high level, a function takes an input (or multiple inputs) and returns a manipulation of those inputs. Some common SQL functions are [EXTRACT](https://docs.getdbt.com/blog/extract-sql-love-letter/), [LOWER](https://docs.getdbt.com/blog/lower-sql-love-letter/), and [DATEDIFF](https://docs.getdbt.com/blog/datediff-sql-love-letter/). For example, the LOWER function takes a string value and returns an all lower-case version of that input string.

## How to use the COALESCE function

In formal terms, using the COALESCE function on a series of values will return the first non-null value. 

The general syntax for using the COALESCE function looks like the following:

```sql
coalesce(<input_1>, <input_2>,...<input_n>)
```

You can have as many input values/columns to the COALESCE function as you like, but remember: order is important here since the first non-null value is the one that is returned. In practice, you’ll likely only ever use the COALESCE function with two inputs: a column and the value you want to fill null values of that column with.

> **See it in action:**
> The COALESCE function is used in the [surrogate_key](https://docs.getdbt.com/blog/sql-surrogate-keys) macro to replace null column values.

### Data warehouse support for the COALESCE function

Most, if not all, modern data warehouses support the COALESCE function; [Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/conditional_expressions#coalesce), [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_COALESCE.html), [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/coalesce.html), [Postgres](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-coalesce/), and [Databricks](https://docs.databricks.com/sql/language-manual/functions/coalesce.html) all support the COALESCE function. In addition, the syntax to use COALESCE is the same across all of them.

## COALESCE SQL function example

Let’s look at an actual example using COALESCE. Below, we have an `orders` <Term id="table" /> with three column values: an `order_id`, `order_date`, and `order_status`.

| **order_id** | **order_date** | **order_status** |
| ------------ | -------------- | ---------------- |
| 12389        | 2022-01-02     |                  |
| 34553        | 2020-04-23     | returned         |
| 78411        | 2022-06-06     |                  |

If you do a little exploration on this table, you would see that there are only two unique values for `order_status`: NULL and `returned`. As we said before, null values have their time and place, but if you first look at this table, the null value for an order could mean many things–has the order been processed? Was the order successful? 

In this `orders` table, you can assume here that any NULL `order_status` value means that the order was not returned. To make this more clear to anyone who looks at this table, you can utilize a COALESCE function to return a newer, more readable `order_status`.

```sql
select
	order_id,
	order_date,
	coalesce(order_status, 'not_returned') as order_status
from {{ ref('orders') }}
```

Running this query would return the following:

| **order_id** | **order_date** | **order_status** |
| ------------ | -------------- | ---------------- |
| 12389        | 2022-01-02     | not_returned     |
| 34553        | 2020-04-23     | returned         |
| 78411        | 2022-06-06     | not_returned     |

Now, there are no null values in the `order_status` column since any null value was replaced by a `not_returned` string. Order 34553’s `order_status` remained unchanged because its original `order_status` was the first non-null value passed in the COALESCE function. By providing more context into what these null values mean, anyone who looks at this table can quickly understand the order status for a specific order.

> **To replace or not to replace:**
> COALESCE has a straightforward use case—fill missing values with values you specify—but you also want to ensure you’re not changing non-empty values when using it. This is where the order of the input values to the COALESCE function are important: from left to right, the first non-null value is the one that’s returned.

## Why we love it

We checked our data team’s dbt project, and we used the COALESCE function over 100 times. We like the COALESCE function so much we named the [annual data conference on analytics engineering](https://coalesce.getdbt.com/) after it.

At its core, the COALESCE function is an efficient way to fill in missing column values with values you specify. You can additionally use COALESCE across most, if not all, modern data warehouses and there’s [no tricky cross-database syntax like there is for DATEADD](https://docs.getdbt.com/blog/sql-dateadd).

Thank you COALESCE for always finding our moments of emptiness, and filling them with valuable stuff.
