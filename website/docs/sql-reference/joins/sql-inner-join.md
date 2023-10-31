---
id: inner-join
title: SQL INNER JOINS
description: An inner join between two database objects returns all rows that have matching join keys; any keys that don’t match are omitted from the query result.
slug: /sql-reference/inner-join
---

<head>
    <title>Working with inner joins in SQL</title>
</head>

The cleanest and easiest of SQL joins: the humble inner join. Just as its name suggests, an inner join between two database objects returns all rows that have matching join keys; any keys that don’t match are omitted from the query result.

## How to create an inner join

Like all joins, you need some database objects (ie <Term id="table">tables</Term>/<Term id="view">views</Term>), keys to join on, and a [select statement](/sql-reference/select) to perform an inner join:

```
select
    <fields>
from <table_1> as t1
inner join <table_2> as t2
on t1.id = t2.id 
```

In this example above, there’s only one field from each table being used to join the two together; if you’re joining between two database objects that require multiple fields, you can leverage AND/OR operators, and more preferably, <Term id="surrogate-key">surrogate keys</Term>. You may additionally add [WHERE](/sql-reference/where), [GROUP BY](/sql-reference/group-by), [ORDER BY](/sql-reference/order-by), [HAVING](/sql-reference/having), and other clauses after your joins to create filtering, ordering, and performing aggregations.

As with any query, you can perform as many joins as you want in a singular query. A general word of advice: try to keep data models <Term id="dry">modular</Term> by performing regular <Term id="dag" /> audits. If you join certain tables further upstream, are those individual tables needed again further downstream? If your query involves multiple joins and complex logic and is exposed to end business users, ensure that you leverage table or [incremental materializations](https://docs.getdbt.com/docs/build/incremental-models).

### SQL inner join example

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
inner join {{ ref('car_color') }} as car_color
on car_type.user_id = car_color.user_id
```

This simple query will return all rows that have the same `user_id` in both Table A and Table B:

| user_id | type | color |
|:---:|:---:|:---:|
| 1 | van | red |
| 3 | truck | green |

Because there’s no `user_id` = 4 in Table A and no `user_id` = 2 in Table B, rows with ids 2 and 4 (from either table) are omitted from the inner join query results.

## SQL inner join use cases

There are probably countless scenarios where you’d want to inner join multiple tables together—perhaps you have some really nicely structured tables with the exact same <Term id="primary-key">primary keys</Term> that should really just be one larger, wider table or you’re joining two tables together don’t want any null or missing column values if you used a left or right join—it’s all pretty dependent on your source data and end use cases. Where you will not (and should not) see inner joins is in [staging models](https://docs.getdbt.com/best-practices/how-we-structure/2-staging) that are used to clean and prep raw source data for analytics uses. Any joins in your dbt projects should happen further downstream in [intermediate](https://docs.getdbt.com/best-practices/how-we-structure/3-intermediate) and [mart models](https://docs.getdbt.com/best-practices/how-we-structure/4-marts) to improve modularity and DAG cleanliness.

