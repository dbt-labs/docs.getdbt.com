---
title: Migrating from DDL, DML, and stored procedures
id: migrating-from-stored-procedures
description:  Learn how to transform from a historical codebase of mixed DDL and DML statements to dbt models, including tips and patterns for the shift from a procedural to a declarative approach in defining datasets.
displayText: Migrating from DDL, DML, and stored procedures
hoverSnippet: Learn how to transform from a historical codebase of mixed DDL and DML statements to dbt models
time_to_complete: '30 minutes'
platform: 'dbt-core'
icon: 'guides'
hide_table_of_contents: true
tags: ['materializations', 'dbt Core']
level: 'Beginner'
recently_updated: true
---

## Introduction

One of the more common situations that new dbt adopters encounter is a historical codebase of transformations written as a hodgepodge of DDL and DML statements, or stored procedures. Going from DML statements to dbt models is often a challenging hump for new users to get over, because the process involves a significant paradigm shift between a procedural flow of building a dataset (e.g. a series of DDL and DML statements) to a declarative approach to defining a dataset (e.g. how dbt uses SELECT statements to express data models). This guide aims to provide tips, tricks, and common patterns for converting DML statements to dbt models.

### Preparing to migrate

Before getting into the meat of conversion, it’s worth noting that DML statements will not always illustrate a comprehensive set of columns and column types that an original table might contain. Without knowing the DDL to create the table, it’s impossible to know precisely if your conversion effort is apples-to-apples, but you can generally get close.

If your <Term id="data-warehouse" /> supports `SHOW CREATE TABLE`, that can be a quick way to get a comprehensive set of columns you’ll want to recreate. If you don’t have the DDL, but are working on a substantial stored procedure, one approach that can work is to pull column lists out of any DML statements that modify the table, and build up a full set of the columns that appear.

As for ensuring that you have the right column types, since models materialized by dbt generally use `CREATE TABLE AS SELECT` or `CREATE VIEW AS SELECT` as the driver for object creation, tables can end up with unintended column types if the queries aren’t explicit. For example, if you care about `INT` versus `DECIMAL` versus `NUMERIC`, it’s generally going to be best to be explicit. The good news is that this is easy with dbt: you just cast the column to the type you intend.

We also generally recommend that column renaming and type casting happen as close to the source tables as possible, typically in a layer of staging transformations, which helps ensure that future dbt modelers will know where to look for those transformations! See [How we structure our dbt projects](/best-practices/how-we-structure/1-guide-overview) for more guidance on overall project structure.

### Operations we need to map

There are four primary DML statements that you are likely to have to convert to dbt operations while migrating a procedure:

- `INSERT`
- `UPDATE`
- `DELETE`
- `MERGE`

Each of these can be addressed using various techniques in dbt. Handling `MERGE`s is a bit more involved than the rest, but can be handled effectively via dbt. The first three, however, are fairly simple to convert.

## Map INSERTs

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

### **A note on `FROM` clauses**

In dbt, using a hard-coded table or view name in a `FROM` clause is one of the most serious mistakes new users make. dbt uses the ref and source macros to discover the ordering that transformations need to execute in, and if you don’t use them, you’ll be unable to benefit from dbt’s built-in <Term id="data-lineage">lineage</Term> generation and pipeline execution. In the sample code throughout the remainder of this article, we’ll use ref statements in the dbt-converted versions of SQL statements, but it is an exercise for the reader to ensure that those models exist in their dbt projects.

### **Sequential `INSERT`s to an existing table can be `UNION ALL`’ed together**

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

## Map UPDATEs

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

## Map DELETEs

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


## Map MERGEs
dbt has a concept called [materialization](/docs/build/materializations), which determines how a model is physically or logically represented in the warehouse. `INSERT`s, `UPDATE`s, and `DELETE`s will typically be accomplished using <Term id='table'>table</Term> or <Term id='view'>view</Term> materializations. For incremental workloads accomplished via commands like `MERGE` or `UPSERT`, dbt has a particular materialization called [incremental](/docs/build/incremental-models). The incremental materialization is specifically used to handle incremental loads and updates to a table without recreating the entire table from scratch on every run.

### Step 1: Map the MERGE like an INSERT/UPDATE to start

Before we get into the exact details of how to implement an incremental materialization, let’s talk about logic conversion. Extracting the logic of the `MERGE` and handling it as you would an `INSERT` or an `UPDATE` is the easiest way to get started migrating a `MERGE` command. .

To see how the logic conversion works, we’ll start with an example `MERGE`. In this scenario, imagine a ride sharing app where rides are loaded into a details table daily, and tips may be updated at some later date, and need to be kept up-to-date:

```sql
MERGE INTO ride_details USING (
    SELECT
        ride_id,
        subtotal,
        tip

    FROM rides_to_load AS rtl

    ON ride_details.ride_id = rtl.ride_id

    WHEN MATCHED THEN UPDATE

    SET ride_details.tip = rtl.tip

    WHEN NOT MATCHED THEN INSERT (ride_id, subtotal, tip)
    VALUES (rtl.ride_id, rtl.subtotal, NVL(rtl.tip, 0, rtl.tip)
);
```

The content of the `USING` clause is a useful piece of code because that can easily be placed in a CTE as a starting point for handling the match statement. I find that the easiest way to break this apart is to treat each match statement as a separate CTE that builds on the previous match statements.

