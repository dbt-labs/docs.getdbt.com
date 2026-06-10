---
title: "dbt State usage examples"
sidebar_label: "dbt State examples"
description: "Side-by-side dbt Core and dbt Core with dbt State execution scenarios using the Jaffle Shop project."
id: "dbt-state-examples"
tags: ['dbt State']
pagination_prev: "docs/deploy/dbt-state-deferral"
pagination_next: "docs/deploy/dbt-state-migration"
---

# Example usage for dbt State <Lifecycle status="preview" />

<IntroText>

These examples use the Jaffle Shop project to show side-by-side comparisons of CLI output with and without dbt State enabled.

</IntroText>

The following examples use this [Jaffle Shop project](https://github.com/dbt-labs/jaffle-shop) DAG as a reference. You can refer to it to understand the model lineage for each scenario.

<Lightbox src="/img/docs/dbt-state/dbt_state_dag.png" title="The Jaffle Shop DAG" />

Each of the following scenarios shows how a run differs between <Constant name="core" /> alone and <Constant name="core" /> with dbt State, using the same command and project.

| Scenario | Command | What dbt State changes |
| --- | --- | --- |
| [Initial run in empty schema](#initial-run-in-empty-schema) | `dbt run --target prod` | Same result |
| [Second run](#second-run) | `dbt run --target prod` | Reuses unchanged table models; rebuilds views with `select *` |
| [Selecting a model in a fresh dev environment after changing the customers model](#selecting-a-model-in-a-fresh-dev-environment-after-changing-the-customers-model) | `dbt run --target dev --select "customers"` | Defers to prod for upstream models |
| [Selecting a model in a new dev schema with no model changes](#selecting-a-model-in-a-new-dev-schema-with-no-model-changes) | `dbt run --target dev --select "customers"` | Defers and clones unchanged models |

## Initial run in empty schema

```shell
dbt run --target prod
```

You get the same result with and without dbt State.

<Tabs queryString="initial-run">
<TabItem value="without" label="Without dbt State">


```shell
Running with dbt=1.12.0-b2
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 644 macros, 3 unit tests

Concurrency: 1 threads (target='prod')

1 of 12 START sql view model jaffle_analytics.stg_customers .................... [RUN]
1 of 12 OK created sql view model jaffle_analytics.stg_customers ............... [SUCCESS 1 in 0.54s]
2 of 12 START sql view model jaffle_analytics.stg_locations .................... [RUN]
2 of 12 OK created sql view model jaffle_analytics.stg_locations ............... [SUCCESS 1 in 0.48s]
3 of 12 START sql view model jaffle_analytics.stg_order_items .................. [RUN]
3 of 12 OK created sql view model jaffle_analytics.stg_order_items ............. [SUCCESS 1 in 0.51s]
4 of 12 START sql view model jaffle_analytics.stg_orders ....................... [RUN]
4 of 12 OK created sql view model jaffle_analytics.stg_orders .................. [SUCCESS 1 in 0.77s]
5 of 12 START sql view model jaffle_analytics.stg_products ..................... [RUN]
5 of 12 OK created sql view model jaffle_analytics.stg_products ................ [SUCCESS 1 in 0.58s]
6 of 12 START sql view model jaffle_analytics.stg_supplies ..................... [RUN]
6 of 12 OK created sql view model jaffle_analytics.stg_supplies ................ [SUCCESS 1 in 0.63s]
7 of 12 START sql table model jaffle_analytics.locations ....................... [RUN]
7 of 12 OK created sql table model jaffle_analytics.locations .................. [SUCCESS 1 in 1.81s]
8 of 12 START sql table model jaffle_analytics.products ........................ [RUN]
8 of 12 OK created sql table model jaffle_analytics.products ................... [SUCCESS 1 in 1.33s]
9 of 12 START sql table model jaffle_analytics.order_items ..................... [RUN]
9 of 12 OK created sql table model jaffle_analytics.order_items ................ [SUCCESS 1 in 2.09s]
10 of 12 START sql table model jaffle_analytics.supplies ....................... [RUN]
10 of 12 OK created sql table model jaffle_analytics.supplies .................. [SUCCESS 1 in 1.26s]
11 of 12 START sql table model jaffle_analytics.orders ......................... [RUN]
11 of 12 OK created sql table model jaffle_analytics.orders .................... [SUCCESS 1 in 1.70s]
12 of 12 START sql table model jaffle_analytics.customers ...................... [RUN]
12 of 12 OK created sql table model jaffle_analytics.customers ................. [SUCCESS 1 in 1.77s]

Finished running 6 table models, 6 view models in 0 hours 0 minutes and 17.77 seconds (17.77s).

Completed successfully

Done. PASS=12 WARN=0 ERROR=0 SKIP=0 NO-OP=0 TOTAL=12
```


</TabItem>
<TabItem value="with" label="With dbt State">

```shell
Running with dbt=1.12.0-b2
State adapter: dbt-state v2.22.7 is enabled
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 644 macros, 3 unit tests

Concurrency: 1 threads (target='prod')

1 of 12 START sql view model jaffle_analytics.stg_customers .................... [RUN]
State adapter: Fetching freshness metadata
1 of 12 OK created sql view model jaffle_analytics.stg_customers ............... [SUCCESS 1 in 0.54s]
2 of 12 START sql view model jaffle_analytics.stg_locations .................... [RUN]
2 of 12 OK created sql view model jaffle_analytics.stg_locations ............... [SUCCESS 1 in 0.48s]
3 of 12 START sql view model jaffle_analytics.stg_order_items .................. [RUN]
3 of 12 OK created sql view model jaffle_analytics.stg_order_items ............. [SUCCESS 1 in 0.51s]
4 of 12 START sql view model jaffle_analytics.stg_orders ....................... [RUN]
4 of 12 OK created sql view model jaffle_analytics.stg_orders .................. [SUCCESS 1 in 0.77s]
5 of 12 START sql view model jaffle_analytics.stg_products ..................... [RUN]
5 of 12 OK created sql view model jaffle_analytics.stg_products ................ [SUCCESS 1 in 0.58s]
6 of 12 START sql view model jaffle_analytics.stg_supplies ..................... [RUN]
6 of 12 OK created sql view model jaffle_analytics.stg_supplies ................ [SUCCESS 1 in 0.63s]
7 of 12 START sql table model jaffle_analytics.locations ....................... [RUN]
7 of 12 OK created sql table model jaffle_analytics.locations .................. [SUCCESS 1 in 1.81s]
8 of 12 START sql table model jaffle_analytics.products ........................ [RUN]
8 of 12 OK created sql table model jaffle_analytics.products ................... [SUCCESS 1 in 1.33s]
9 of 12 START sql table model jaffle_analytics.order_items ..................... [RUN]
9 of 12 OK created sql table model jaffle_analytics.order_items ................ [SUCCESS 1 in 2.09s]
10 of 12 START sql table model jaffle_analytics.supplies ....................... [RUN]
10 of 12 OK created sql table model jaffle_analytics.supplies .................. [SUCCESS 1 in 1.26s]
11 of 12 START sql table model jaffle_analytics.orders ......................... [RUN]
11 of 12 OK created sql table model jaffle_analytics.orders .................... [SUCCESS 1 in 1.70s]
12 of 12 START sql table model jaffle_analytics.customers ...................... [RUN]
12 of 12 OK created sql table model jaffle_analytics.customers ................. [SUCCESS 1 in 1.77s]

Finished running 6 table models, 6 view models in 0 hours 0 minutes and 17.77 seconds (17.77s).

Completed successfully. Total cache hits: 0. Estimated time saved: 0.00s. Freshness tolerance: 45m.

Done. PASS=12 WARN=0 ERROR=0 SKIP=0 NO-OP=0 REUSED=0 TOTAL=12
```

</TabItem>
</Tabs>

## Second run

```shell
dbt run --target prod
```

With dbt State enabled, the six table models are reused — nothing changed, so there's nothing to rebuild. The six staging views still rebuild because they use `select *`. [Learn why views with `select *` are always rebuilt.](/faqs/State/views-rebuilt)

<Tabs queryString="second-run">
<TabItem value="without" label="Without dbt State">

```shell
Running with dbt=1.12.0-b2
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 644 macros, 3 unit tests

Concurrency: 1 threads (target='prod')

1 of 12 START sql view model jaffle_analytics.stg_customers .................... [RUN]
1 of 12 OK created sql view model jaffle_analytics.stg_customers ............... [SUCCESS 1 in 0.54s]
2 of 12 START sql view model jaffle_analytics.stg_locations .................... [RUN]
2 of 12 OK created sql view model jaffle_analytics.stg_locations ............... [SUCCESS 1 in 0.48s]
3 of 12 START sql view model jaffle_analytics.stg_order_items .................. [RUN]
3 of 12 OK created sql view model jaffle_analytics.stg_order_items ............. [SUCCESS 1 in 0.51s]
4 of 12 START sql view model jaffle_analytics.stg_orders ....................... [RUN]
4 of 12 OK created sql view model jaffle_analytics.stg_orders .................. [SUCCESS 1 in 0.77s]
5 of 12 START sql view model jaffle_analytics.stg_products ..................... [RUN]
5 of 12 OK created sql view model jaffle_analytics.stg_products ................ [SUCCESS 1 in 0.58s]
6 of 12 START sql view model jaffle_analytics.stg_supplies ..................... [RUN]
6 of 12 OK created sql view model jaffle_analytics.stg_supplies ................ [SUCCESS 1 in 0.63s]
7 of 12 START sql table model jaffle_analytics.locations ....................... [RUN]
7 of 12 OK created sql table model jaffle_analytics.locations .................. [SUCCESS 1 in 1.81s]
8 of 12 START sql table model jaffle_analytics.products ........................ [RUN]
8 of 12 OK created sql table model jaffle_analytics.products ................... [SUCCESS 1 in 1.33s]
9 of 12 START sql table model jaffle_analytics.order_items ..................... [RUN]
9 of 12 OK created sql table model jaffle_analytics.order_items ................ [SUCCESS 1 in 2.09s]
10 of 12 START sql table model jaffle_analytics.supplies ....................... [RUN]
10 of 12 OK created sql table model jaffle_analytics.supplies .................. [SUCCESS 1 in 1.26s]
11 of 12 START sql table model jaffle_analytics.orders ......................... [RUN]
11 of 12 OK created sql table model jaffle_analytics.orders .................... [SUCCESS 1 in 1.70s]
12 of 12 START sql table model jaffle_analytics.customers ...................... [RUN]
12 of 12 OK created sql table model jaffle_analytics.customers ................. [SUCCESS 1 in 1.77s]

Finished running 6 table models, 6 view models in 0 hours 0 minutes and 17.77 seconds (17.77s).

Completed successfully

Done. PASS=12 WARN=0 ERROR=0 SKIP=0 NO-OP=0 TOTAL=12
```

</TabItem>
<TabItem value="with" label="With dbt State">

```shell
Running with dbt=1.12.0-b2
State adapter: dbt-state v2.22.7 is enabled
Registered adapter: snowflake=1.11.5
Unable to do partial parsing because of a version mismatch
Found 12 models, 6 seeds, 27 data tests, 6 sources, 658 macros, 3 unit tests

Concurrency: 1 threads (target='prod')

1 of 12 START sql view model jaffle_analytics.stg_customers .................... [RUN]
State adapter: Fetching freshness metadata
1 of 12 OK created sql view model jaffle_analytics.stg_customers ............... [SUCCESS 1 in 47.73s]
2 of 12 START sql view model jaffle_analytics.stg_locations .................... [RUN]
2 of 12 OK created sql view model jaffle_analytics.stg_locations ............... [SUCCESS 1 in 0.87s]
3 of 12 START sql view model jaffle_analytics.stg_order_items .................. [RUN]
3 of 12 OK created sql view model jaffle_analytics.stg_order_items ............. [SUCCESS 1 in 1.04s]
4 of 12 START sql view model jaffle_analytics.stg_orders ....................... [RUN]
4 of 12 OK created sql view model jaffle_analytics.stg_orders .................. [SUCCESS 1 in 0.74s]
5 of 12 START sql view model jaffle_analytics.stg_products ..................... [RUN]
5 of 12 OK created sql view model jaffle_analytics.stg_products ................ [SUCCESS 1 in 1.47s]
6 of 12 START sql view model jaffle_analytics.stg_supplies ..................... [RUN]
6 of 12 OK created sql view model jaffle_analytics.stg_supplies ................ [SUCCESS 1 in 0.92s]
7 of 12 START sql table model jaffle_analytics.locations ....................... [RUN]
7 of 12 OK created sql table model jaffle_analytics.locations .................. [No new changes in 1.84s]
8 of 12 START sql table model jaffle_analytics.products ........................ [RUN]
8 of 12 OK created sql table model jaffle_analytics.products ................... [No new changes in 1.99s]
9 of 12 START sql table model jaffle_analytics.order_items ..................... [RUN]
9 of 12 OK created sql table model jaffle_analytics.order_items ................ [No new changes in 2.35s]
10 of 12 START sql table model jaffle_analytics.supplies ....................... [RUN]
10 of 12 OK created sql table model jaffle_analytics.supplies .................. [No new changes in 0.24s]
11 of 12 START sql table model jaffle_analytics.orders ......................... [RUN]
11 of 12 OK created sql table model jaffle_analytics.orders .................... [No new changes in 1.07s]
12 of 12 START sql table model jaffle_analytics.customers ...................... [RUN]
12 of 12 OK created sql table model jaffle_analytics.customers ................. [No new changes in 2.19s]

Finished running 6 table models, 6 view models in 0 hours 1 minutes and 9.79 seconds (69.79s).

Completed successfully. Total cache hits: 6. Estimated time saved: 12.32s. Freshness tolerance: 45m.

Done. PASS=6 WARN=0 ERROR=0 SKIP=0 NO-OP=0 REUSED=6 TOTAL=12
```

</TabItem>
</Tabs>

## Selecting a model in a fresh dev environment after changing the customers model

```shell
dbt run --target dev --select "customers"
```

Imagine you've made a small change to the `customers` model and run it in a fresh developer schema. Without dbt State, <Constant name="core" /> fails because upstream relations are missing. With dbt State, dbt [defers](/docs/deploy/dbt-state-deferral) to prod for upstream models and runs only the updated `customers` model.

<Tabs queryString="select-customers-fresh-dev">
<TabItem value="without" label="Without dbt State">

```shell
Running with dbt=1.12.0-b2
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 658 macros, 3 unit tests

Concurrency: 1 threads (target='dev')

1 of 1 START sql table model dbt_schema.customers .............................. [RUN]
1 of 1 ERROR creating sql table model dbt_schema.customers ..................... [ERROR in 0.36s]

Finished running 1 table model in 0 hours 0 minutes and 5.11 seconds (5.11s).

Completed with 1 error, 0 partial successes, and 0 warnings:

[ERROR]: in model customers (models/marts/customers.sql)
  Database Error in model customers (models/marts/customers.sql)
  002003 (42S02): SQL compilation error:
  Object 'ANALYTICS.DBT_SCHEMA.STG_CUSTOMERS' does not exist or not authorized.
  compiled code at target/run/jaffle_shop/models/marts/customers.sql

  compiled code at target/compiled/jaffle_shop/models/marts/customers.sql

Done. PASS=0 WARN=0 ERROR=1 SKIP=0 NO-OP=0 REUSED=0 TOTAL=1
```

</TabItem>
<TabItem value="with" label="With dbt State">

```shell
Running with dbt=1.12.0-b2
State adapter: dbt-state v2.22.7 is enabled
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 658 macros, 3 unit tests

Concurrency: 1 threads (target='dev')

1 of 1 START sql table model dbt_schema.customers .............................. [RUN]
State adapter: Fetching freshness metadata
1 of 1 OK created sql table model dbt_schema.customers ......................... [SUCCESS 128 in 52.46s]

Finished running 1 table model in 0 hours 0 minutes and 58.06 seconds (58.06s).

Completed successfully

Done. PASS=1 WARN=0 ERROR=0 SKIP=0 NO-OP=0 REUSED=0 TOTAL=1
```


</TabItem>
</Tabs>


## Selecting a model in a new dev schema with no model changes

```shell
dbt run --target dev --select "customers"
```

Suppose you create a fresh dev schema and run only the `customers` model. Without dbt State, <Constant name="core" /> fails because there is no data in the schema. With dbt State, dbt knows `customers` just ran in another schema: it defers to prod for upstream models and clones `customers` because the outcome is unchanged.

<Tabs queryString="select-customers-new-dev">
<TabItem value="without" label="Without dbt State">

```shell
Running with dbt=1.12.0-b2
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 658 macros, 3 unit tests

Concurrency: 1 threads (target='dev')

1 of 1 START sql table model dbt_schema.customers .............................. [RUN]
1 of 1 ERROR creating sql table model dbt_schema.customers ..................... [ERROR in 0.36s]

Finished running 1 table model in 0 hours 0 minutes and 5.11 seconds (5.11s).

Completed with 1 error, 0 partial successes, and 0 warnings:

[ERROR]: in model customers (models/marts/customers.sql)
  Database Error in model customers (models/marts/customers.sql)
  002003 (42S02): SQL compilation error:
  Object 'ANALYTICS.DBT_SCHEMA.STG_CUSTOMERS' does not exist or not authorized.
  compiled code at target/run/jaffle_shop/models/marts/customers.sql

  compiled code at target/compiled/jaffle_shop/models/marts/customers.sql

Done. PASS=0 WARN=0 ERROR=1 SKIP=0 NO-OP=0 REUSED=0 TOTAL=1
```

</TabItem>
<TabItem value="with" label="With dbt State">

```shell
Running with dbt=1.12.0-b2
State adapter: dbt-state v2.22.7 is enabled
Registered adapter: snowflake=1.11.5
Found 12 models, 6 seeds, 27 data tests, 6 sources, 658 macros, 3 unit tests

Concurrency: 1 threads (target='dev')

1 of 1 START sql table model dbt_schema.customers .............................. [RUN]
State adapter: Fetching freshness metadata
1 of 1 OK created sql table model dbt_schema.customers ......................... [Cloned from other environment in 57.19s]

Finished running 1 table model in 0 hours 1 minutes and 3.50 seconds (63.50s).

Completed successfully. Total cache hits: 1. Estimated time saved: 2.20s. Freshness tolerance: 45m.

Done. PASS=0 WARN=0 ERROR=0 SKIP=0 NO-OP=0 REUSED=1 TOTAL=1
```

</TabItem>
</Tabs>

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Setting up dbt State](/docs/deploy/dbt-state-setup)
- [CI/CD setup for dbt State](/docs/deploy/dbt-state-cicd)
- [Configuring deferral in dbt State](/docs/deploy/dbt-state-deferral)
- [Monitoring dbt State activity in dbt platform](/docs/deploy/dbt-state-interface)
- [Migrating from state-aware orchestration to dbt State](/docs/deploy/dbt-state-migration)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
