---
id: concat
title: SQL CONCAT
description: The CONCAT function allows analytics engineers to join multiple string values in a query.
slug: /sql-reference/concat
---

<head>
    <title>Working with the SQL CONCAT</title>
</head>

There is no better or simpler way to join multiple string values in a query than by using the CONCAT function. Full stop.

It’s a straightforward function with pretty straightforward use cases. Use this page to understand how to use the CONCAT function in your data warehouse and why analytics engineers use it throughout their dbt models.

## How to use the CONCAT function

Using the CONCAT function is pretty straightforward: you’ll pass in the strings or binary values you want to join together in the correct order into the CONCAT function. You can pass in as many expressions into the CONCAT function as you would like.

### CONCAT function example

```sql
select
	user_id,
	first_name,
	last_name,
	concat(first_name, ' ', last_name) as full_name
from {{ ref('customers') }}
limit 3
```

This query using the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `customers` table will return results like this with a new column of the combined `first_name` and `last_name` field with a space between them:

| user_id | first_name | last_name | full_name |
|:---:|:---:|:---:|:---:|
| 1 | Michael | P. | Michael P. |
| 2 | Shawn | M. | Shawn M. |
| 3 | Kathleen | P. | Kathleen P. |

## CONCAT function syntax in Snowflake, Databricks, BigQuery, and Redshift

Snowflake, Databricks, Google BigQuery, and Amazon Redshift all support the CONCAT function with the syntax looking the same in each platform. You may additionally see the CONCAT function represented by the `||` operator (ex. `select first_name || last_name AS full_name from {{ ref('customers') }}`) which has the same functionality as the CONCAT function in these data platforms.

## CONCAT use cases

We most commonly see concatenation in SQL for strings to:

- Join together address/geo columns into one field
- Add hard-coded string values to columns to create clearer column values
- Create <Term id="surrogate-key">surrogate keys</Term> using a hashing method and multiple column values (ex. `md5(column_1 || column_2) as unique_id`

This isn’t an extensive list of where your team may be using CONCAT throughout your data work, but it contains some common scenarios analytics engineers face day-to-day.