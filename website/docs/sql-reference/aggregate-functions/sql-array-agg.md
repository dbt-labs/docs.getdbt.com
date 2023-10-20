---
id: array-agg
title: SQL ARRAY_AGG
description: The ARRAY_AGG function allows you to create an array of multiple data values in SQL.
slug: /sql-reference/array-agg
---

<head>
    <title>Working with the SQL ARRAY_AGG function</title>
</head>

In any typical programming language such as Python or Javascript, arrays are typically innate and bountiful; when you’re processing data in SQL, arrays are a little less common but are a handy way to provide more structure to your data.

To create an array of multiple data values in SQL, you’ll likely leverage the ARRAY_AGG function (short for *array aggregation*), which puts your input column values into an array.

## How to use SQL ARRAY_AGG

The ARRAY_AGG function has the following syntax:

`array_agg( [distinct] <field_name>) [within group (<order_by field>) over ([partition by <field>])`

A few notes on the functionality of this function:
- Most of the example syntax from above is optional, meaning the ARRAY_AGG function can be as simple as `array_agg(<field_name>)` or used as a more complex as a window function
- [DISTINCT](/sql-reference/distinct) is an optional argument that can be passed in, so only distinct values are in the return array
- If input column is empty, the returning array will also be empty
- Since the ARRAY_AGG is an aggregate function (gasp!), you’ll need a GROUP BY statement at the end of your query if you’re grouping by certain field
- ARRAY_AGG and similar aggregate functions can become inefficient or costly to compute on large datasets, so use ARRAY_AGG wisely and truly understand your use cases for having arrays in your datasets

Let’s dive into a practical example using the ARRAY_AGG function.

### SQL ARRAY_AGG example

```sql
select
    date_trunc('month', order_date) as order_month,
    array_agg(distinct status) as status_array
from  {{ ref('orders') }}
group by 1
order by 1
```

This simple query using the sample dataset [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `orders` table is returning a new column of distinct order statuses by order month:

| order_month | status_array |
|:---:|:---:|
| 2018-01-01 | [ "returned", "completed", "return_pending" ] |
| 2018-02-01 | [ "completed", "return_pending" ] |
| 2018-03-01 | [ "completed", "shipped", "placed" ] |
| 2018-04-01 | [ "placed" ] |

Looking at the query results—this makes sense! We’d expect newer orders to likely not have any returns, and older orders to have completed returns.

## SQL ARRAY_AGG syntax in Snowflake, Databricks, BigQuery, and Redshift

[Snowflake](https://docs.snowflake.com/en/sql-reference/functions/array_agg.html), [Databricks](https://docs.databricks.com/sql/language-manual/functions/array_agg.html), and [BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/aggregate_functions#array_agg) all support the ARRAY_AGG function. Redshift, however, supports an out-of-the-box [LISTAGG function](https://docs.aws.amazon.com/redshift/latest/dg/r_LISTAGG.html) that can perform similar functionality to ARRAY_AGG. The primary difference is that LISTAGG allows you to explicitly choose a delimiter to separate a list whereas arrays are naturally delimited by commas.

## ARRAY_AGG use cases

There are definitely too many use cases to list out for using the ARRAY_AGG function in your dbt models, but it’s very likely that ARRAY_AGG is used pretty downstream in your <Term id="dag" /> since you likely don’t want your data so bundled up earlier in your DAG to improve modularity and <Term id="dry">dryness</Term>. A few downstream use cases for ARRAY_AGG:

- In [`export_` models](https://www.getdbt.com/open-source-data-culture/reverse-etl-playbook) that are used to send data to platforms using a <Term id="reverse-etl" /> tool to pair down multiple rows into a single row. Some downstream platforms, for example, require certain values that we’d usually keep as separate rows to be one singular row per customer or user. ARRAY_AGG is handy to bring multiple column values together by a singular id, such as creating an array of all items a user has ever purchased and sending that array downstream to an email platform to create a custom email campaign.
- Similar to export models, you may see ARRAY_AGG used in [mart tables](https://docs.getdbt.com/guides/best-practices/how-we-structure/4-marts) to create final aggregate arrays per a singular dimension; performance concerns of ARRAY_AGG in these likely larger tables can potentially be bypassed with use of [incremental models in dbt](https://docs.getdbt.com/docs/build/incremental-models).
