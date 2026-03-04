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

Metrics define measurable quantities that you can query through the Semantic Layer. You can define them in standalone YAML (see [Creating metrics](/docs/build/metrics-overview)) or, in the *latest spec*, as a top-level `metrics:` list on a [model](/reference/model-properties) alongside `semantic_model:` and `columns:`.

import LatestYamlSpecAvailability from '/snippets/_latest-yaml-spec-availability-versioned.md';

<LatestYamlSpecAvailability />

<VersionBlock firstVersion="1.12">

## Latest spec (model YAML)

In the latest spec, you can define metrics on a model. Add a top-level *metrics* list alongside *semantic_model* and *columns* (metrics are not nested under semantic_model). Type-specific settings are top-level keys on each metric.

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
| All | name, type, description, label |
| Simple | agg, expr, time_granularity, agg_time_dimension, hidden, join_to_timespine, fill_nulls_with; optionally config, non_additive_dimension |
| Derived | expr, input_metrics (each with optional alias, filter, offset_window) |
| Ratio | numerator, denominator (each a metric name or a dict with name, filter, alias) |
| Conversion | entity, calculation, base_metric, conversion_metric, window; optional constant_properties |
| Cumulative | input_metric, window, grain_to_date, period_agg |

**Cross-model metrics:** Metrics under a model's *metrics* list can only reference that semantic model. Metrics that depend on other semantic models (for example, cross-model cumulative, ratio, derived, or conversion) go in a top-level *metrics* key in standalone YAML (same in both specs). No simple metrics at that level.

**Note:** For the legacy spec, all metrics were defined in standalone YAML; there was no model-level `metrics:` list.

See [Creating metrics](/docs/build/metrics-overview) and [Semantic models](/docs/build/semantic-models) for the exact YAML structure and examples.

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

- **Simple**: `agg` (required), `expr`, `percentile`, `percentile_type`, `non_additive_dimension`, `agg_time_dimension`, `join_to_timespine`, `fill_nulls_with`
- **Cumulative**: `input_metric` (required), `window`, `grain_to_date`, `period_agg`
- **Derived**: `expr` (required), `input_metrics` (required)
- **Ratio**: `numerator` (required), `denominator` (required)
- **Conversion**: `entity` (required), `calculation` (required), `base_metric` (required), `conversion_metric` (required), `window`, `constant_properties`

For full `type_params` and examples per type, see [Creating metrics](/docs/build/metrics-overview), [Simple metrics](/docs/build/simple), [Cumulative metrics](/docs/build/cumulative), [Ratio metrics](/docs/build/ratio), [Derived metrics](/docs/build/derived), and [Conversion metrics](/docs/build/conversion).

</VersionBlock>