We can ignore the `ON` clause for now, as that will only come into play once we get to a point where we’re ready to turn this into an incremental.

As with `UPDATE`s and `INSERT`s, you can use the `SELECT` list and aliases to name columns appropriately for the target table, and `UNION` together `INSERT` statements (taking care to use `UNION`, rather than `UNION ALL` to avoid duplicates).

The `MERGE` would end up translating to something like this:

```sql
WITH

using_clause AS (

    SELECT
        ride_id,
        subtotal,
        tip

    FROM {{ ref('rides_to_load') }}

),

updates AS (

    SELECT
        ride_id,
        subtotal,
        tip

    FROM using_clause

),

inserts AS (

    SELECT
        ride_id,
        subtotal,
        NVL(tip, 0, tip)

    FROM using_clause

)

SELECT *

FROM updates

UNION inserts
```

To be clear, this transformation isn’t complete. The logic here is similar to the `MERGE`, but will not actually do the same thing, since the updates and inserts CTEs are both selecting from the same source query. We’ll need to ensure we grab the separate sets of data as we transition to the incremental materialization.

One important caveat is that dbt does not natively support `DELETE` as a `MATCH` action. If you have a line in your `MERGE` statement that uses `WHEN MATCHED THEN DELETE`, you’ll want to treat it like an update and add a soft-delete flag, which is then filtered out in a follow-on transformation.

### Step 2: Convert to incremental materialization

As mentioned above, incremental materializations are a little special in that when the target table does not exist, the materialization functions in nearly the same way as a standard table materialization, and executes a `CREATE TABLE AS SELECT` statement. If the target table does exist, however, the materialization instead executes a `MERGE` statement.

Since a `MERGE` requires a `JOIN` condition between the `USING` clause and the target table, we need a way to specify how dbt determines whether or not a record triggers a match or not. That particular piece of information is specified in the dbt model configuration.

We can add the following `config()` block to the top of our model to specify how it should build incrementally:

```sql
{{
    config(
        materialized='incremental',
        unique_key='ride_id',
        incremental_strategy='merge'
    )
}}
```

The three configuration fields in this example are the most important ones.

- Setting `materialized='incremental'` tells dbt to apply UPSERT logic to the target table.
- The `unique_key` should be a primary key of the target table. This is used to match records with the existing table.
- `incremental_strategy` here is set to MERGE any existing rows in the target table with a value for the `unique_key` which matches the incoming batch of data. There are [various incremental strategies](/docs/build/incremental-models#about-incremental_strategy) for different situations and warehouses.

The bulk of the work in converting a model to an incremental materialization comes in determining how the logic should change for incremental loads versus full backfills or initial loads. dbt offers a special macro, `is_incremental()`, which evaluates false for initial loads or for backfills (called full refreshes in dbt parlance), but true for incremental loads.

This macro can be used to augment the model code to adjust how data is loaded for subsequent loads. How that logic should be added will depend a little bit on how data is received. Some common ways might be:

1. The source table is truncated ahead of incremental loads, and only contains the data to be loaded in that increment.
2. The source table contains all historical data, and there is a load timestamp column that identifies new data to be loaded.

In the first case, the work is essentially done already. Since the source table always contains only the new data to be loaded, the query doesn’t have to change for incremental loads. The second case, however, requires the use of the `is_incremental()` macro to correctly handle the logic.

Taking the converted `MERGE` statement that we’d put together previously, we’d augment it to add this additional logic:

```sql
WITH

using_clause AS (

    SELECT
        ride_id,
        subtotal,
        tip,
        max(load_timestamp) as load_timestamp

    FROM {{ ref('rides_to_load') }}


    {% if is_incremental() %}

        WHERE load_timestamp > (SELECT max(load_timestamp) FROM {{ this }})

    {% endif %}

),

updates AS (

    SELECT
        ride_id,
        subtotal,
        tip,
        load_timestamp

    FROM using_clause

    {% if is_incremental() %}

        WHERE ride_id IN (SELECT ride_id FROM {{ this }})

    {% endif %}

),

inserts AS (

    SELECT
        ride_id,
        subtotal,
        NVL(tip, 0, tip),
        load_timestamp

    FROM using_clause

    WHERE ride_id NOT IN (SELECT ride_id FROM updates)

)

SELECT * FROM updates UNION inserts
```

There are a couple important concepts to understand here:

1. The code in the `is_incremental()` conditional block only executes for incremental executions of this model code. If the target table doesn’t exist, or if the `--full-refresh` option is used, that code will not execute.
2. `{{ this }}` is a special keyword in dbt that when used in a Jinja block, self-refers to the model for which the code is executing. So if you have a model in a file called `my_incremental_model.sql`, `{{ this }}` will refer to `my_incremental_model` (fully qualified with database and schema name if necessary). By using that keyword, we can leverage the current state of the target table to inform the source query.


## Migrate Stores procedures

The techniques shared above are useful ways to get started converting the individual DML statements that are often found in stored procedures. Using these types of patterns, legacy procedural code can be rapidly transitioned to dbt models that are much more readable, maintainable, and benefit from software engineering best practices like <Term id='dry'>DRY principles</Term>. Additionally, once transformations are rewritten as dbt models, it becomes much easier to test the transformations to ensure that the data being used downstream is high-quality and trustworthy.
