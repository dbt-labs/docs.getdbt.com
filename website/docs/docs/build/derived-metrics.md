---
title: "Derived metrics"
id: derived
description: "Derived metrics is defined as an expression of other metrics.."
sidebar_label: Derived
tags: [Metrics, Semantic Layer]
---

Derived metrics in MetricFlow refer to metrics that are created by defining an expression using other metrics. Derived metrics allow for calculations on top of metrics. For example, you can define a metric called "Net Sales Per User" by using other metrics in the calculation.

```yaml
metrics:
  - name: net_sales_per_user
    type: derived
    type_params:
      expr: gross_sales - cogs / active_users
      metrics:
        - name: gross_sales # these are all metrics (can be a derived metric, meaning building a derived metric with derived metrics)
        - name: cogs
        - name: users
          filter: is_active # Optional additional constraint
          alias: active_users # Optional alias to use in the expr
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
