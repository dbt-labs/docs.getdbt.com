---
id: datepart
title: SQL DATE_PART
description: The DATE_PART function allows you to extract a specified date part from a date/time. Like most other SQL functions, you need to pass in arguments; for the DATE_PART function, you’ll pass in a date/timestamp/date field that you want to extract a date part from and specify the part you want removed.
slug: /sql-reference/datepart
---

<head>
    <title>Working with SQL DATEPART</title>
</head>

In this post, we’re going to give a deep dive into the DATE_PART function, how it works, and why we use it.

The DATE_PART function allows you to extract a specified date part from a date/time. For example, if you were to extract the month from the date February 14, 2022, it would return 2 since February is the second month in the year.

## How to use the DATE_PART function

Like most other SQL functions, you need to pass in arguments; for the DATE_PART function, you’ll pass in a date/timestamp/date field that you want to extract a date part from and specify the part you want removed. You can extract the numeric month, date, year, hour, seconds, etc. from a timestamp or date field) using the DATE_PART function using the following syntax:

`date_part(<date/time part>, <date field/date>)`

Let’s take a look at a practical example below.

### DATE_PART function example

```sql
select
	date_part('month', order_date) as order_month,
	round(avg(amount)) as avg_order_amount
from {{ ref('orders') }}
group by 1
```

This query using the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `orders` table will return the rounded order amount per each order month (represented as a numeric value):

| order_month | avg_order_amount |
|:---:|:---:|
| 1 | 17 |
| 2 | 15 |
| 3 | 18 |
| 4 | 17 |

Unlike the DATE_TRUNC function that actually truncates a date to its first instance of a given date part (so it maintains a date structure), the DATE_PART function returns a numeric value from a date field.

You may commonly see the DATE_PART function replaced with an EXTRACT function, which performs the same functionality.

## DATE_PART function syntax in Snowflake, Databricks, BigQuery, and Redshift

| Data warehouse | DATE_PART support? | Notes |
|:---:|:---:|:---:|
| Snowflake | ✅ |  |
| Databricks | ✅ |  |
| Amazon Redshift | ✅ |  |
| Google BigQuery | ❌ | BigQuery supports the EXTRACT function which performs the same functionality as the DATE_PART function |
| Postgres | ✅ | This is overly pedantic and you’ll likely never encounter an issue with DATE_PART and EXTRACT evaluating to differences in values that truly matter, but it’s worth noting. Postgres’ DATE_PART and EXTRACT functions would previously evaluate to the same output. However, with Postgres 14, the EXTRACT function now returns a numeric type instead of an 8-byte float. |

## DATE_PART function use cases

We most commonly see the DATE_PART or EXTRACT function used in data work to analyze:

- Fiscal calendars: If your business uses fiscal years, or calendars that differ from the normal 12-month cycle, DATE_PART functions can help create alignment between fiscal calendars and normal calendars
- Ad hoc analysis: The DATE_PART function are useful in ad hoc analyses and queries when you need to look at values grouped by date periods or for period comparisons

This isn’t an extensive list of where your team may be using the DATE_PART function throughout your dbt models and BI tool logic, but it contains some common scenarios analytics engineers face day-to-day.
