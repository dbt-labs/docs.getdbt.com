---
title: Sub-daily granularity
id: "sub-daily"
description: "Sub-daily granularity enables you to query metrics at granularities at finer time grains below a day, such as hourly, minute, or even by the second. "
sidebar_label: "Sub-daily granularity"
tags: [Metrics, Semantic Layer]
pagination_next: "docs/build/conversion"
---


Sub-daily granularity enables you to query metrics at granularities at finer time grains below a day, such as hourly, minute, or even by the second. It support anything that `date_trunc` supports. Use sub-daily granularity for cumulative metrics, time spine models at sub-daily grains, and default grain settings for metrics.

This is particularly useful for more detailed analysis and for datasets where high-resolution time data is required, such as minute-by-minute event tracking. 

### Usage
There are two ways to specify sub-daily granularity: `default_grain` and `time_granularity`. This section explains how to use both methods, how they also interact, and which one takes precedence. 

- #### `default_grain`
  Use the `default_grain` parameter in the metric-level metric config to specify the default granularity for querying the metric when no specific granularity is defined. It allows specifying the most common or sensible default, like day, hour, and so on.
  
  This parameter is optional and defaults to `day`.

    <File name="models/metrics/file_name.yml" >

    ```yaml
    metrics:
    - name: my_metrics
        ...
        default_grain: day # Optional: defaults to day
    ```
    </File>

- #### `time_granularity`
  Use the `time_granularity` parameter at the dimension-level with the [time dimension](/docs/build/dimensions#time) `type_params` to specify the level of granularity directly on the data, like hour, minute, second, and so on. It affects how the data is truncated or aggregated in queries.

    <File name="models/metrics/file_name.yml" >

    ```yaml
    dimensions:
    - name: ordered_at
        type: time
        type_params:
          time_granularity: hour

    ```
    </File>

### Precedence
When querying metrics by `metric_time`, MetricFlow currently defaults to the grain of the `agg_time_dimension`. If you want to query metrics at a different grain, you can use the `time_granularity` type parameter in time dimensions.

The following table explains how `default_grain` and `time_granularity` interact and the resulting query granularity:

| Context | `default_grain` | `time_granularity` | Result |
| --- | --- | --- | --- |
| Only `default_grain` specified | `day` | `hour` | Query at `hour` granularity |
| Only `time_granularity` specified | - | `hour` | Query at `hour` granularity |
| Both specified, same value | `hour` | `hour` | Query at `hour` granularity |
| Both specified, different value | `day` | `minute` | Query at `minute` granularity |
| Both not specified | - | - | Defaults to `day` |

Implementation using the `time_granularity` type parameter in time dimensions.
Examples of using DATE_TRUNC with sub-daily granularities in SQL.
