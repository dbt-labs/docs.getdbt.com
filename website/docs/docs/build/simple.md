---
title: "Simple metrics"
id: simple
description: "Use simple metrics to directly reference a single measure."
sidebar_label: Simple
tags: [Metrics, Semantic Layer]
---

Simple metrics are metrics that directly reference a single measure, without any additional measures involved.
<!-- create_metric not supported yet
:::tip

If you've already defined the measure using the `create_metric: true` parameter, you don't need to create simple metrics. However, if you want to include a filter or in the final metric, you'll need to define and create a simple metric.
:::
-->

``` yaml
metrics: 
- name: cancellations
  type: simple # Pointers to a measure you created in a data source
  type_params:
    measure: cancellations_usd # The measure you're creating a proxy of.
  # For any metric optionally include a filter string which applies a dimensional filter when computing the metric
  filter: | 
    value > 100 and user__acquisition
```
