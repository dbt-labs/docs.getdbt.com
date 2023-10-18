---
id: between
title: SQL BETWEEN
description: The SQL BETWEEN condition allows you to specify a range of numerical, date-type, or text values to filter rows on in a query.
slug: /sql-reference/between
---

<head>
    <title>Working with the SQL BETWEEN operator</title>
</head>

The SQL BETWEEN condition allows you to specify a range of numerical, date-type, or text values to filter rows on in a query. It’s particularly useful during ad hoc analysis work to narrow query results on a specific data range.

In this page, we’ll dive into how to use the SQL BETWEEN condition and elaborate on why it might be useful to you.

## How to use the SQL BETWEEN condition

The BETWEEN condition has a simple syntax and should be passed in a WHERE clause:

`where <field_name> between <beginning_value> and <end_value>`

It’s important to note that the BETWEEN condition is inclusive of `beginning_value` and `end_value`.

Let’s take a look at a practical example using the BETWEEN condition  below.

### SQL BETWEEN example

```sql
select
    customer_id,
    order_id,
    order_date
from {{ ref('orders') }}
where order_date between '2018-01-01' and '2018-01-31'
```

This simple query using the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `orders` table  will return all rows where the `order_date` falls during January 2018:

| **customer_id** | **order_id** | **order_date** |
|:---:|:---:|:---:|
| 1 | 1 | 2018-01-01 |
| 3 | 2 | 2018-01-02 |
| 94 | 3 | 2018-01-04 |
| 50 | 4 | 2018-01-05 |
| 64 | 5 | 2018-01-05 |
| 54 | 6 | 2018-01-07 |

Alternatively, you could build this same query using >/= operators (`where order_date >= 2018-01-01' and order_date <= '2018-01-31'` or `where order_date >= '2018-01-01' and order_date < '2018-02-01'`).

You may additionally see the NOT clause used in front of BETWEEN to exclude rows that fall between specified ranges.

## BETWEEN syntax in Snowflake, Databricks, BigQuery, and Redshift

Most, if not all, modern data warehouses support the BETWEEN condition; the syntax is also the same across them. If your data warehouse does not support the BETWEEN condition, consider using the >/= operators similar to the example outlined above.

Use the table below to read more on the documentation for the BETWEEN operator in your data warehouse.

| **Data warehouse** | **BETWEEN support?** |
|:---:|:---:|
| Snowflake | ✅ |
| Databricks | ✅ |
| Amazon Redshift | ✅ |
| Google BigQuery | ✅ |

## SQL BETWEEN condition use cases

You’ll most commonly see the BETWEEN condition used in data work to:
- Filter query results to be in a specified date range
- Create buckets for data using case statements, common for bucketing web session engagement or NPS score classification

```sql
case when time_engaged between 0 and 9 then 'low_engagement'
     when time_engaged between 10 and 29 then 'medium_engagement'
     else 'high_engagement' end as engagement
```

This isn’t an extensive list of where your team may be using the BETWEEN condition throughout your dbt models or ad hoc analyses, but contains some common scenarios analytics engineers may encounter.