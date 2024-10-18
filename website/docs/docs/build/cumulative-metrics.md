---
title: "Cumulative metrics"
id: cumulative
description: "Use Cumulative metrics to aggregate a measure over a given window."
sidebar_label: Cumulative
tags: [Metrics, Semantic Layer]
---

Cumulative metrics aggregate a measure over a given accumulation window. If no window is specified, the window is considered infinite and accumulates values over all time. You will need to create a [time spine model](/docs/build/metricflow-time-spine) before you add cumulative metrics.

Cumulative metrics are useful for calculating things like weekly active users, or month-to-date revenue. The parameters, description, and types for cumulative metrics are: 

:::tip
Note that we use the double colon (::) to indicate whether a parameter is nested within another parameter. So for example, `measure::name` means the `name` parameter is nested under `measure`.
:::

## Parameters

<VersionBlock firstVersion="1.9">

| Parameter   | <div style={{width:'350px'}}>Description</div>   | Type      |
|-------------|---------------------------------------------------|-----------|
| `name`  | The name of the metric.       | Required  |
| `description`       | The description of the metric.     | Optional  |
| `type`    | The type of the metric (cumulative, derived, ratio, or simple).       | Required  |
| `label`     | Required string that defines the display value in downstream tools. Accepts plain text, spaces, and quotes (such as `orders_total` or `"orders_total"`).  | Required  |
| `type_params`    | The type parameters of the metric. Supports nested parameters indicated by the double colon, such as `type_params::measure`.  | Required  |
| `type_params::measure`   | The measure associated with the metric. Supports both shorthand (string) and object syntax. The shorthand is used if only the name is needed, while the object syntax allows specifying additional attributes. | Required  |
| `measure::name`    | The name of the measure being referenced. Required if using object syntax for `type_params::measure`.  | Optional  |
| `measure::fill_nulls_with`     | Sets a value (for example, 0) to replace nulls in the metric definition.    | Optional  |
| `measure::join_to_timespine` | Boolean indicating if the aggregated measure should be joined to the time spine table to fill in missing dates. Default is `false`. | Optional  |
| `type_params::cumulative_type_params`     | Configures the attributes like `window`, `period_agg`, and `grain_to_date` for cumulative metrics. | Optional  |
| `cumulative_type_params::window`      | Specifies the accumulation window, such as `1 month`, `7 days`, or `1 year`. Cannot be used with `grain_to_date`.   | Optional  |
| `cumulative_type_params::grain_to_date`   | Sets the accumulation grain, such as `month`, restarting accumulation at the beginning of each specified grain period. Cannot be used with `window`. | Optional  |
| `cumulative_type_params::period_agg`  | Defines how to aggregate the cumulative metric when summarizing data to a different granularity: `first`, `last`, or `average`. Defaults to `first` if `window` is not specified. | Optional  |

</VersionBlock>

<VersionBlock lastVersion="1.8">

| Parameter | <div style={{width:'350px'}}>Description</div> | Type |
| --------- | ----------- | ---- |
| `name` | The name of the metric. | Required |
| `description` | The description of the metric. | Optional |
| `type` | The type of the metric (cumulative, derived, ratio, or simple). | Required |
| `label` | Required string that defines the display value in downstream tools. Accepts plain text, spaces, and quotes (such as `orders_total` or `"orders_total"`). | Required |
| `type_params` | The type parameters of the metric. Supports nested parameters indicated by the double colon, such as `type_params::measure`. | Required |
| `window` | The accumulation window, such as `1 month`, `7 days`, or `1 year`. This can't be used with `grain_to_date`. | Optional  |
| `grain_to_date` | Sets the accumulation grain, such as `month`, which will accumulate data for one month and then restart at the beginning of the next. This can't be used with `window`. | Optional |
| `type_params::measure` | A list of measure inputs | Required |
| `measure:name` | The name of the measure being referenced. Required if using object syntax for `type_params::measure`.  | Optional  |
| `measure:fill_nulls_with` | Set the value in your metric definition instead of null (such as zero).| Optional |
| `measure:join_to_timespine` | Boolean that indicates if the aggregated measure should be joined to the time spine table to fill in missing dates. Default `false`. | Optional |

</VersionBlock>

<Expandable alt_header="Explanation of type_params::measure">
  
The`type_params::measure` configuration can be written in different ways:
- Shorthand syntax &mdash;  To only specify the name of the measure, use a simple string value. This is a shorthand approach when no other attributes are required.
  ```yaml
  type_params:
    measure: revenue
  ```
- Object syntax &mdash; To add more details or attributes to the measure (such as adding a filter, handling `null` values, or specifying whether to join to a time spine), you need to use the object syntax. This allows for additional configuration beyond just the measure's name.

  ```yaml
  type_params:
    measure:
      name: order_total
      fill_nulls_with: 0
      join_to_timespine: true
  ```
