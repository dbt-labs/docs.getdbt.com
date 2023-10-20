---
id: datetrunc
title: SQL DATE_TRUNC
description: The DATE_TRUNC function will truncate a date or time to the first instance of a given date part. You can truncate to the weeks, months, years, or other date parts for a date or time field.
slug: /sql-reference/date-trunc
---

<head>
    <title>Working with the SQL DATE_TRUNC function</title>
</head>

In general, data people prefer the more granular over the less granular. [Timestamps > dates](https://docs.getdbt.com/blog/when-backend-devs-spark-joy#signs-the-data-is-sparking-joy), daily data > weekly data, etc.; having data at a more granular level always allows you to zoom in. However, you’re likely looking at your data at a somewhat zoomed-out level—weekly, monthly, or even yearly. To do that, you’re going to need a handy dandy function that helps you round out date or time fields.

The DATE_TRUNC function will truncate a date or time to the first instance of a given date part. Wordy, wordy, wordy! What does this really mean? If you were to truncate `2021-12-13` out to its month, it would return `2021-12-01` (the first day of the month).

Using the DATE_TRUNC function, you can truncate to the weeks, months, years, or other date parts for a date or time field. This can make date/time fields easier to read, as well as help perform cleaner time-based analyses.

Overall, it’s a great function to use to help you aggregate your data into specific date parts while keeping a date format. However, the DATE_TRUNC function isn’t your swiss army knife–it’s not able to do magic or solve all of your problems (we’re looking at you [star](https://getdbt.com/sql-foundations/star-sql-love-letter/)). Instead, DATE_TRUNC is your standard kitchen knife—it’s simple and efficient, and you almost never start cooking (data modeling) without it.

## How to use the DATE_TRUNC function​

For the DATE_TRUNC function, there are two arguments you must pass in:

- The date part: This is the days/months/weeks/years (level) you want your field to be truncated out to
- The date/time you want to be truncated

The DATE_TRUNC function can be used in [SELECT](/sql-reference/select) statements and [WHERE](/sql-reference/where) clauses.

Most, if not all, modern cloud data warehouses support some type of the DATE_TRUNC function. There may be some minor differences between the argument order for DATE_TRUNC across data warehouses, but the functionality very much remains the same.

Below, we’ll outline some of the slight differences in the implementation between some of the data warehouses.

## The DATE_TRUNC function in Snowflake and Databricks​

In [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/date_trunc.html) and [Databricks](https://docs.databricks.com/sql/language-manual/functions/date_trunc.html), you can use the DATE_TRUNC function using the following syntax:

```sql
date_trunc(<date_part>, <date/time field>)
```

In these platforms, the <date_part> is passed in as the first argument in the DATE_TRUNC function.

## The DATE_TRUNC function in Google BigQuery and Amazon Redshift​

In [Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions#date_trunc) and [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_DATE_TRUNC.html), the `<date_part>` is passed in as the first argument and the `<date/time field>` is the second argument:

```sql
date_trunc(<date/time field>, <date part>)
```

A note on BigQuery: BigQuery’s DATE_TRUNC function supports the truncation of date types, whereas Snowflake, Redshift, and Databricks’ `<date/time field>` can be a date or timestamp data type. BigQuery also supports DATETIME_TRUNC and TIMESTAMP_TRUNC functions to support truncation of more granular date/time types.

## A dbt macro to remember​

Why Snowflake, Amazon Redshift, Databricks, and Google BigQuery decided to use different implementations of essentially the same function is beyond us and it’s not worth the headache trying to figure that out. Instead of remembering if the `<date_part>` or the `<date/time field>` comes first, (which, let’s be honest, we can literally never remember) you can rely on a dbt Core macro to help you get away from finicky syntax.

With dbt v1.2, [adapters](https://docs.getdbt.com/docs/supported-data-platforms) now support [cross-database macros](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros) to help you write certain functions, like DATE_TRUNC and DATEDIFF, without having to memorize sticky function syntax.

Using the [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop/blob/main/models/orders.sql), a simple dataset and dbt project, you can truncate the `order_date` from the orders table using the [dbt DATE_TRUNC macro](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros#date_trunc):

```sql
select
   order_id,
   order_date,
   {{ date_trunc("week", "order_date") }} as order_week,
   {{ date_trunc("month", "order_date") }} as order_month,
   {{ date_trunc("year", "order_date") }} as order_year
from {{ ref('orders') }}
```

Running the above would product the following sample results:

| **order_id** | **order_date** | **order_week** | **order_month** | **order_year** |
|:---:|:---:|:---:|:---:|:---:|
| 1 | 2018-01-01 | 2018-01-01 | 2018-01-01 | 2018-01-01 |
| 70 | 2018-03-12 | 2018-03-12 | 2018-03-01 | 2018-01-01 |
| 91 | 2018-03-31 | 2018-03-26 | 2018-03-01 | 2018-01-01 |

The `order_week`, `order_month`, and `order_yea`r fields are the truncated values from the `order_date` field.