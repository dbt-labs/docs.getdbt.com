---
title: "Anti Patterns for dbt Cloud jobs"
id: "dbt-cloud-job-anti-patterns"
slug: anti-patterns
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

Creating distinct jobs to invoke a single model as shown in the above example is strongly discouraged because it creates a lot of overhead for each job run. Specifically for each job:
- the run will queue to be processed by the dbt Cloud Scheduler
- the dbt Cloud Scheduler will prepare an environment to execute dbt in
- dbt will clone the repository
- dbt will clone the packaage dependencies
- dbt will parse the complete project
- dbt will establish the connection with the warehouse
all before the model build begins.
This setup cost is efficient when dbt runs a large swath of the DAG, but every inefficient if dbt runs a single model at a time. dbt is optimized to process a graph of nodes, and it's important to not extract each model from the DAG separately in a job.

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

