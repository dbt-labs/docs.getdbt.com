---
id: strings
title: SQL Strings
description: Strings in SQL are words or combination of characters that you’ll typically see encased in single quotes (ex. 'Jaffle Shop', '1234 Shire Lane', 'Plan A').
slug: /sql-reference/strings
---

<head>
    <title>Working with the SQL Strings</title>
</head>

We can almost guarantee that there is not a single dbt model or table in your database that doesn’t have at least one column of a string type.

Strings are everywhere in data—they allow folks to have descriptive text field columns, use regex in their data work, and honestly, they just make the data world go ‘round.

Below, we’ll unpack the different string formats you might see in a modern cloud data warehouse and common use cases for strings.

## Using SQL strings

Strings are inherent in your data—they’re the name fields that someone inputs when they sign up for an account, they represent the item someone bought from your ecommerce store, they describe the customer address, and so on.

To formalize it a bit, a string type is a word, or the combination of characters that you’ll typically see encased in single quotes (ex. 'Jaffle Shop', '1234 Shire Lane', 'Plan A').

Most often, when you’re working with strings in a dbt model or query, you’re:

- Changing the casing (uppering/lowering) to create some standard for your string type columns in your data warehouse
- Concatenating strings together to create more robust, uniform, or descriptive string values
- Unnesting <Term id="json" /> or more complex structured data objects and converting those values to explicit strings
- Casting a column of a different type to a string for better compatibility or usability in a BI tool
- Filtering queries on certain string values
- Creating a new string column type based off a CASE WHEN statement to bucket data by
- Splitting a string into a substring

This is not an exhaustive list of string functionality or use cases, but contains some common scenarios analytics engineers face day-to-day.

### Strings in an example query

```sql
select
	date_trunc('month', order_date)::string as order_month,
	round(avg(amount)) as avg_order_amount
from {{ ref('orders') }}
where status not in ('returned', 'return_pending')
group by 1
```

This query using the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `orders` table will return the order month as a string and rounded order amount for only orders with statuses not equal to `returned` or `pending` string values:

| order_month | avg_order_amount |
|:---:|:---:|
| 2018-01-01 | 18 |
| 2018-02-01 | 15 |
| 2018-03-01 | 18 |
| 2018-04-01 | 17 |

## String support in Snowflake, Databricks, BigQuery, and Redshift

Snowflake, Databricks, Google BigQuery, and Amazon Redshift all support the string [data type](/sql-reference/data-types#string-data-types). They may have slightly varying sub-types for strings; some data warehouses such as Snowflake and Redshift support text, char, and character string types which typically differ in byte length in comparison to the generic string type.

Again, since most string type columns are inherent in your data, you’ll likely be ok using generic varchar or strings for casting, but it never hurts to read up on the docs specific to your data warehouse string support!
