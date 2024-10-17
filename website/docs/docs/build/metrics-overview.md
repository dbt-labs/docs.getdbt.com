---
title: Creating metrics
id: metrics-overview
description: "Metrics can be defined in the same or separate YAML files from semantic models within the same dbt project repo."
sidebar_label: "Creating metrics"
tags: [Metrics, Semantic Layer]
pagination_next: "docs/build/cumulative"
---
  
Once you've created your semantic models, it's time to start adding metrics. Metrics can be defined in the same YAML files as your semantic models, or split into separate YAML files into any other subdirectories (provided that these subdirectories are also within the same dbt project repo).

This article explains the different supported metric types you can add to your dbt project. The keys for metrics definitions are:

<!-- for v1.8 and higher -->

<VersionBlock firstVersion="1.8">

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| `name` | Provide the reference name for the metric. This name must be a unique metric name and can consist of lowercase letters, numbers, and underscores.  | Required |
| `description` | Describe your metric.   | Optional |
| `type` | Define the type of metric, which can be `conversion`, `cumulative`, `derived`, `ratio`, or `simple`. | Required |
| `type_params` | Additional parameters used to configure metrics. `type_params` are different for each metric type. | Required |
| `label` | Required string that defines the display value in downstream tools. Accepts plain text, spaces, and quotes (such as `orders_total` or `"orders_total"`).  | Required |
| `config` | Use the [`config`](/reference/resource-properties/config) property to specify configurations for your metric. Supports [`meta`](/reference/resource-configs/meta), [`group`](/reference/resource-configs/group), and [`enabled`](/reference/resource-configs/enabled) configurations.  | Optional |
| `filter` | You can optionally add a [filter](#filters) string to any metric type, applying filters to dimensions, entities, time dimensions, or other metrics during metric computation. Consider it as your WHERE clause.   | Optional |

Here's a complete example of the metrics spec configuration:

<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: metric name                     ## Required
    description: description               ## Optional
    type: the type of the metric          ## Required
    type_params:                          ## Required
      - specific properties for the metric type
    config:                               ## Optional
      meta:
        my_meta_config:  'config'         ## Optional
    label: The display name for your metric. This value will be shown in downstream tools. ## Required
    filter: |                             ## Optional            
      {{  Dimension('entity__name') }} > 0 and {{ Dimension(' entity__another_name') }} is not
      null and {{ Metric('metric_name', group_by=['entity_name']) }} > 5
```

</File>
</VersionBlock>

<!-- for v1.7 and lower -->

<VersionBlock lastVersion="1.7">

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| `name` | Provide the reference name for the metric. This name must be unique amongst all metrics.   | Required |
| `description` | Describe your metric.   | Optional |
| `type` | Define the type of metric, which can be `simple`, `ratio`, `cumulative`, or `derived`.  | Required |
| `type_params` | Additional parameters used to configure metrics. `type_params` are different for each metric type. | Required |
| `config` | Provide the specific configurations for your metric.   | Optional |
| `meta` | Use the [`meta` config](/reference/resource-configs/meta) to set metadata for a resource.  | Optional |
| `label` | Required string that defines the display value in downstream tools. Accepts plain text, spaces, and quotes (such as `orders_total` or `"orders_total"`).   | Required |
| `filter` | You can optionally add a filter string to any metric type, applying filters to dimensions, entities, or time dimensions during metric computation. Consider it as your WHERE clause.   | Optional |

Here's a complete example of the metrics spec configuration:

<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: metric name                     ## Required
    description: same as always           ## Optional
    type: the type of the metric          ## Required
    type_params:                          ## Required
      - specific properties for the metric type
    config: here for `enabled`            ## Optional
    meta:
        my_meta_direct: 'direct'           ## Optional
    label: The display name for your metric. This value will be shown in downstream tools. ## Required
    filter: |                             ## Optional            
      {{  Dimension('entity__name') }} > 0 and {{ Dimension(' entity__another_name') }} is not
      null and {{ Metric('metric_name', group_by=['entity_name']) }} > 5
```
</File>

</VersionBlock>

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Default granularity for metrics

<VersionBlock lastVersion="1.8">
Default time granularity for metrics is useful if your time dimension has a very fine grain, like second or hour, but you typically query metrics rolled up at a coarser grain. 

To set the default time granularity for metrics, you need to be on dbt Cloud Versionless or dbt v1.9 and higher. 

</VersionBlock>

<VersionBlock firstVersion="1.9">

It's possible to define a default time granularity for metrics if it's different from the granularity of the default aggregation time dimensions (`metric_time`). This is useful if your time dimension has a very fine grain, like second or hour, but you typically query metrics rolled up at a coarser grain. 

The granularity can be set using the `time_granularity` parameter on the metric, and defaults to `day`. If day is not available because the dimension is defined at a coarser granularity, it will default to the defined granularity for the dimension.

### Example
You have a semantic model called `orders` with a time dimension called `order_time`. You want the `orders` metric to roll up to `monthly` by default; however, you want the option to look at these metrics hourly. You can set the `time_granularity` parameter on the `order_time` dimension to `hour`, and then set the `time_granularity` parameter in the metric to `month`.
```yaml
semantic_models:
  ...
  dimensions:
    - name: order_time
      type: time
      type_params:
      time_granularity: hour
  measures:
    - name: orders
      expr: 1
      agg: sum
  metrics:
    - name: orders
      type: simple
      label: Count of Orders
      type_params:
        measure:
          name: orders
      time_granularity: month -- Optional, defaults to day
```
</VersionBlock>

## Conversion metrics

[Conversion metrics](/docs/build/conversion) help you track when a base event and a subsequent conversion event occur for an entity within a set time period.

<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: The metric name 
    description: The metric description 
    type: conversion 
    label: YOUR_LABEL 
    type_params: #
      conversion_type_params: 
        entity: ENTITY
        calculation: CALCULATION_TYPE 
        base_measure: 
          name: The name of the measure 
          fill_nulls_with: Set the value in your metric definition instead of null (such as zero) 
          join_to_timespine: true/false
        conversion_measure:
          name: The name of the measure 
          fill_nulls_with: Set the value in your metric definition instead of null (such as zero) 
          join_to_timespine: true/false
        window: TIME_WINDOW
        constant_properties:
          - base_property: DIMENSION or ENTITY 
            conversion_property: DIMENSION or ENTITY 
```
</File>

## Cumulative metrics

[Cumulative metrics](/docs/build/cumulative) aggregate a measure over a given window. If no window is specified, the window will accumulate the measure over all of the recorded time period. Note that you will need to create the [time spine model](/docs/build/metricflow-time-spine) before you add cumulative metrics.

<File name="models/metrics/file_name.yml" >

```yaml
# Cumulative metrics aggregate a measure over a given window. The window is considered infinite if no window parameter is passed (accumulate the measure over all of time)
metrics:
  - name: wau_rolling_7
    type: cumulative
    label: Weekly active users
    type_params:
      measure:
        name: active_users
        fill_nulls_with: 0
        join_to_timespine: true
        window: 7 days
```
</File>

## Derived metrics

[Derived metrics](/docs/build/derived) are defined as an expression of other metrics. Derived metrics allow you to do calculations on top of metrics. 

<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: order_gross_profit
    description: Gross profit from each order.
    type: derived
    label: Order gross profit
    type_params:
      expr: revenue - cost
      metrics:
        - name: order_total
          alias: revenue
        - name: order_cost
          alias: cost
```
</File>

<!-- not supported
### Expression metrics
Use [expression metrics](/docs/build/expr) when you're building a metric that involves a SQL expression of multiple measures.

```yaml
# Expression metric
metrics:
  name: revenue_usd
  type: expr # Expression metrics allow you to pass in any valid SQL expression.
  type_params:
    expr: transaction_amount_usd - cancellations_usd + alterations_usd # Define the SQL expression 
    measures: # Define all the measures that are to be used in this expression metric 
      - transaction_amount_usd
      - cancellations_usd
      - alterations_usd
```
-->

## Ratio metrics 

[Ratio metrics](/docs/build/ratio) involve a numerator metric and a denominator metric. A  `filter` string  can be applied to both the numerator and denominator or separately to the numerator or denominator.

<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: cancellation_rate
    type: ratio
    label: Cancellation rate
    type_params:
      numerator: cancellations
      denominator: transaction_amount
    filter: |   
      {{ Dimension('customer__country') }} = 'MX'
  - name: enterprise_cancellation_rate
    type: ratio
    type_params:
      numerator:
        name: cancellations
        filter: {{ Dimension('company__tier') }} = 'enterprise'  
      denominator: transaction_amount
    filter: | 
      {{ Dimension('customer__country') }} = 'MX' 
```
</File>

## Simple metrics

[Simple metrics](/docs/build/simple) point directly to a measure. You may think of it as a function that takes only one measure as the input.

- `name` &mdash; Use this parameter to define the reference name of the metric. The name must be unique amongst metrics and can include lowercase letters, numbers, and underscores. You can use this name to call the metric from the dbt Semantic Layer API.

**Note:** If you've already defined the measure using the `create_metric: True` parameter, you don't need to create simple metrics.  However, if you would like to include a constraint on top of the measure, you will need to create a simple type metric.

<File name="models/metrics/file_name.yml" >

```yaml
metrics:
  - name: cancellations
    description: The number of cancellations
    type: simple
    label: Cancellations
    type_params:
      measure:
        name: cancellations_usd  # Specify the measure you are creating a proxy for.
        fill_nulls_with: 0
    filter: |
      {{ Dimension('order__value')}} > 100 and {{Dimension('user__acquisition')}} is not null
    join_to_timespine: true
```
</File>

## Filters

A filter is configured using Jinja templating. Use the following syntax to reference entities, dimensions, time dimensions, or metrics in filters. 

Refer to [Metrics as dimensions](/docs/build/ref-metrics-in-filters) for details on how to use metrics as dimensions with metric filters:

<VersionBlock firstVersion="1.8">

<File name="models/metrics/file_name.yml" >

```yaml
filter: | 
  {{ Entity('entity_name') }}

filter: |  
  {{ Dimension('primary_entity__dimension_name') }}

filter: |  
  {{ TimeDimension('time_dimension', 'granularity') }}

filter: |  
 {{ Metric('metric_name', group_by=['entity_name']) }}  

```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.7">


<File name="models/metrics/file_name.yml" >

```yaml
filter: | 
  {{ Entity('entity_name') }}

filter: |  
  {{ Dimension('primary_entity__dimension_name') }}

filter: |  
  {{ TimeDimension('time_dimension', 'granularity') }}

```
</File>
</VersionBlock>

For example, if you want to filter for the order date dimension grouped by month, use the following syntax:

```yaml
filter: |  
  {{ TimeDimension('order_date', 'month') }}

```

## Further configuration

You can set more metadata for your metrics, which can be used by other tools later on. The way this metadata is used will vary based on the specific integration partner

- **Description** &mdash;  Write a detailed description of the metric.

## Related docs

- [Semantic models](/docs/build/semantic-models)
- [Fill null values for metrics](/docs/build/fill-nulls-advanced)
- [Metrics as dimensions with metric filters](/docs/build/ref-metrics-in-filters)
