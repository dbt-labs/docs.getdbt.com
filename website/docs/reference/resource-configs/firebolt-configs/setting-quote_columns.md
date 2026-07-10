---
title: "Setting quote_columns"
sidebar_label: "quote_columns"
description: "Explicitly set a value for quote_columns in your project file to prevent a warning when running seeds in Firebolt."
---

To prevent a warning, make sure to explicitly set a value for `quote_columns` in your `dbt_project.yml`. See the [doc on quote_columns](/reference/resource-configs/quote_columns) for more information.

```yaml
seeds:
  +quote_columns: false  #or `true` if you have CSV column headers with spaces
```
