---
title: "Dimension properties"
id: dimension-properties
sidebar_label: "Dimension properties"
description: "Complete property reference for dbt Semantic Layer dimensions: time and categorical dimensions."
keywords:
  - dbt semantic layer
  - dimensions
  - dimension configuration
  - MetricFlow
---

Dimensions are non-aggregatable expressions that define how metrics can be grouped or sliced. They are always defined within a [semantic model](/reference/semantic-model-properties). See [Dimensions](/docs/build/dimensions) for concepts and examples.

import LatestYamlSpecAvailability from '/snippets/_latest-yaml-spec-availability-versioned.md';

<LatestYamlSpecAvailability />

<VersionBlock firstVersion="1.12">

## Latest spec (model YAML)

Dimensions are defined at the column level.

### Available dimension properties (latest spec)

| Property / location | Type | Required | Description |
|---------------------|------|----------|-------------|
| `dimension:` (on column) | block | — | Block on a model column. |
| `dimension.type` | string | Yes | `time` or `categorical`. |
| `dimension.name` | string | No | Unique within the semantic model; defaults to column name. |
| `dimension.description` | string | No | Documentation for the dimension. |
| `dimension.label` | string | No | Display value in downstream tools. |
| `dimension.config` | object | No | Metadata and config. |
| `granularity:` (on column) | string | Yes (time only) | Time grain (for example, `day`, `week`, `month`). Required on the column for time dimensions. |
| `derived_semantics.dimensions` | array | No | Derived dimensions with an `expr`. |
| `validity_params` (time) | object | No | SCD-style validity (for example, `is_start`, `is_end`). |

- **Column-level:** Under the model's `columns:` list, each column can have a `dimension:` block with *time* or *categorical* type, and optional `name`, `description`, `label`, `config`.
- **Time dimensions:** The column must also have a top-level `granularity:` (for example, `day`).
- **Derived dimensions:** Use optional `derived_semantics.dimensions` with an `expr`.
- **Validity (SCD):** Time dimensions can specify `validity_params` (for example, `is_start`, `is_end`).

For the full structure and examples, see [Dimensions](/docs/build/dimensions).

</VersionBlock>

<VersionBlock lastVersion="1.11">

## Legacy spec (standalone semantic model)

Dimensions are defined in a top-level `dimensions:` list on the semantic model.

### Available dimension properties (legacy spec)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes | Unique within the semantic model. Displayed in downstream tools; can act as alias when `expr` differs. |
| type | string | Yes | `time` or `categorical`. |
| type_params | object | Yes (time only) | For time dimensions (for example, `time_granularity`, `is_primary`, `time_partitioning_granularity`). Omitted for categorical. |
| description | string | No | Documentation for the dimension. |
| expr | string | No | Column or SQL expression. Defaults to the dimension name if omitted. |
| label | string | No | Display value in downstream tools. |
| meta | object | No | Metadata key-value pairs. |

### Full structure (standalone semantic model, legacy spec)

```yaml
dimensions:
  - name: <dimension_name>       # Required
    type: time | categorical    # Required
    type_params:                 # Required for time
      time_granularity: day | week | month | quarter | year
      is_primary: true | false
    description: <string>        # Optional
    expr: <column_or_sql>        # Optional, defaults to name
    label: <display_name>        # Optional
    meta: {}                     # Optional
```

For the latest spec (column-level and derived dimensions), see [Dimensions](/docs/build/dimensions).

</VersionBlock>
