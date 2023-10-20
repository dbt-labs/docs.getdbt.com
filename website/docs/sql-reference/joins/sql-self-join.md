---
id: self-join
title: SQL SELF JOINS
description: A self join allows you to join a dataset back onto itself. A common use cases to leverage a self join is when a table contains a foreign key to the primary key of that same table.
slug: /sql-reference/self-join
---

<head>
    <title>Working with self joins in SQL</title>
</head>

Simultaneously the easiest and most confusing of joins: the self join. Simply put, a self join allows you to join a dataset back onto itself.

If you’re newer to data work or SQL, you may be asking yourself: why in the world would you want to do this? Shouldn’t joins happen between multiple *different* entities?

The majority of joins you see in analytics work and dbt projects will probably be left and inner joins, but occasionally, depending on how the raw source table is built out, you’ll leverage a self join. One of the most common use cases to leverage a self join is when a table contains a foreign key to the <Term id="primary-key" /> of that same table.

It’s ok if none of that made sense—jump into this page to better understand how and where you might use a self join in your analytics engineering work.

## How to create a self join

No funny venn diagrams here—there’s actually even no special syntax for self joins. To create a self join, you’ll use a regular join syntax, the only differences is the join objects are *the same*:

```
select
	<fields>
from <table_1> as t1
[<join_type>] join <table_2> as t2
on t1.id = t2.id
```

Since you can choose the dialect of join for a self join, you can specify if you want to do a [left](/sql-reference/left-join), [outer](/sql-reference/outer-join), [inner](/sql-reference/inner-join), [cross](/sql-reference/cross-join), or [right join](/sql-reference/right-join) in the join statement.

### SQL self join example

Given a `products` table that looks likes this, where there exists both a primary key (`sku_id`) and foreign key (`parent_id`) to that primary key:

| **sku_id** | **sku_name** | **parent_id** |
|:---:|:---:|:---:|
| 1 | Lilieth Bed | 4 |
| 2 | Holloway Desk | 3 |
| 3 | Basic Desk | null |
| 4 | Basic Bed | null |

And this query utilizing a self join to join `parent_name` onto skus:

```sql
select
   products.sku_id,
   products.sku_name,
   products.parent_id,
   parents.sku_name as parent_name
from {{ ref('products') }} as products
left join {{ ref('products') }} as parents
on products.parent_id = parents.sku_id
```

This query utilizing a self join adds the `parent_name` of skus that have non-null `parent_ids`:

| sku_id | sku_name | parent_id | parent_name |
|:---:|:---:|:---:|:---:|
| 1 | Lilieth Bed | 4 | Basic Bed |
| 2 | Holloway Desk | 3 | Basic Desk |
| 3 | Basic Desk | null | null |
| 4 | Basic Bed | null | null |

## SQL self join use cases

Again, self joins are probably rare in your dbt project and will most often be utilized in tables that contain a hierarchical structure, such as consisting of a column which is a foreign key to the primary key of the same table. If you do have use cases for self joins, such as in the example above, you’ll typically want to perform that self join early upstream in your <Term id="dag" />, such as in a [staging](https://docs.getdbt.com/guides/best-practices/how-we-structure/2-staging) or [intermediate](https://docs.getdbt.com/guides/best-practices/how-we-structure/3-intermediate) model; if your raw, unjoined table is going to need to be accessed further downstream sans self join, that self join should happen in a modular intermediate model.

You can also use self joins to create a cartesian product (aka a cross join) of a table against itself. Again, slim use cases, but still there for you if you need it 😉