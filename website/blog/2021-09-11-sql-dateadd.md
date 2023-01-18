---
title: "DATEADD SQL Function Across Data Warehouses"
description: "DATEADD Function syntax varies across data warehouses. Learn how to standardize your syntax no matter the container."
slug: sql-dateadd
canonical_url: https://docs.getdbt.com/sql-reference/dateadd

authors: david_krevitt

tags: [SQL magic]
hide_table_of_contents: false

date: 2021-11-15
is_featured: true
---

I’ve used the dateadd SQL function thousands of times.

I’ve googled the syntax of the dateadd SQL function all of those times except one, when I decided to hit the "are you feeling lucky" button and go for it.

In switching between SQL dialects (BigQuery, Postgres and Snowflake are my primaries), I can literally never remember the argument order (or exact function name) of dateadd.

This article will go over how the DATEADD function works, the nuances of using it across the major cloud warehouses, and how to standardize the syntax variances using dbt macro.

<!--truncate-->

## What is the DATEADD SQL Function?

The DATEADD function in SQL adds a time/date interval to a date and then returns the date. This allows you to add or subtract a certain period of time from a given start date.

Sounds simple enough, but this function lets you do some pretty useful things like calculating an estimated shipment date based on the ordered date.


## Differences in DATEADD syntax across data warehouse platforms

All of them accept the same rough parameters, in slightly different syntax and order:

* Start / from date
* Datepart (day, week, month, year)
* Interval (integer to increment by)

The *functions themselves* are named slightly differently, which is common across SQL dialects.

### For example, the DATEADD function in Snowflake…

```sql
dateadd( {{ datepart }}, {{ interval }}, {{ from_date }} )
```

*Hour, minute and second are supported!*

### The DATEADD Function in Databricks

```sql
date_add( {{ startDate }}, {{ numDays }} )
```

### The DATEADD Function in BigQuery…

```sql
date_add( {{ from_date }}, INTERVAL {{ interval }} {{ datepart }} )
```

*Dateparts of less than a day (hour / minute / second) are not supported.*

### The DATEADD Function in Postgres...

Postgres doesn’t provide a dateadd function out of the box, so you’ve got to go it alone - but the syntax looks very similar to BigQuery’s function…

```sql
{{ from_date }} + (interval '{{ interval }} {{ datepart }}')
```

Switching back and forth between those SQL syntaxes, at least for me, usually requires a quick scan through the warehouse's docs to get back on the horse.

So I made this handy 2 x 2 matrix to help sort the differences out:

![blank 2x2 matrix](/img/blog/dateadd_matrix.png)

I am sorry - that’s just a blank 2x2 matrix. I've surrendered to just searching for the docs.

## Standardizing your DATEADD SQL syntax with a dbt macro

But couldn’t we be doing something better with those keystrokes, like typing out and then deleting a tweet?

dbt (and the [dbt_utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/#dateadd-source-macros-cross_db_utils-dateadd-sql-) macro package) helps us smooth out these wrinkles of writing SQL across <Term id="data-warehouse">data warehouses</Term>.

Instead of looking up the syntax each time you use it, you can just write it the same way each time, and the macro compiles it to run on your chosen warehouse:

```sql
{{ dbt_utils.dateadd(datepart, interval, from_date_or_timestamp) }}
```

Adding 1 month to today would look like...

```sql
{{ dbt_utils.dateadd(month, 1, '2021-08-12' }}
```

> *New to dbt?  Check out [dbt introduction](https://docs.getdbt.com/docs/introduction) for more background on dbt and the analytics engineering workflow that it facilitates.*
>
> *TL;DR: dbt allows data practitioners to write code like software engineers, which in this case means not repeating yourself unnecessarily.*

### Compiling away your DATEADD troubles

When we run dbt, the dateadd macro compiles your function into the SQL dialect of the warehouse adapter you’re running on—it’s running the same SQL you would’ve written yourself in your native query browser.

And it’s actually quite a simple 31-line macro ([source here](https://github.com/dbt-labs/dbt-utils/blob/0.1.20/macros/cross_db_utils/dateadd.sql) and snapshot below) - if you wanted to extend it (to support another warehouse adapter, for example), I do believe almost any SQL user is qualified to submit a PR to the repo:

```sql
{% macro dateadd(datepart, interval, from_date_or_timestamp) %}
  {{ adapter_macro('dbt_utils.dateadd', datepart, interval, from_date_or_timestamp) }}
{% endmacro %}


{% macro default__dateadd(datepart, interval, from_date_or_timestamp) %}

    dateadd(
        {{ datepart }},
        {{ interval }},
        {{ from_date_or_timestamp }}
        )

{% endmacro %}


{% macro bigquery__dateadd(datepart, interval, from_date_or_timestamp) %}

        datetime_add(
            cast( {{ from_date_or_timestamp }} as datetime),
        interval {{ interval }} {{ datepart }}
        )

{% endmacro %}


{% macro postgres__dateadd(datepart, interval, from_date_or_timestamp) %}

    {{ from_date_or_timestamp }} + ((interval '1 {{ datepart }}') * ({{ interval }}))

{% endmacro %}
```

Enjoy! FYI I've used dateadd macro in dbt-utils on BigQuery, Postgres, Redshift and Snowflake, but it likely works across most other warehouses.

*Note: While `dbt_utils` doesn't support Databricks by default, you can use other packages that [implement overrides](/reference/dbt-jinja-functions/dispatch#overriding-package-macros) as a workaround.*

*This [spark_utils package](https://github.com/dbt-labs/spark-utils/blob/0.3.0/macros/dbt_utils/cross_db_utils/dateadd.sql) can help you implement the override needed to add support for Databricks dateadd*
