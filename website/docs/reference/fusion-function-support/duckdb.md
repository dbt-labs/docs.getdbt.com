---
title: "Supported DuckDB functions in dbt Fusion"
sidebar_label: "DuckDB"
id: "duckdb-function-support"
description: "Check which DuckDB built-in SQL functions dbt Fusion can typecheck during static analysis."
tags: ['DuckDB', 'dbt Fusion', 'static_analysis']
---

{/* Auto-generated from duckdb.json by scripts/generate-functions-snippet.js. Do not edit directly. */}

import FunctionsTable from '/snippets/_functions-table-duckdb.md';

<Constant name="fusion"/> can validate that your DuckDB function arguments match expected types directly in <Constant name="dbt_platform"/>, the CLI, or using the dbt VS Code extension. To turn it on, run `dbt login` and set [`static_analysis: strict`](/docs/fusion/new-concepts?version=2.0) in your project configuration.

Today, <Constant name="fusion"/> can typecheck **386 of 510** DuckDB built-in functions. The table below lists every function and its support status — use the search and filters to find a specific one.

:::info Refreshed weekly
This table is updated weekly from the [DuckDB function reference](https://duckdb.org/docs/current/sql/functions/overview) and cross-referenced with <Constant name="fusion"/>'s support list. Spot a discrepancy? We'd love a fix — [open an issue](https://github.com/dbt-labs/dbt-core/issues) in the dbt Core repository.
:::

<FunctionsTable />
