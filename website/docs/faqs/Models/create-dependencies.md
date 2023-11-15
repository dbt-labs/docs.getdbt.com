---
title: How do I create dependencies between models?
description: "Using ref function to create dependencies"
sidebar_label: 'Creating dependencies between models'
id: create-dependencies

---

When you use the `ref` [function](/reference/dbt-jinja-functions/ref), dbt automatically infers the dependencies between models.

For example, consider a model, `customer_orders`, like so:

<File name='models/customer_orders.sql'>

```sql
select
    customer_id,
    min(order_date) as first_order_date,
    max(order_date) as most_recent_order_date,
    count(order_id) as number_of_orders
from {{ ref('stg_orders') }}
group by 1

```

</File>

**There's no need to explicitly define these dependencies.** dbt will understand that the `stg_orders` model needs to be built before the above model (`customer_orders`). When you execute `dbt run`, you will see these being built in order:

```txt
$ dbt run
Running with dbt=0.16.0
Found 2 models, 28 tests, 0 snapshots, 0 analyses, 130 macros, 0 operations, 0 seed files, 3 sources

11:42:52 | Concurrency: 8 threads (target='dev_snowflake')
11:42:52 |
11:42:52 | 1 of 2 START view model dbt_claire.stg_jaffle_shop__orders........... [RUN]
11:42:55 | 1 of 2 OK creating view model dbt_claire.stg_jaffle_shop__orders..... [CREATE VIEW in 2.50s]
11:42:55 | 2 of 2 START relation dbt_claire.customer_orders..................... [RUN]
11:42:56 | 2 of 2 OK creating view model dbt_claire.customer_orders............. [CREATE VIEW in 0.60s]
11:42:56 | Finished running 2 view models in 15.13s.


Done. PASS=2 WARN=0 ERROR=0 SKIP=0 TOTAL=2
```

To learn more about building a dbt project, we recommend you complete the [quickstart guide](/guides).
