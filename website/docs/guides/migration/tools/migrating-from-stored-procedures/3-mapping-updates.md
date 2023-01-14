---
title: Updates
id: 3-updates
---

`UPDATE`s start to increase the complexity of your transformations, but fortunately, they’re pretty darn simple to migrate, as well. The thought process that you go through when translating an `UPDATE` is quite similar to how an `INSERT` works, but the logic for the `SELECT` list in the dbt model is primarily sourced from the content in the `SET` section of the `UPDATE` statement. Let’s look at a simple example:

```sql
UPDATE orders

SET type = 'return'

WHERE total < 0
```

The way to look at this is similar to an `INSERT`-`SELECT` statement. The table being updated is the model you want to modify, and since this is an `UPDATE`, that model has likely already been created, and you can either:

- add to it with subsequent transformations
- create an intermediate model that builds off of the original model – perhaps naming it something like `int_[entity]_[verb].sql`.

The `SELECT` list should contain all of the columns for the table, but for the specific columns being updated by the DML, you’ll use the computation on the right side of the equals sign as the `SELECT`ed value. Then, you can use the target column name on the left of the equals sign as the column alias.

If I were building an intermediate transformation from the above query would translate to something along the lines of:

```sql
SELECT
    CASE
        WHEN total < 0 THEN 'return'
        ELSE type
    END AS type,

    order_id,
    order_date

FROM {{ ref('stg_orders') }}
```

Since the `UPDATE` statement doesn’t modify every value of the type column, we use a `CASE` statement to apply the contents’ `WHERE` clause. We still want to select all of the columns that should end up in the target table. If we left one of the columns out, it wouldn’t be passed through to the target table at all due to dbt’s declarative approach.

Sometimes, you may not be sure what all the columns are in a table, or in the situation as above, you’re only modifying a small number of columns relative to the total number of columns in the table. It can be cumbersome to list out every column in the table, but fortunately dbt contains some useful utility macros that can help list out the full column list of a table.

Another way I could have written the model a bit more dynamically might be:

```sql
SELECT
    {{ dbt_utils.star(from=ref('stg_orders'), except=['type']) }},
    CASE
        WHEN total < 0 THEN 'return'
        ELSE type
    END AS type,

FROM {{ ref('stg_orders') }}
```

The `dbt_utils.star()` macro will print out the full list of columns in the table, but skip the ones I’ve listed in the except list, which allows me to perform the same logic while writing fewer lines of code. This is a simple example of using dbt macros to simplify and shorten your code, and dbt can get a lot more sophisticated as you learn more techniques. Read more about the [dbt_utils package](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) and the [star macro](https://github.com/dbt-labs/dbt-utils/tree/0.8.6/#star-source).
