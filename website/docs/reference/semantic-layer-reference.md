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

The <Constant name="semantic_layer" /> YAML spec defines every property and option for semantic models, metrics, and dimensions. Use it when you need the complete, authoritative list of what you can configure. For example, configurations when defining new objects, validating YAML, or troubleshooting config errors.

Because this reference provides information about both the *latest spec* (model-embedded) and the *legacy spec* (standalone YAML), you'll need to select the appropriate version from the version picker. [Read the build docs](/docs/build/semantic-models) to find out which applies to your environment. To convert from the legacy spec, see [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec).

import LatestYamlSpecAvailability from '/snippets/_latest-yaml-spec-availability.md';

<LatestYamlSpecAvailability />


## Property reference

The property reference pages document each resource type in detail so you can look up allowed values, syntax, and behavior for every property in the full YAML spec. Use the version picker on each page to see *latest spec (model YAML)* or *legacy spec (standalone YAML)* content:

- [Semantic model properties](/reference/semantic-model-properties)
- [Metric properties](/reference/metric-properties)
- [Dimension properties](/reference/dimension-properties) — for the latest spec, distinguishes **column-level** keys (`dimension:`, `granularity:`) from **properties inside** the `dimension:` block; use the version picker on that page for legacy standalone `dimensions:` fields.

## Where to define <Constant name="semantic_layer" /> objects

| Object | Latest spec (model YAML) | Legacy spec (standalone YAML) |
|--------|--------------------------|------------------------------|
| **Semantic models** | Top-level `semantic_model:` block under [models](/reference/model-properties). | Top-level `semantic_models:` list. |
| **Metrics** | For metrics that only depend on the same semantic model, nest them directly under each model in `models:` (but not nested under `semantic_model`). <br /> <br /> For metrics that depend on metrics or dimensions from a different semantic model, define them under a top-level `metrics:` block (For example, `outside models:`). This can be in the same YAML file or a separate one. | Top-level `metrics:` key in standalone YAML. |
| **Dimensions** | `dimension:` blocks on model columns (and optional `derived_semantics.dimensions`). Defined within a model's semantic layer configuration. | `dimensions:` list on the semantic model. Defined within a model's semantic layer configuration. |

## Related documentation

For the complete structure and examples, refer to these build docs:

- [Build your metrics](/docs/build/build-metrics-intro): Conceptual overview of the <Constant name="semantic_layer" />, metric types, and how to get started.
- [Semantic models](/docs/build/semantic-models): How to define semantic models (on a model or standalone), structure, and examples.
- [Creating metrics](/docs/build/metrics-overview): How to create and configure metrics; links to type-specific guides (simple, cumulative, ratio, derived, conversion).
- [Dimensions](/docs/build/dimensions): How to define time and categorical dimensions within semantic models.
- [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec): How to migrate from the legacy metrics YAML spec to the latest spec.
