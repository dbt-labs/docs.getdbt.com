---
title: "Simple metrics"
id: simple
description: "Use simple metrics to directly reference a single measure."
sidebar_label: Simple
tags: [Metrics, Semantic Layer]
pagination_next: null
---

Simple metrics are metrics that directly reference a single measure, without any additional measures involved. They are aggregations over a column in your data platform and can be filtered by one or multiple dimensions.

 The parameters, description, and type for simple metrics are: 

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| `name` | The name of the metric. | Required |
| `description` | The description of the metric. | Optional |
| `type` | The type of the metric (cumulative, derived, ratio, or simple). | Required |
| `label` | The value that will be displayed in downstream tools. | Required |
| `type_params` | The type parameters of the metric. | Required |
| `measure` | The measure you're referencing. | Required |

Refer to [additional settings](#additional-settings) to learn how to customize conversion metrics with settings for null values, calculation type, and constant properties.

The following displays the complete specification for simple metrics, along with an example.


```yaml
metrics:
  - name: The metric name # Required
    description: the metric description # Optional
    type: simple # Required
    label: The value that will be displayed in downstream tools # Required
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
        measure: customers # The measure you're creating a proxy of.
    - name: large_orders
      description: "Order with order values over 20."
      type: SIMPLE
      label: Large Orders
      type_params:
        measure: orders
      filter: | # For any metric you can optionally include a filter on dimension values
        {{Dimension('customer__order_total_dim')}} >= 20
```

### Additional settings

Use the following additional settings to customize your conversion metrics:

- **Null conversion values:** Set null conversions to zero using `fill_nulls_with`.
<!-- **Calculation type:** Choose between showing raw conversions or conversion rate.
- **Constant property:** Add conditions for specific scenarios to join conversions on constant properties.-->

To return zero in the final data set, you can set the value of a null conversion event to zero instead of null. You can add the `fill_nulls_with` parameter to your conversion metric definition like this:

```yaml
- name: vist_to_buy_conversion_rate_7_day_window
  description: "Conversion rate from viewing a page to making a purchase"
  type: conversion
  label: Visit to Seller Conversion Rate (7 day window)
  type_params:
    conversion_type_params:
      calculation: conversions
      base_measure: visits
      conversion_measure: 
        name: buys
        fill_nulls_with: 0
      entity: user
      window: 7 days 

```

This will return the following results:

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/conversion-metrics-fill-null.png" width="75%" title="Metric with fill nulls with parameter"/>
