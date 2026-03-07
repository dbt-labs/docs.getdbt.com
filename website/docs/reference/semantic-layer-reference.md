---
title: Semantic Layer configurations
id: semantic-layer-reference
description: "Configuration reference for the Semantic Layer: semantic models, metrics, and dimensions."
keywords:
  - dbt semantic layer
  - semantic layer configuration
  - metrics configuration
  - dimensions configuration
---

You can use this <Constant name="semantic_layer" /> configuration reference to learn about every property and option for semantic models, metrics, and dimensions that belong to the full YAML spec.

Because this reference provides information about both the *latest spec* (model-embedded) and the *legacy spec* (standalone YAML), you'll need to select the appropriate version from the version picker. [Read the build docs](/docs/build/semantic-models) to find out which applies to your environment. To convert from the legacy spec, see [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec).

import LatestYamlSpecAvailability from '/snippets/_latest-yaml-spec-availability.md';

<LatestYamlSpecAvailability />


## Property reference

Click a link to read the full property reference for that resource. Use the version picker on each page to see *latest spec (model YAML)* or *legacy spec (standalone YAML)* content.

| Page | Description |
|------|-------------|
| [Semantic model properties](/reference/semantic-model-properties) | **Semantic models**: <br></br>- Latest spec (model YAML): `semantic_model:` block, top-level `agg_time_dimension` and `primary_entity`, `columns` (entity/dimension blocks, `granularity`), `derived_semantics`, and optional `metrics`.<br></br> - Legacy spec (standalone YAML): `semantic_models:` list with model, defaults, entities, dimensions, measures, config. |
| [Metric properties](/reference/metric-properties) | **Metrics** — Latest spec (model YAML): top-level `metrics:` list on a model; property table and properties by type (simple, cumulative, ratio, derived, conversion); cross-model rules. Legacy spec (standalone YAML): top-level `metrics:` key; property table with `type_params`; type-specific parameters. |
| [Dimension properties](/reference/dimension-properties) | **Dimensions** — Latest spec (model YAML): column-level `dimension:` block, `granularity:` on column, `derived_semantics.dimensions`, `validity_params`. Legacy spec (standalone semantic model): `dimensions:` list with name, type, `type_params`, description, expr, label, meta. |

## Where to define <Constant name="semantic_layer" /> objects

| Object | Latest spec (model YAML) | Legacy spec (standalone YAML) |
|--------|--------------------------|------------------------------|
| **Semantic models** | Top-level `semantic_model:` block on a [model](/reference/model-properties). | Top-level `semantic_models:` list. |
| **Metrics** | Top-level `metrics:` list on a model alongside `semantic_model:` and `columns:` (not nested under `semantic_model`). Model-level `metrics:` can only reference that semantic model; for cross-model metrics, use standalone YAML. | Top-level `metrics:` key in standalone YAML. |
| **Dimensions** | `dimension:` blocks on model columns (and optional `derived_semantics.dimensions`). Always within a semantic model. | `dimensions:` list on the semantic model. Always within a semantic model. |

## Related documentation

For the complete structure and examples, refer to these build docs:

- [Build your metrics](/docs/build/build-metrics-intro): Conceptual overview of the <Constant name="semantic_layer" />, metric types, and how to get started.
- [Semantic models](/docs/build/semantic-models): How to define semantic models (on a model or standalone), structure, and examples.
- [Creating metrics](/docs/build/metrics-overview): How to create and configure metrics; links to type-specific guides (simple, cumulative, ratio, derived, conversion).
- [Dimensions](/docs/build/dimensions): How to define time and categorical dimensions within semantic models.
- [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec): How to migrate from the legacy metrics YAML spec to the latest spec.
