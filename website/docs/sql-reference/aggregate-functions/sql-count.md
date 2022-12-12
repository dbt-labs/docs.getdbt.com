---
id: count
title: SQL COUNT
description: COUNT is an aggregate function that is used to return the count of rows of a specified field or all rows in a dataset. It is commonly used to get baseline statistical information of a dataset, help ensure primary keys are unique, and calculate business metrics.
slug: /sql-reference/count
---

<head>
    <title>Working with the SQL COUNT function</title>
</head>

COUNT is a SQL function you need to know how to use. Whether it’s in an ad hoc query, a data model, or in a BI tool calculation, you’ll be using the SQL COUNT function countless times (pun intended) in your data work.

To formalize it, COUNT is an aggregate function that is used to return the count of rows of a specified field (`count(<field_name>)`) or all rows in a dataset (`count(*)`). It is commonly used to get baseline statistical information of a dataset, help ensure primary keys are unique, and calculate business metrics.

## How to use SQL COUNT in a query

Use the following syntax to generate the aggregate count of a field:

`count(<field_name>)`

Since COUNT is an aggregate function, you’ll need a GROUP BY statement in your query if you’re looking at counts broken out by dimension(s). If you’re calculating the standalone counts of fields without the need to break them down by another field, you don’t need a GROUP BY statement.

Let’s take a look at a practical example using COUNT, DISTINCT, and GROUP BY below.

### COUNT example

```sql
select
	date_part('month', order_date) as order_month,
	count(order_id) as count_all_orders,
	count(distinct(customer_id)) as count_distinct_customers
from {{ ref('orders') }}
group by 1
```

:::note What dataset is this?
This example is querying from a sample dataset created by dbt Labs called [jaffle_shop](https://github.com/dbt-labs/jaffle_shop).
:::

This simple query is something you may do while doing initial exploration of your data; it will return the count of `order_ids` and count of distinct `customer_ids` per order month that appear in the Jaffle Shop’s `orders` table:

| order_month | count_all_orders | count_distinct_customers |
|:---:|:---:|:---:|
| 1 | 29 | 24 |
| 2 | 27 | 25 |
| 3 | 35 | 31 |
| 4 | 8 | 8 |

An analyst or analytics engineer may want to perform a query like this to understand the ratio of orders to customers and see how it changes seasonally.

## SQL COUNT syntax in Snowflake, Databricks, BigQuery, and Redshift

All modern data warehouses support the ability to use the COUNT function (and follow the same syntax!).

Some data warehouses, such as Snowflake and Google BigQuery, additionally support a COUNT_IF/COUNTIF function that allows you to pass in a boolean expression to determine whether to count a row or not.

## COUNT use cases

We most commonly see queries using COUNT to:
- Perform initial data exploration on a dataset to understand dataset volume, primary key uniqueness, distribution of column values, and more.
- Calculate the counts of key business metrics (daily orders, customers created, etc.) in your data models or BI tool.
- Define [dbt metrics](/docs/build/metrics) to aggregate key metrics.

This isn’t an extensive list of where your team may be using COUNT throughout your development work, dbt models, and BI tool logic, but it contains some common scenarios analytics engineers face day-to-day.