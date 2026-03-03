---
title: "Semantic Layer reference"
id: semantic-layer-reference
sidebar_label: "Semantic Layer reference"
description: "Configuration reference for the Semantic Layer: semantic models, metrics, and dimensions."
keywords:
  - dbt semantic layer
  - semantic layer reference
  - semantic layer configuration
  - metrics configuration
  - dimensions configuration
---

The following **configuration reference** for the Semantic Layer lists every property and option for semantic models, metrics, and dimensions so you can see the full spec in one place.

For conceptual guides and examples, see [Build your metrics](/docs/build/build-metrics-intro) and the linked build docs below.

## Reference pages

| Page | Description |
|------|-------------|
| [Semantic model properties](/reference/semantic-model-properties) | Full property reference for semantic models (entities, measures, dimensions, defaults). |
| [Metric properties](/reference/metric-properties) | Full property reference for metrics (simple, cumulative, ratio, derived, conversion), including metrics defined on a model. |
| [Dimension properties](/reference/dimension-properties) | Full property reference for dimensions (time and categorical). |

## Where to define Semantic Layer objects

You can define Semantic Layer objects in the following ways:

- **Semantic models** — In standalone YAML or in <Constant name="fusion" /> as a `semantic_model` block on a [model](/reference/model-properties).
- **Metrics** — In standalone YAML or in <Constant name="fusion" /> under a semantic model on a model (`semantic_model.metrics`).
- **Dimensions** — Always within a semantic model (as a list under `dimensions` or on columns).

For the complete structure and examples, refer to the build docs: [Semantic models](/docs/build/semantic-models), [Creating metrics](/docs/build/metrics-overview), [Dimensions](/docs/build/dimensions).
