---
id: dateadd
title: SQL DATEADD
description: The DATEADD function in SQL adds a time/date interval to a date and then returns the date. This allows you to add or subtract a certain period of time from a given start date.
slug: /sql-reference/dateadd
---

<head>
    <title>What is the SQL DATEADD Function?</title>
</head>

If you’ve used the DATEADD SQL function any number of times, you’ve googled the syntax of the function all of those times except one, when I decided to hit the “are you feeling lucky” button and go for it.

In switching between SQL dialects (BigQuery, Postgres and Snowflake are my primaries), it's almost impossible to remember the argument order (or exact function name) of dateadd.

This article will go over how the DATEADD function works, the nuances of using it across the major cloud warehouses, and how to standardize the syntax variances using dbt macro.

## What is the DATEADD SQL function?

The DATEADD function in SQL adds a time/date interval to a date and then returns the date. This allows you to add or subtract a certain period of time from a given start date.

Sounds simple enough, but this function lets you do some pretty useful things like calculating an estimated shipment date based on the ordered date.

## Differences in DATEADD syntax across data warehouse platforms 

All of them accept the same rough parameters, in slightly different syntax and order:

- Start / from date
- Datepart (day, week, month, year)
- Interval (integer to increment by)

The *functions themselves* are named slightly differently, which is common across SQL dialects.

### For example, the DATEADD function in Snowflake…

```
dateadd( {{ datepart }}, {{ interval }}, {{ from_date }} )
```

*Hour, minute and second are supported!*

### For example, the DATEADD function in Snowflake…

```
dateadd( {{ datepart }}, {{ interval }}, {{ from_date }} )
```

*Hour, minute and second are supported!*

### The DATEADD function in Databricks

```sql
date_add( {{ startDate }}, {{ numDays }} )
```

### The DATEADD function in BigQuery…

```sql
date_add( {{ from_date }}, INTERVAL {{ interval }} {{ datepart }} )
```

*Dateparts of less than a day (hour / minute / second) are not supported.*

### The DATEADD function in Postgres…


Postgres doesn’t provide a dateadd function out of the box, so you’ve got to go it alone - but the syntax looks very similar to BigQuery’s function…

```sql
{{ from_date }} + (interval '{{ interval }} {{ datepart }}')
```

Switching back and forth between those SQL syntaxes usually requires a quick scan through the warehouse’s docs to get back on the horse.

## Standardizing your DATEADD SQL syntax with a dbt macro 

But couldn’t we be doing something better with those keystrokes, like typing out and then deleting a tweet?

dbt v1.2 helps us smooth out these wrinkles of writing [SQL across data warehouses](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros).

Instead of looking up the syntax each time you use it, you can just write it the same way each time, and the macro compiles it to run on your chosen warehouse:

```
{{ dateadd(datepart, interval, from_date_or_timestamp) }}
```

Adding 1 month to a specific date would look like…

```
{{ dateadd(datepart="month", interval=1, from_date_or_timestamp="'2021-08-12'") }}
```

