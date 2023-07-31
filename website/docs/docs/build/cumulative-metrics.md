---
title: "Cumulative metrics"
id: cumulative
description: "Use Cumulative metrics to aggregate a measure over a given window."
sidebar_label: Cumulative
tags: [Metrics, Semantic Layer]
---

Cumulative metrics aggregate a measure over a given window. If no window is specified, the window is considered infinite and accumulates values over all time.

:::info MetricFlow time spine required

You will need to create the [time spine model](/docs/build/metricflow-time-spine) before you add cumulative metrics.

:::

```yaml
# Cumulative metrics aggregate a measure over a given window. The window is considered infinite if no window parameter is passed (accumulate the measure over all time)
metrics:
- name: wau_rolling_7
  owners:
    - support@getdbt.com
  type: cumulative
  type_params:
    measures:
      - distinct_users
    #Omitting window will accumulate the measure over all time
    window: 7 days
```

### Window options

This section details examples of when you specify and don't specify window options.

<Tabs>

<TabItem value="specified" label="Example of window specified">

If a window option is specified, the MetricFlow framework applies a sliding window to the underlying measure. 

Suppose the underlying measure `distinct_users` is configured as such to reflect a count of distinct users by user_id and user_status. 

```yaml
measures:
  - name: distinct_users
  description: The number of distinct users creating mql queries
  expr: case when user_status in ('PENDING','ACTIVE') then user_id else null end
  agg: count_distinct
```

We can write a cumulative metric `wau_rolling_7` as such: 

``` yaml
metrics: 
  name: wau_rolling_7
  # Define the measure and the window.
  type: cumulative
  type_params:
    measures:
      - distinct_users
    # the default window is infinity - omitting window will accumulate the measure over all time
    window: 7 days
```

From the sample YAML above, note the following: 

* `type`: Specify cumulative to indicate the type of metric. 
* `type_params`: Specify the measure you want to aggregate as a cumulative metric. You have the option of specifying a `window`, or a `grain to date`.  

For example, in the `wau_rolling_7` cumulative metric, MetricFlow takes a sliding 7-day window of relevant users and applies a count distinct function.

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

Using cumulative metrics without specifying a window, you can calculate running totals for metrics like the count of active subscriptions and revenue at any point in time. The following configuration YAML displays creating such cumulative metrics to obtain current revenue or total number of active subscriptions as a cumulative sum:

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
  type: cumulative 
  type_params: 
    measures: 
      - revenue
- name: active_subscriptions 
  description: Count of active subscriptions 
  type: cumulative 
  type_params: 
    measures: 
      - subscription_count
```

</TabItem>

</Tabs>

### Grain to date 

You can choose to specify a grain to date in your cumulative metric configuration to accumulate a metric from the start of a grain (such as week, month, or year). When using a window, such as a month, MetricFlow will go back one full calendar month. However, grain to date will always start accumulating from the beginning of the grain, regardless of the latest date of data.

For example, let's consider an underlying measure of `total_revenue.`

```yaml
measures: 
  - name: total_revenue 
    description: Total revenue (summed) 
    agg: sum 
    expr: revenue 
```

We can compare the difference between a 1-month window and a monthly grain to date. The cumulative metric in a window approach applies a sliding window of 1 month, whereas the grain to date by month resets at the beginning of each month.

```yaml
metrics: 
  name: revenue_monthly_window #For this metric, we use a window of 1 month 
  description: Monthly revenue using a window of 1 month (think of this as a sliding window of 30 days)
  type: cumulative 
  type_params: 
    measures: 
      - total_revenue 
    window: 1 month 
```

```yaml
metrics: 
  name: revenue_monthly_grain_to_date #For this metric, we use a monthly grain to date 
  description: Monthly revenue using grain to date of 1 month (think of this as a monthly resetting point) 
  type: cumulative 
  type_params: 
    measures: 
      - total_revenue 
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
