---
title: "Derived metrics"
id: derived
description: "Derived metrics is defined as an expression of other metrics.."
sidebar_label: Derived
tags: [Metrics, Semantic Layer]
---

Derived metrics in MetricFlow refer to metrics that are created by defining an expression using other metrics. Derived metrics allow for calculations on top of metrics. This is useful when you want to combine metrics and perform arthematic fucntions ontop of aggregated columns. For example, defining a profit metric. Below, we'll show the full spec for derived metrics as well as an example.

# Derived Metrics Spec
```yaml
metrics:
  - name: the metric name # Required
    description: the metric description # Optinal
    type: derived # Required
    label: The value that will be displayed in downstream tools #Required
    type_params: # Required
      expr: the derived expression # Required
      metrics: # The list of metrics used in the derived metrics # Required
        - name: the name of the metrics. must refrence a metric you have already defined # Required
          alias: optional alias for the metric that you can use in the expr # Optional
          filter: optional filter to apply to the metric # Optional
          offset_window: set the period for the offset window i.e 1 month. This will retrun the value of the metric one month from the metric time. # Required.



```

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
            {{dimension('is_food_order')}} = True
        - name: order_cost
          alias: cost
          filter: |
            {{dimension('is_food_order')}} = True
  - name: order_total_growth_mom
    description: "Percentage growth of orders total compated to 1 month ago"
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

You may want to use an offset value of a metric in the definition of a derived metric. For example, if you define retention rate as (active customers at the end of the month/active customers at the beginning of the month)-1 you can model this using a derived metric with an offset. 

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
