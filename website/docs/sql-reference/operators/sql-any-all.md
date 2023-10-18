---
id: any-all
title: SQL ANY and ALL
description: The ANY operator will return true if any of the conditions passed into evaluate to true, while ALL will only return true if all conditions passed into it are true.
slug: /sql-reference/any-all
---

<head>
    <title>Working with the SQL ANY and ALL operators</title>
</head>

The SQL ANY and ALL operators are useful for evaluating conditions to limit query results; they are often passed in with [LIKE](/sql-reference/like) and [ILIKE](/sql-reference/ilike) operators. The ANY operator will return true if any of the conditions passed into evaluate to true, while ALL will only return true if *all* conditions passed into it are true.

Use this page to better understand how to use ANY and ALL operators, use cases for these operators, and which data warehouses support them.

## How to use the SQL ANY and ALL operators

The ANY and ALL operators have very simple syntax and are often passed in the LIKE/ILIKE operator or <Term id="subquery" />:

`where <field_name> like/ilike any/all (array_of_options)`

`where <field_name> = any/all (subquery)`

Some notes on this operator’s syntax and functionality:
- You may pass in a subquery into the ANY or ALL operator instead of an array of options
- Use the ILIKE operator with ANY or ALL to avoid case sensitivity

Let’s dive into a practical example using the ANY operator now.

### SQL ANY example

```sql
select
    order_id,
    status
from {{ ref('orders') }}
where status like any ('return%', 'ship%')
```

This simple query using the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `orders` table will return orders whose status is like the patterns `start with 'return'` or `start with 'ship'`:

| order_id | status |
|:---:|:---:|
| 18 | returned |
| 23 | return_pending |
| 74 | shipped |

Because LIKE is case-sensitive, it would not return results in this query for orders whose status were say `RETURNED` or `SHIPPED`. If you have a mix of uppercase and lowercase strings in your data, consider standardizing casing for strings using the [UPPER](/sql-reference/upper) and [LOWER](/sql-reference/lower) functions or use the more flexible ILIKE operator.

## ANY and ALL syntax in Snowflake, Databricks, BigQuery, and Redshift

Snowflake and Databricks support the ability to use ANY in a LIKE operator. Amazon Redshift and Google BigQuery, however, do not support the use of ANY in a LIKE or ILIKE operator. Use the table below to read more on the documentation for the ANY operator in your data warehouse.

| **Data warehouse** | **ANY support?** | **ALL support?** |
|:---:|:---:|:---:|
| [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/like_any.html) | ✅ | ✅ |
| [Databricks](https://docs.databricks.com/sql/language-manual/functions/like.html) | ✅ | ✅ |
| Amazon Redshift | ❌Not supported; consider utilizing multiple OR clauses or [IN operators](/sql-reference/in). | ❌Not supported; consider utilizing multiple [AND clauses](/sql-reference/and) |
| Google BigQuery | ❌Not supported; consider utilizing [multiple OR clauses](https://stackoverflow.com/questions/54645666/how-to-implement-like-any-in-bigquery-standard-sql) or IN operators. | ❌Not supported; consider utilizing multiple AND clauses |