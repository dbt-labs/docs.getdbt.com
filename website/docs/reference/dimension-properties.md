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

## Available dimension properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes | Unique within the semantic model. Displayed in downstream tools; can act as alias when `expr` differs. |
| type | string | Yes | `time` or `categorical`. |
| type_params | object | Yes (pre-2.0) | For time dimensions: e.g. `time_granularity`, `is_primary`, `time_partitioning_granularity`. Omitted for categorical. |
| description | string | No | Documentation for the dimension. |
| expr | string | No | Column or SQL expression. Defaults to the dimension name if omitted. |
| label | string | No | Display value in downstream tools. |
| meta | object | No | Metadata key-value pairs. |

In dbt Core 2.0+, dimensions can be defined at the column level under a model's `columns` (with a `dimension` block per column) or as derived semantics. See [Dimensions](/docs/build/dimensions) for the full structure.

## Full structure (standalone semantic model, pre-2.0)

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

For the latest spec (including 2.0+ column-level and derived dimensions), see [Dimensions](/docs/build/dimensions).
