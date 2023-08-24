---
title: "Cumulative metrics"
id: cumulative
description: "Use Cumulative metrics to aggregate a measure over a given window."
sidebar_label: Cumulative
tags: [Metrics, Semantic Layer]
---

Cumulative metrics aggregate a measure over a given accumulation window. If no window is specified, the window is considered infinite and accumulates values over all time. You will need to create the [time spine model](/docs/build/metricflow-time-spine) before you add cumulative metrics.

This metric is common for calculating things like weekly active users, or month-to-date revenue.  The parameters, description, and type for cumulative metrics are: 

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| `name` | The name of the metric. | Required |
| `description` | The description of the metric. | Optional |
| `type` | The type of the metric (cumulative, derived, ratio, or simple). | Required |
| `label` | The value that will be displayed in downstream tools. | Required |
| `type_params` | The type parameters of the metric. | Required |
| `measure` | The measure you are referencing. | Required |
| `window` | The accumulation window, such as 1 month, 7 days, 1 year. This can't be used with `window`. | Optional  |
| `grain_to_date` | Sets the accumulation grain, such as month will accumulate data for one month. Then restart at the beginning of the next. This can't be used with window. | Optional |

The following displays the complete specification for cumulative metrics, along with an example:

```yaml
metrics:
  - name: The metric name # Required
    description: The metric description # Optional
    type: cumulative # Required
    label: The value that will be displayed in downstream tools # Required
    type_params: # Required
      measure: The measure you are referencing # Required
      window: The accumulation window, such as 1 month, 7 days, 1 year. # Optional. Can not be used with window. 
      grain_to_date: Sets the accumulation grain, such as month will accumulate data for one month, then restart at the beginning of the next.  # Optional. Cannot be used with grain_to_date

```

## Cumulative metrics example


:::tip MetricFlow time spine required

You will need to create the [time spine model](/docs/build/metricflow-time-spine) before you add cumulative metrics.

:::

Cumulative metrics measure data over a given window and consider the window infinite when no window parameter is passed, accumulating the data over all time.

```yaml

metrics:
  - name: cumulative_order_total
    label: Cumulative Order total (All Time)    
    description: The cumulative value of all orders
    type: cumulative
    type_params:
      measure: order_total
  - name: cumulative_order_total_l1m
    label: Cumulative Order total (L1M)   
    description: Trailing 1 month cumulative order amount
    type: cumulative
    type_params:
      measure: order_total
      window: 1 month
  - name: cumulative_order_total_mtd
    label: Cumulative Order total (MTD)
    description: The month to date value of all orders
    type: cumulative
    type_params:
      measure: order_total
      grain_to_date: month
```

### Window options

This section details examples of when you specify and don't specify window options.

<Tabs>

<TabItem value="specified" label="Example of window specified">

If a window option is specified, the MetricFlow framework applies a sliding window to the underlying measure. 

Suppose the underlying measure `customers` is configured to count the unique customers making orders at the Jaffle shop.

```yaml
measures:
  - name: customers
    expr: customer_id
    agg: count_distinct

```

We can write a cumulative metric `weekly_customers` as such: 

``` yaml
metrics: 
  - name: weekly_customers # Define the measure and the window.
  type: cumulative
  type_params:
    measure: customers
    window: 7 days # Setting the window to 7 days since we want to track weekly active 
```

From the sample YAML above, note the following: 

* `type`: Specify cumulative to indicate the type of metric. 
* `type_params`: Specify the measure you want to aggregate as a cumulative metric. You have the option of specifying a `window`, or a `grain to date`.  

For example, in the `weekly_customers` cumulative metric, MetricFlow takes a sliding 7-day window of relevant customers and applies a count distinct function.

If you omit the `window`, the measure will accumulate over all time. Otherwise, you can choose from granularities like day, week, quarter, or month, and describe the window using phrases like "7 days" or "1 month."

</TabItem>

<TabItem value="notspecified" label="Example of window not specified">

