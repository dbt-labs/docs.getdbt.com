---
title: Merges
id: 5-merges
---

dbt has a concept called [materialization](/docs/build/materializations), which determines how a model is physically or logically represented in the warehouse. `INSERT`s, `UPDATE`s, and `DELETE`s will typically be accomplished using <Term id='table'>table</Term> or <Term id='view'>view</Term> materializations. For incremental workloads accomplished via commands like `MERGE` or `UPSERT`, dbt has a particular materialization called [incremental](/docs/build/incremental-models). The incremental materialization is specifically used to handle incremental loads and updates to a table without recreating the entire table from scratch on every run.

## Step 1: Map the MERGE like an INSERT/UPDATE to start

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
