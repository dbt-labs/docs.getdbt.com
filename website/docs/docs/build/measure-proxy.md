---
title: "Measure proxy metrics"
id: measure-proxy
description: "Expression metrics allow measures to be modified using a SQL expression. "
sidebar_label: Measure proxy
tags: [Metrics, Semantic Layer]
---

Measure proxy metrics are metrics that directly reference a single measure, without any additional measures involved.

:::tip

If you've already defined the measure using the `create_metric: true` parameter, you don't need to create measure proxies. However, if you want to include a filter or in the final metric, you'll need to define and create a measure proxy metric.
:::

``` yaml
metrics: 
- name: cancellations
  type: measure_proxy # Measure_proxies are pointers to a measure you created in a data source
  type_params:
    measure: cancellations_usd # The measure you're creating a proxy of.
  # For any metric optionally include a filter string which applies a dimensional filter when computing the metric
  filter: | 
    value > 100 and user__acquisition
```
