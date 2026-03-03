---
title: "Metric properties"
id: metric-properties
sidebar_label: "Metric properties"
description: "Complete property reference for dbt Semantic Layer metrics: simple, cumulative, ratio, derived, and conversion metrics."
keywords:
  - dbt semantic layer
  - metrics
  - metric configuration
  - MetricFlow
---

Metrics define measurable quantities that can be queried via the dbt Semantic Layer. They can be defined in standalone YAML (see [Creating metrics](/docs/build/metrics-overview)) or, in dbt Core 2.0+, as a `metrics` list under a [semantic model](/reference/semantic-model-properties) on a [model](/reference/model-properties).

## Available metric properties (common)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes | Unique metric name (lowercase letters, numbers, underscores). |
| description | string | No | Documentation for the metric. |
| type | string | Yes | One of: `simple`, `cumulative`, `ratio`, `derived`, `conversion`. |
| type_params | object | Yes (pre-2.0) | Type-specific parameters; structure depends on `type`. See type-specific sections below. |
| label | string | Yes (pre-2.0) / No (2.0+) | Display name in downstream tools. |
| filter | string | No | MetricFlow filter expression (dimensions, entities, or other metrics). |
| config | object | No | Supports [meta](/reference/resource-configs/meta), [group](/reference/resource-configs/group), [tags](/reference/resource-configs/tags), [enabled](/reference/resource-configs/enabled). |

## Type-specific parameters

- **Simple**: `agg` (required), `expr`, `percentile`, `percentile_type`, `non_additive_dimension`, `agg_time_dimension`, `join_to_timespine`, `fill_nulls_with`
- **Cumulative**: `input_metric` (required), `window`, `grain_to_date`, `period_agg`
- **Derived**: `expr` (required), `input_metrics` (required)
- **Ratio**: `numerator` (required), `denominator` (required)
- **Conversion**: `entity` (required), `calculation` (required), `base_metric` (required), `conversion_metric` (required), `window`, `constant_properties`

For full type_params and examples per type, see [Creating metrics](/docs/build/metrics-overview), [Simple metrics](/docs/build/simple), [Cumulative metrics](/docs/build/cumulative-metrics), [Ratio metrics](/docs/build/ratio-metrics), [Derived metrics](/docs/build/derived-metrics), and [Conversion metrics](/docs/build/conversion-metrics).

## Defining metrics on a model (2.0+)

In dbt Core 2.0 and later, you can define metrics inside a semantic model that is attached to a model. In your model's YAML, under `semantic_model`, add a `metrics` list. Each item uses the same properties as above. This keeps simple metrics co-located with the semantic model they belong to.

See [Creating metrics](/docs/build/metrics-overview) and [Semantic models](/docs/build/semantic-models) for the exact YAML structure and examples.
