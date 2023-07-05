---
title: Creating metrics
id: metrics-overview
description: "Metrics can be defined in the same or separate YAML files from semantic models within the same dbt project repo."
sidebar_label: "Creating metrics"
tags: [Metrics, Semantic Layer]
---
  
Once you've created your semantic models, it's time to start adding metrics! Metrics can be defined in the same YAML files as your semantic models, or split into separate YAML files into any other subdirectories (provided that these subdirectories are also within the same dbt project repo)

The keys for metrics definitions are: 

* `name`: Provide the reference name for the metric. This name must be unique amongst all metrics.  
* `type`: Define the type of metric, which can be a measure (`simple`) or ratio (`ratio`)). 
* `type_params`: Additional parameters used to configure metrics. `type_params` are different for each metric type. 
* `constraint`: For any type of metric, you may optionally include a constraint string, which applies a dimensional filter when computing the metric. You may think of this as your WHERE clause.  
* `meta`: Additional metadata you want to add to your metric. 

This page explains the different supported metric types you can add to your dbt project. 
<!--
- [Cumulative](#cumulative-metrics) — Cumulative metrics aggregate a measure over a given window.
- [Derived](#derived-metrics) — An expression of other metrics, which allows you to do calculation on top of metrics.
- [Expression](#expression-metrics) — Allow measures to be modified using a SQL expression.
- [Measure proxy](#measure-proxy-metrics) — Metrics that refer directly to one measure.
- [Ratio](#ratio-metrics) — Create a ratio out of two measures. 
-->

<!--not supported for this release
### Cumulative metrics 

[Cumulative metrics](/docs/build/cumulative) aggregate a measure over a given window. Note that if no window is specified, the window would accumulate the measure over all time. 

```yaml
# Cumulative metrics aggregate a measure over a given window. The window is considered infinite if no window parameter is passed (accumulate the measure over all time)
metrics:
- name: wau_rolling_7
  owners:
    - support@getdbt.com
  type: cumulative
  type_params:
    measures:
      - distinct_users
    #Omitting window will accumulate the measure over all time
    window: 7 days
```
-->
### Derived metrics

[Derived metrics](/docs/build/derived) are defined as an expression of other metrics. Derived metrics allow you to do calculations on top of metrics. 

```yaml
metrics:
  - name: net_sales_per_user
    type: derived
    type_params: 
    metrics:
      - name: gross_sales # these are all metrics (can be a derived metric, meaning building a derived metric with derived metrics)
      - name: cogs
      - name: users
      filter: is_active # Optional additional constraint
      alias: active_users # Optional alias to use in the expr
```
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

### Ratio metrics 

[Ratio metrics](/docs/build/ratio) involve a numerator measure and a denominator measure. A  `constraint` string  can be applied, to both numerator and denominator, or applied separately to the numerator or denominator. 

```yaml
# Ratio Metric
metrics:
  - name: cancellation_rate
    owners:
      - support@getdbt.com
# Ratio metrics create a ratio out of two measures.
# Define the measures from the semantic model as numerator or denominator
    type: ratio  
    type_params:
      numerator: cancellations_usd
      denominator: transaction_amount_usd
      filter: | # add optional constraint string. This applies to both the numerator and denominator
      {{ dimension('country', entity_path=['customer']) }} = 'MX'

  - name: enterprise_cancellation_rate
    owners:
      - support@getdbt.com
 # Ratio metrics create a ratio out of two measures. 
 # Define the measures from the semantic model as numerator or denominator
    type: ratio 
    type_params:
      numerator: 
        name: cancellations_usd
        filter: tier = 'enterprise' #constraint only applies to the numerator
      denominator: transaction_amount_usd 
        filter: | # add optional constraint string. This applies to both the numerator and denominator
        {{ dimension('country', entity_path=['customer']) }} = 'MX'
  
```
### Simple metrics

[Simple metrics](/docs/build/simple) point directly to a measure. You may think of it as a function that takes only one measure as the input.

<!--create_metric not supported yet
**Note:** If you've already defined the measure using the `create_metric: True` parameter, you don't need to create simple metrics.  However, if you would like to include a constraint on top of the measure, you will need to create a simple type metric. 
-->
```yaml
metrics: 
# Define the reference name of the metric.  
# This name must be unique amongst metrics and can include lowercase letters, numbers, and underscores. 
# This name is used to call the metric from the dbt Semantic Layer API.
  - name: cancellations 
    type: simple 
    type_params:
  # Specify the measure you are creating a proxy for. 
      measure: cancellations_usd 
      filter: | 
      {{dimension('value')}} > 100 and {{dimension('acquisition', entity_path=['user'])}}
```

### Further configuration 

You can set more metadata for your metrics, which can be used by other tools later on. The way this metadata is used will vary based on the specific integration partner

- **Description** &mdash;  Write a detailed description of the metric.

<!--Provide a detailed description of the metric. This description is surfaced in the main “definition” section of the metric page using rich Markdown formatting in the Transform UI. [this includes transform and not sure how this looks in core and cloud]-->


## Related docs

- [Semantic models](/docs/build/semantic-models)
- [Derived](/docs/build/derived)



