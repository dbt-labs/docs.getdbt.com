---
title: Metrics
id: metrics-overview
description: "Metrics can be defined in the same or separate YAML files from semantic models within the same dbt project repo."
sidebar_label: "Metrics"
tags: [Metrics, Semantic Layer]
---
  

Once you've created your semantic models its time to start adding metrics! Metrics can be defined in the same YAML files as your semantic models, or split into separate YAML files into any other subdirectories (provided that these subdirectories are also within the same dbt project repo)

The keys for metrics definitions are: 

* `name`: Provide the reference name for the metric. This name must be unique amongst all metrics.  
* `type`: Define the type of metric, which can be a measure (`measure_proxy`), ratio (`ratio`), SQL expression (`expr`), or cumulative (`cumulative`). 
* `type_params`: Additional parameters used to configure metrics. `type_params` are different for each metric type. 
* `constraint`: For any type of metric, you may optionally include a constraint string, which applies a dimensional filter when computing the metric. You may think of this as your WHERE clause.  

These are the different supported metric types:
<!--
- [Cumulative](#cumulative-metrics) — Cumulative metrics aggregate a measure over a given window.
- [Derived](#derived-metrics) — An expression of other metrics, which allows you to do calculation on top of metrics.
- [Expression](#expression-metrics) — Allow measures to be modified using a SQL expression.
- [Measure proxy](#measure-proxy-metrics) — Metrics that refer directly to one measure.
- [Ratio](#ratio-metrics) — Create a ratio out of two measures. 
-->

### Cumulative metrics 
[Cumulative metrics](/docs/build/cumulative) aggregate a measure over a given window. Note that if no window is specified, the window would accumulate the measure over all time. 

```yaml
# Cumulative metrics aggregate a measure over a given window. The window is considered infinite if no window parameter is passed (accumulate the measure over all time)
metrics:
- name: wau_rolling_7
  owners:
    - ssupport@getdbt.com
  type: cumulative
  type_params:
    measures:
      - distinct_users
    #Omitting window will accumulate the measure over all time
    window: 7 days
```

### Derived metrics
[Derived metrics](/docs/build/derived) is defined as an expression of other metrics. This is different form EXPR type metrics, which can only be built of measures. Derived metrics allow you to do calculation on top of metrics. 

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
        constraint: is_active # Optional additional constraint
        alias: active_users # Optional alias to use in the expr
```

### Expression metrics
Use [expression metrics](/docs/build/expr) for when you're building a metric that involves a SQL expression of multiple measures.

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

### Measure proxy metrics
[Measure proxies](/docs/build/measure-proxy) are metrics that point directly to a measure (you may think of the measure proxy as a function that takes only one measure as the input). 

**Note:** If you've already defined the measure using the `create_metric: True` parameter, you don't need to create measure proxies.  However, if you would like to include a constraint on top of the measure, you will need to create a measure proxy type metric. 

```yaml
metrics: 
  name: cancellations # Define the reference name of the metric. This name must be unique amongst metrics and can include lowercase letters, numbers and underscores.
                      # This name is used to call the metric from the MetricFlow API.
  type: measure_proxy 
  type_params:
    measure: cancellations_usd # Specify the measure you are creating a proxy for. 
  constraint: | 
    value > 100 AND user__acquisition
```

### Ratio metrics 
[Ratio metrics](/docs/build/ratio) involve a numerator measure and a denominator measure. A  `constraint` string  can be applied, to both numerator and denominator, or applied separately to the numerator or denominator. 

```yaml
# Ratio Metric
metrics:
- name: cancellation_rate
  owners:
    - upport@getdbt.com
  type: ratio # Ratio metrics create a ratio out of two measures. Define the measures from the semantic model as numerator or denominator
  type_params:
    numerator: cancellations_usd
    denominator: transaction_amount_usd
  constraint: | # add optional constraint string. This applies to both the numerator and denominator
    is_internal = false

- name: enterprise_cancellation_rate
  owners:
    - support@getdbt.com
  type: ratio # Ratio metrics create a ratio out of two measures. Define the measures from the semantic model as numerator or denominator
  type_params:
    numerator: 
      name: cancellations_usd
      constraint: tier = 'enterprise' #constraint only applies to the numerator
    denominator: transaction_amount_usd 
  constraint: | # add optional constraint string. This applies to both the numerator and denominator
    is_internal = false
  
```


### Further configuration 

You can set more metadata for your metrics, which can be used by other tools later on. The way this metadata is used will vary based on the specific integration partner

- **Description** &mdash;  Write a detailed description of the metric

<!--Provide a detailed description of the metric. This description is surfaced in the main “definition” section of the metric page using rich Markdown formatting in the Transform UI. [this includes transform and not sure how this looks in core and cloud]-->


## Related docs

- [Cumulative](/docs/build/cumulative)
- [Derived](/docs/build/derived)
- [Expression](/docs/build/expr)
- [Measure proxy](/docs/build/measure-proxy)
- [Ratio](/docs/build/ratio)


