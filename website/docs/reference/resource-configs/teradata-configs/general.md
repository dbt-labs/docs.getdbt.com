---
title: "General configuration"
sidebar_label: "General"
description: "Set the quote_columns seed configuration to avoid warnings when using the dbt-teradata adapter."
---

* *Set `quote_columns`* - to prevent a warning, make sure to explicitly set a value for `quote_columns` in your `dbt_project.yml`. See the [doc on quote_columns](/reference/resource-configs/quote_columns) for more information.

  ```yaml
  seeds:
    +quote_columns: false  #or `true` if you have CSV column headers with spaces
  ```
