---
id: group-by
title: SQL GROUP BY
description: The GROUP BY statement allows you to group query results by specified columns and is used in pair with aggregate functions such as AVG and SUM to calculate those values across specific rows.
slug: /sql-reference/group-by
---

<head>
    <title>Working with the SQL GROUP BY statement</title>
</head>

GROUP BY…it’s a little hard to explicitly define in a way *that actually makes sense*, but it will inevitably show up countless times in analytics work and you’ll need it frequently.

To put it in the simplest terms, the GROUP BY statement allows you to group query results by specified columns and is used in pair with aggregate functions such as [AVG](/sql-reference/avg) and [SUM](/sql-reference/sum) to calculate those values across specific rows.

## How to use the SQL GROUP BY statement

The GROUP BY statement appears at the end of a query, after any joins and [WHERE](/sql-reference/where) filters have been applied:

```sql
select 
	my_first_field,
	count(id) as cnt --or any other aggregate function (sum, avg, etc.) 
from my_table
where my_first_field is not null
group by 1 --grouped by my_first_field
order by 1 desc
```

A few things to note about the GROUP BY implementation:
- It’s usually listed as one of the last rows in a query, after any joins or where statements; typically you’ll only see [HAVING](/sql-reference/having), [ORDER BY](/sql-reference/order-by), or [LIMIT](/sql-reference/limit) statements following it in a query
- You can group by multiple fields (ex. `group by 1,2,3`) if you need to; in general, we recommend performing aggregations and joins in separate <Term id="cte">CTEs</Term> to avoid having to group by too many fields in one query or CTE 
- You may also group by explicit column name (ex. `group by my_first_field`) or even a manipulated column name that is in the query (ex. `group by date_trunc('month', order_date)`)

:::note Readability over DRYness?
Grouping by explicit column name (versus column number in query) can be two folded: on one hand, it’s potentially more readable by end business users; on the other hand, if a grouped column name changes, that name change needs to be reflected in the group by statement. Use a grouping convention that works for you and your data, but try to keep to one standard style.
:::

### SQL GROUP BY example

```sql
select
    customer_id,
    count(order_id) as num_orders
from {{ ref('orders') }}
group by 1
order by 1
limit 5
```

This simple query using the sample dataset [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `order` table will return customers and the count of orders they’ve placed:

| customer_id | num_orders |
|:---:|:---:|
| 1 | 2 |
| 2 | 1 |
| 3 | 3 |
| 6 | 1 |
| 7 | 1 |

Note that the `order by` and `limit` statements are after the `group by` in the query.

## SQL GROUP BY syntax in Snowflake, Databricks, BigQuery, and Redshift

Snowflake, Databricks, BigQuery, and Redshift all support the ability to group by columns and follow the same syntax.

## GROUP BY use cases

Aggregates, aggregates, and did we mention, aggregates? GROUP BY statements are needed when you’re calculating aggregates (averages, sum, counts, etc.) by specific columns; your query will not run successfully without them if you’re attempting to use aggregate functions in your query. You may also see GROUP BY statements used to deduplicate rows or join aggregates onto other tables with <Term id="cte">CTEs</Term>; [this article provides a great writeup](https://www.getdbt.com/blog/write-better-sql-a-defense-of-group-by-1/) on specific areas you might see GROUP BYs used in your dbt projects and data modeling work.

:::tip 👋Bye bye finicky group bys
In some sticky data modeling scenarios, you may find yourself needing to group by many columns to collapse a table down into fewer rows or deduplicate rows. In that scenario, you may find yourself writing `group by 1, 2, 3,.....,n` which can become tedious, confusing, and difficult to troubleshoot. Instead, you can leverage a [dbt macro](https://github.com/dbt-labs/dbt-utils#group_by-source) that will save you from writing `group by 1,2,....,46` to instead a simple `{{ dbt_utils.group_by(46) }}`...you’ll thank us later 😉
:::
