---
id: ilike
title: SQL ILIKE
description: The ILIKE operator helps you easily match, find, and filter out case-insensitive string values of a specified pattern by using SQL wildcards.
slug: /sql-reference/ilike
---

<head>
    <title>Working with the SQL ILIKE operator</title>
</head>

The favorite child ILIKE helps you easily match, find, and filter out string values of a specified pattern by using SQL wildcards *without having to worry about case sensitivity*. If you’re a stickler for case-sensitivity, don’t hesitate to use the not-as-special (but still important) child, the LIKE operator 😆

## How to use the SQL ILIKE operator

The ILIKE operator has a simple syntax, with the ability to have it utilized in WHERE clauses or case statements:

`where <field_name> ilike '<pattern>'` or `case when <field_name> ilike  '<pattern>'`

Some notes on this operator’s syntax and functionality:
- The `<pattern>` can use two SQL wildcards (`%` and ` _`); the underscore will match any single character and the % matches zero or more characters
    - Ex. '%j' = any string that ends with the letter j
    - Ex. 'j%' = any string that starts with a letter j
    - Ex. 'j%l' = any string that starts with a the letter j and ends with a letter l
    - Ex. '_j%' = any string that has a letter j in the second position
- Majority of use cases for the ILIKE operator will likely involve the `%` wildcard
- The ILIKE operator is case-insensitive, meaning that the casing in the `<pattern>` you want to filter does not need to match the same-case in your column values
- The ILIKE operator can be paired with the NOT operator, to filter on rows that are not like a specified pattern

Let’s dive into a practical example using the ILIKE operator now.

### SQL ILIKE example

```sql
select
   payment_id,
   order_id,
   payment_method,
   case when payment_method ilike '%card' then 'card_payment' else 'non_card_payment' end as was_card
from {{ ref('payments') }}
```

This simple query using the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `payments` table is creating a new column to determine if a payment used a type of card (ex. debit card, credit card, gift card) payment based on if the `payment_method` value ends in `card`:

| **payment_id** | **order_id** | **payment_method** | **was_card** |
|:---:|:---:|:---:|:---:|
| 1 | 1 | credit_card | card_payment |
| 9 | 9 | gift_card | card_payment |
| 3 | 3 | coupon | non_card_payment |
| 4 | 4 | coupon | non_card_payment |

## ILIKE syntax in Snowflake, Databricks, BigQuery, and Redshift

Most modern data warehouses, with the exception of Google BigQuery, support the ILIKE operator and the syntax is the same across them. Use the table below to read more on the documentation for the ILIKE operator in your data warehouse.

| **Data warehouse** | **ILIKE support?** |
|:---:|:---:|
| Snowflake | ✅ |
| Databricks | ✅ |
| Amazon Redshift | ✅ |
| Google BigQuery | ❌, recommend using regular expressions or the CONTAINS function |

## ILIKE operator example use cases

The ILIKE operator has very similar use cases to the [LIKE operator](/sql-reference/like), so we won’t repeat ourselves here. The important thing to understand when using the LIKE or ILIKE operators is what the casing variations look like in your data: if casing is inconsistent within a column, ILIKE will be your friend; if your backend engineers and analytics engineers rigorously follow a style-guide (and our source data is magically of the same case), the LIKE operator is there for you if you need it.