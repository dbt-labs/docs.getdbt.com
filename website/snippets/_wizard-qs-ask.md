Copy each prompt into the chat, one at a time. <Constant name="wizard" /> answers from your project's metadata, so the answers describe jaffle shop, not a generic project. Your wording will differ a little from the examples here.

1. **Get the big picture**

    ```text
    Tell me about this project
    ```

    **You should see** something like:

    > This is **Jaffle Shop**, a small, self-contained dbt playground for a fictional ecommerce store, using **DuckDB** locally.
    >
    > - **Inputs:** Three CSV seeds contain raw customers, orders, and payments.
    > - **Staging:** `stg_customers`, `stg_orders`, and `stg_payments` standardize the inputs.
    > - **Customer analytics:** `customers` produces one row per customer, with first and latest order dates, order count, and lifetime payment value.
    > - **Order analytics:** `orders` produces one row per order, with total payment amount and a breakdown by payment method.
    > - **Coverage:** 20 tests, and 25% documentation coverage.

2. **Check the testing**

    ```text
    What tests does the orders model have, and what isn't covered?
    ```

    **You should see** a table of the tests on `orders`, followed by gaps. For example:

    > `orders` has **10 configured data tests**: `unique` and `not_null` on `order_id`, `not_null` and a relationship to `customers` on `customer_id`, accepted values on `status`, and `not_null` on `amount` and each payment method amount.
    >
    > **What isn't covered:** `order_date` has no tests, there's no `not_null` test on `status`, and nothing checks that `amount` equals the sum of the payment method amounts.

3. **Trace the lineage**

    ```text
    What feeds into the orders model, and what depends on it?
    ```

    **You should see** something like: `orders` is built from `stg_orders` and `stg_payments`, which come from the `raw_orders` and `raw_payments` seeds. Nothing in the project depends on `orders` yet. `customers` reads the staging models directly.

    Explore it yourself. Select a model to trace its lineage, and turn on **Show tests** to see the tests attached to each model.

    <LineageGraph graph="jaffleShop" focus="orders" />

**What just happened:** <Constant name="wizard" /> read your models, tests, and lineage instead of guessing from file names. It answered without editing anything.
