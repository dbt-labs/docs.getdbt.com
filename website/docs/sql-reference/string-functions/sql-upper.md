---
id: upper
title: SQL UPPER
description: Using the UPPER function on a string value will return the input as an all-uppercase string. It’s an effective way to create expected capitalization for certain string values across your data.
slug: /sql-reference/upper
---

<head>
    <title>Working with the SQL UPPER function</title>
</head>

UPPER is the counterpart to [LOWER](/sql-reference/lower) (who would have guessed?)—and they’re probably the most intuitive of SQL functions.

Using the UPPER function on a string value will return the input as an all-uppercase string. It’s an effective way to create expected capitalization for certain string values across your data.

## How to use the SQL UPPER function

 The syntax for using the UPPER function looks like the following:

```sql
upper(<string_column>)
```
Executing this command in a SELECT statement will return the uppercase version of the input string value. You may additionally use the UPPER function in WHERE clauses and on join values.

Below, we’ll walk through a practical example using the UPPER function.

### SQL UPPER function example

You can uppercase the first name of the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `customers` model using the following code:

```sql
select 
	customer_id,
	upper(first_name) as first_name,
	last_name
from {{ ref('customers') }}
```

After running this query, the `customers` table will look a little something like this:

| customer_id | first_name | last_name |
|---|---|---|
| 1 | MICHAEL | P. |
| 2 | SHAWN | M. |
| 3 | KATHLEEN | P. |

Now, all characters in the `first_name` are uppercase (and `last_name` are unchanged).

> Changing string columns to uppercase to create uniformity across data sources typically happens in our [dbt project’s staging models](https://docs.getdbt.com/guides/best-practices/how-we-structure/2-staging). There are a few reasons for that: data cleanup and standardization, such as aliasing, casting, and lower or upper casing, should ideally happen in staging models to create downstream uniformity and improve downstream performance.

## SQL UPPER function syntax in Snowflake, Databricks, BigQuery, and Redshift

Google BigQuery, Amazon Redshift, Snowflake, Postgres, and Databricks all support the UPPER function. In addition, the syntax to use the UPPER function is the same across all of them.

## UPPER function use cases

By creating a consistent capitalization format (upper or lowercase) for all string values in your data models, you therefore create some expectations for business users in your BI tool.
- Uppercase country codes in data sources to meet user expectations
- Create a consistent capitalization format for string values in your data models, also creating expectations for business users in your BI tool

There will most likely never be 100% consistency in your data models, but doing all that you can to mitigate that chaos will make your life and the life of your business users hopefully a little easier. Use the UPPER function to create a consistent casing for all strings in your data sources.
