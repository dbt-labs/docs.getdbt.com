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

Semantic models define the structure that MetricFlow uses to build the semantic graph. They can be declared in standalone YAML (see [Semantic models](/docs/build/semantic-models)) or, in the *latest spec*, as a top-level `semantic_model:` block on a [model](/reference/model-properties).

import LatestYamlSpecAvailability from '/snippets/_latest-yaml-spec-availability-versioned.md';

<LatestYamlSpecAvailability />

<VersionBlock firstVersion="1.12">

## Latest spec (model YAML)

In the latest spec, a model defines a `semantic_model:` block and optional top-level keys; dimensions and entities are defined at the column level.

### Available semantic model properties (latest spec)

| Property / location | Type | Required | Description |
|---------------------|------|----------|-------------|
| `semantic_model.enabled` | boolean | Yes | Must be `true` to enable the semantic model. |
| `semantic_model.name` | string | No | Unique name; defaults to model name. |
| `semantic_model.group` | string | No | Group for organization. |
| `semantic_model.config` | object | No | Supports [meta](/reference/resource-configs/meta), [group](/reference/resource-configs/group), [enabled](/reference/resource-configs/enabled). |
| `agg_time_dimension` (top-level) | string | Yes | Default time dimension for metrics; references dimension name. |
| `primary_entity` (top-level) | string | No | Primary entity name when no column has `type: primary`. |
| `columns` | array | Yes | Column list; each can have `entity:` or `dimension:` block; time dimensions have `granularity` on the column. |
| `derived_semantics` | object | No | Optional dimensions and entities with `expr`. |
| `metrics` (top-level) | array | No | Metrics derived from this semantic model; list is alongside (not under) `semantic_model`. |

In the latest spec, a model can define:

- **`semantic_model:`** block (with required `enabled`) and optional top-level keys such as `agg_time_dimension` and `primary_entity`.
- **`columns:`** list: each column can have an `entity:` or `dimension:` block; time dimensions also have `granularity` on the column.
- Optional **`derived_semantics:`** (dimensions and entities with `expr`).
- Top-level **`metrics:`** list alongside (not under) `semantic_model`. Metrics on the model are only derived from that semantic model.

**Minimal structure:**

```yaml
models:
  - name: my_model
    semantic_model:
      enabled: true    # required
      name: optional_override   # optional; defaults to model name
      group: optional_group
      config:
        meta: {}
    agg_time_dimension: my_time_dimension   # top-level; references dimension name
    primary_entity: my_primary_entity       # optional; use when no column has type: primary
    columns:
      - name: my_entity_column
        entity:
          type: primary | foreign | unique | natural
          name: optional_entity_name
      - name: my_time_dimension_column
        granularity: day    # required for time dimensions
        dimension:
          type: time
          name: my_time_dimension
      - name: my_categorical_dimension_column
        dimension:
          type: categorical
          name: my_categorical_dimension
    derived_semantics:    # optional
      dimensions: []
      entities: []
    metrics:
      - name: my_simple_metric
        type: simple
        agg: count
        expr: optional_expr
```

For the full structure and all options, see [Semantic models](/docs/build/semantic-models).

</VersionBlock>

<VersionBlock lastVersion="1.11">

## Legacy spec (standalone YAML)

Semantic models are defined in a top-level `semantic_models:` list in standalone YAML, with `model`, `defaults`, `entities`, `dimensions`, and `measures`.

### Available semantic model properties (legacy spec)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes | Unique name for the semantic model. Avoid double underscores (`__`). |
| description | string | No | Documentation for the semantic model. |
| model | string | Yes | The dbt model reference, e.g. `ref('my_model')`. |
| defaults | object | Yes | Defaults; typically `agg_time_dimension`. |
| entities | array | Yes | Join keys and type (primary, foreign, unique); each with `name`, `type`, optional `expr`. |
| primary_entity | string | No | Name of the primary entity if not declared on an entity. |
| dimensions | array | Yes | List of [dimension](/reference/dimension-properties) definitions (time or categorical). |
| measures | array | No | List of measures (simple aggregations). |
| label | string | No | Display name in downstream tools. |
| config | object | No | Supports [meta](/reference/resource-configs/meta), [group](/reference/resource-configs/group), [enabled](/reference/resource-configs/enabled). |

### Full structure (standalone YAML, legacy spec)

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

For the latest spec (model-embedded form with top-level `semantic_model:` and `metrics:` on the model), see [Semantic models](/docs/build/semantic-models).

</VersionBlock>
