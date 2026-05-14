---
title: "Migrate to the latest YAML spec"
id: "latest-metrics-spec"
description: "Learn how to migrate from the legacy metrics spec to the latest metrics spec."
sidebar_label: Migrate to the latest YAML spec 
tags: [Metrics, Semantic Layer, Fusion]
---


The latest Semantic Layer specification creates an open standard for defining metrics and dimensions that works across multiple platforms. It simplifies authorship by embedding semantic annotations alongside each model, replacing measures with simple metrics, and promoting frequently used options to top-level keys. 

With the new spec, you get simpler configuration without losing flexibility, faster onboarding for new contributors, and a clearer path to consistent, governed metrics across your organization. 

import LatestYamlSpecAvailability from '/snippets/_latest-yaml-spec-availability.md';

<LatestYamlSpecAvailability />

## Changes in the latest spec 

This section highlights the key updates in the latest metrics spec and compares them to the legacy spec.

- [Semantic models](#semantic-models): These define the business logic for your metrics by specifying entities, dimensions, and how they relate to your data models. In the new spec, `semantic_model` is nested directly under each model in `models:` instead of being a top-level key.
- [Entities and dimensions](#entities-and-dimensions): Entities are the people, places, or things you want to group or join your metrics by (like `user_id` or `order_id`), while dimensions are the attributes you use to filter or slice your data (like `status` or `region`). In the new spec, both are defined directly under `columns:`.
- [Time dimension](#time-dimension): Time dimensions are the date or timestamp columns that let you analyze metrics over time (like `order_date` or `created_at`). In the new spec, set `agg_time_dimension` at the model level as the default time dimension for all metrics, with the option to override per metric. Define `granularity` at the column level instead of using the deprecated `time_granularity`.
- [Simple metrics](#simple-metrics): Metrics that directly reference a single column expression within a semantic model, without any additional columns involved. Simple metrics replace measures in the new spec. Use `type: simple` metrics defined directly within the model to replace measures.
- [Advanced metrics](#advanced-metrics): These are metrics that combine or build upon other metrics, such as ratios, conversions, or derived calculations. In the new spec, define simple metrics inside the model, and create cross‑model metrics under a top‑level `metrics` block. Top-level key is required for any metric that depends on metrics or dimensions defined in a different semantic model.
- [`type_params`](#type_params): This is a wrapper key in the legacy spec that contains metric-specific configurations (for example, `expr`, `join_to_timespine`). `type_params` is deprecated in the new spec and these parameters are promoted to top-level keys within each metric definition.

### Semantic models

The `semantic_model` key is embedded under `models`.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>New spec</h4>

```yml
models:
  - name: fct_orders
    semantic_model:
      enabled: true # required
      name: fct_orders_semantic_model # optional override; defaults to value of model.name
```
</div>

<div>

<h4 style={{marginTop: 0}}>Legacy spec</h4>

```yml
semantic_models:
  - name: orders
     model: ref('orders')
```

</div>

</div>

import SLMeshLatestSpec from '/snippets/_sl-mesh-latest-spec.md';

<SLMeshLatestSpec/>

### Entities and dimensions

Entities and dimensions are defined directly under columns, creating a 1:1 relationship between the physical columns and their semantic definitions.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>New spec</h4>

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

</div>

<div>

<h4 style={{marginTop: 0}}>Legacy spec</h4>

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

</div>

</div>


### Time dimension

- `agg_time_dimension`: Set once at the model level as the default time dimension for all metrics in that semantic model. You can still override it per metric with `agg_time_dimension`.
- `time granularity`: Deprecated in the new spec. Define the native grain on the time dimension column with `granularity` (for example, `hour`, `day`).

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>New spec</h4>

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

</div>

<div>

<h4 style={{marginTop: 0}}>Legacy spec</h4>

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

</div>

</div>

### Simple metrics

Measures are deprecated in the new spec and are replaced with simple metrics.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>New spec</h4>

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

</div>

<div>

<h4 style={{marginTop: 0}}>Legacy spec</h4>

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

</div>

</div>


### Advanced metrics

Define simple metrics inside the model, and create cross‑model metrics under a top‑level `metrics` block. Top-level key is required for any metric that depends on metrics or dimensions defined in a different semantic model.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>New spec</h4>

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

</div>

<div>

<h4 style={{marginTop: 0}}>Legacy spec</h4>

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

</div>

</div>

### `type_params`

The `type_params` key is deprecated. The following are direct keys on the metric:

- `expr`
- `percentile`
- `percentile_type`
- `non_additive_dimension: { name, window_agg, group_by }`
- `join_to_timespine`
- `fill_nulls_with`

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>New spec</h4>

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

</div>

<div>

<h4 style={{marginTop: 0}}>Legacy spec</h4>

```yml
metrics:
  - name: revenue_p95
    type: simple
    type_params:
      expr: amount
      percentile: 95.0
      percentile_type: discrete
```

</div>

</div>

For [derived metrics](/docs/build/derived), `type_params.metrics` is renamed `input_metrics`.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>New spec</h4>

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

</div>

<div>

<h4 style={{marginTop: 0}}>Legacy spec</h4>

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

</div>

</div>

For [ratio metrics](/docs/build/ratio), `numerator` and `denominator` are now direct keys on the metric.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>New spec</h4>

```yaml
metrics:
  - name: conversion_rate
    type: ratio
    numerator: conversions
    denominator: sessions
```

</div>

<div>

<h4 style={{marginTop: 0}}>Legacy spec</h4>

```yaml
metrics:
  - name: conversion_rate
    type: ratio
    type_params:
      numerator: conversions
      denominator: sessions
```

</div>

</div>

For [cumulative metrics](/docs/build/cumulative):
- `type_params.measure` is renamed `input_metric` and must reference a metric.
- `type_params.cumulative_type_params` values are direct keys on the metric: `window`, `grain_to_date`, and `period_agg`.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>New spec</h4>

```yaml
metrics:
  - name: revenue_mtd_cumulative
    type: cumulative
    input_metric: revenue_daily
    window: 30d
    grain_to_date: month
    period_agg: sum
```

</div>

<div>

<h4 style={{marginTop: 0}}>Legacy spec</h4>

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

</div>

</div>

For [conversion metrics](/docs/build/conversion), the following `type_params.conversion_type_params` values are direct keys on the metric: 
- `entity`
- `calculation`
- `base_metric` (previously `base_measure`)
- `conversion_metric` (previously `conversion_measure`)
- `constant_properties`

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>New spec</h4>

```yaml
metrics:
  - name: paid_signup_conversion
    type: conversion
    entity: user_id
    calculation: conversion_rate
    base_metric: signups
    conversion_metric: paid_signups
    constant_properties:
      - base_property: plan
        conversion_property: plan
```

</div>

<div>

<h4 style={{marginTop: 0}}>Legacy spec</h4>

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

</div>

</div>

## Migrating to the latest spec

:::note Studio IDE YAML validation
The <Constant name="studio_ide" /> validates dbt YAML using JSON Schema from the [dbt-jsonschema](https://github.com/dbt-labs/dbt-jsonschema) project. These definitions are aligned with the <Constant name="fusion_engine" /> and apply across all [<Constant name="dbt_platform" /> release tracks](/docs/dbt-versions/dbt-release-tracks), including when your development environment is still running <Constant name="core" />.

If the <Constant name="studio_ide" /> flags your YAML as invalid but <Constant name="dbt" /> commands succeed, trust your run results. Share examples with [dbt Support](mailto:support@getdbt.com) or your account team so the schema can be updated.
:::

Migrate your legacy metrics to the latest YAML spec using the dbt-autofix tool in your CLI, the [dbt VS Code extension](/docs/about-dbt-extension), or <Constant name="dbt_platform"/>'s <Constant name="studio_ide" />.

import CopilotLimitation from '/snippets/_copilot-limitation.md';

<CopilotLimitation />

### Package compatibility

If your project uses dbt packages (listed in `packages.yml`) that define metrics or semantic models, the package maintainer must update those packages to use the latest YAML spec.

The [dbt-autofix tool](https://github.com/dbt-labs/dbt-autofix) only updates files in your current dbt project (like models, marts, and so on) and does not update installed packages under `dbt_packages/`. If an installed package still uses the legacy metrics spec, dbt may raise parsing or validation errors after migration.

To update packages, a package maintainer should:

1. Run `dbt-autofix deprecations --semantic-layer` in the package repository.

2. Validate the changes by running:

  - For Fusion and dbt users in the dbt platform CLI or locally with a valid `dbt_cloud.yml`:

    ```bash
    dbt parse
    dbt sl validate
    ```

    When using `dbt sl validate` locally, the command validates your local semantic manifest, and not the platform's manifest. This means your uncommitted local changes are included in the validation.

  - For Fusion CLI users not connected to dbt platform and using local MetricFlow:

    ```bash
    dbt parse
    mf validate-configs
    ```

3. Release a new version of the package with the updated metrics definitions.

After a compatible version is released, update your project to [install the new package version](/docs/build/packages). You can then migrate your metrics to the latest spec with the following steps, depending on which tool you're using.

<!--no toc-->
- [Using the CLI or VS Code extension](#using-the-cli-or-vs-code-extension)
- [Using the Studio IDE](#using-the-studio-ide)

### Using the CLI or VS Code extension

The [dbt-autofix tool](https://github.com/dbt-labs/dbt-autofix) rewrites legacy metrics YAML into the latest format and produces a clear, reviewable diff in version control. Make sure you have installed the latest version of the autofix tool before migrating to the new spec using the CLI or the dbt VS Code extension.

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

Convert your metrics in the <Constant name="studio_ide" /> in the <Constant name="dbt_platform" /> without having to install the `dbt-autofix` tool.

1. Navigate to the <Constant name="studio_ide" /> by clicking **Studio** in the left menu.
2. Make sure to save and commit your work before proceeding. The autofix command may overwrite any unsaved changes.
3. In the <Constant name="studio_ide" />, run the following command:

    ```bash
    dbt-autofix deprecations --semantic-layer
    ```
4. Click **Commit and sync** in the top left of the <Constant name="studio_ide" /> to commit these changes to the project repository.
