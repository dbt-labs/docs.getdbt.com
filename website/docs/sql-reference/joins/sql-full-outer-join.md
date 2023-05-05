---
id: outer-join
title: SQL OUTER JOIN
description: A SQL full outer join is a join between two tables that returns all rows from both tables, regardless of join key match success.
slug: /sql-reference/outer-join
---

<head>
    <title>Working with full outer joins in SQL</title>
</head>

SQL full outer joins exist and therefore we have to talk about them, but they’re *highly unlikely* to be a join you regularly leverage in your data work. In plain terms, a SQL full outer join is a join between two tables that returns *all rows* from both tables, regardless of join key match success; compare this to [left](/sql-reference/left-join), [inner](/sql-reference/outer-join), or [right joins](/sql-reference/right-join) that require matches to be successful to return certain rows.

In this page, we’ll unpack how to create a full outer join and demonstrate when you might need one in your analytics engineering work.

## How to create a full outer join

Like all joins, you need some database objects (ie tables/views), keys to join on, and a [select statement](/sql-reference/select) to perform a full outer join:

```
select
    <fields>
from <table_1> as t1
full outer join <table_1> as t2
on t1.id = t2.id 
```

In this example above, there’s only one field being used to join the table together; if you’re joining between database objects that require multiple fields, you can leverage AND/OR operators, and more preferably, <Term id="surrogate-key">surrogate keys</Term>. You may additionally add [WHERE](/sql-reference/where), [GROUP BY](/sql-reference/group-by), [ORDER BY](/sql-reference/order-by), [HAVING](/sql-reference/having), and other clauses after your joins to create filtering, ordering, and performing aggregations.

A note on full outer joins: it may sound obvious, but because full outer joins can return all rows between two tables, they therefore can return *many* rows, which is not necessarily a recipe for efficiency. When you use full outer joins, you often can find alternatives using different joins or unions to potentially bypass major inefficiencies caused by a full outer join.

### SQL full outer join example

Table A `car_type`

| user_id | car_type |
|:---:|:---:|
| 1 | van |
| 2 | sedan |
| 3 | truck |

Table B `car_color`

| user_id | car_color |
|:---:|:---:|
| 1 | red |
| 3 | green |
| 4 | yellow |

```sql
select
   car_type.user_id as user_id,
   car_type.car_type as type,
   car_color.car_color as color
from {{ ref('car_type') }} as car_type
full outer join {{ ref('car_color') }} as car_color
on car_type.user_id = car_color.user_id
order by 1
```

This simple query will return all rows from tables A and B, regardless of `user_id` match success between the two tables:

| user_id | type | color |
|:---:|:---:|:---:|
| 1 | van | red |
| 2 | sedan | null |
| 3 | truck | green |
| 4 | null | yellow |

## SQL full outer join use cases

There will inevitably be valid use cases for full outer joins in your dbt project. However, because of the nature of dbt, which heavily encourages modularity and <Term id="dry" /> dryness, the necessity for full outer joins may go down (slightly). Regardless, the two primary cases for full outer joins we typically see are around consolidating or merging multiple entities together and data validation.
- Merging tables together: A full outer join between two tables can bring those entities together, regardless of join key match. This type of joining can often be bypassed by using different joins, unions, pivots, and a combination of these, but hey, sometimes the full outer join is a little less work 🤷
- Data validation: Full outer joins can be incredibly useful when performing data validation; for example, in the [dbt-audit-helper package](https://github.com/dbt-labs/dbt-audit-helper), a full outer join is used in the [compare_column_values test](https://github.com/dbt-labs/dbt-audit-helper/blob/main/macros/compare_column_values.sql) to help determine where column values are mismatched between two dbt models.