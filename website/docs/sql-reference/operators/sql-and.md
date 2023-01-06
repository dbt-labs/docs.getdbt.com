---
id: and
title: SQL AND
description: The AND operator returns results that meet all requirements passed into it. You’ll often see the AND operator used in a WHERE clause to filter query results. 
slug: /sql-reference/and
---

<head>
    <title>Working with the SQL AND operator</title>
</head>

The AND operator returns results that meet all requirements passed into it; compared to the [OR operator](/sql-reference/or) that only needs to have one true requirement. You’ll often see the AND operator used in a [WHERE clause](/sql-reference/where) to filter query results or in a case statement to create multiple criteria for a result.

Use this page to understand how to use the AND operator and why it might be helpful  in analytics engineering work.

## How to use the AND operator

It’s straightforward to use the AND operator, and you’ll typically see it appear in a WHERE clause to filter query results appropriately, in case statements, or joins that involve multiple fields.

```sql
-- and in a where clause
where <condition_1> and <condition_2> and… 

-- and in a case statement
case when <condition_1> and <condition_2> then <result_1> … 

-- and in a join
from <table_a>
join <table_b> on
<a_id_1> = <b_id_1> and <a_id_2> = <b_id_2>
```

:::tip Surrogate keys > joins with AND
Using <Term id="surrogate-key">surrogate keys</Term>, hashed values of multiple columns, is a great way to avoid using AND operators in joins. Typically, having AND or [OR operators](/sql-reference/or) in a join can cause the query or model to be potentially inefficient, especially at considerable data volume, so creating surrogate keys earlier in your upstream tables ([using the surrogate key macro](https://docs.getdbt.com/blog/sql-surrogate-keys)) can potentially improve performance in downstream models.
:::

### SQL AND operator example

```sql
select
	order_id,
	status,
	round(amount) as amount
from {{ ref('orders') }}
where status = 'shipped' and amount > 20
limit 3
```

This query using the sample dataset Jaffle Shop’s `orders` table will return results where the order status is shipped and the order amount is greater than $20:

| **order_id** | **status** | **amount** |
|:---:|:---:|:---:|
| 74 | shipped | 30 |
| 88 | shipped | 29 |
| 78 | shipped | 26 |

## AND operator syntax in Snowflake, Databricks, BigQuery, and Redshift

Snowflake, Databricks, Google BigQuery, and Amazon Redshift all support the AND operator with the same syntax for it across each platform.