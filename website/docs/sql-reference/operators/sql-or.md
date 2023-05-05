---
id: or
title: SQL OR
description: Read this guide to learn about the SQL OR operator in dbt.
slug: /sql-reference/or
---

<head>
    <title>Working with the SQL OR Operator</title>
</head>

We tried to come up with something witty about using the OR operator in a query, but couldn’t think of any 🤷

Use the OR operator in a WHERE clause to filter on multiple field values or perform more advanced joins on multiple fields.

## How to use the OR operator

The OR operator is technically a boolean operator—meaning it returns results that execute to true. It’s straightforward to use, and you’ll typically see it appear in a WHERE clause to filter query results appropriately or joins that involve multiple possible fields.

### OR operator example

```sql
select
	order_id,
	customer_id,
	order_date,
	status,
	amount
from {{ ref('orders') }}
where status = 'shipped' or status = 'completed'
limit 3
```

This query using the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `orders` table will return results where the order status is shipped or completed:

| order_id | customer_id | order_date | status | amount |
|:---:|:---:|:---:|:---:|:---:|
| 2 | 3 | 2018-01-02 | completed | 20.0000 |
| 3 | 94 | 2018-01-04 | completed | 1.00000 |
| 4 | 50 | 2018-01-05 | completed | 25.0000 |

## OR operator syntax in Snowflake, Databricks, BigQuery, and Redshift

Snowflake, Databricks, Google BigQuery, and Amazon Redshift all support the OR operator with the syntax looking the same in each platform. You may see the OR operator substituted for a more appropriate IN operator.

## OR use cases

We most commonly see OR operators used in queries and dbt models to:
- Return results for fields of varying values
- Joining tables on multiple fields using an OR operator (fair warning: this can be a bit scary and inefficient, so use OR operators in joins very carefully and consider refactoring your work to avoid these scenarios)

This isn’t an extensive list of where your team may be using OR throughout your data work, but it contains some common scenarios analytics engineers face day-to-day.
