---
title: "Semantic model properties"
id: semantic-model-properties
sidebar_label: "Semantic model properties"
description: "Complete property reference for dbt Semantic Layer semantic models: name, model, entities, dimensions, measures, and configuration."
keywords:
  - dbt semantic layer
  - semantic model
  - semantic model configuration
  - MetricFlow
---

Semantic models define the structure that MetricFlow uses to build the semantic graph. They can be declared in standalone YAML (see [Semantic models](/docs/build/semantic-models)) or, in dbt Core 2.0+, as a `semantic_model` block on a [model](/reference/model-properties).

## Available semantic model properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes (standalone) / No (on model; defaults to model name) | Unique name for the semantic model. Avoid double underscores (`__`). |
| description | string | No | Documentation for the semantic model. |
| model | string | Yes (standalone only) | The dbt model reference, for example `ref('my_model')`. Omitted when defined on a model. |
| defaults | object | Yes (standalone, pre-2.0) | Defaults for the semantic model; typically `agg_time_dimension`. In 2.0+ this is expressed as `time_dimension` / `agg_time_dimension` at the top level. |
| entities | array | Yes | Join keys and their type (primary, foreign, unique, natural). In 2.0+ entities can be defined at the column level. |
| primary_entity | string | No | Name of the primary entity if not declared on a column. Required if no column has `type: primary`. |
| dimensions | array | Yes | List of [dimension](/reference/dimension-properties) definitions (time or categorical). |
| measures | array | No | List of measures (simple aggregations). In 2.0+ also referred to as simple metrics. |
| label | string | No | Display name in downstream tools. |
| config | object | No | Supports [meta](/reference/resource-configs/meta), [group](/reference/resource-configs/group), [enabled](/reference/resource-configs/enabled). |

Version-specific behavior (standalone vs model-embedded, and exact property names) is documented in [Semantic models](/docs/build/semantic-models).

## Full structure (standalone YAML, pre-2.0 style)

```yaml
semantic_models:
  - name: <unique_name>
    description: <string>
    model: "{{ ref('my_model') }}"
    defaults:
      agg_time_dimension: <time_dimension_name>
    entities:
      - name: <entity_name>
        type: primary | foreign | unique
        expr: <optional_sql_expr>
    dimensions:
      - name: <dimension_name>
        type: time | categorical
        # ... see dimension-properties
    measures:
      - name: <measure_name>
        agg: sum | count | count_distinct | avg | min | max | ...
        expr: <column_or_expr>
    label: <display_name>
    config:
      meta: {}
      group: <string>
      enabled: true | false
```

For the latest spec (including 2.0+ model-embedded form and derived semantics), see [Semantic models](/docs/build/semantic-models).
