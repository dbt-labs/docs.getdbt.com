---
id: having
title: SQL HAVING
description: Read this guide to learn about the SQL HAVING clause in dbt.
slug: /sql-reference/having
---

<head>
    <title>Working with the HAVING clause in SQL</title>
</head>

SQL HAVING is just one of those little things that are going to make your ad hoc data work a little easier.

A not-so-fun fact about the [WHERE clause](/sql-reference/where) is that you can’t filter on aggregates with it…that’s where HAVING comes in. With HAVING, you can not only define an aggregate in a [select](/sql-reference/select) statement, but also filter on that newly created aggregate within the HAVING clause.

This page will walk through how to use HAVING, when you should use it, and discuss data warehouse support for it.


## How to use the HAVING clause in SQL

The HAVING clause essentially requires one thing: an aggregate field to evaluate. Since HAVING is technically a boolean, it will return rows that execute to true, similar to the WHERE clause.

The HAVING condition is followed after a [GROUP BY statement](/sql-reference/group-by) and optionally enclosed with an ORDER BY statement:

```sql
select
	-- query
from <table>
group by <field(s)>
having condition
[optional order by]
```

That example syntax looks a little gibberish without some real fields, so let’s dive into a practical example using HAVING.

### SQL HAVING example

<Tabs
  defaultValue="having"
  values={[
    { label: 'HAVING example', value: 'having', },
    {label: 'CTE example', value: 'cte', },
  ]
}>
<TabItem value="having">

```sql
select
    customer_id,
    count(order_id) as num_orders
from {{ ref('orders') }}
group by 1
having num_orders > 1 --if you replace this with `where`, this query would not successfully run
```
</TabItem>
<TabItem value="cte">

```sql
with counts as (
	select
		customer_id,
		count(order_id) as num_orders
	from {{ ref('orders') }}
	group by 1
)
select
	customer_id,
	num_orders
from counts
where num_orders > 1
```

</TabItem>
</Tabs>

This simple query using the sample dataset [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `orders` table will return customers who have had more than one order:

| customer_id | num_orders |
|:---:|:---:|
| 1 | 2 |
| 3 | 3 |
| 94 | 2 |
| 64 | 2 |
| 54 | 4 |

The query above using the <Term id="cte" /> utilizes more lines compared to the simpler query using HAVING, but will produce the same result.

## SQL HAVING clause syntax in Snowflake, Databricks, BigQuery, and Redshift

[Snowflake](https://docs.snowflake.com/en/sql-reference/constructs/having.html), [Databricks](https://docs.databricks.com/sql/language-manual/sql-ref-syntax-qry-select-having.html), [BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#having_clause), and [Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_HAVING_clause.html) all support the HAVING clause and the syntax for using HAVING is the same across each of those data warehouses.
