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

## Related documentation

- [Build your metrics](/docs/build/build-metrics-intro): Conceptual overview of the Semantic Layer, metric types, and how to get started.
- [Semantic models](/docs/build/semantic-models): How to define semantic models (standalone or on a model), structure, and examples.
- [Creating metrics](/docs/build/metrics-overview): How to create and configure metrics; links to type-specific guides (simple, cumulative, ratio, derived, conversion).
- [Dimensions](/docs/build/dimensions): How to define time and categorical dimensions within semantic models.

This section is the **configuration reference** for the Semantic Layer. It lists every property and option for semantic models, metrics, and dimensions so you can see the full spec in one place.

## Property reference

Click the link on each option to read the full property reference.

| Page | Description |
|------|-------------|
| [Semantic model properties](/reference/semantic-model-properties) | Properties for semantic models (entities, measures, dimensions, defaults). |
| [Metric properties](/reference/metric-properties) | Properties for metrics (simple, cumulative, ratio, derived, conversion), including metrics defined on a model. |
| [Dimension properties](/reference/dimension-properties) | Properties for dimensions (time and categorical). |

## Where to define Semantic Layer objects

You can define Semantic Layer objects in the following ways:

- **Semantic models** — In standalone YAML or in <Constant name="fusion" /> as a `semantic_model` block on a [model](/reference/model-properties).
- **Metrics** — In standalone YAML or in <Constant name="fusion" /> under a semantic model on a model (`semantic_model.metrics`).
- **Dimensions** — Always within a semantic model (as a list under `dimensions` or on columns).

For the complete structure and examples, refer to the build docs linked above.
