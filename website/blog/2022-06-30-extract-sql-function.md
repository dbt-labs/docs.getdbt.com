---
title: "EXTRACT SQL function: Why we love it"
description: "In this post, we’re going to give a deep-dive into the EXTRACT function, how it works, and why we use it. The EXTRACT function allows you to extract a specified date part from a date/time. "
slug: extract-sql-love-letter

authors: [kira_furuichi]

tags: [SQL Magic]
hide_table_of_contents: false

date: 2022-05-15
is_featured: false
---
There are so many different date functions in SQL—you have [DATEDIFF](https://docs.getdbt.com/blog/datediff-sql-love-letter/), [DATEADD](https://docs.getdbt.com/blog/sql-dateadd), DATE_PART, and [DATE_TRUNC](https://docs.getdbt.com/date-trunc-sql) to name a few. They all have their different use cases and understanding how and when they should be used is a SQL fundamental to get down. Are any of those as easy to use as the EXTRACT function? Well, that debate is for another time…

In this post, we’re going to give a deep dive into the EXTRACT function, how it works, and why we use it.

<!--truncate-->

The EXTRACT function allows you to extract a specified date part from a date/time. For example, if you were to extract the month from the date February 14, 2022, it would return 2 since February is the second month in the year.

> **What is a SQL function?**
> At a high level, a function takes an input (or multiple inputs) and returns a manipulation of those inputs. Some common SQL functions are [COALESCE](https://docs.getdbt.com/blog/coalesce-sql-love-letter/), [LOWER](https://docs.getdbt.com/blog/lower-sql-love-letter/) and [DATEDIFF](https://docs.getdbt.com/blog/datediff-sql-love-letter/). For example, the COALESCE function takes a group of values and returns the first non-null value from that group.

## How to use the EXTRACT function

One of our favorite things about the EXTRACT function is how readable it is. Sometimes you may encounter SQL functions and not immediately understand what the arguments are and what the expected output should be. (We’re looking at you, SPLIT_PART.) The EXTRACT function isn’t like that.

To use the EXTRACT function, you’ll simply specify the date part you want extracted out and the field you want to extract from. You can extract many different date parts, but you’ll most commonly see year, month, week of year, or quarter extracted from a date.

```yaml
extract(<date_part> from <date/time field>)
```

Depending on the data warehouse you use, the value returned from an EXTRACT function is often a numeric value or the same date type as the input `<date/time field>`. Read the [documentation for your data warehouse](#data-warehouse-support-for-extract-function) to better understand EXTRACT outputs.

> **Note:**
> You may additionally see a comma used in place of the ‘from’ in the EXTRACT function, like `extract(<date_part>, <date/time field>)`. We feel that using that ‘from’ in the function makes it a little more readable.

### The DATE_PART function

You may also see the DATE_PART function used in place of the EXTRACT function. Both DATE_PART and EXTRACT perform the same functionality, it’s just a matter of preference on which one you want to use.

> **Postgres & DATE_PART:**
> This is overly pedantic and you’ll likely never encounter an issue with DATE_PART and EXTRACT evaluating to differences in values that truly matter, but it’s worth noting. Postgres’ DATE_PART and EXTRACT functions would previously evaluate to the same output. However, with Postgres 14, the [EXTRACT function now returns a numeric type instead of an 8-byte float.](https://stackoverflow.com/questions/38442340/difference-between-extractyear-from-timestamp-function-and-date-partyear-t)

### Data warehouse support for the EXTRACT function

[Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/datetime_functions#extract), [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_EXTRACT_function.html), [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/extract.html), [Postgres](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-extract/), and [Databricks](https://docs.databricks.com/sql/language-manual/functions/extract.html) all support the EXTRACT function. In addition, the syntax to use EXTRACT is the same across all of them.

## EXTRACT function example

Let’s take this to an actual example! We’re going to use the [jaffle shop](https://github.com/dbt-labs/jaffle_shop/blob/main/models/orders.sql), a simple dataset and dbt project, to help us. The jaffle shop’s `orders` <Term id="table" /> has some fields around an order’s status, order date, and order amount.

You can extract different time-based values (weeks, months, years, etc.) from the `order_date` in  the `orders` model using the following code:

```sql
select 
	order_id,
	order_date,
	extract(week from order_date) as order_week,
	extract(month from order_date) as order_month,
	extract(year from order_date) as order_year
from {{ ref('orders') }}
```

After running this query, your results would look a little something like this:

| **order_id** | **order_date** | **order_week** | **order_month** | **order_year** |
| ------------ | -------------- | -------------- | --------------- | -------------- |
| 1            | 2018-01-01     | 1              | 1               | 2018           |
| 9            | 2018-01-12     | 2              | 1               | 2018           |
| 72           | 2018-03-23     | 12             | 3               | 2018           |

As you can see, this query extracted the week of year, month of year, and year from the `order_date`.

## Why we love it

We’re going to be honest: EXTRACT isn’t the most widely used SQL function in our dbt project. However, EXTRACT has its time and place: 

* Fiscal calendars: If your business uses fiscal years, or calendars that differ from the normal 12-month cycle, EXTRACT functions can help create alignment between fiscal calendars and normal calendars
* Ad hoc analysis: EXTRACT functions are useful in ad hoc analyses and queries when you need to look at values grouped by date periods or for period comparisons

Extract is a consistent, helpful, and straightforward function–what more could we ask for from a ~~friend~~ function?