</Expandable>

### Complete specification
The following displays the complete specification for cumulative metrics, along with an example:

<File name='models/marts/sem_semantic_model_name.yml'>

<VersionBlock firstVersion="1.9">

```yaml
metrics:
  - name: The metric name # Required
    description: The metric description # Optional
    type: cumulative # Required
    label: The value that will be displayed in downstream tools # Required
    type_params: # Required
      cumulative_type_params:
        period_agg: first # Optional. Defaults to first. Accepted values: first|last|average
        window: The accumulation window, such as 1 month, 7 days, 1 year. # Optional. It cannot be used with grain_to_date.
        grain_to_date: Sets the accumulation grain, such as month will accumulate data for one month, then restart at the beginning of the next.  # Optional. It cannot be used with window.
      measure: 
        name: The measure you are referencing. # Required
        fill_nulls_with: Set the value in your metric definition instead of null (such as zero). # Optional
        join_to_timespine: true/false # Boolean that indicates if the aggregated measure should be joined to the time spine table to fill in missing dates. Default `false`. # Optional

```
</VersionBlock>

<VersionBlock lastVersion="1.8">

```yaml
metrics:
  - name: The metric name  # Required
    description: The metric description  # Optional
    type: cumulative  # Required
    label: The value that will be displayed in downstream tools  # Required
    type_params:  # Required
      measure: 
        name: The measure you are referencing  # Required
        fill_nulls_with: Set the value in your metric definition instead of null (such as zero)  # Optional
        join_to_timespine: false  # Boolean that indicates if the aggregated measure should be joined to the time spine table to fill in missing dates. Default `false`. # Optional
      window: 1 month  # The accumulation window, such as 1 month, 7 days, 1 year. Optional. Cannot be used with grain_to_date.
      grain_to_date: month  # Sets the accumulation grain, such as month will accumulate data for one month, then restart at the beginning of the next. Optional. Cannot be used with window.
```
</VersionBlock>

</File>

## Cumulative metrics example

Cumulative metrics measure data over a given window and consider the window infinite when no window parameter is passed, accumulating the data over all time.

The following example shows how to define cumulative metrics in a YAML file:

<VersionBlock firstVersion="1.9">

- `cumulative_order_total`: Calculates the cumulative order total over all time. Uses `type params` to specify the measure `order_total` to be aggregated.

- `cumulative_order_total_l1m`: Calculates the trailing 1-month cumulative order total. Uses `cumulative_type_params` to specify a `window` of 1 month.

- `cumulative_order_total_mtd`: Calculates the month-to-date cumulative order total, respectively. Uses `cumulative_type_params` to specify a `grain_to_date` of `month`.

</VersionBlock>

<VersionBlock lastVersion="1.8">

- `cumulative_order_total`: Calculates the cumulative order total over all time. Uses `type params` to specify the measure `order_total` to be aggregated.

- `cumulative_order_total_l1m`: Calculates the trailing 1-month cumulative order total. Uses `type params` to specify a `window` of 1 month.

- `cumulative_order_total_mtd`: Calculates the month-to-date cumulative order total, respectively. Uses `type params` to specify a `grain_to_date` of `month`.

</VersionBlock>

<File name='models/marts/sem_semantic_model_name.yml'>

<VersionBlock firstVersion="1.9">

```yaml
metrics:
  - name: cumulative_order_total
    label: Cumulative order total (All-Time)    
    description: The cumulative value of all orders
    type: cumulative
    type_params:
      measure: 
        name: order_total
  
  - name: cumulative_order_total_l1m
    label: Cumulative order total (L1M)   
    description: Trailing 1-month cumulative order total
    type: cumulative
    type_params:
      measure: 
        name: order_total
      cumulative_type_params:
        window: 1 month
  
  - name: cumulative_order_total_mtd
    label: Cumulative order total (MTD)
    description: The month-to-date value of all orders
    type: cumulative
    type_params:
      measure: 
        name: order_total
      cumulative_type_params:
        grain_to_date: month
```
</VersionBlock>

<VersionBlock lastVersion="1.8">

```yaml
metrics:
  - name: cumulative_order_total
    label: Cumulative order total (All-Time)    
    description: The cumulative value of all orders
    type: cumulative
    type_params:
      measure: 
        name: order_total
  
  - name: cumulative_order_total_l1m
    label: Cumulative order total (L1M)   
    description: Trailing 1-month cumulative order total
    type: cumulative
    type_params:
      measure: 
        name: order_total
      window: 1 month
  
  - name: cumulative_order_total_mtd
    label: Cumulative order total (MTD)
    description: The month-to-date value of all orders
    type: cumulative
    type_params:
      measure: 
        name: order_total
      grain_to_date: month
```
</VersionBlock>

