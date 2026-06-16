---
title: Creating metrics
id: metrics-overview
description: "Define metrics in your dbt project to create quantitative indicators."
sidebar_label: "Creating metrics"
tags: [Metrics, Semantic Layer]
pagination_next: "docs/build/cumulative"
---

After building [semantic models](/docs/build/semantic-models), it's time to start adding metrics. This page explains the different supported metric types you can add to your dbt project.

<VersionBlock lastVersion="1.11">
  
Metrics must be defined in a YAML file &mdash; either within the same file as your semantic models or in a separate YAML file in a subdirectory of your dbt project. They shouldn't be defined in a `config` block on a model.

</VersionBlock>

<VersionBlock firstVersion="1.12">

You can define metrics in two locations within your `models` YAML files:

- **Within semantic models** (under `models` -> `semantic_model` -> `metrics`) for metrics that use dimensions from a single semantic model. Recommended for simple metrics.
- **At the top level** (under a separate `metrics` key) for advanced metrics (cumulative, ratio, derived, conversion) that reference metrics from different semantic models. Simple metrics can't be defined at the top level.

Define metrics in YAML files within your dbt project, and not in a `config` block on a model.

</VersionBlock>

## Parameters

The keys for metrics parameters are:

<VersionBlock lastVersion="1.11">

