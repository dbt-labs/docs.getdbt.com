---
id: order-by
title: SQL ORDER BY
description: Read this guide to learn about the SQL ORDER BY clause in dbt.
slug: /sql-reference/order-by
---

<head>
    <title>Working with the SQL ORDER BY clause</title>
</head>

The ORDER BY clause allows you to specify the resulting row order for a query. In practice, you use the ORDER BY clause to indicate which field(s) you want to order by and in what type of order you want (ascending or descending). It’s useful to leverage during ad hoc analyses and for creating appropriate column values for partitioned rows in window functions.

## How to use the SQL ORDER BY clause

ORDER BY clauses have multiple use cases in analytics work, but we see it most commonly utilized to:
- Order a query or subquery result by a column or group of columns
- Appropriately order a subset of rows in a window function

To use the ORDER BY clause to a query or model, use the following syntax:

```sql
select
	column_1,
	column_2
from source_table
order by <field(s)> <asc/desc> --comes after FROM, WHERE, and GROUP BY statements
```
You can order a query result by multiple columns, represented by their column name or by their column number in the select statement (ex. `order by column_2 == order by 2`). You can additionally specify the ordering type you want (ascending or descending) to return the desired row order.

Let’s take a look at a practical example using ORDER BY.

### ORDER BY example

```sql
select
	date_trunc('month, order_date') as order_month,
	round(avg(amount)) as avg_order_amount
from {{ ref('orders') }}
group by 1
order by 1 desc
```

This query using the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `orders` table will return the rounded order amount per each order month in descending order:

| order_month | avg_order_amount |
|:---:|:---:|
| 2018-04-01 | 17 |
| 2018-03-01 | 18 |
| 2018-02-01 | 15 |
| 2018-01-01 | 17 |

## SQL ORDER BY syntax in Snowflake, Databricks, BigQuery, and Redshift

Since the ORDER BY clause is a SQL fundamental, data warehouses, including Snowflake, Databricks, Google BigQuery, and Amazon Redshift, all support the ability to add ORDER BY clauses in queries and window functions.

## ORDER BY use cases

We most commonly see the ORDER BY clause used in data work to:
- Analyze data for both initial exploration of raw data sources and ad hoc querying of [mart datasets](https://docs.getdbt.com/guides/best-practices/how-we-structure/4-marts)
- Identify the top 5/10/50/100 of a dataset when used in pair with a [LIMIT](/sql-reference/limit)
- (For Snowflake) Optimize the performance of large incremental models that use both a `cluster_by` [configuration](https://docs.getdbt.com/reference/resource-configs/snowflake-configs#using-cluster_by) and ORDER BY statement
- Control the ordering of window function partitions (ex. `row_number() over (partition by user_id order by updated_at)`)

This isn’t an extensive list of where your team may be using the ORDER BY clause throughout your dbt models, ad hoc queries, and BI tool logic, but it contains some common scenarios analytics engineers face day-to-day.