</File>

<VersionBlock firstVersion="1.9">

### Granularity options

Use the `period_agg` parameter with `first()`, `last()`, and `average()` functions to aggregate cumulative metrics over the requested period. This is because granularity options for cumulative metrics are different than the options for other metric types. 
- For other metrics, we use the `date_trunc` function to implement granularity. 
- However, cumulative metrics are non-additive (values can't be added up), so we can't use the `date_trunc` function to change their time grain granularity.
- By default, we take the first value of the period. You can change this by specifying a different function using the `period_agg` parameter.

In the following example, we define a cumulative metric, `cumulative_revenue`, that calculates the cumulative revenue for all orders:

<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
- name: cumulative_revenue
  description: The cumulative revenue for all orders.
  label: Cumulative revenue (all-time)
  type: cumulative
  type_params:
    measure: revenue
    cumulative_type_params:
      period_agg: first # Optional. Defaults to first. Accepted values: first|end|average
```
</File>

In this example, `period_agg` is set to `first`, which chooses the first value for the selected granularity window. To query `cumulative_revenue` by week, use the following query syntax: 
- `dbt sl query --metrics cumulative_revenue --group-by metric_time__week`

<Expandable alt_header="Expand toggle to view how the SQL compiles">

Note the use of the `window` function to select the `first` value. For `last` and `average`, we would replace the `first_value()` function in the generated SQL with `last_value()` and `average` respectively.

```sql
-- re-aggregate metric via the group by
select
  metric_time__week,
  metric_time__quarter,
  revenue_all_time
from (
  -- window function for metric re-aggregation
  select
    metric_time__week,
    metric_time__quarter,
    first_value(revenue_all_time) over (
      partition by
        metric_time__week,
        metric_time__quarter
      order by metric_time__day
      rows between unbounded preceding and unbounded following
    ) as revenue_all_time
  from (
    -- join self over time range
    -- pass only elements: ['txn_revenue', 'metric_time__week', 'metric_time__quarter', 'metric_time__day']
    -- aggregate measures
    -- compute metrics via expressions
    select
      subq_11.metric_time__day as metric_time__day,
      subq_11.metric_time__week as metric_time__week,
      subq_11.metric_time__quarter as metric_time__quarter,
      sum(revenue_src_28000.revenue) as revenue_all_time
    from (
      -- time spine
      select
        ds as metric_time__day,
        date_trunc('week', ds) as metric_time__week,
        date_trunc('quarter', ds) as metric_time__quarter
      from mf_time_spine subq_12
      group by
        ds,
        date_trunc('week', ds),
        date_trunc('quarter', ds)
    ) subq_11
    inner join fct_revenue revenue_src_28000
    on (
      date_trunc('day', revenue_src_28000.created_at) <= subq_11.metric_time__day
    )
    group by
      subq_11.metric_time__day,
      subq_11.metric_time__week,
      subq_11.metric_time__quarter
  ) subq_16
) subq_17
group by
  metric_time__week,
  metric_time__quarter,
  revenue_all_time

```

</Expandable>

</VersionBlock>

### Window options

This section details examples of when to specify and not to specify window options.

- When a window is specified, MetricFlow applies a sliding window to the underlying measure, such as tracking weekly active users with a 7-day window.
- Without specifying a window, cumulative metrics accumulate values over all time, useful for running totals like current revenue and active subscriptions.

<Expandable alt_header="Example of window specified">

If a window option is specified, MetricFlow applies a sliding window to the underlying measure.

Suppose the underlying measure `customers` is configured to count the unique customers making orders at the Jaffle shop.

<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
measures:
  - name: customers
    expr: customer_id
    agg: count_distinct

```
</File>

We can write a cumulative metric `weekly_customers` as such:

<VersionBlock firstVersion="1.9">

<File name='models/marts/sem_semantic_model_name.yml'>

``` yaml
metrics: 
  - name: weekly_customers # Define the measure and the window.
  type: cumulative
  type_params:
    measure: customers
    cumulative_type_params:
      window: 7 days # Setting the window to 7 days since we want to track weekly active
      period_agg: first # This will choose the first value of the granularity window when changing the granularity.
```
</File>

From the sample YAML example, note the following:

* `type`: Specify cumulative to indicate the type of metric. 
* `type_params`: Configure the cumulative metric by providing a `measure`.
* `cumulative_type_params`: Optionally add a `window`, `period_agg` and `grain_to_date` configuration.

For example, in the `weekly_customers` cumulative metric, MetricFlow takes a sliding 7-day window of relevant customers and applies a count distinct function.

If you remove `window`, the measure will accumulate over all time.
</VersionBlock>

<VersionBlock lastVersion="1.8">

<File name='models/marts/sem_semantic_model_name.yml'>

``` yaml
metrics: 
  - name: weekly_customers # Define the measure and the window.
  type: cumulative
  type_params:
    measure: customers
    window: 7 days # Setting the window to 7 days since we want to track weekly active
```
</File>
</VersionBlock>

From the sample YAML example, note the following:

* `type`: Specify cumulative to indicate the type of metric. 
* `type_params`: Configure the cumulative metric by providing a `measure` and optionally add a `window` or `grain_to_date` configuration.

For example, in the `weekly_customers` cumulative metric, MetricFlow takes a sliding 7-day window of relevant customers and applies a count distinct function.

If you remove `window`, the measure will accumulate over all time.

</Expandable>

<Expandable alt_header="Example of window not specified">

Suppose you (a subscription-based company for the sake of this example) have an event-based log table with the following columns: 

* `date`: a date column 
* `user_id`: (integer) an ID specified for each user that is responsible for the event 
* `subscription_plan`: (integer) a column that indicates a particular subscription plan associated with the user. 
* `subscription_revenue`: (integer) a column that indicates the value associated with the subscription plan.  
* `event_type`: (integer) a column that populates with +1 to indicate an added subscription, or -1 to indicate a deleted subscription. 
* `revenue`: (integer) a column that multiplies `event_type` and `subscription_revenue` to depict the amount of revenue added or lost for a specific date. 

Using cumulative metrics without specifying a window, you can calculate running totals for metrics like the count of active subscriptions and revenue at any point in time. The following YAML file shows creating a cumulative metrics to obtain current revenue and the total number of active subscriptions as a cumulative sum:

<File name='models/marts/sem_semantic_model_name.yml'>

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

</File>
</Expandable>

### Grain to date

You can choose to specify a grain to date in your cumulative metric configuration to accumulate a metric from the start of a grain (such as week, month, or year). When using a window, such as a month, MetricFlow will go back one full calendar month. However, grain to date will always start accumulating from the beginning of the grain, regardless of the latest date of data.

For example, let's consider an underlying measure of `order_total.`

<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
    measures:
      - name: order_total
        agg: sum
```
</File>

We can compare the difference between a 1-month window and a monthly grain to date. 
- The cumulative metric in a window approach applies a sliding window of 1 month
- The grain to date by month resets at the beginning of each month.

<File name='models/marts/sem_semantic_model_name.yml'>

<VersionBlock firstVersion="1.9">

```yaml
metrics:
  - name: cumulative_order_total_l1m  # For this metric, we use a window of 1 month 
    label: Cumulative order total (L1M)
    description: Trailing 1-month cumulative order amount
    type: cumulative
    type_params:
      measure: order_total
      cumulative_type_params:
        window: 1 month # Applies a sliding window of 1 month
  - name: cumulative_order_total_mtd   # For this metric, we use a monthly grain-to-date 
    label: Cumulative order total (MTD)
    description: The month-to-date value of all orders
    type: cumulative
    type_params:
      measure: order_total
      cumulative_type_params:
        grain_to_date: month # Resets at the beginning of each month
        period_agg: first # Optional. Defaults to first. Accepted values: first|last|average
```
</VersionBlock>

<VersionBlock lastVersion="1.8">

```yaml
metrics:
  - name: cumulative_order_total_l1m  # For this metric, we use a window of 1 month 
    label: Cumulative order total (L1M)
    description: Trailing 1-month cumulative order amount
    type: cumulative
    type_params:
      measure: order_total
    window: 1 month # Applies a sliding window of 1 month
  - name: cumulative_order_total_mtd   # For this metric, we use a monthly grain-to-date 
    label: Cumulative order total (MTD)
    description: The month-to-date value of all orders
    type: cumulative
    type_params:
      measure: order_total
      grain_to_date: month # Resets at the beginning of each month
```
</VersionBlock>
</File>

Cumulative metric with grain to date:

<VersionBlock firstVersion="1.9">
<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
- name: orders_last_month_to_date
  label: Orders month to date
  type: cumulative
  type_params:
    measure: order_count
    cumulative_type_params:
      grain_to_date: month
```
</File>

<Expandable alt_header="Expand toggle to view how the SQL compiles">

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

</Expandable>
</VersionBlock>

<VersionBlock lastVersion="1.8">
<File name='models/marts/sem_semantic_model_name.yml'>

```yaml
- name: orders_last_month_to_date
  label: Orders month to date
  type: cumulative
  type_params:
    measure: order_count
    grain_to_date: month
```
</File>
</VersionBlock>

## SQL implementation example

To calculate the cumulative value of the metric over a given window we do a time range join to a timespine table using the primary time dimension as the join key. We use the accumulation window in the join to decide whether a record should be included on a particular day. The following SQL code produced from an example cumulative metric is provided for reference:

To implement cumulative metrics, refer to the SQL code example:

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
