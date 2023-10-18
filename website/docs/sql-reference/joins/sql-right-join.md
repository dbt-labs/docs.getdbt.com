---
id: right-join
title: SQL RIGHT JOIN
description: Right joins return all rows in the right join database object regardless of match in the database object in the FROM statement. 
slug: /sql-reference/right-join
---

<head>
    <title>Working with right joins in SQL</title>
</head>

The not-as-favorite child: the right join. Unlike [left joins](/sql-reference/left-join) that return all rows in the database object in [the FROM statement](/sql-reference/from), regardless of match in the left join object, right joins return all rows *in the right join database object*, regardless of match in the database object in the FROM statement. 

What you really need to know: You can accomplish anything a right join does with a left join and left joins typically are more readable and intuitive. However, we’ll still walk you through how to use right joins and elaborate on why we think left joins are superior 😉

## How to create a right join

Like all joins, you need some database objects (ie tables/views), keys to join on, and a [select statement](/sql-reference/select) to perform a right join:

```
select
    <fields>
from <table_1> as t1
right join <table_2> as t2
on t1.id = t2.id 
```

In this example above, there’s only one field from each table being used to join the two together together; if you’re joining between two database objects that require multiple fields, you can leverage AND/OR operators, and more preferably, <Term id="surrogate-key">surrogate keys</Term>. You may additionally add [WHERE](/sql-reference/where), [GROUP BY](/sql-reference/group-by), [ORDER BY](/sql-reference/order-by), [HAVING](/sql-reference/having), and other clauses after your joins to create filtering, ordering, and performing aggregations. You may also right (or any join really) as many joins as you’d like in an individual query or <Term id="cte" />.

### SQL right join example

Table A `car_type`

| **user_id** | **car_type** |
|:---:|:---:|
| 1 | van |
| 2 | sedan |
| 3 | truck |

Table B `car_color`

| **user_id** | **car_color** |
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
right join {{ ref('car_color') }} as car_color
on car_type.user_id = car_color.user_id
```

This simple query will return *all* rows from Table B and adds the `color` column to rows where there’s a successful match to Table A:

| **user_id** | **type** | **color** |
|:---:|:---:|:---:|
| 1 | van | red |
| 3 | truck | green |
| 4 | null | yellow |

Because there’s no `user_id` = 4 in Table A, there is no `type` available, thus a null result `type` column for `user_id` 4. Since no `user_id` = 2 exists in Table B, and that id is not in the right join database object, no rows with a `user_id` of 2 will be returned.

## SQL right join use cases

Compared to left joins, you likely won’t see right joins as often (or ever) in data modeling and analytics engineering work. But why not?

Simply because right joins are a little less intuitive than a left join. When you’re data modeling, you’re usually focused on one database object, and adding the supplementary data or tables you need to give you a final dataset. That one focal database object is typically what is put in the `from {{ ref('my_database_object')}}`; any other columns that are joined onto it from other tables are usually supplementary, but keeping all the rows from the initial table of focus is usually the priority. Don’t get us wrong—right joins can get you there—it’s likely just a little less intuitive and can get complex with queries that involve multiple joins.