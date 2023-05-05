---
id: in
title: SQL IN
description: Read this guide to learn about the SQL IN operator in dbt.
slug: /sql-reference/in
---

<head>
    <title>Working with the SQL IN Operator</title>
</head>

It happens to the best of data people: The `orders` table always needs to filter out `status = employee_order` in order to get the accurate order counts. So you’re data model for the `orders` table looks a little something like this:

```sql
select * from {{ source('backend_db', 'orders') }}
where status != 'employee_order'
```

What happens one day if there’s an additional `status` that needs to be filtered out? Well, that’s where the handy IN operator comes into play.

The IN operator ultimately allows you to specify multiple values in a WHERE clause, so you can easily filter your query on multiple options. Using the IN operator is a more refined version of using multiple OR conditions in a WHERE clause.

## How to use SQL IN operator

In the scenario above if you now needed to filter on an additional new `status` value to remove certain rows, your use of the IN operator would look like this:

```sql
select * from {{ source('backend_db', 'orders') }}
where status not in ('employee_order', 'influencer_order') --list of order statuses to filter out
```

Woah woah woah, what is a `not in`? This is exactly what it sounds like: return all rows where the status is not `employee_order` or `influencer_order`. If you wanted to just use the IN operator, you can specify all other statuses that are appropriate (ex. `where status in ('regular_order', 'temp_order')`).

You can additionally use the IN/NOT IN operator for a subquery, to remove/include rows from a subquery’s result:

```sql
where status in (select …)
```

:::tip Compare columns against appropriate data types
The only “gotcha” that really exists in using the IN operator is remembering that the values in your IN list **must** match the data type of the column they’re compared against. This is especially important for boolean columns that could be accidentally cast as strings.
:::

## IN operator syntax in Snowflake, Databricks, BigQuery, and Redshift

The IN operator, like most of the SQL operators, are not syntactically different across data warehouses. That means the syntax for using the IN/NOT IN operator is the same in Snowflake, Databricks, Google BigQuery, and Amazon Redshift.

## IN operator use cases

Use the IN condition to filter out inappropriate or inaccurate rows from a query or database schema object based on parameters you define and understand. We guarantee there’s an IN somewhere in your dbt project 😀
