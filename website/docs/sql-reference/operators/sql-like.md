---
id: like
title: SQL LIKE
description: The LIKE operator helps you easily match, find, and filter out case-sensitive string values of a specified pattern by using SQL wildcards.
slug: /sql-reference/like
---

<head>
    <title>Working with the SQL LIKE operator</title>
</head>

The LIKE operator helps you easily match, find, and filter out string values of a specified pattern by using SQL wildcards. Important to note that the pattern passed into the LIKE operator is case-sensitive, unlike its case-insensitive cousin, [ILIKE](/sql-reference/ilike).

## How to use the SQL LIKE operator

The LIKE operator has a simple syntax, with the ability to have it utilized in [WHERE clauses](/sql-reference/where) or case statements:

`where <field_name> like '<pattern>'` or `case when <field_name> like '<pattern>'`

Some notes on this operator’s syntax and functionality:
- The `<pattern>` can use two SQL wildcards (`%` and ` _`); the underscore will match any *single character* and the % matches zero or more characters
    - Ex. '%J' = any string that ends with a capital J
    - Ex. 'J%' = any string that starts with a capital J
    - Ex. 'J%L' = any string that starts with a capital J and ends with a capital L
    - Ex. '_J%' = any string that has a capital J in the second position
- Majority of use cases for the LIKE operator will likely involve the `%` wildcard
- The LIKE operator is case-sensitive, meaning that the casing in the `<pattern>` you want to filter for should match the same-case in your column values; for columns with varied casing, leverage the case-insensitive ILIKE operator
- The LIKE operator can be paired with the NOT operator, to filter on rows that are not like a specified pattern

Let’s dive into a practical example using the LIKE operator now.

### SQL LIKE example

```sql
select
    user_id,
    first_name
from {{ ref('customers') }}
where first_name like 'J%'
order by 1
```

This simple query using the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `customers` table  would return all of the customers whose first name starts with the *uppercase* letter J:

| **customer_id** | **first_name** |
|:---:|:---:|
| 1 | Julia |
| 4 | Jeremy |

Because LIKE is case-sensitive, it would not return results in this query for customers with lowercase J-names. If you have a mix of uppercase and lowercase strings in your data, consider standardizing casing for strings using the [UPPER](/sql-reference/upper) and [LOWER](/sql-reference/lower) functions or use the more flexible [ILIKE operator](/sql-reference/ilike).

## LIKE syntax in Snowflake, Databricks, BigQuery, and Redshift

Most, if not all, modern data warehouses support the LIKE operator and the syntax is also the same across them. Some data warehouses, such as Snowflake and Databricks, additionally support similar or more flexible operators such as ILIKE, the case-insensitive version of LIKE, or LIKE ANY, which allows you to pass in multiple pattern options to scan for.

Use the table below to read more on the documentation for the LIKE operator in your data warehouse.

| **Data warehouse** | **LIKE support?** |
|:---:|:---:|
| Snowflake | ✅ |
| Databricks | ✅ |
| Amazon Redshift | ✅ |
| Google BigQuery | ✅ |

## LIKE operator example use cases

You may see the LIKE operator used in analytics engineering work to:
- Bucket column values together based on general requirements using case statements and the LIKE operator (ex. `case when page_path like '/product%' then 'product_page' else 'non_product_page'`)
- Filter out employee email records based on a similar email address pattern (ex. `where email_address not like '%@dbtlabs.com'`)

This isn’t an extensive list of where your team may be using the LIKE operator throughout your dbt models, but contains some common scenarios analytics engineers face day-to-day.