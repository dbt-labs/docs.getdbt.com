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

- [Build your metrics](/docs/build/build-metrics-intro): For conceptual guides and examples.
- [Semantic models](/docs/build/semantic-models)
- [Creating metrics](/docs/build/metrics-overview)
- [Dimensions](/docs/build/dimensions)

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
