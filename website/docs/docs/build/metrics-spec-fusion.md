---
title: "Metrics YAML spec in the dbt Fusion engine"
id: "metrics-spec-fusion"
description: "Learn how to migrate from the legacy metrics spec to the new metrics spec in Fusion."
sidebar_label: Metrics YAML spec in Fusion 
tags: [Metrics, Semantic Layer, Fusion]
---

The legacy MetricFlow YAML specification is often described as complex and disconnected from the model-centric configuration experience in dbt. 

The new Semantic Layer specification in the <Constant name="fusion_engine" /> creates an open standard for defining metrics and dimensions that works across multiple platforms. It simplifies authorship by embedding semantic annotations alongside each model, replacing measures with simple metrics, and promoting frequently used options to direct keys. 

With the new spec, you get simpler configuration without losing flexibility, faster onboarding for new contributors, and a clearer path to consistent, governed metrics across your organization.

## Changes in the new spec

This section highlights the key updates in the new metrics spec in Fusion and compares them to the previous spec.

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

<TabItem value="old" label="Old spec">

```yml
semantic_models:
  - name: orders
```

</TabItem>

</Tabs>

### Entities and dimensions

Entities and dimensions are defined under columns. 

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
        dimension:
          type: time
        granularity: day

      # categorical dimension
      - name: order_status
        dimension:
          type: categorical
        alias: status
```

</TabItem>

<TabItem value="old" label="Old spec">

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

<TabItem value="old" label="Old spec">

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

<TabItem value="old" label="Old spec">

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

<TabItem value="old" label="Old spec">

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

## `type_params`

The `type_params` key is deprecated. The following are direct keys on the metric:

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

<TabItem value="old" label="Old spec">

```yml
metrics:
  - name: revenue_p95
    type: simple
    type_params:
      percentile: 95.0
      percentile_type: discrete
```

</TabItem>

</Tabs>


## Migrating to the new spec

Refer to the steps in this section to convert your legacy metrics to the new YAML spec.

### Using the CLI

The [autofix tool](https://github.com/dbt-labs/dbt-autofix) rewrites legacy metrics YAML into the Fusion format and produces a clear, reviewable diff in version control. Make sure you have installed the autofix tool before migrating to the new spec using the CLI.

1. In your CLI, run the following command:

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

<!--need to confirm steps and replace screenshots-->

You can also convert your metrics in the <Constant name="cloud_ide" /> in the <Constant name="dbt_platform" />. You don't have to install the autofix tool.

1. Navigate to the <Constant name="cloud_ide" /> by clicking **Studio** in the left menu.
2. Make sure to save and commit your work before proceeding. The autofix tool may overwrite any unsaved changes.
3. Click the three-dot menu located at the bottom right corner of the <Constant name="cloud_ide" />.
4. Select **Check & fix deprecations**.
     <Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-options-menu-with-save.png" width="90%" title="Access the Studio IDE options menu to autofix deprecation warnings"/>
        The tool performs a `dbt-autofix deprecations --semantic-layer` to find the deprecations in your project.
5. If you don't see the deprecations and the **Autofix warnings** button, click the command history in the bottom left:
    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/command-history.png" width="90%" title="Access recent commands to see the autofix button"/>
6. When the command history opens, click the **Autofix warnings** button.

7. When the **Proceed with autofix** dialog opens, click **Continue** to begin resolving project deprecations and start a follow-up parse to show remaining deprecations.
    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/proceed-with-autofix.png" width="90%" title="Proceed with autofix"/> 
8. Once complete, a success message appears. Click **Review changes** to verify the changes.

9. Click **Commit and sync** in the top left of <Constant name="cloud_ide" /> to commit these changes to the project repository.