| Parameter | Description | Required | Type |
| --------- | ----------- | ---- | ---- |
| `name` | Provide the reference name for the metric. This name must be a unique metric name and can consist of lowercase letters, numbers, and underscores.  | Required | String |
| `description` | Describe your metric.   | Optional | String |
| `type` | Define the type of metric, which can be `conversion`, `cumulative`, `derived`, `ratio`, or `simple`. | Required | String |
| `type_params` | Additional parameters used to configure metrics. `type_params` are different for each metric type. | Required | Dict |
| `label` | Required string that defines the display value in downstream tools. Accepts plain text, spaces, and quotes (such as `orders_total` or `"orders_total"`).  | Required | String |
| `config` | Use the [`config`](/reference/resource-properties/config) property to specify configurations for your metric. Supports [`meta`](/reference/resource-configs/meta), [`group`](/reference/resource-configs/group), and [`enabled`](/reference/resource-configs/enabled) configurations.  | Optional | Dict |
| `filter` | You can optionally add a [filter](#filters) string to any metric type, applying filters to dimensions, entities, time dimensions, or other metrics during metric computation. Consider it as your WHERE clause.   | Optional | String |

</VersionBlock>

<VersionBlock firstVersion="1.12">

| Parameter | Description | Required | Type |
| --------- | ----------- | ---- | ---- |
| `name` | Provide the reference name for the metric. This name must be a unique metric name and can consist of lowercase letters, numbers, and underscores.  | Required | String |
| `description` | Describe your metric.   | Optional | String |
| `type` | Define the type of metric, which can be `conversion`, `cumulative`, `derived`, `ratio`, or `simple`. | Required | String |
| `label` | Defines the display value in downstream tools. Accepts plain text, spaces, and quotes (such as `orders_total` or `"orders_total"`).  | Optional | String |
| `config` | Use the [`config`](/reference/resource-properties/config) property to specify configurations for your metric. Supports [`meta`](/reference/resource-configs/meta), [`group`](/reference/resource-configs/group), [`tags`](/reference/resource-configs/tags), and [`enabled`](/reference/resource-configs/enabled) configurations.  | Optional | Dict |
| `filter` | You can optionally add a [filter](#filters) string to any metric type, applying filters to dimensions, entities, time dimensions, or other metrics during metric computation. Consider it as your WHERE clause.   | Optional | String |

</VersionBlock>

### Type-specific parameters

Each metric type has additional specific parameters:

- **Simple metrics**: `agg` (required), `expr`, `percentile`, `percentile_type`, `non_additive_dimension`, `agg_time_dimension`, `join_to_timespine`, `fill_nulls_with`
- **Cumulative metrics**: `input_metric` (required), `window`, `grain_to_date`, `period_agg`
- **Derived metrics**: `expr` (required), `input_metrics` (required)
- **Ratio metrics**: `numerator` (required), `denominator` (required)
- **Conversion metrics**: `entity` (required), `calculation` (required), `base_metric` (required), `conversion_metric` (required), `window`, `constant_properties`

Refer to the following sections about each metric type for detailed information on type-specific parameters.

### Example

Here's a complete example of the metrics spec configuration:

<VersionBlock lastVersion="1.11">
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

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true
      name: my_semantic_model
    
    # Define columns, dimensions, entities...
    columns:
      - name: my_column
        # column config...
    
    # Metrics defined within the semantic model
    metrics:
      - name: my_simple_metric
        description: A metric description
        type: simple
        label: My Simple Metric
        agg: sum
        expr: revenue_column  # Optional, defaults to metric name
        config:
          meta:
            owner: "@analytics_team"

# Advanced metrics that reference metrics from different semantic models
metrics:
  - name: my_advanced_cumulative_metric
    type: cumulative
    window: 1 week 
    input_metric: 
      name: my_metric_name_from_another_semantic_model
      filter: my_filter
      alias: my_metric_name_a_week_ago_in_another_semantic_model
```

</File>

</VersionBlock>

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Default granularity for metrics

<VersionBlock lastVersion="1.11">

It's possible to define a default time granularity for metrics if it's different from the granularity of the default aggregation time dimensions (`metric_time`). This is useful if your time dimension has a very fine grain, like second or hour, but you typically query metrics rolled up at a coarser grain.

The granularity can be set using the `time_granularity` parameter on the metric, and defaults to `day`. If day is not available because the dimension is defined at a coarser granularity, it will default to the defined granularity for the dimension.

### Example

- You have a semantic model called `orders` with a time dimension called `order_time`.
- You want the `orders` metric to roll up to `monthly` by default; however, you want the option to look at these metrics hourly.
- You can set the `time_granularity` parameter on the `order_time` dimension to `hour`, and then set the `time_granularity` parameter in the metric to `month`.

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

<VersionBlock firstVersion="1.12">

Set the native grain on the time dimension column and choose the rollup grain at query time.

- Define the data’s grain on the time dimension column with granularity (for example, hour, day, month).
- Metrics inherit the model’s default aggregation time dimension (set at the model level), and you can optionally override it per metric with `agg_time_dimension`.
- When querying, pick the rollup grain (day/week/month/year) in your BI tool or with the [Semantic Layer API](/docs/dbt-apis/sl-api-overview). You can only roll up to grains coarser than or equal to the column’s native grain.

### Example

- `order_time` is stored at hourly grain.
- The `orders` metric uses that time dimension; you roll it up to month at query time (not in the metric spec).
- A second metric shows how to point at a different time dimension using `agg_time_dimension`.

<File name="models/file_name.yml">

```yaml
models:
  - name: orders
    semantic_model:
      enabled: true

    # Model-level default aggregation time dimension (optional)
    agg_time_dimension: order_time

    columns:
      - name: order_time
        granularity: hour  # Native grain of the column
        dimension:
          type: time

      - name: created_at
        granularity: day
        dimension:
          type: time

    metrics:
      - name: orders
        type: simple
        agg: count
        expr: 1
        # No time_granularity here. Roll up to month at query time.

      - name: orders_by_created_day
        type: simple
        agg: count
        expr: 1
        agg_time_dimension: created_at  # Use an alternate time dimension for this metric

```
</File>

</VersionBlock>

## Conversion metrics

[Conversion metrics](/docs/build/conversion) help you track when a base event and a subsequent conversion event occur for an entity within a set time period.

<VersionBlock lastVersion="1.11">

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

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true
    
    # Define columns, dimensions, entities...
    
    metrics:
      - name: my_conversion_metric
        description: Conversion metric description
        type: conversion
        label: My conversion metric
        entity: my_primary_entity  # Required
        calculation: conversion_rate  # conversion_rate | conversions
        base_metric: simple_metric # Required, must refer to metric name or metric dict
        conversion_metric: my_simple_metric_that_uses_the_other_time_dimension # Required, must refer to metric name or metric dict
        window: 1 week  # Optional time window
        constant_properties:  # Optional
          - base_property: dimension_or_entity_name  # Dimension or entity from base metric's semantic model
            conversion_property: dimension_or_entity_name  # Dimension or entity from conversion metric's semantic model

# For conversion metrics referencing metrics from different semantic models
metrics:
  - name: my_advanced_conversion_metric
    config:
      group: example_group
      tags:
        - example_tag
        - another_tag
      meta:
        owner: "@docs-team"
    type: conversion
    entity: my_primary_entity # required for conversion metrics
    calculation: conversion_rate # conversion_rate | conversions # required for conversion metrics
    base_metric: my_simple_metric # str | metric dict (if filters are needed)
    conversion_metric: my_other_metric_from_another_semantic_model # str | metric dict (if filters are needed)
    window: 1 week # optional, as above
    constant_properties: # optional - DIMENSION OR ENTITY
      - base_property: my_primary_entity # Required. A reference to a dimension/entity of the semantic model linked to the base_metric
        conversion_property: another_semantic_model_categorical_dimension
```

</File>

</VersionBlock>

## Cumulative metrics

<VersionBlock lastVersion="1.11">

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
      cumulative_type_params:
        window: 7 days
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

[Cumulative metrics](/docs/build/cumulative) aggregate a simple metric over a given period. If no period is specified, the window will accumulate the simple metric over all of the recorded time period. Note that you will need to create the [time spine model](/docs/build/metricflow-time-spine) before you add cumulative metrics.

<File name="models/file_name.yml">

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true
    
    # Define columns, dimensions, entities...
    
    metrics:
      - name: active_users
        type: simple
        agg: count_distinct
        expr: user_id
      
      - name: wau_rolling_7
        type: cumulative
        label: Weekly active users
        description: Rolling 7 day window of active users
        input_metric: active_users  # Required - must refer to metric name or dict
        window: 7 days  # Optional - omit for infinite window (all time)
        join_to_timespine: true  # Optional
        fill_nulls_with: 0  # Optional

# For cumulative metrics using metrics from different semantic models
metrics:
  - name: my_advanced_cumulative_metric
    type: cumulative
    label: Advanced cumulative metric
    input_metric:
      name: metric_from_another_model
      filter: "{{ Dimension('entity__dimension') }} > 0"
      alias: filtered_metric
    window: 1 week  # Optional: can specify window OR grain_to_date, not both
    # grain_to_date: month  # Alternative to window
    # period_agg: first  # Optional: first | last | average
```

</File>

</VersionBlock>

## Derived metrics

[Derived metrics](/docs/build/derived) allow you to perform calculations using other metrics. For example, you can calculate `gross_profit` by subtracting a `cost` metric from a `revenue` metric, or calculate growth by comparing a metric to its value from a previous time period.

<VersionBlock lastVersion="1.11">

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

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true
    
    # Define columns, dimensions, entities...
    
    metrics:
      - name: order_total
        type: simple
        agg: sum
        expr: order_amount
      
      - name: order_cost
        type: simple
        agg: sum
        expr: cost_amount
      
      - name: order_gross_profit
        description: Gross profit from each order
        type: derived
        label: Order gross profit
        expr: revenue - cost  # Required for derived metrics
        input_metrics:  # Required for derived metrics
          - name: order_total
            alias: revenue
          - name: order_cost
            alias: cost

# For derived metrics using metrics from different semantic models
metrics:
  - name: my_advanced_derived_metric
    type: derived
    label: Advanced derived metric
    expr: metric_a - metric_b_offset + metric_c  # Required
    input_metrics:  # Required - list of metric names or dicts
      - name: metric_a
        filter: "{{ Dimension('entity__dimension') }} > 10"
      - name: metric_b
        alias: metric_b_offset
        offset_window: 1 week  # Only allowed for derived metrics
      - name: metric_c
        offset_to_grain: month  # Only allowed for derived metrics
```

</File>

</VersionBlock>


## Ratio metrics

[Ratio metrics](/docs/build/ratio) involve a numerator metric and a denominator metric. A `filter` string can be applied to both the numerator and denominator or separately to the numerator or denominator.

<VersionBlock lastVersion="1.11">

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

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true
    
    # Define columns, dimensions, entities...
    
    metrics:
      - name: cancellations
        type: simple
        agg: sum
      
      - name: transaction_amount
        description: The amount of transactions
        label: Transaction Amount
        type: simple
        agg: sum
      
      - name: cancellation_rate
        type: ratio
        label: Cancellation rate
        numerator: cancellations  # Can be string or dict
        denominator: transaction_amount  # Can be string or dict
        filter: |  # Optional - applies to both numerator and denominator
          "{{ Dimension('customer__country') }} = 'MX'"
      
      - name: enterprise_cancellation_rate
        type: ratio
        label: Enterprise cancellation rate
        numerator:
          name: cancellations
          filter: "{{ Dimension('company__tier') }} = 'enterprise'"  # Optional
          alias: enterprise_cancellations  # Optional
        denominator: transaction_amount
        filter: |  # Optional - applies to both
          {{ Dimension('customer__country') }} = 'MX'

# For ratio metrics using metrics from different semantic models
metrics:
  - name: my_advanced_ratio_metric
    type: ratio
    label: Advanced ratio metric
    numerator:
      name: metric_from_model_a
      filter: "{{ Dimension('entity__dimension') }} > 10"
      alias: filtered_numerator
    denominator:
      name: metric_from_model_b
      filter: "{{ Dimension('entity__dimension') }} < 100"
```

</File>

</VersionBlock>

## Simple metrics

<VersionBlock lastVersion="1.11">

[Simple metrics](/docs/build/simple) point directly to a measure. You may think of it as a function that takes only one measure as the input.

- `name` &mdash; Use this parameter to define the reference name of the metric. The name must be unique amongst metrics and can include lowercase letters, numbers, and underscores. You can use this name to call the metric from the <Constant name="semantic_layer" /> API.

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
        join_to_timespine: true
    filter: |
      {{ Dimension('order__value')}} > 100 and {{Dimension('user__acquisition')}} is not null
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

[Simple metrics](/docs/build/simple) point directly to a single column expression within a semantic model. You can think of a simple metric as the foundational building block for other metrics. It performs an aggregation (like `sum`, `count`, or `average`, and so on) on a single field in your model.

<File name="models/file_name.yml">

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true
    
    # Define columns, dimensions, entities...
    
    metrics:
      - name: cancellations
        description: The number of cancellations
        type: simple
        label: Cancellations
        agg: sum  # Required: sum | max | min | average | median | count_distinct | percentile | count | sum_boolean
        expr: cancellations_usd  # Optional, defaults to metric name
        join_to_timespine: true  # Optional
        fill_nulls_with: 0  # Optional
        filter: |  # Optional
          {{ Dimension('order__value') }} > 100 and "{{ Dimension('user__acquisition') }} is not null
      
      # Example with percentile aggregation
      - name: order_percentile
        type: simple
        label: Order 95th Percentile
        agg: percentile
        expr: order_value
        percentile: 95.0  # Required if agg is percentile
        percentile_type: discrete  # Required: discrete | continuous
      
      # Example with non-additive dimension
      - name: account_balance
        type: simple
        label: Account balance
        agg: sum
        expr: balance_amount
        non_additive_dimension:
          name: snapshot_date  # Must be a dimension
          window_agg: max  # min | max
          group_by:  # Optional - list of entity names
            - account_id
      
      # Example with config
      - name: revenue
        type: simple
        label: Total revenue
        agg: sum
        expr: revenue_amount
        config:
          meta:
            owner: "@finance_team"
            team: "Revenue analytics"
```

</File>

</VersionBlock>

## Filters

Configure a filter using Jinja templating and the following syntax to reference entities, dimensions, time dimensions, or metrics in filters.

Refer to [Metrics as dimensions](/docs/build/ref-metrics-in-filters) for details on how to use metrics as dimensions with metric filters:

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

For example, if you want to filter for the order date dimension grouped by month, use the following syntax:

```yaml
filter: |
  {{ TimeDimension('order_date', 'month') }}

```

## Related docs

- [Semantic models](/docs/build/semantic-models)
- [Fill null values for metrics](/docs/build/fill-nulls-advanced)
- [Metrics as dimensions with metric filters](/docs/build/ref-metrics-in-filters)
