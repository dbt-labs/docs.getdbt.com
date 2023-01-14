---
title: Deletes
id: 4-deletes
---

One of the biggest differences between a procedural transformation and how dbt models data is that dbt, in general, will never destroy data. While there are ways to execute hard `DELETE`s in dbt that are outside of the scope of this article, the general best practice for handling deleted data is to just use soft deletes, and filter out soft-deleted data in a final transformation.

Let’s consider a simple example query:

```sql
DELETE FROM stg_orders WHERE order_status IS NULL
```

In a dbt model, you’ll need to first identify the records that should be deleted and then filter them out. There are really two primary ways you might translate this query:

```sql
SELECT * FROM {{ ref('stg_orders') }} WHERE order_status IS NOT NULL
```

This first approach just inverts the logic of the DELETE to describe the set of records that should remain, instead of the set of records that should be removed. This ties back to the way dbt declaratively describes datasets. You reference the data that should be in a dataset, and the table or view gets created with that set of data.

Another way you could achieve this is by marking the deleted records, and then filtering them out. For example:

```sql
WITH

soft_deletes AS (

    SELECT
        *,
        CASE
            WHEN order_status IS NULL THEN true
            ELSE false
        END AS to_delete

    FROM {{ ref('stg_orders') }}

)

SELECT * FROM soft_deletes WHERE to_delete = false
```

This approach flags all of the deleted records, and the final `SELECT` filters out any deleted data, so the resulting table contains only the remaining records. It’s a lot more verbose than just inverting the `DELETE` logic, but for complex `DELETE` logic, this ends up being a very effective way of performing the `DELETE` that retains historical context.

It’s worth calling out that while this doesn’t enable a hard delete, hard deletes can be executed a number of ways, the most common being to execute a dbt [macros](/docs/build/jinja-macros) via as a [run-operation](https://docs.getdbt.com/reference/commands/run-operation), or by using a [post-hook](https://docs.getdbt.com/reference/resource-configs/pre-hook-post-hook/) to perform a `DELETE` statement after the records to-be-deleted have been marked. These are advanced approaches outside the scope of this guide.
