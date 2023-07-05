---
title: "Anti Patterns for dbt Cloud jobs"
id: "dbt-cloud-job-anti-patterns"
slug: 3-anti-patterns
description: Recognize common anti-patterns in dbt Cloud jobs
displayText: dbt Cloud job anti-patterns
hoverSnippet: Recognize common anti-patterns in dbt Cloud jobs.
---

dbt's ref() function enables running data models in the proper sequence automatically and in parallel. Thus, it's possible to make things harder than they need to be by making dbt Cloud job runs too specific. See organizing-dbt-cloud-jobs for our recommendations on approach.

### Example DAG

Model `fct_orders` ref()s `int_orders` which ref()s `stg_orders`

The `models/` directory of the dbt Project looks like this:

```
models/
  staging/
    stg_orders.sql
    stg_items.sql
  intermediate/
    int_orders.sql
    int_order_items.sql
  marts/
    fct_order_items.sql
```

### Creating and running a separate dbt Cloud job for each model

In Job 1:
`dbt run -s stg_orders`

In Job 2:
`dbt run -s int_orders`

In Job 3:
`dbt run -s fct_orders`

Issuing the separate `dbt run` commands for models `a` and `b` causes dbt to close the job session before opening a new one. This results in repeating the work to clone dependencies and parse the project before `stg_customers` is run and again before `stg_items`. It also creates some additional latency when dbt drops and then re-acquires the database connection.

### Too many dbt run commands in a single dbt Cloud job

In Job 1:
`dbt run -s model_a`
`dbt run -s model_b`
`dbt run -s model_c`

This is a slightly better situation than the one above with wholly separate jobs, but still causes dbt to start a new session on the warehouse before it can run `model_b` and againg before `model_c`.

### A Better Approach

Take advantage of the ref() statement and dbt selection syntax to run your models in parallel.

In Job 1:
`dbt run -s stg_orders stg_order_items stg_items`
OR
`dbt run -s staging`
OR
`dbt run -s tag:hourly`

