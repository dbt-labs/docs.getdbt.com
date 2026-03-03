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

Metrics define measurable quantities that you can query through the Semantic Layer. You can define them in standalone YAML (see [Creating metrics](/docs/build/metrics-overview)) or, in <Constant name="fusion" />, as a `metrics` list under a [semantic model](/reference/semantic-model-properties) on a [model](/reference/model-properties).

## Available metric properties (common)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes | Unique metric name. Use lowercase letters, numbers, and underscores. |
| description | string | No | Documentation for the metric. |
| type | string | Yes | One of: `simple`, `cumulative`, `ratio`, `derived`, `conversion`. |
| type_params | object | Yes (<Constant name="core" />) | Type-specific parameters. Structure depends on `type`. See the type-specific sections below. |
| label | string | Yes (<Constant name="core" />) / No (<Constant name="fusion" />) | Display name in downstream tools. |
| filter | string | No | MetricFlow filter expression (dimensions, entities, or other metrics). |
| config | object | No | Supports [meta](/reference/resource-configs/meta), [group](/reference/resource-configs/group), [tags](/reference/resource-configs/tags), [enabled](/reference/resource-configs/enabled). |

## Type-specific parameters

The following parameters apply by metric type:

- **Simple**: `agg` (required), `expr`, `percentile`, `percentile_type`, `non_additive_dimension`, `agg_time_dimension`, `join_to_timespine`, `fill_nulls_with`
- **Cumulative**: `input_metric` (required), `window`, `grain_to_date`, `period_agg`
- **Derived**: `expr` (required), `input_metrics` (required)
- **Ratio**: `numerator` (required), `denominator` (required)
- **Conversion**: `entity` (required), `calculation` (required), `base_metric` (required), `conversion_metric` (required), `window`, `constant_properties`

For full `type_params` and examples per type, see [Creating metrics](/docs/build/metrics-overview), [Simple metrics](/docs/build/simple), [Cumulative metrics](/docs/build/cumulative), [Ratio metrics](/docs/build/ratio), [Derived metrics](/docs/build/derived), and [Conversion metrics](/docs/build/conversion).

## Defining metrics on a model

In <Constant name="fusion" />, you can define metrics inside a semantic model that is attached to a model. In your model YAML, under `semantic_model`, add a `metrics` list. Each item uses the same properties as in the table above. This keeps metrics co-located with the semantic model they belong to.

See [Creating metrics](/docs/build/metrics-overview) and [Semantic models](/docs/build/semantic-models) for the exact YAML structure and examples.
