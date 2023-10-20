---
id: not
title: SQL NOT
description: The SQL NOT operator allows you to return results from conditions that are not true. he NOT boolean is kind of similar to an adjective—it’s often put in front of another operator. 
slug: /sql-reference/not
---

<head>
    <title>Working with the SQL NOT operator</title>
</head>

This will be a not *not* useful page on a helpful SQL operator.

Ok we had to get that out of the way. The SQL NOT operator allows you to return results from conditions that are not true. Pretty intuitive, right?

In this page, we’ll dive into how to use the NOT operator, demonstrate an example, and elaborate on potential use cases.

## How to use the SQL NOT operator

The NOT boolean is kind of similar to an adjective—it’s often put in front of another operator, such as [BETWEEN](/sql-reference/between), [LIKE](/sql-reference/like)/[ILIKE](/sql-reference/ilike), IS, and [IN](/sql-reference/in), to return rows that do not meet the specified criteria. Below is an example of how to use NOT in front of a LIKE operator:

`where <field_name> not like <value>`

This syntax can be easily modified for other operators:
- `where not between <value_1> and <value_2>`
- `where <field_name> is not null`
- `where <field_name> is not in (array_of_options)`
- …or placed altogether in a different place, such as a case statement (ex. `case when <field_name> is not null then 1 else 0 end`)

Let’s dive into a practical example using the NOT operator.

### SQL NOT example

```sql
select
   payment_id,
   order_id,
   payment_method
from {{ ref('payments') }}
where payment_method not like '%card' 
```

This simple query using the sample dataset [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `payments` table is returning all rows whose `payment_method` is not a card-type (ex. gift card  or credit card):

| **payment_id** | **order_id** | **payment_method** |
|:---:|:---:|:---:|
| 3 | 3 | coupon |
| 4 | 4 | coupon |
| 5 | 5 | bank_transfer |
| 10 | 9 | bank_transfer |

## SQL NOT syntax in Snowflake, Databricks, BigQuery, and Redshift

[Snowflake](https://docs.snowflake.com/en/sql-reference/operators-logical.html), [Databricks](https://docs.databricks.com/sql/language-manual/functions/not.html), [BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/operators), and [Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_logical_condition.html) all support the NOT operator, but may not all support secondary operators you would typically use the NOT operator in pair with. For example, `where <field_name> not ilike <pattern>` is valid in Snowflake, Databricks, and Redshift, but the ILIKE operator is not supported in BigQuery, so this example would not be valid across all data warehouses.

## NOT operator example use cases

There are probably many scenarios where you’d want to use the NOT operators in your WHERE clauses or case statements, but we commonly see NOT operators used to remove nulls or boolean-identifed deleted rows in source data in [staging models](https://docs.getdbt.com/guides/best-practices/how-we-structure/2-staging). This removal of unnecessary rows can potentially help the performance of downstream [intermediate](https://docs.getdbt.com/guides/best-practices/how-we-structure/3-intermediate) and [mart models](https://docs.getdbt.com/guides/best-practices/how-we-structure/4-marts).