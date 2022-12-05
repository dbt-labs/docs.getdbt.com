---
id: min 
title: SQL MIN 
description: The MIN aggregate function allows you to compute the minimum value from a column or across a set of rows for a column.
slug: /sql-reference/min
---

<head>
    <title>Working with SQL MIN</title>
</head>

SQL MIN, MAX, SUM…the aggregate functions that you’ll live and die by as an analytics practitioner. In this post, we’re going to unpack the SQL MIN function, how to use it, and why it's valuable in data work.

The MIN aggregate function allows you to compute the minimum value from a column or across a set of rows for a column. The results from the MIN function are useful for understanding the distribution of column values and determining the first timestamps of key events.

## How to use the MIN function in a query

Use the following syntax in a query to find the minimum value of a field:

`min(<field_name>)`

Since MIN is an aggregate function, you’ll need a GROUP BY statement in your query if you’re looking at counts broken out by dimension(s). If you’re calculating the standalone minimum of fields without the need to break them down by another field, you don’t need a GROUP BY statement.

MIN can also be used as a window function to operate across specified or partitioned rows.

Let’s take a look at a practical example using MIN below.

### MIN example

```sql
select
	customer_id,
	min(order_date) as first_order_date,
	max(order_date) as last_order_date
from {{ ref('orders') }}
group by 1
limit 3
```

:::note What dataset is this?
This example is querying from a sample dataset created by dbt Labs called [jaffle_shop](https://github.com/dbt-labs/jaffle_shop).
:::

This simple query is returning the first and last order date for a customer in the Jaffle Shop’s `orders` table:

| customer_id | first_order_date | last_order_date |
|:---:|:---:|:---:|
| 1 | 2018-01-01 | 2018-02-10 |
| 3 | 2018-01-02 | 2018-03-11 |
| 94 | 2018-01-04 | 2018-01-29 |

## SQL MIN function syntax in Snowflake, Databricks, BigQuery, and Redshift

All modern data warehouses support the ability to use the MIN function (and follow the same syntax).

## MIN function use cases

We most commonly see queries using MIN to:
- Perform initial data exploration on a dataset to understand the distribution of column values.
- Identify the first timestamp for key events (ex. `min(login_timestamp_utc) as first_login`).

This isn’t an extensive list of where your team may be using MIN throughout your development work, dbt models, and BI tool logic, but it contains some common scenarios analytics engineers face day-to-day.