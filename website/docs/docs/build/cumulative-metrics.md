---
title: "Cumulative metrics"
id: cumulative
description: "Use Cumulative metrics to aggregate a measure over a given window."
sidebar_label: Cumulative
tags: [Metrics, Semantic Layer]
---

Cumulative metrics aggregate a measure over a given accumulation window. If no window is specified, the window is considered infinite and accumulates values over all time. You will need to create the [time spine model](/docs/build/metricflow-time-spine) before you add cumulative metrics.

This metric is common for calculating things like weekly active users, or month-to-date revenue. You can use `fill_nulls_with` to [set null metric values to zero](/docs/build/fill-nulls-advanced), ensuring numeric values for every data row. The parameters, description, and type for cumulative metrics are: 

:::tip
Note that we use the double colon (::) to indicate whether a parameter is nested within another parameter. So for example, `query_params::metrics` means the `metrics` parameter is nested under `query_params`.
:::

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| `name` | The name of the metric. | Required |
| `description` | The description of the metric. | Optional |
| `type` | The type of the metric (cumulative, derived, ratio, or simple). | Required |
| `label` | Required string that defines the display value in downstream tools. Accepts plain text, spaces, and quotes (such as `orders_total` or `"orders_total"`). | Required |
| `type_params` | The type parameters of the metric. | Required |
| `type_param:window` | The accumulation window, such as 1 month, 7 days, 1 year. This can't be used with `grain_to_date`. | Optional  |
| `type_param:grain_to_date` | Sets the accumulation grain, such as `month`, which will accumulate data for one month. Then restart at the beginning of the next. This can't be used with `window`. | Optional |
| `type_param:period_agg` | Specifies how to roll up the cumulative metric to another granularity.  Options are `start`, `end`, `average`. Defaults to `start` if no `window` is specified. | Optional |
| `type_param:window_choice` | Specifies whether to take the cumulative metric value from the beginning (min) or end (max) of the window. Defaults to `min`. | Optional |
| `measure` | A list of measure inputs | Required |
| `measure:name` | TThe measure you are referencing. | Optional  |
| `measure:fill_nulls_with` | Set the value in your metric definition instead of null (such as zero).| Optional |
| `measure:join_to_timespine` | Boolean that indicates if the aggregated measure should be joined to the time spine table to fill in missing dates. Default `false`. | Optional |

The following displays the complete specification for cumulative metrics, along with an example:

```yaml
metrics:
  - name: The metric name # Required
    description: The metric description # Optional
    type: cumulative # Required
    label: The value that will be displayed in downstream tools # Required
    type_params: # Required
      period_agg: start # Optional. Defaults to start. Accepted values: start|end|average
      window_choice: max # Optional. Defaults to min. Choose between min|max
      measure: 
        name: The measure you are referencing. # Required
        fill_nulls_with: Set the value in your metric definition instead of null (such as zero). # Optional
        join_to_timespine: true/false # Boolean that indicates if the aggregated measure should be joined to the time spine table to fill in missing dates. Default `false`. # Optional
      window: The accumulation window, such as 1 month, 7 days, 1 year. # Optional. It cannot be used with grain_to_date.
      grain_to_date: Sets the accumulation grain, such as month will accumulate data for one month, then restart at the beginning of the next.  # Optional. It cannot be used with window.

```

## Cumulative metrics example

Cumulative metrics measure data over a given window and consider the window infinite when no window parameter is passed, accumulating the data over all time.

```yaml

metrics:
  - name: cumulative_order_total
    label: Cumulative order total (All-Time)    
    description: The cumulative value of all orders
    type: cumulative
    type_params:
      measure: 
        name: order_total
        fill_nulls_with: 0
  
  - name: cumulative_order_total_l1m
    label: Cumulative order total (L1M)   
    description: Trailing 1-month cumulative order amount
    type: cumulative
    type_params:
      measure: 
        name: order_total
        fill_nulls_with: 0
      window: 1 month
  
  - name: cumulative_order_total_mtd
    label: Cumulative order total (MTD)
    description: The month-to-date value of all orders
    type: cumulative
    type_params:
      measure: 
        name: order_total
        fill_nulls_with: 0
      grain_to_date: month
```

