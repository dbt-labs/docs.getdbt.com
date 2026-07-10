---
title: "Setting row filters"
sidebar_label: "Setting row filters"
description: "Apply a Unity Catalog row filter to a Databricks model with the row_filter config."
---

_Available in versions 1.12 or higher_

You can set `row_filter` to apply a [Unity Catalog row filter](https://docs.databricks.com/aws/en/tables/row-and-column-filters) to a model, restricting which rows a query returns based on a SQL UDF. dbt applies the filter with a `WITH ROW FILTER` clause when it creates the relation, and emits `ALTER ... SET ROW FILTER` / `ALTER ... DROP ROW FILTER` to add, update, or remove the filter on subsequent runs.

`row_filter` is an optional model-level config. When you set it, both of the following properties are required:

| Property   | Description   | Required?| Example  |
|------------|---------------|----------|----------|
| function   | The row-filter UDF to apply. Provide either an unqualified name (dbt qualifies it with the model's catalog and schema) or a fully qualified `catalog.schema.function`. dbt rejects a two-part schema.function name as ambiguous. | Yes | `region_filter` |
| columns    | The columns passed as arguments to the filter function. Can be a single string or a list. Required when `function` is set. | Yes | `[region]` |

Row filters are supported on the `table`, `incremental`, `materialized_view`, and `streaming_table` materializations. They are _not_ supported on regular views or on Hive Metastore relations. Configuring `row_filter` on either raises a compiler error.

This example applies a row filter to a model:

<File name='schema.yml'>

```yaml
models:
  - name: orders
    config:
      row_filter:
        function: my_catalog.my_schema.region_filter
        columns: [region]
```

</File>
