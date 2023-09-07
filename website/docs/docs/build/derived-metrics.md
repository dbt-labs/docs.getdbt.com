---
title: "Derived metrics"
id: derived
description: "Derived metrics is defined as an expression of other metrics.."
sidebar_label: Derived
tags: [Metrics, Semantic Layer]
---

In MetricFlow, derived metrics are metrics created by defining an expression using other metrics. They enable you to perform calculations with existing metrics. This is helpful for combining metrics and doing math functions on aggregated columns, like creating a profit metric. 

 The parameters, description, and type for derived metrics are: 

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| `name` | The name of the metric. | Required |
| `description` | The description of the metric. | Optional |
| `type` | The type of the metric (cumulative, derived, ratio, or simple). | Required |
| `label` | The value that will be displayed in downstream tools. | Required |
| `type_params` | The type parameters of the metric. | Required |
| `expr` | The derived expression. | Required |
| `metrics` |  The list of metrics used in the derived metrics. | Required  |
| `alias` | Optional alias for the metric that you can use in the expr. | Optional |
| `filter` | Optional filter to apply to the metric. | Optional |
| `offset_window` | Set the period for the offset window, such as 1 month. This will return the value of the metric one month from the metric time. This can't be used with `offset_to_grain`. | Required |

The following displays the complete specification for derived metrics, along with an example.

```yaml
metrics:
  - name: the metric name # Required
    description: the metric description # Optional
    type: derived # Required
    label: The value that will be displayed in downstream tools #Required
    type_params: # Required
      expr: the derived expression # Required
      metrics: # The list of metrics used in the derived metrics # Required
        - name: the name of the metrics. must reference a metric you have already defined # Required
          alias: optional alias for the metric that you can use in the expr # Optional
          filter: optional filter to apply to the metric # Optional
          offset_window: set the period for the offset window, such as 1 month. This will return the value of the metric one month from the metric time. # Required
```

## Derived metrics example

```yaml
metrics:
  - name: order_gross_profit
    description: Gross profit from each order.
    type: derived
    label: Order Gross Profit
    type_params:
      expr: revenue - cost
      metrics:
        - name: order_total
          alias: revenue
        - name: order_cost
          alias: cost
  - name: food_order_gross_profit
    label: Food Order Gross Profit  
    description: "The gross profit for each food order."
    type: derived
    type_params:
      expr: revenue - cost
      metrics:
        - name: order_total
          alias: revenue
          filter: |
            {{ Dimension('order__is_food_order') }} = True
        - name: order_cost
          alias: cost
          filter: |
            {{ Dimension('order__is_food_order') }} = True
  - name: order_total_growth_mom
    description: "Percentage growth of orders total completed to 1 month ago"
    type: derived
    label: Order Total Growth % M/M
    type_params:
      expr: (order_total - order_total_prev_month)*100/order_total_prev_month
      metrics: 
        - name: order_total
        - name: order_total
          offset_window: 1 month
          alias: order_total_prev_month
```

## Derived metric offset

To perform calculations using a metric's value from a previous time period, you can add an offset parameter to a derived metric. For example, if you want to calculate period-over-period growth or track user retention, you can use this metric offset.

**Note:** You must include the [`metric_time` dimension](/docs/build/dimensions#time) when querying a derived metric with an offset window.

The following example displays how you can calculate monthly revenue growth using a 1-month offset window:

```yaml
- name: customer_retention
  description: Percentage of customers that are active now and those active 1 month ago
  label: customer_retention
  type_params:
    expr: (active_customers/ active_customers_prev_month)
    metrics:
      - name: active_customers
        alias: current_active_customers
      - name: active_customers
        offset_window: 1 month
        alias: active_customers_prev_month
```

### Offset windows and granularity

You can query any granularity and offset window combination. The following example queries a metric with a 7-day offset and a monthly grain:

```yaml
- name: d7_booking_change
  description: Difference between bookings now and 7 days ago
  type: derived
  label: d7 Bookings Change
  type_params:
    expr: bookings - bookings_7_days_ago
    metrics:
      - name: bookings
        alias: current_bookings
      - name: bookings
        offset_window: 7 days
        alias: bookings_7_days_ago
```

When you run the query  `mf query --metrics d7_booking_change --group-by metric_time__month` for the metric, here's how it's calculated:

1. We retrieve the raw, unaggregated dataset with the specified measures and dimensions at the smallest level of detail, which is currently 'day'.
2. Then, we perform an offset join on the daily dataset, followed by performing a date trunc and aggregation to the requested granularity.
   For example, to calculate `d7_booking_change` for July 2017: 
   - First, we sum up all the booking values for each day in July to calculate the bookings metric.
   - The following table displays the range of days that make up this monthly aggregation.

|   | Orders | Metric_time |
| - | ---- | -------- |
|   | 330 | 2017-07-31 |
|   | 7030 | 2017-07-30 to 2017-07-02 |
|   | 78 | 2017-07-01 |
| Total  | 7438 | 2017-07-01 |

3. Next, we calculate July's bookings with a 7-day offset. The following table displays the range of days that make up this monthly aggregation. Note that the month begins 7 days later (offset by 7 days) on 2017-07-24.

|   | Orders | Metric_time |
| - | ---- | -------- |
|   | 329 | 2017-07-24 |
|   | 6840 | 2017-07-23  to 2017-06-30 |
|   | 83 | 2017-06-24 |
| Total  | 7252 | 2017-07-01 |

4. Lastly, we calculate the derived metric and return the final result set:
   
```bash
bookings - bookings_7_days_ago would be compile as 7438 - 7252 = 186. 
```

| d7_booking_change | metric_time__month |
| ----------------- | ------------------ |
| 186 | 2017-07-01 |
