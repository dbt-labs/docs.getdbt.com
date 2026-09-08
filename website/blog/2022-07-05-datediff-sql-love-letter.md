---
title: "DATEDIFF SQL function: Why we love it"
description: "The DATEDIFF function will return the difference in specified units (ex. days, weeks, years) between a start date/time and an end date/time. It’s a simple and widely used function that you’ll find yourself using more often than you expect."
slug: datediff-sql-love-letter
canonical_url: https://docs.getdbt.com/sql-reference/datediff

authors: [kira_furuichi]

tags: [sql magic]
hide_table_of_contents: false

date: 2022-07-13
is_featured: false
---

*“How long has it been since this customer last ordered with us?”*

*“What is the average number of days to conversion?”*

Business users will have these questions, data people will have to answer these questions, and the only way to solve them is by calculating the time between two different dates. Luckily, there’s a handy DATEDIFF function that can do that for you.

The DATEDIFF function will return the difference in specified units (ex. days, weeks, years) between a start date/time and an end date/time. It’s a simple and widely used function that you’ll find yourself using more often than you expect.

<!--truncate-->

> **What is a SQL function?**
> At a high level, a function takes an input (or multiple inputs) and returns a manipulation of those inputs. Some common SQL functions are [COALESCE](https://getdbt.com/sql-foundations/coalesce-sql-love-letter/), [LOWER](https://getdbt.com/sql-foundations/lower-sql-love-letter/), and [EXTRACT](https://getdbt.com/sql-foundations/extract-sql-love-letter/). For example, the COALESCE function takes a group of values and returns the first non-null value from that group.

DATEDIFF is a little bit like your favorite pair of socks; you’ll usually find the first one easily and feel like the day is going to be great. But for some reason, the matching sock requires a little digging in the drawer. DATEDIFF is this pair of socks—you’ll inevitably find yourself Googling the syntax almost every time you use it, but you can’t go through your day without using it. 

This post will go over how to use the DATEDIFF function across different data warehouses and how to write more standardized DATEDIFF functions using a dbt macro (or successfully find your socks as a pair in one go).

## How to use the DATEDIFF function

For the DATEDIFF function, there’s three elements, or arguments, passed in:

* The date part: This is the days/months/weeks/years (unit) of the difference calculated
* The first (start) date/time
* The second (end) date/time

The DATEDIFF function can be used in SELECT statements and WHERE clauses.

Most, if not all, modern cloud data warehouses support some type of the DATEDIFF function. There may be some minor differences between the argument order and function name for DATEDIFF across data warehouses, but the functionality very much remains the same.

Below, we’ll outline some of the slight differences in the implementation between some data warehouses.

### DATEDIFF in Snowflake, Amazon Redshift, and Databricks

The syntax for using the DATEDIFF function in [Snowflake](https://docs.snowflake.com/en/sql-reference/functions/datediff.html) and [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_DATEDIFF_function.html), and [Databricks](https://docs.databricks.com/sql/language-manual/functions/datediff3.html) looks like the following:

```sql
datediff(<date part>, <start date/time>, <end date/time>)
```

> **A note on Databricks:**
> Databricks additionally supports a separate [DATEDIFF function](https://docs.databricks.com/sql/language-manual/functions/datediff.html) that takes only two arguments: a start date and an end date. The function will always return the difference between two dates in days.

### DATEDIFF in Google BigQuery

The syntax for using the DATEDIFF function in [Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/datetime_functions#datetime_diff) looks like the following:

Three minor differences in the implementation here:

* Unlike in Snowflake, Amazon Redshift, and Databricks where the `<date part>` is passed as the first argument, the `<date part>` is passed in as the last argument in Google BigQuery.
* Google BigQuery also calls the function DATETIME_DIFF with an additional underscore separating the function name. This is on-par with [Google BigQuery’s preference to have underscores in function names](https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions).
* The DATETIME_DIFF arguments are datetimes, not dates; Snowflake, Redshift, and Databricks’ DATEDIFF functions support multiple date types such as dates and timestamps. BigQuery also supports a separate [DATE_DIFF function](https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions#date_diff) that will return the difference between two `date` types, unlike the DATETIME_DIFF that only supports the `datetime` type.

## A hero in the shadows: The DATEDIFF dbt macro!

You may be able to memorize the syntax for the DATEDIFF function for the primary data warehouse you use. What happens when you switch to a different one for a new job or a new data stack? Remembering if there’s an underscore in the function name or which argument the `<date part>` is passed in as is… no fun and leads to the inevitable, countless “datediff in bigquery” Google searches.

Luckily, [dbt-core](https://github.com/dbt-labs/dbt-core) has your back! dbt Core is the open source dbt product that helps data folks write their [data transformations](https://www.getdbt.com/analytics-engineering/transformation/) following software engineering best practices.

With dbt v1.2, [adapters](https://docs.getdbt.com/docs/supported-data-platforms) now support [cross-database macros](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros) to help you write certain functions, like [DATE_TRUNC](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros#date_trunc) and [DATEDIFF](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros#datediff), without having to memorize sticky function syntax.

> **Note:**
> Previously, [dbt_utils](https://github.com/dbt-labs/dbt-utils), a package of macros and tests that data folks can use to help write more DRY code in their dbt project, powered cross-database macros. Now, cross-database macros are available **regardless if dbt utils is installed or not.**

Using the [DATEDIFF macro](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros#datediff), you can calculate the difference between two dates without having to worry about finicky syntax. Specifically, this means you could successfully run the *same code* across multiple databases without having to worry about the finicky differences in syntax.

Using the [jaffle shop](https://github.com/dbt-labs/jaffle_shop/blob/main/models/orders.sql), a simple dataset and dbt project, we can calculate the difference between two dates using the dbt DATEDIFF macro:

```sql
select
	*,
	{{ datediff("order_date", "'2022-06-09'", "day") }}
from {{ ref('orders') }}
```

This would return all fields from the `orders` table and the difference in days between order dates and June 9, 2022.

Under the hood, this macro is taking your inputs and creating the appropriate SQL syntax for the DATEDIFF function *specific to your data warehouse.*

*This post is a part of the SQL love letters—a series on the SQL functions the dbt Labs data team members use and love. You can find [the entire collection here](https://getdbt.com/sql-foundations/top-sql-functions).*
