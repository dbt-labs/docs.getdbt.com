---
title: "Simple metrics"
id: simple
description: "Use simple metrics to directly reference a single measure."
sidebar_label: Simple
tags: [Metrics, Semantic Layer]
---

Simple metrics are metrics that directly reference a single measure, without any additional measures involved. They are aggregations over a column in your data platform, and can be filtered by one or multiple dimensions.

 The parameters, description, and type for simple metrics are: 

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| `name` | The name of the metric. | Required |
| `description` | The description of the metric. | Optional |
| `type` | The type of the metric (cumulative, derived, ration, or simple). | Required |
| `label` | The value that will be displayed in downstream tools. | Required |
| `type_params` | The type parameters of the metric. | Required |
| `measure` | The measure you're referencing. | Required |

The following displays the complete specification for simple metrics, along with an example.


```yaml
metrics:
  - name: The metric name # Required
    description: the metric description # Optional
    type: simple # Required
    label: The value that will be displayed in downstream tools #Required
    type_params: # Required
      measure: The measure you're referencing # Required

```

<!-- create_metric not supported yet
:::tip

If you've already defined the measure using the `create_metric: true` parameter, you don't need to create simple metrics. However, if you want to include a filter or in the final metric, you'll need to define and create a simple metric.
:::
-->

## Simple metrics example

```yaml
  metrics: 
    - name: customers
      description: Count of customers
      type: simple # Pointers to a measure you created in a semantic model
      label: Count of customers
      type_params:
        measure: customers # The measure youre creating a proxy of.
    - name: large_orders
      description: "Order with order values over 20."
      type: SIMPLE
      label: Large Orders
      type_params:
        measure: orders
      filter: | # For any metric you can optionally include a filter on dimension values
        {{Dimension('customer__order_total_dim')}} >= 20
```
