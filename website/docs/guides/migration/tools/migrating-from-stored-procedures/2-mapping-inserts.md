---
title: Inserts
id: 2-inserts
---

An `INSERT` statement is functionally the same as using dbt to `SELECT` from an existing source or other dbt model. If you are faced with an `INSERT`-`SELECT` statement, the easiest way to convert the statement is to just create a new dbt model, and pull the `SELECT` portion of the `INSERT` statement out of the procedure and into the model. That’s basically it!

To really break it down, let’s consider a simple example:

```sql
INSERT INTO returned_orders (order_id, order_date, total_return)

SELECT order_id, order_date, total FROM orders WHERE type = 'return'
```

Converting this with a first pass to a [dbt model](/guides/bigquery?step=8) (in a file called returned_orders.sql) might look something like:

```sql
SELECT
    order_id as order_id,
    order_date as order_date,
    total as total_return

FROM {{ ref('orders') }}

WHERE type = 'return'
```

Functionally, this would create a model (which could be materialized as a table or view depending on needs) called `returned_orders` that contains three columns: `order_id`, `order_date`, `total_return`) predicated on the type column. It achieves the same end as the `INSERT`, just in a declarative fashion, using dbt.

## **A note on `FROM` clauses**

In dbt, using a hard-coded table or view name in a `FROM` clause is one of the most serious mistakes new users make. dbt uses the ref and source macros to discover the ordering that transformations need to execute in, and if you don’t use them, you’ll be unable to benefit from dbt’s built-in <Term id="data-lineage">lineage</Term> generation and pipeline execution. In the sample code throughout the remainder of this article, we’ll use ref statements in the dbt-converted versions of SQL statements, but it is an exercise for the reader to ensure that those models exist in their dbt projects.

## **Sequential `INSERT`s to an existing table can be `UNION ALL`’ed together**

Since dbt models effectively perform a single `CREATE TABLE AS SELECT` (or if you break it down into steps, `CREATE`, then an `INSERT`), you may run into complexities if there are multiple `INSERT` statements in your transformation that all insert data into the same table. Fortunately, this is a simple thing to handle in dbt. Effectively, the logic is performing a `UNION ALL` between the `INSERT` queries. If I have a transformation flow that looks something like (ignore the contrived nature of the scenario):

```sql
CREATE TABLE all_customers

INSERT INTO all_customers SELECT * FROM us_customers

INSERT INTO all_customers SELECT * FROM eu_customers
```

The dbt-ified version of this would end up looking something like:

```sql
SELECT * FROM {{ ref('us_customers') }}

UNION ALL

SELECT * FROM {{ ref('eu_customers') }}
```

The logic is functionally equivalent. So if there’s another statement that `INSERT`s into a model that I’ve already created, I can just add that logic into a second `SELECT` statement that is just `UNION ALL`'ed with the first. Easy!
