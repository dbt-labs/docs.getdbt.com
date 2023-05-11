---
id: where
title: SQL WHERE
description: Read this guide to learn about the SQL WHERE clause in dbt.
slug: /sql-reference/where
---

<head>
    <title>Working with the SQL WHERE clause</title>
</head>

If the humble [SELECT statement](/sql-reference/select) is an analytics engineer kitchen knife, the WHERE clause is the corresponding knife sharpener: no (good) cooking (or data modeling) is happening without it.

The WHERE clause is a fundamental SQL statement—it allows you to appropriately filter your data models and queries, so you can look at specific subsets of data based on your requirements.

## How to use the SQL WHERE clause

The syntax for using WHERE clause in a SELECT statement looks like the following:

```sql
select
	order_id,
	customer_id,
	amount
from {{ ref('orders') }}
where status != 'returned'
```

In this query, you’re filtering for any order from the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `orders` model whose status is not `returned` by adding a WHERE clause after the FROM statement. You could additionally filter on string, numeric, date, or other data types to meet your query conditions.

You will likely see WHERE clauses show up 99.99%  of the time in a typical query or dbt model. The other .01% is probably in a <Term id="dml" />  statement, such as DELETE or ALTER, to modify specific rows in tables.

## SQL WHERE clause syntax in Snowflake, Databricks, BigQuery, and Redshift

Since the WHERE clause is a SQL fundamental, Google BigQuery, Amazon Redshift, Snowflake, and Databricks all support the ability to filter queries and data models using it. In addition, the syntax to round is the same across all of them using the WHERE clause.

## SQL WHERE clause use cases

WHERE clauses are probably some of the most widely used SQL capabilities, right after SELECT and FROM statements. Below is a non-exhaustive list of where you’ll commonly see WHERE clauses throughout dbt projects and data work:
- Removing source-deleted rows from staging models to increase accuracy and improve downstream model performance
- Filtering out employee records from models
- Performing ad-hoc analysis on specific rows or users, either in a dbt model, BI tool, or ad-hoc query
- Paired with IN, LIKE, NOT IN clauses to create more generalized or a group of specific requirements to filter on
