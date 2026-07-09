---
title: "Configuring columns"
sidebar_label: "Configuring columns"
description: "Set column-level configs for Databricks models, including databricks_tags and column masks for dynamic data masking."
---

_Available in versions 1.10 or higher_

When materializing models of various types, you may include several optional column-level configs that are specific to the dbt-databricks plugin, in addition to the standard [column configs](/reference/resource-properties/columns). Support for column tags and column masks were added in dbt-databricks v1.10.4.

| Option    | Description   | Required?| Model support | Materialization support | Example  |
|-----------|---------------|----------|---------------|----------------------------|----------|
| databricks_tags     | [Tags](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) to be set on individual columns    | Optional    |  SQL†, Python† | Table, Incremental, Materialized View, Streaming Table  | `{'data_classification': 'pii'}`  |
| column_mask   | [Column mask](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-column-mask) configuration for dynamic data masking. Accepts `function` and optional `using_columns` properties*  | Optional     | SQL, Python   | Table, Incremental, Streaming Table | `{'function': 'my_catalog.my_schema.mask_email'}`   |

\* `using_columns` supports all parameter types listed in [Databricks column mask parameters](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-column-mask#parameters).


† `databricks_tags` are applied via `ALTER` statements. Tags cannot be removed via dbt-databricks once applied. To remove tags, use Databricks directly or a post-hook. Starting in `dbt-databricks` v1.12, `databricks_tags` set at multiple config hierarchy levels [merge additively](/reference/resource-configs/databricks-configs/materialized-views-and-streaming-tables#databricks_tags) instead of the lower (more specific) level fully replacing the higher one.

This example uses the column-level configurations in the previous table:

<File name='schema.yml'>

```yaml
models:
  - name: customers
    columns:
      - name: customer_id
        databricks_tags:
          data_classification: "public"
      - name: email
        databricks_tags:
          data_classification: "pii"
        column_mask:
          function: my_catalog.my_schema.mask_email
          using_columns: "customer_id, 'literal string'"
```

</File>
