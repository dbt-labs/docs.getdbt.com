---
title: "About state-aware orchestration"
description: "Learn about how state-aware orchestration automatically determines which models to build by detecting changes in code or data every time a job runs." 
id: "state-aware-about"
tags: ['scheduler','SAO']
---

# About state-aware orchestration <Lifecycle status="private_preview,managed,managed_plus" />

<IntroText>

Every time a job runs, state-aware orchestration automatically determines which models to build by detecting changes in code or data.

</IntroText>

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';

<FusionLifecycle />

State-aware orchestration saves you compute costs and reduces runtime because when a job runs, it checks for new records and only builds the models that will change.

<Lightbox src="/img/docs/deploy/sao.gif" title="Fusion powered state-aware orchestration" />

We built <Constant name="dbt" />'s state-aware orchestration on these four core principles:

- **Real-time shared state:** All jobs write to a real-time shared model-level state, allowing <Constant name="dbt" /> to rebuild only changed models regardless of which jobs the model is built in.
- **Model-level queueing:** Jobs queue up at the model-level so you can avoid any 'collisions' and prevent rebuilding models that were just updated by another job.
- **State-aware and state agnostic support:** You can build jobs dynamically (state-aware) or explicitly (state-agnostic). Both approaches update shared state so everything is kept in sync.
- **Sensible defaults:** State-aware orchestration works out-of-the-box (natively), with an optional configuration setting for more advanced controls. For more information, refer to [state-aware advanced configurations](/docs/deploy/state-aware-setup#advanced-configurations).

:::note
State-aware orchestration does not depend on [static analysis](/docs/fusion/new-concepts#principles-of-static-analysis) and works even when `static_analysis` is disabled.
:::

## Optimizing builds with state-aware orchestration

State-aware orchestration uses shared state tracking to determine which models need to be built by detecting changes in code or data every time a job runs. It also supports custom refresh intervals and custom source freshness configurations, so <Constant name="dbt" /> only rebuilds models when they're actually needed.

For example, you can configure your project so that <Constant name="dbt" /> skips rebuilding the `dim_wizards` model (and its parents) if they’ve already been refreshed within the last 4 hours, even if the job itself runs more frequently.

Without configuring anything, <Constant name="dbt" />'s state-aware orchestration automatically knows to build your models either when the code has changed or if there’s any new data in a source (or upstream model in the case of [dbt Mesh](/docs/mesh/about-mesh)).

**Note:** When a model fails a [data test](/docs/build/data-tests), state-aware orchestration rebuilds it on subsequent runs instead of reusing it from prior state. This ensures dbt reevaluates models with unresolved data quality issues.

### Handling concurrent jobs

If two separate jobs both depend on the same downstream model (for example, `model_ab`) and both detect upstream changes (`updates_on = any`), `model_ab` could run twice &mdash; once for each job. However, if `model_ab` was already built and nothing has changed since that build, neither job will rebuild it. Instead, both jobs will reuse the existing version instead of rebuilding.

Under state-aware orchestration, all jobs read and write from the same shared state and build a model only when either the code or data state has changed. This means that each job individually evaulates whether a model needs rebuilding based on the model’s compiled code and upstream data state.

What happens when jobs overlap:

- If both jobs reach the same model at exactly the same time, one job waits until the other finishes. This is to prevent collisions in the data warehouse when two jobs try to build the same model at the same time.
- After the first job finishes building the model, the second job still checks whether a rebuild is needed. If there are new data or code changes to incorporate, the second job builds the model again. If there are no changes and building the model would produce the same result, the second job reuses the model.

To prevent a job from being built too frequently even when the code or data state has changed, you can reduce build frequency by using the `build_after` config. For information on how to use `build_after`, refer to [Model freshness](/reference/resource-configs/freshness) and [Advanced configurations](/docs/deploy/state-aware-setup#advanced-configurations).

### Handling deleted tables

State-aware orchestration detects and rebuilds models when their tables are deleted in the warehouse, even if there are no code or data changes.

When a table is deleted in the warehouse:

- dbt raises a warning that the expected table is missing.
- The affected model is queued for rebuild during the current run, even if there are no code or data changes.

This behavior ensures consistency between the dbt state and the actual warehouse state. It also reduces the need to manually clear cache or disable state-aware orchestration when models are modified outside of dbt.

## Efficient testing in state-aware orchestration <Lifecycle status="private_beta" />

:::info Private beta feature
State-aware orchestration features in the <Constant name="dbt_platform" /> are only available in Fusion, which is in private preview. Contact your account manager to enable Fusion in your account. 
:::

Data quality can get degraded in two ways: 

- New code changes definitions or introduces edge cases.
- New data, like duplicates or unexpected values, invalidates downstream metrics.

Running dbt’s out-of-the-box [data tests](/docs/build/data-tests) (`unique`, `not_null`, `accepted_values`, `relationships`) on every build helps catch data errors before they impact business decisions. Catching these errors often requires having multiple tests on every model and running tests even when not necessary. If nothing relevant has changed, repeated test executions don’t improve coverage and only increase cost.

With Fusion, dbt gains an understanding of the SQL code based on the logical plan for the compiled code. dbt then can determine when a test must run again, or when a prior upstream test result can be reused.

Efficient testing in state-aware orchestration reduces warehouse costs by avoiding redundant data tests and combining multiple tests into one run. This feature includes two optimizations:
    
- **Test reuse** &mdash; Tests are reused in cases where no logic in the code or no new data could have changed the test's outcome.
- **Test aggregation** &mdash; When there are multiple tests on a model, dbt combines tests to run as a single query against the warehouse, rather than running separate queries for each test.

Currently, Efficient testing is only available in deploy jobs, not in continuous integration (CI) or merge jobs.

### Supported data tests

The following tests can be reused when Efficient testing is enabled:
- [`unique`](/reference/resource-properties/data-tests#unique)
- [`not_null`](/reference/resource-properties/data-tests#not_null)
- [`accepted_values`](/reference/resource-properties/data-tests#accepted_values)

### Enabling Efficient testing

Before enabling Efficient testing, make sure you have configured [`static_analysis`](/docs/fusion/new-concepts#configuring-static_analysis).

To enable Efficient testing:

1. From the main menu, go to **Orchestration** > **Jobs**. 
2. Select your deploy job. Go to your job settings and click **Edit**. 
3. Under **Enable Fusion cost optimization features**, expand **More options**.
4. Select **Efficient testing**. This feature is disabled by default.
5. Click **Save**.

### Example

In the following query, you’re joining an `orders` and a `customers` table:

```sql
with

orders as (

    select * from {{ ref('orders') }}

),

customers as (

    select * from {{ ref('customers') }}

),

joined as (

    select
        customers.customer_id as customer_id,
        orders.order_id as order_id
    from customers
    left join orders
        on orders.customer_id = customers.customer_id

)

select * from joined
```

- `not_null` test: A `left join` can introduce null values for customers without orders. Even if upstream tests verified `not_null(order_id)` in orders, the join can create null values downstream. dbt must always run a `not_null` test on `order_id` in this joined result.

- `unique` test: If `orders.order_id` and `customers.customer_id` are unique upstream, uniqueness of `order_id` is preserved and the upstream result can be reused. 

### Limitations

The following section lists some considerations when using Efficient testing in state-aware-orchestration:

- **Aggregated tests do not support custom configs**. Tests that include the following [custom config options](/reference/data-test-configs) will run individually rather than as part of the aggregated batch:

  ```yaml
  config:
    fail_calc: <string>
    limit: <integer>
    severity: error | warn
    error_if: <string>
    warn_if: <string>
    store_failures: true | false
    where: <string>
  ```
  
 - **Efficient testing is available only in deploy jobs**. CI and merge jobs currently do not have the option to enable this feature. 

## Related FAQs

<FAQ path="Runs/sao-difference-core" />

## Related docs

- [State-aware orchestration configuration](/docs/deploy/state-aware-setup)
- [Artifacts](/docs/deploy/artifacts)
- [Continuous integration (CI) jobs](/docs/deploy/ci-jobs)
- [`freshness`](/reference/resource-configs/freshness)