## Granularity options
Ensure you can request cumulative metrics at different granularities, reducing redundancy and configuration efforts:
- Window options
- Grain to date
- Window choice
- Period aggregation


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
    window_choice: min # Value at the beginning of the window
    period_agg: first # ADD CONTEXT
```

From the sample YAML above, note the following:

* `type`: Specify cumulative to indicate the type of metric. 
* `type_params`: Specify the measure you want to aggregate as a cumulative metric. You have the option of specifying a `window`, `grain to date`, `period_agg`, `window_choice`.  

For example, in the `weekly_customers` cumulative metric, MetricFlow takes a sliding 7-day window of relevant customers and applies a count distinct function.

If you remove `window`, `window_choice`, `period_agg`, the measure will accumulate over all time. Otherwise, you can choose from granularities like day, week, quarter, or month, and describe the window using phrases like "7 days" or "1 month."

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

We can compare the difference between a 1-month window and a monthly grain to date. 
- The cumulative metric in a window approach applies a sliding window of 1 month
- The grain to date by month resets at the beginning of each month.

```yaml
metrics:
  - name: cumulative_order_total_l1m  # For this metric, we use a window of 1 month 
    label: Cumulative Order total (L1M)
    description: Trailing 1-month cumulative order amount
    type: cumulative
    type_params:
      measure: order_total
      window: 1 month # Applies a sliding window of 1 month
  - name: cumulative_order_total_mtd   # For this metric, we use a monthly grain-to-date 
    label: Cumulative Order total (MTD)
    description: The month-to-date value of all orders
    type: cumulative
    type_params:
      measure: order_total
      grain_to_date: month # Resets at the beginning of each month
      window_choice: min # Value at the beginning of the window
      period_agg: first # ADD CONTEXT
```

### Window choice
Window choice specifies whether to take the cumulative metric value from the beginning (min) or end (max) of the window. Defaults to `min`.

For example, `dbt sl query --metrics orders_last_7_days --group-by metric_time__week`, will show cumulative metrics by week. 

#### Example configurations

Cumulative metric with a specified window and choice.
```yaml
- name: orders_last_7_days
  description: Count of orders.
  label: orders last 7 days
  type: cumulative
  type_params:
    measure: order_count
    window: 7 days
    window_choice: min # or max
```

This compiles the following SQL code:

```sql
--dbt sl query --metrics orders_last_7_days --group-by metric_time__week
with staging as (
    select
        subq_3.date_day as metric_time__day,
        date_trunc('week', subq_3.date_day) as metric_time__week,
        sum(subq_1.order_count) as orders_last_7_days
    from dbt_sl_test.metricflow_time_spine subq_3
    inner join (
        select
            date_trunc('day', ordered_at) as metric_time__day,
            1 as order_count
        from analytics.dbt_jstein.orders orders_src_10000
    ) subq_1
    on (
        subq_1.metric_time__day <= subq_3.date_day
    ) and (
        subq_1.metric_time__day > dateadd(day, -7, subq_3.date_day)
    )
    where
        subq_3.date_day between '2016-01-01' and '2017-12-31'
    group by
        subq_3.date_day
)

select
    *
from (
    select
        metric_time__week,
        first_value(orders_last_7_days) over (partition by date_trunc('week', metric_time__day) order by metric_time__day) as cumulative_revenue
    from
        staging
)
group by
    metric_time__week,
    cumulative_revenue
order by
    metric_time__week
    1
```

Cumulative metric with grain to date:

```yaml
- name: orders_last_month_to_date
  label: Orders month to date
  type: cumulative
  type_params:
    measure: order_count
    grain_to_date: month
    window_choice: min # or max
