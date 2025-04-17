---
id: rank
title: SQL RANK
description: The RANK function returns the rank of a value (starting at 1) in an ordered group or dataset.
slug: /sql-reference/rank
---

<head>
    <title>Working with the SQL RANK</title>
</head>

There are many different ranking window functions…[ROW_NUMBER](/sql-reference/row-number), DENSE_RANK, RANK. Let’s start off with the most basic (RANK) and talk about what it is, how to use it, and why it’s important in analytics engineering work.

The RANK function is an effective way to create a ranked column or filter a query based on rankings. More specifically, the RANK function returns the rank of a value (starting at 1) in an ordered group or dataset. It's important to note that if multiple values executed by the rank function are the same, they’ll have the same rank.

## How to use the RANK function

The RANK function has a pretty simple syntax, with an optional partition field and support for ordering customization:

`rank() over ([partition by <field(s)>] order by field(s) [asc | desc])`

Some notes on this function’s syntax:

- The `partition by` field is optional; if you want to rank your entire dataset by certain fields (compared to partitioning *and ranking* within a dataset), you would simply omit the `partition by` from the function call (see the example below for this).
- By default, the ordering of a ranking function is set to ascending. To explicitly make the ordering in a descending order, you’ll need to pass in `desc` to the `order by` part of the function.

Let’s take a look at a practical example using the RANK function below.

### RANK function example

```sql
select
	order_id,
	order_date,
	rank() over (order by order_date) as order_rank
from {{ ref('orders') }}
```

This simple query using the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `orders` table will return the rank of orders by their `order_date`:

| order_id | order_date | order_rank |
|:---:|:---:|:---:|
| 1 | 2018-01-01 | 1 |
| 2 | 2018-01-02 | 2 |
| 3 | 2018-01-04 | 3 |
| 4 | 2018-01-05 | 4 |
| 5 | 2018-01-05 | 4 |
| 6 | 2018-01-07 | 6 |

Some notes on these results:

- Orders that have the same `order_date`(ex. Orders 4 and 5) have the same `order_rank` (4). 
- Order 6’s `order_rank` is 6 (if you wanted the rank to execute to 5, you would use the DENSE_RANK function).

:::tip Ranking functions to know
RANK is just one of the ranking functions that analytics engineering practitioners will use throughout their data models. There’s also DENSE_RANK and [ROW_NUMBER](/sql-reference/row-number) which rank rows differently than RANK.
:::

## RANK syntax in Snowflake, Databricks, BigQuery, and Redshift

Most, if not all, modern data warehouses support RANK and other similar ranking functions; the syntax is also the same across them. Use the table below to read more on the documentation for the RANK function in your data warehouse.

| Data warehouse | RANK support? |
|:---:|:---:|
| Snowflake | ✅ |
| Databricks | ✅ |
| Amazon Redshift | ✅ |
| Google BigQuery | ✅ |

## RANK function use cases

We most commonly see the RANK function used in data work to:

- In [SELECT statements](/sql-reference/select) to add explicit ranking to rows
- In QUALIFY statements to filter a query on a ranking without having to add the rank to the query result

This isn’t an extensive list of where your team may be using the RANK function throughout your dbt models and BI tool logic, but contains some common scenarios analytics engineers face in a day-to-day.
