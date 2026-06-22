---
title: "Supported Databricks functions in dbt Fusion"
sidebar_label: "Databricks"
id: "databricks-function-support"
description: "Check which Databricks built-in SQL functions dbt Fusion can typecheck during static analysis."
tags: ['Databricks', 'dbt Fusion', 'static_analysis']
---

{/* Auto-generated from databricks.json by scripts/generate-functions-snippet.js. Do not edit directly. */}

import FunctionsTable from '/snippets/_functions-table-databricks.md';

<Constant name="fusion"/> can validate that your Databricks function arguments match expected types directly in <Constant name="dbt_platform"/>, the CLI, or using the dbt VS Code extension. To turn it on, run `dbt login` and set [`static_analysis: strict`](/docs/fusion/new-concepts?version=2.0) in your project configuration.

Today, <Constant name="fusion"/> can typecheck **630 of 757** Databricks built-in functions. The table below lists every function and its support status — use the search and filters to find a specific one.

:::info Refreshed weekly
This table is updated weekly from the [Databricks SQL function reference](https://docs.databricks.com/en/sql/language-manual/sql-ref-functions-builtin-alpha.html) and cross-referenced with <Constant name="fusion"/>'s support list. Spot a discrepancy? We'd love a fix — [open an issue](https://github.com/dbt-labs/dbt-core/issues) in the dbt Core repository.
:::

<FunctionsTable />