```

This compiles the following SQL code:

```sql
with staging as (
    select
        subq_3.date_day as metric_time__day,
        date_trunc('week', subq_3.date_day) as metric_time__week,
        sum(subq_1.order_count) as orders_last_month_to_date
    from dbt_jstein.metricflow_time_spine subq_3
    inner join (
        select
            date_trunc('day', ordered_at) as metric_time__day,
            1 as order_count
        from analytics.dbt_jstein.orders orders_src_10000
    ) subq_1
    on (
        subq_1.metric_time__day <= subq_3.date_day
    ) and (
        subq_1.metric_time__day >= date_trunc('month', subq_3.date_day)
    )
    group by
        subq_3.date_day,
        date_trunc('week', subq_3.date_day)
)

select
    *
from (
    select
        metric_time__week,
        first_value(orders_last_month_to_date) over (partition by date_trunc('week', metric_time__day) order by metric_time__day) as cumulative_revenue
    from
        staging
)
group by
    metric_time__week,
    cumulative_revenue
order by
    metric_time__week
    1
```

### Period aggregation

You can specify how to roll up the cumulative metric to another granularity. Options are `start`, `end`, `average`. Defaults to `start` if no `window` is specified.

Cumulative metric with no window, default to min:

```yaml
- name: cumulative_revenue
  description: The cumulative revenue for all orders.
  label: Cumulative Revenue (All Time)
  type: cumulative
  type_params:
    measure: revenue
    period_agg: first # Optional. Defaults to first. Accepted values: first|end|avg
```

This compiles the following SQL code:

```sql
--mf query --metrics cumulative_revenue --group-by metric_time__week
with staging as (
    select
        subq_3.date_day as metric_time__day,
        date_trunc('week', subq_3.date_day) as metric_time__week,
        sum(subq_1.revenue) as cumulative_revenue
    from
        dbt_sl_test.metricflow_time_spine subq_3
    inner join (
        select
            date_trunc('day', cast(ordered_at as datetime)) as metric_time__day,
            product_price as revenue
        from
            analytics.dbt_jstein.order_items order_item_src_10000
    ) subq_1 on (subq_1.metric_time__day <= subq_3.date_day)
    where
        subq_3.date_day between '2016-01-01' and '2017-12-31'
    group by
        subq_3.date_day,
        date_trunc('week', subq_3.date_day)
    order by
        1
)

select
    *
from (
    select
        metric_time__week,
        first_value(cumulative_revenue) over (partition by date_trunc('week', metric_time__day) order by metric_time__day) as cumulative_revenue
    from
        staging
)
group by
    metric_time__week,
    cumulative_revenue
order by
    metric_time__week
    1
```

### Implementation

To calculate the cumulative value of the metric over a given window, use a time range join to a timespine table using the primary time dimension as the join key. Use the accumulation window in the join to decide whether to include on a particular day. Refer to the following example cumulative metric SQL code:

``` sql
select
  count(distinct distinct_users) as weekly_active_users,
  metric_time
from (
  select
    subq_3.distinct_users as distinct_users,
    subq_3.metric_time as metric_time
  from (
    select
      subq_2.distinct_users as distinct_users,
      subq_1.metric_time as metric_time
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
        distinct_users as distinct_users,
        date_trunc('day', ds) as metric_time
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
  metric_time,
limit 100;

```

## Limitations

If you specify a `window` in your cumulative metric definition, you must include `metric_time` as a dimension in the SQL query. This is because the accumulation window is based on metric time. For example,

```sql
select
  count(distinct subq_3.distinct_users) as weekly_active_users,
  subq_3.metric_time
from (
  select
    subq_2.distinct_users as distinct_users,
    subq_1.metric_time as metric_time
group by
  subq_3.metric_time
```

## Related docs
- [Fill null values for simple, derived, or ratio metrics](/docs/build/fill-nulls-advanced)
