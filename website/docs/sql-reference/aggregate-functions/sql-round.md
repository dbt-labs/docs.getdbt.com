---
id: round 
title: SQL ROUND 
description: The ROUND aggregate function allows you to round numeric fields or values in SQL to the number of decimal places of your choosing.
slug: /sql-reference/round
---

<head>
    <title>Working with SQL ROUND</title>
</head>

If you’re reading this, that probably means you’re a data person. And as a data person who’s likely modeling data for analytics use cases, you’re going to need to round data from time to time. For the unacquainted, "rounding" is making a number simpler so that it's easier to understand while keeping it close to its original value. In data, a common use case for rounding is to decrease the number of decimal places a numeric record has.

To round numeric fields or values in SQL, you’re going to use the handy ROUND function.

## How to use the SQL ROUND function

The syntax for using ROUND function looks like the following:

```sql
round(<numeric column or data>, [optional] <number of decimal places>)
```
In this function, you’ll need to input the *numeric* field or data you want rounded and pass in an optional number to round your field by. For most data warehouses, the number of decimal places is defaulted to 0 or 1, meaning if you rounded 20.00 using `round(20.00)`, it would return 20 or 20.0 (depending on your data warehouse).

### SQL ROUND function example

:::note What dataset is this?
This example is querying from a sample dataset created by dbt Labs called [jaffle_shop](https://github.com/dbt-labs/jaffle_shop).
:::

You can round some of the numeric fields of the Jaffle Shop’s `orders` model using the following code:

```sql
select 
	cast(order_id as string) as order_id,
	order_date,
	amount,
	round(amount, 1) as rounded_amount
from {{ ref('orders') }}
```

After running this query, the resulting `orders` table will look a little something like this:

| order_id | order_date | amount | rounded_amount |
|---|---|---|---|
| 1 | 2018-01-01 | 10.000000 | 10.0 |
| 2 | 2018-01-02 | 20.000000 | 20.0 |
| 3 | 2018-01-04 | 1.000000 | 1.0 |

The new `rounded_amount` column is the `amount` fielded rounded to 1 decimal place.

For most data warehouses, the returned data from the ROUND function should be the same as the input data. If you input a float type into the ROUND function, the returned rounded number should also be a float.

## SQL ROUND function syntax in Snowflake, Databricks, BigQuery, and Redshift

Google BigQuery, Amazon Redshift, Snowflake, and Databricks all support the ability to round numeric columns and data. In addition, the syntax to round is the same across all of them using the ROUND function.

## ROUND function use cases

If you find yourself rounding numeric data, either in data models or ad-hoc analyses, you’re probably rounding to improve the readability and usability of your data using downstream [intermediate](https://docs.getdbt.com/guides/best-practices/how-we-structure/3-intermediate) or [mart models](https://docs.getdbt.com/guides/best-practices/how-we-structure/4-marts). Specifically, you’ll likely use the ROUND function to:

- Make numeric calculations using division or averages a little cleaner and easier to understand
- Create concrete buckets of data for a cleaner distribution of values during ad-hoc analysis

You’ll additionally likely see the ROUND function used in your BI tool as it generates rounded clean numbers for business users to interact with.
