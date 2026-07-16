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

### Column-level placement (latest spec)

Add these keys to a **column** under the semantic model’s `columns:` list — they are not nested inside the `dimension:` object.

| Location | Type | Required | Description |
|----------|------|----------|-------------|
| `dimension:` | block or shorthand | Yes (to define a dimension) | Attaches a dimension to the column. Use a mapping (`dimension:` with `type`, etc.) or the shorthand `dimension: categorical` / `dimension: time`. |
| `granularity:` | string | Yes for **time** dimensions | Time grain of the underlying column data (for example, `day`, `week`, `month`). Place `granularity:` on the column next to `dimension:`, not inside the `dimension:` block. For **categorical** dimensions, `granularity` is not meaningful; if it appears in YAML, validation should surface an error. |

### Properties inside the `dimension:` block (latest spec)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | Yes | `time` or `categorical`. |
| `name` | string | No | Unique within the semantic model; defaults to column name. |
| `description` | string | No | Documentation for the dimension. |
| `label` | string | No | Display value in downstream tools. |
| `is_partition` | boolean | No | Whether this dimension is a partition dimension for the model (supported for time and categorical dimensions in YAML). |
| `config` | object | No | Metadata and config. |
| `validity_params` | object | No | For **time** dimensions: SCD-style validity (for example, `is_start`, `is_end`). |

**Derived dimensions:** To define dimensions with an `expr` that is not tied to a single column, use the semantic model’s optional `derived_semantics.dimensions` list. That structure is part of the [semantic model](/reference/semantic-model-properties) configuration (alongside `columns:`), not a property nested under a column’s `dimension:` block. See [Semantic models](/docs/build/semantic-models) and [Dimensions](/docs/build/dimensions) for examples.

- **Column-level:** Under the model's `columns:` list, each column can have a `dimension:` block with *time* or *categorical* type, and optional `name`, `description`, `label`, `is_partition`, `config`.
- **Time dimensions:** The column must also have a top-level `granularity:` (for example, `day`).
- **Validity (SCD):** Time dimensions can specify `validity_params` (for example, `is_start`, `is_end`).

For concepts and usage patterns, refer to [Dimensions](/docs/build/dimensions). For the latest spec, refer to [Semantic models](/docs/build/semantic-models).

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
| is_partition | boolean | No | Whether this dimension is a partition dimension for the model. |
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
    is_partition: true | false   # Optional
    description: <string>        # Optional
    expr: <column_or_sql>        # Optional, defaults to name
    label: <display_name>        # Optional
    meta: {}                     # Optional
```

For the latest spec (column-level and derived dimensions), see [Dimensions](/docs/build/dimensions).

</VersionBlock>
