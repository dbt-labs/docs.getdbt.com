---
id: case
title: SQL CASE WHEN
description: CASE statements allow you to cascade through multiple scenarios (or cases) in your data, evaluate them if they’re true, and output a corresponding value for each case.
slug: /sql-reference/case
---

<head>
    <title>Working with the SQL CASE statements</title>
</head>

SQL case statements are the backbone of analytics engineers and dbt projects. They help add context to data, make fields more readable or usable, and allow you to create specified buckets with your data.

To informally formalize it, case statements are the SQL equivalent of an if-then statement in other programming languages. They allow you to cascade through multiple scenarios (or cases) in your data, evaluate them if they’re true, and output a corresponding value for each case.

In this page, we’ll break down how to use SQL case statements and demonstrate why they’re valuable to modern data teams.

## How to use the SQL case statements

Case when statements are created in [SELECT statements](/sql-reference/select) along with other fields you choose to select. The general syntax for SQL case when statements is as follows:

```sql
case when [scenario 1] then [result 1]
     when [scenario 2] then [result 2]
    -- …as many scenarios as you want
     when [scenario n] then [result n]
     else [fallback result] -- this else is optional
end as <new_field_name>
```

Some notes on case statement functionality:
- Scenarios in case statements are *evaluated in the order they’re listed*. What does this mean? It means that if multiple scenarios evaluate to true, the earliest listed true scenario is the one whose result is returned.
- The results in each scenario need to be of the same data type; if scenario 1 results in a string, all other scenarios need to be [strings](/sql-reference/strings).
- Oftentimes data teams will omit a final `else` scenario since the `else [fallback result]`is optional and defaulted to `else null`.
- In general, case statement performance in select statements is relatively efficient (compared to other SQL functionality like aggregates or clunky joins involving ANDs and ORs); this isn’t to say it’s efficient (or smart) to be comparing a ton of scenarios, but it likely won’t be the bottleneck in your data models.
- Case when statement results can also be passed into aggregate functions, such as [MAX](/sql-reference/max), [MIN](/sql-reference/min), and [COUNT](/sql-reference/count), or even date functions (ex. `date_trunc('month', <case when statement>`)

Below, let’s take a look at a practical example using a case statement.

### SQL CASE WHEN example

```sql
select
    order_id,
    round(amount) as amount,
    case when amount between 0 and 10 then 'low'
         when amount between 11 and 20 then 'medium'
         else 'high'
    end as order_value_bucket
from {{ ref('orders') }}
```

This simple query using the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `orders` table will return a new field that buckets order amount based on criteria:

| **order_id** | **amount** | **order_value_bucket** |
|:---:|:---:|:---:|
| 1 | 10 | low |
| 2 | 20 | medium |
| 3 | 1 | low |
| 4 | 25 | high |
| 5 | 17 | medium |

## SQL CASE WHEN syntax in Snowflake, Databricks, BigQuery, and Redshift

Since it’s a fundamental of SQL, most, if not all, modern data warehouses support the ability to add case when statements to their queries. Snowflake, Databricks, Google BigQuery, and Amazon Redshift all support case statements and have the same syntax for them.

## CASE WHEN use cases

The use cases for case statements in dbt models and ad hoc queries is almost endless; as a result, we won’t (be able to) create an exhaustive list of where you might see case statements in the wild.

Instead, it’s important to know *why* you’d want to use them in your data work and when you wouldn’t want to use them. Some example reasons you’d want to leverage case statements:
- Create booleans from your existing data (ex. `case when cnt > 1 then true else false end as is_active`)
- Establish mappings between raw data and more general buckets of data (see example earlier in the page); note that if you find yourself creating many case when scenarios for a mapping that doesn’t change over time, you’ll likely want to import that mapping either as its own dbt model or data source (a good use case for [seeds](https://docs.getdbt.com/docs/build/seeds))
- If you find yourself creating the same case when statement throughout your models, consider abstracting that case when into its own model or into a <Term id="dry" /> [macro](https://docs.getdbt.com/docs/build/jinja-macros)
- Generate more business-user friendly columns values that can be easily comprehended by business users
