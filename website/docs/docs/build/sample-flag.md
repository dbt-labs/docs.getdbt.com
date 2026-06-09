---
title: "About the sample flag"
description: "Use the sample flag to lower development time and reduce warehouse spend."
sidebar_label: "The sample flag"
pagination_next: null
pagination_prev: "docs/build/empty-flag"
---

# About the `--sample` flag

:::note

The `--sample` flag is not currently available for Python models. If the flag is used with a Python model, it will be ignored.

Seeds will be created normally, but are sampled when referenced by downstream nodes. 

:::

Large data sets can drastically increase build times and reduce how quickly dbt developers can build and test new code. The dbt `--sample` flag can help to reduce build times and warehouse spend by running dbt in sample mode. Sample mode enables you to address cases where you don't need to build the entire model during the development or CI cycle but include enough data to validate the outputs. 

Sample mode takes the [`--empty` flag's](/docs/build/empty-flag) validation of semantic results a step further by including a sampling of data from the model(s) in your development schema. It won't solve every scenario; for example, there are cases where not all joins will be populated. However, it presents a viable solution for faster building, testing, and validating many strategies. 

The `--sample` flag will become more robust over time, but it only supports time-based sampling for now.

## Using the `--sample` flag

The `--sample` flag is available for the [`run`](/reference/commands/run) and [`build`](/reference/commands/build) commands. When used, sample mode wraps each `ref()` and `source()` in a time filter on that resource's configured [`event_time`](/reference/resource-configs/event-time) column. There is no automatic timestamp detection. If `event_time` is not configured on an upstream model, source, or seed, dbt reads the full table instead.

:::warning
dbt does not warn when it reads a full table because `event_time` is missing. Configure `event_time` on every upstream model, source, or seed you expect to be sampled, or you may unintentionally query large datasets at full scale.
:::

By default, every `ref()` and `source()` in your model SQL is filtered during a `--sample` run. To leave a relation unfiltered, append `.render()` in the model's `.sql` file. Refer to [Opt out of sampling](#opt-out-of-sampling) for an example.

There are two time-based sample specifications supported for sample mode:
- **Relative time specs:** Filters sampled data from the time the command is run back to a specified integer and granularity. Supported granularities are:
    - Hours
    - Days
    - Months
    - Years
- **Static time specs:** Filters your data between a defined start and end period using date and/or timestamp.

dbt applies the filter as a subquery with a `WHERE` clause, limited to the time window you pass to `--sample`. Relative time specs are calculated from the time the command runs (UTC).

When you use `--sample`, dbt executes your model SQL against the warehouse and builds tables containing only data from the specified time window.

### Examples

The following examples use a `jaffle_shop` project with `stg_customers` and `stg_orders` staging models, plus an `fct_orders` fact model downstream.

#### Configure `event_time`

Before sample mode can filter a resource, set [`event_time`](/reference/resource-configs/event-time) on the source or model to the column dbt should use for time filtering:

```yml
sources:
  - name: jaffle_shop
    tables:
      - name: customers
        config:
          event_time: customer_created_at
      - name: orders
        config:
          event_time: order_placed_at

models:
  - name: stg_customers
    config:
      event_time: customer_created_at
  - name: stg_orders
    config:
      event_time: order_placed_at
```

When you run with `--sample`, dbt uses these configs to filter `source()` and `ref()` calls. `stg_customers` reads from the `jaffle_shop.customers` source; `stg_orders` reads from `jaffle_shop.orders`.

#### Run with `--sample`

From the terminal or IDE, run a staging model with a relative time window of three days:

```
dbt run --select path/to/stg_customers --sample="3 days"
```

Run the downstream `fct_orders` model with a shorter window:

```
dbt run --select path/to/fct_orders --sample="6 hours"
```

To sample a fixed historical range instead of a window relative to when the command runs, specify a start and end date or timestamp:

```
dbt run --select path/to/fct_orders --sample="{'start': '2024-07-01', 'end': '2024-07-08 18:00:00'}"
```

#### Opt out of sampling

If a model should read an upstream relation in full during a `--sample` run, append `.render()` to that `ref()` or `source()` in the model's `.sql` file.

In `fct_orders`, you might keep `stg_customers` unfiltered while still sampling `stg_orders`:

```sql
select *
from {{ ref('stg_orders') }}
left join {{ ref('stg_customers').render() }} as stg_customers using (customer_id)
```

When you run `dbt run --select path/to/fct_orders --sample="6 hours"`, dbt samples `stg_orders` using the `event_time` configured above. `stg_customers` is not sampled because `.render()` skips the time filter for that `ref()`.
 