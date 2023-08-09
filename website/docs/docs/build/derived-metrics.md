---
title: "Derived metrics"
id: derived
description: "Derived metrics is defined as an expression of other metrics.."
sidebar_label: Derived
tags: [Metrics, Semantic Layer]
---

In MetricFlow, derived metrics are metrics created by defining an expression using other metrics. They allow performing calculations on top of existing metrics. This proves useful for combining metrics and applying arithmetic functions to aggregated columns, such as, you can define a profit metric. 

 The parameters, description, and type for derived metrics are: 

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| `name` | The name of the metric. | Required |
| `description` | The description of the metric. | Optional |
| `type` | The type of the metric (cumulative, derived, ration, or simple). | Required |
| `label` | The value that will be displayed in downstream tools. | Required |
| `type_params` | The type parameters of the metric. | Required |
| `expr` | The derived expression. | Required |
| `metrics` |  The list of metrics used in the derived metrics. | Required  |
| `alias` | Optional alias for the metric that you can use in the expr. | Optional |
| `filter` | Optional filter to apply to the metric. | Optional |
| `offset_window` | Set the period for the offset window, such as 1 month. This will return the value of the metric one month from the metric time. | Required |

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
          offset_window: set the period for the offset window i.e 1 month. This will return the value of the metric one month from the metric time. # Required
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

You may want to use an offset value of a metric in the definition of a derived metric. For example, you can model the retention rate by using a derived metric with an offset, which involves calculating (active customers at the end of the month/active customers at the beginning of the month).

```yaml
metrics:
- name: user_retention
  type: derived
  type_params:
    expr: active_customers/active_customers_t1m
    metrics:
      - name: active_customers # these are all metrics (can be a derived metric, meaning building a derived metric with derived metrics)
      - name: active_customers
        offset_window: 1 month
        alias: active_customers_t1m
```
