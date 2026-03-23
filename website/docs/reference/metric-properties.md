---
title: "Metric properties"
id: metric-properties
sidebar_label: "Metric properties"
description: "Property reference for Semantic Layer metrics: simple, cumulative, ratio, derived, and conversion."
keywords:
  - dbt semantic layer
  - metrics
  - metric configuration
  - MetricFlow
---

Metrics define measurable quantities that you can query through the <Constant name="semantic_layer" />. You define them in different places, depending on your <Constant name="dbt" /> version:

- In a model using the *latest* YAML spec. Top-level `metrics:` list on a [model](/reference/model-properties) that has semantic modeling enabled, alongside `semantic_model:` and `columns:`. Available in the <Constant name="dbt_platform" /> **Latest** release track and the <Constant name="fusion_engine" />.
- In the standalone *legacy* YAML spec.  Refer to [Creating metrics](/docs/build/metrics-overview) for more information.

import LatestYamlSpecAvailability from '/snippets/_latest-yaml-spec-availability-versioned.md';

<LatestYamlSpecAvailability />

<VersionBlock firstVersion="1.12">

## Latest spec (model YAML)

In the latest YAML spec, you can define metrics on a model that has semantic modeling enabled. Add a top-level `metrics` list alongside `semantic_model` and `columns` (metrics are not nested under `semantic_model`). Type-specific settings are top-level keys on each metric.

### Available metric properties (latest spec)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes | Unique metric name. Use lowercase letters, numbers, and underscores. |
| type | string | Yes | One of: `simple`, `cumulative`, `ratio`, `derived`, `conversion`. |
| description | string | No | Documentation for the metric. |
| label | string | No | Display name in downstream tools. |
| filter | string | No | MetricFlow filter expression (dimensions, entities, or other metrics). |
| config | object | No | Supports [meta](/reference/resource-configs/meta), [group](/reference/resource-configs/group), [tags](/reference/resource-configs/tags), [enabled](/reference/resource-configs/enabled). |

### Properties by metric type (latest spec)

| Metric type | Key properties |
|-------------|-----------------|
| All | name, type, description, label, hidden, filter, config |
| [Simple](/docs/build/simple) | agg, expr, time_granularity, agg_time_dimension, join_to_timespine, fill_nulls_with; optionally non_additive_dimension |
| [Derived](/docs/build/derived) | expr, input_metrics (each with optional alias, filter, offset_window) |
| [Ratio](/docs/build/ratio) | numerator, denominator (each a metric name or a dict with name, filter, alias) |
| [Conversion](/docs/build/conversion) | entity, calculation, base_metric, conversion_metric, window; optional constant_properties |
| [Cumulative](/docs/build/cumulative) | input_metric, window, grain_to_date, period_agg |

**Cross-model metrics:** Metrics under a model's `metrics:` list can only reference that semantic model. Metrics that depend on other semantic models (for example, cross-model cumulative, ratio, derived, or conversion) go in a top-level `metrics:` block (outside `models:`). This can live in the same YAML file or a separate file.

**Note:** For the legacy spec, all metrics were defined in standalone YAML; there was no model-level `metrics:` list.

For the latest spec, refer to [Semantic models](/docs/build/semantic-models). For metric types, `type_params`, and more examples, refer to [Creating metrics](/docs/build/metrics-overview).

</VersionBlock>

<VersionBlock lastVersion="1.11">

## Legacy spec (standalone YAML)

Metrics are defined in a top-level `metrics:` key in standalone YAML. Type-specific settings go under `type_params`.

### Available metric properties (legacy spec)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes | Unique metric name. Use lowercase letters, numbers, and underscores. |
| type | string | Yes | One of: `simple`, `cumulative`, `ratio`, `derived`, `conversion`. |
| type_params | object | Yes | Type-specific parameters; structure depends on `type`. See the type-specific list below. |
| description | string | No | Documentation for the metric. |
| label | string | Yes | Display name in downstream tools. |
| filter | string | No | MetricFlow filter expression (dimensions, entities, or other metrics). |
| config | object | No | Supports [meta](/reference/resource-configs/meta), [group](/reference/resource-configs/group), [tags](/reference/resource-configs/tags), [enabled](/reference/resource-configs/enabled). |

### Type-specific parameters (legacy spec)

The following parameters apply by metric type under `type_params`:

- **[Simple](/docs/build/simple)**: `agg` (required), `expr`, `percentile`, `percentile_type`, `non_additive_dimension`, `agg_time_dimension`, `join_to_timespine`, `fill_nulls_with`
- **[Cumulative](/docs/build/cumulative)**: `input_metric` (required), `window`, `grain_to_date`, `period_agg`
- **[Derived](/docs/build/derived)**: `expr` (required), `input_metrics` (required)
- **[Ratio](/docs/build/ratio)**: `numerator` (required), `denominator` (required)
- **[Conversion](/docs/build/conversion)**: `entity` (required), `calculation` (required), `base_metric` (required), `conversion_metric` (required), `window`, `constant_properties`

For full `type_params` and examples per type, see [Creating metrics](/docs/build/metrics-overview), [Simple metrics](/docs/build/simple), [Cumulative metrics](/docs/build/cumulative), [Ratio metrics](/docs/build/ratio), [Derived metrics](/docs/build/derived), and [Conversion metrics](/docs/build/conversion).

</VersionBlock>