You can use cumulative metrics without a window specified to obtain a running total. Suppose you have a log table with columns like:

Suppose you (a subscription-based company for the sake of this example) have an event-based log table with the following columns: 

* `date`: a date column 
* `user_id`: (integer) an ID specified for each user that is responsible for the event 
* `subscription_plan`: (integer) a column that indicates a particular subscription plan associated with the user. 
* `subscription_revenue`: (integer) a column that indicates the value associated with the subscription plan.  
* `event_type`: (integer) a column that populates with +1 to indicate an added subscription, or -1 to indicate a deleted subscription. 
* `revenue`: (integer) a column that multiplies `event_type` and `subscription_revenue` to depict the amount of revenue added or lost for a specific date. 

Using cumulative metrics without specifying a window, you can calculate running totals for metrics like the count of active subscriptions and revenue at any point in time. The following configuration YAML displays creating such cumulative metrics to obtain current revenue or the total number of active subscriptions as a cumulative sum:

```yaml
measures:
  - name: revenue
    description: Total revenue
    agg: sum
    expr: revenue
  - name: subscription_count
    description: Count of active subscriptions
    agg: sum
    expr: event_type
metrics:
  - name: current_revenue
    description: Current revenue
    label: Current Revenue
    type: cumulative
    type_params:
      measure: revenue
  - name: active_subscriptions
    description: Count of active subscriptions
    label: Active Subscriptions
    type: cumulative
    type_params:
      measure: subscription_count

```

</TabItem>

</Tabs>

### Grain to date 

You can choose to specify a grain to date in your cumulative metric configuration to accumulate a metric from the start of a grain (such as week, month, or year). When using a window, such as a month, MetricFlow will go back one full calendar month. However, grain to date will always start accumulating from the beginning of the grain, regardless of the latest date of data.

For example, let's consider an underlying measure of `order_total.`

```yaml
    measures:
      - name: order_total
        agg: sum
```

We can compare the difference between a 1-month window and a monthly grain to date. The cumulative metric in a window approach applies a sliding window of 1 month, whereas the grain to date by month resets at the beginning of each month.

```yaml
metrics:
  - name: cumulative_order_total_l1m  #For this metric, we use a window of 1 month 
    label: Cumulative Order total (L1M)
    description: Trailing 1 month cumulative order amount
    type: cumulative
    type_params:
      measure: order_total
      window: 1 month
  - name: cumulative_order_total_mtd   #For this metric, we use a monthly grain to date 
    label: Cumulative Order total (MTD)
    description: The month to date value of all orders
    type: cumulative
    type_params:
      measure: order_total
      grain_to_date: month
```

### Implementation

The current method connects the metric table to a timespine table using the primary time dimension as the join key. We use the accumulation window in the join to decide whether a record should be included on a particular day. The following SQL code produced from an example cumulative metric is provided for reference:

``` sql
select
  count(distinct distinct_users) as weekly_active_users
  , metric_time
from (
  select
    subq_3.distinct_users as distinct_users
    , subq_3.metric_time as metric_time
  from (
    select
      subq_2.distinct_users as distinct_users
      , subq_1.metric_time as metric_time
    from (
      select
        metric_time
      from transform_prod_schema.mf_time_spine subq_1356
      where (
        metric_time >= cast('2000-01-01' as timestamp)
      ) and (
        metric_time <= cast('2040-12-31' as timestamp)
      )
    ) subq_1
    inner join (
      select
        distinct_users as distinct_users
        , date_trunc('day', ds) as metric_time
      from demo_schema.transactions transactions_src_426
      where (
        (date_trunc('day', ds)) >= cast('1999-12-26' as timestamp)
      ) AND (
        (date_trunc('day', ds)) <= cast('2040-12-31' as timestamp)
      )
    ) subq_2
    on
      (
        subq_2.metric_time <= subq_1.metric_time
      ) and (
        subq_2.metric_time > dateadd(day, -7, subq_1.metric_time)
      )
  ) subq_3
)
group by
  metric_time
limit 100
```
