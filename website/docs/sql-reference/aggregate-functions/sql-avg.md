---
id: avg
title: SQL AVG
description: The AVG function is used to calculate the simple average of a numeric column, but you may also see it used in a window function to calculate rolling averages.
slug: /sql-reference/avg
---

<head>
    <title>Working with the SQL AVG function</title>
</head>

You’re a data person, so we assume you’re going to be calculating averages of some metrics \**waves hands airily*\* at some point in your career. And the way to calculate averages of a numeric column in SQL is by using the AVG function.

## How to use the AVG function

The AVG function is a part of the group of mathematical or aggregate functions (ex. MIN, MAX, SUM) that are often used in SQL to summarize datasets. You’ll most likely see the AVG function used to straightforwardly calculate the average of a numeric column, but you may also see it used in a window function to calculate rolling averages.

### AVG function example

```sql
select
	date_trunc('month', order_date) as order_month,
	round(avg(amount)) as avg_order_amount
from {{ ref('orders') }}
where status not in ('returned', 'return_pending')
group by 1
```

:::note What dataset is this?
This example is querying from a sample dataset created by dbt Labs called [jaffle_shop](https://github.com/dbt-labs/jaffle_shop).
:::

This query using the Jaffle Shop’s `orders` table will return the rounded order amount per each order month:

| order_month | avg_order_amount |
|:---:|:---:|
| 2018-01-01 | 18 |
| 2018-02-01 | 15 |
| 2018-03-01 | 18 |
| 2018-04-01 | 17 |

The AVG function, like many other mathematical functions, is an aggregate function. Aggregate functions operate across all rows, or a group of rows, to return a singular value. When calculating the average of a column across a dimension (or group of dimensions)—in our example above, `order_month`—you need a GROUP BY statement; the query above would not successfully run without it.

## SQL AVG function syntax in Snowflake, Databricks, BigQuery, and Redshift

Snowflake, Databricks, Google BigQuery, and Amazon Redshift all support the ability to take the average of a column value and the syntax for the AVG functions is the same across all of those data platforms.

## AVG function use cases

We most commonly see the AVG function used in data work to calculate:
- The average of key metrics (ex. Average CSAT, average lead time, average order amount) in downstream [fact or dim models](https://docs.getdbt.com/guides/best-practices/how-we-structure/4-marts)
- Rolling or moving averages (ex. 7-day, 30-day averages for key metrics) using window functions
- Averages in [dbt metrics](https://docs.getdbt.com/docs/build/metrics)

This isn’t an extensive list of where your team may be using the AVG function throughout your dbt models and BI tool logic, but contains some common scenarios analytics engineers face in their day-to-day.
