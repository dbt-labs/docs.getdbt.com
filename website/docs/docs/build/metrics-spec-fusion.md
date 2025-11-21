---
title: "Migrate to the latest YAML spec in the dbt Fusion engine"
id: "metrics-spec-fusion"
description: "Learn how to migrate from the legacy metrics spec to the latest metrics spec in Fusion."
sidebar_label: Migrate to the latest YAML spec 
tags: [Metrics, Semantic Layer, Fusion]
---


The latest Semantic Layer specification in the <Constant name="fusion_engine" /> creates an open standard for defining metrics and dimensions that works across multiple platforms. It simplifies authorship by embedding semantic annotations alongside each model, replacing measures with simple metrics, and promoting frequently used options to top-level keys. 

With the new spec, you get simpler configuration without losing flexibility, faster onboarding for new contributors, and a clearer path to consistent, governed metrics across your organization.

## Changes in the latest spec

This section highlights the key updates in the latest metrics spec in Fusion and compares them to the legacy spec.

- [Semantic models](#semantic-models) &mdash; `semantic_model` is nested directly under each model in `models:` instead of being a top-level key.
- [Entities and dimensions](#entities-and-dimensions) &mdash; Entities and dimensions are defined under columns.
- [Time dimension](#time-dimension) &mdash; Set `agg_time_dimension` at the model level as the default time dimension for all metrics, with the option to override per metric. `time_granularity` is deprecated in Fusion. Define `granularity` at the column level.
- [Simple metrics](#simple-metrics) &mdash; Measures are deprecated in Fusion. Use `type: simple` metrics defined directly within the model instead.
- [Advanced metrics](#advanced-metrics) &mdash; Top-level key is required for any metric that depends on metrics or dimensions defined in a different semantic model.
- [`type_params`](#type_params) &mdash; The `type_params` key is deprecated in Fusion.

### Semantic models

The `semantic_model` key is embedded under `models`.

<Tabs>

<TabItem value="new" label="New spec">

```yml
models:
  - name: fct_orders
    semantic_model:
      enabled: true # required
      name: fct_orders_semantic_model # optional override; defaults to value of model.name
```

</TabItem>

<TabItem value="old" label="Legacy spec">

```yml
semantic_models:
  - name: orders
     model: ref('orders')
```

</TabItem>

</Tabs>

### Entities and dimensions

Entities and dimensions are defined directly under columns, creating a 1:1 relationship between the physical columns and their semantic definitions.

<Tabs>

<TabItem value="new" label="New spec">

```yml
models:
  - name: orders
    semantic_model:
      enabled: true
    agg_time_dimension: ordered_at
    columns:
      # entities
      - name: order_id
        entity:
          type: primary
          name: order
      - name: customer_id
        entity:
          type: foreign
          name: customer

      # time dimension
      - name: ordered_at
        granularity: day
        dimension:
          type: time

      # categorical dimension
      - name: order_status
        dimension:
          type: categorical
```

</TabItem>

<TabItem value="old" label="Legacy spec">

```yml
semantic_models:
  - name: orders
    model: ref('orders')
    entities:
      - name: order
        type: primary
        expr: order_id
      - name: customer
        type: foreign
        expr: customer_id
    dimensions:
      - name: ordered_at
        type: time
        type_params:
          time_granularity: day
      - name: status
        type: categorical
        expr: order_status
```

</TabItem>

</Tabs>

### Time dimension

- `agg_time_dimension`: Set once at the model level as the default time dimension for all metrics in that semantic model. You can still override it per metric with `agg_time_dimension`.
- `time granularity`: Deprecated in Fusion. Define the native grain on the time dimension column with `granularity` (for example, `hour`, `day`).

<Tabs>

<TabItem value="new" label="New spec">

```yml
models:
  - name: subscriptions
    semantic_model:
      enabled: true

    # default aggregation time dimension for metrics in this model
    agg_time_dimension: activated_at

    columns:
      - name: activated_at
        granularity: day # native grain on the column
        dimension:
          type: time

      - name: created_at
        granularity: hour # another time column with a different native grain
        dimension:
          type: time

    metrics:
      - name: active_subscriptions
        type: simple
        agg: count
        expr: 1 # inherits agg_time_dimension: activated_at

      - name: signups_by_created_day
        type: simple
        agg: count
        expr: 1
        agg_time_dimension: created_at # override to use created_at as the time dimension
```

</TabItem>

<TabItem value="old" label="Legacy spec">

```yml
semantic_models:
  - name: subscriptions
    model: ref('subscriptions')

    defaults:
      agg_time_dimension: activated_at

    dimensions:
      - name: activated_at
        type: time
        type_params:
          time_granularity: day
      - name: created_at
        type: time
        type_params:
          time_granularity: hour

    measures:
      - name: active_subscriptions
        agg: count

metrics:
  - name: active_subscriptions
    type: simple
    type_params:
      measure: active_subscriptions
```

</TabItem>

</Tabs>


### Simple metrics

Measures are deprecated in Fusion and are replaced with simple metrics.

<Tabs>

<TabItem value="new" label="New spec">

```yml
models:
  - name: customers
    semantic_model:
      enabled: true
    agg_time_dimension: first_ordered_at
    columns:
      - name: customer_id
        entity:
          name: customer
          type: primary
      - name: first_ordered_at
        dimension:
          type: time
        granularity: day
    metrics:
      - name: lifetime_spend_pretax
        type: simple # simple metrics
        agg: sum
        expr: amount_pretax
```

</TabItem>

<TabItem value="old" label="Legacy spec">

```yml
semantic_models:
  - name: customers
    model: ref('customers')
    entities:
      - name: customer
        type: primary
        expr: customer_id
    dimensions:
      - name: first_ordered_at
        type: time
        type_params:
          time_granularity: day
    measures:
      - name: lifetime_spend_pretax
        agg: sum

metrics:
  - name: lifetime_spend_pretax
    type: simple
    type_params:
      measure: lifetime_spend_pretax
```

</TabItem>

</Tabs>

### Advanced metrics

Define simple metrics inside the model, and create cross‑model metrics under a top‑level `metrics` block. Top-level key is required for any metric that depends on metrics or dimensions defined in a different semantic model.

<Tabs>

<TabItem value="new" label="New spec">

```yml
# define simple metrics where the data lives
models:
  - name: orders
    ...
    semantic_model:
      enabled: true
    metrics:
      - name: orders
        type: simple
        agg: count
        expr: 1

  - name: website
    semantic_model:
      enabled: true
    metrics:
      - name: sessions
        type: simple
        agg: count
        expr: 1

# advanced metrics under top-level metrics key
metrics:
  - name: orders_per_session
    type: ratio
    numerator: orders
    denominator: sessions
```

</TabItem>

<TabItem value="old" label="Legacy spec">

```yml
semantic_models:
  - name: orders
    model: ref('orders')
    measures:
      - name: orders
        agg: count
  - name: website
    model: ref('website')
    measures:
      - name: sessions
        agg: count

metrics:
  - name: orders_per_session
    type: ratio
    type_params:
      numerator: { measure: orders }
      denominator: { measure: sessions }
```

</TabItem>

</Tabs>

### `type_params`

The `type_params` key is deprecated. The following are direct keys on the metric:

- `expr`
- `percentile`
- `percentile_type`
- `non_additive_dimension: { name, window_agg, group_by }`
- `join_to_timespine`
- `fill_nulls_with`

<Tabs>

<TabItem value="new" label="New spec">

```yml
models:
  - name: payments
    semantic_model:
      enabled: true
    metrics:
      - name: revenue_p95
        type: simple
        agg: percentile
        expr: amount
        percentile: 95.0
        percentile_type: discrete
```

</TabItem>

<TabItem value="old" label="Legacy spec">

```yml
metrics:
  - name: revenue_p95
    type: simple
    type_params:
      expr: amount
      percentile: 95.0
      percentile_type: discrete
```

</TabItem>

</Tabs>

For [derived metrics](/docs/build/derived), `type_params::metrics` is renamed `input_metrics`.
<Tabs>

<TabItem value="new" label="New spec">

```yaml
metrics:
  - name: d7_booking_change
    description: Difference between bookings now and 7 days ago
    type: derived
    label: d7 bookings change
    expr: current_bookings - bookings_7_days_ago
    input_metrics:
      - name: bookings
        alias: current_bookings
      - name: bookings
        offset_window: 7 days
        alias: bookings_7_days_ago
```

</TabItem>

<TabItem value="old" label="Legacy spec">

```yaml
- name: d7_booking_change
  description: Difference between bookings now and 7 days ago
  type: derived
  label: d7 bookings change
  type_params:
    expr: bookings - bookings_7_days_ago
    metrics:
      - name: bookings
        alias: current_bookings
      - name: bookings
        offset_window: 7 days
        alias: bookings_7_days_ago
```

</TabItem>
</Tabs>

For [ratio metrics](/docs/build/ratio), `numerator` and `denominator` are now direct keys on the metric.

<Tabs>
<TabItem value="new" label="New spec">

```yaml
metrics:
  - name: conversion_rate
    type: ratio
    numerator: conversions
    denominator: sessions
```

</TabItem>

<TabItem value="old" label="Legacy spec">

```yaml
metrics:
  - name: conversion_rate
    type: ratio
    type_params:
      numerator: conversions
      denominator: sessions
```

</TabItem>
</Tabs>

For [cumulative metrics](/docs/build/cumulative):
- `type_params::measure` is renamed `input_metric` and must reference a metric.
- `type_params::cumulative_type_params` values are direct keys on the metric: `window`, `grain_to_date`, and `period_agg`.

<Tabs>
<TabItem value="new" label="New spec">

```yaml
metrics:
  - name: revenue_mtd_cumulative
    type: cumulative
    input_metric: revenue_daily
    window: 30d
    grain_to_date: month
    period_agg: sum
```

</TabItem>

<TabItem value="old" label="Legacy spec">

```yaml
metrics:
  - name: revenue_mtd_cumulative
    type: cumulative
    type_params:
      measure: revenue_daily  
      cumulative_type_params:
        window: 30d
        grain_to_date: month
        period_agg: sum
```

</TabItem>
</Tabs>

For [conversion metrics](/docs/build/conversion), the following `type_params::conversion_type_params` values are direct keys on the metric: 
- `entity`
- `calculation`
- `base_metric` (previously `base_measure`)
- `conversion_metric` (previously `conversion_measure`)
- `constant_properties`

<Tabs>
<TabItem value="new" label="New spec">

```yaml
metrics:
  - name: paid_signup_conversion
    type: conversion
    entity: user_id
    calculation: conversion_rate
    base_metric: signups
    conversion_metric: paid_signups
    constant_properties:
      plan: pro
```

</TabItem>

<TabItem value="old" label="Legacy spec">

```yaml
metrics:
  - name: paid_signup_conversion
    type: conversion
    type_params:
      conversion_type_params:
        entity: user_id
        calculation: conversion_rate
        base_measure: signups            
        conversion_measure: paid_signups
        constant_properties:
          plan: pro
```

</TabItem>
</Tabs>


## Migrating to the latest spec

Migrate your legacy metrics to the latest YAML spec using the dbt-autofix tool in your CLI, the [dbt VS Code extension](/docs/about-dbt-extension), or <Constant name="dbt_platform"/>'s <Constant name="cloud_ide" />.

:::note
Using <Constant name="copilot" /> to generate semantic models with the latest YAML spec is not yet supported. 
:::

Refer to the following steps in this section, depending on which tool you use.

<!--no toc-->
- [Using the CLI or VS Code extension](#using-the-cli-or-vs-code-extension)
- [Using the Studio IDE](#using-the-studio-ide)

### Using the CLI or VS Code extension

The [dbt-autofix tool](https://github.com/dbt-labs/dbt-autofix) rewrites legacy metrics YAML into the Fusion format and produces a clear, reviewable diff in version control. Make sure you have installed the latest version of the autofix tool before migrating to the new spec using the CLI or the dbt VS Code extension.

1. In your CLI or in the VS Code extension, run the following command:

    ```bash
    dbt-autofix deprecations --semantic-layer
    ```

2. Review the diff and resolve all flagged items.

3. Run parsing and validations:

    ```bash
    dbt parse
    mf validate-configs
    ```

### Using the Studio IDE

Convert your metrics in the <Constant name="cloud_ide" /> in the <Constant name="dbt_platform" /> without having to install the `dbt-autofix` tool.

1. Navigate to the <Constant name="cloud_ide" /> by clicking **Studio** in the left menu.
2. Make sure to save and commit your work before proceeding. The autofix command may overwrite any unsaved changes.
3. In the <Constant name="cloud_ide" />, run the following command:

    ```bash
    dbt-autofix deprecations --semantic-layer
    ```
4. Click **Commit and sync** in the top left of the <Constant name="cloud_ide" /> to commit these changes to the project repository.
