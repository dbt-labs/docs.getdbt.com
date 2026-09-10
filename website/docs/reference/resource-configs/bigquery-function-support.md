---
title: "Supported BigQuery functions in dbt v2"
sidebar_label: "BigQuery functions in dbt v2"
id: "bigquery-function-support"
description: "Check which BigQuery built-in SQL functions dbt v2 can typecheck during static analysis."
tags: ['BigQuery', 'dbt v2', 'static_analysis']
---

import BigQueryFunctionsTable from '/snippets/_functions-table-bigquery.md';


<Constant name="fusion"/> can validate that your BigQuery function arguments match expected types directly in <Constant name="dbt_platform"/>, the CLI, or using the dbt VS Code extension. To enable this, run `dbt login` and set [`static_analysis: strict`](/docs/build/about-static-analysis?version=2.0) in your project configuration.

The following table lists _every_ BigQuery built-in function and its typechecking support status. Use the table's search and filters to find specific functions.

:::info Refreshed weekly
This table is updated weekly from the [BigQuery SQL function reference](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/functions-all) and cross-referenced with <Constant name="fusion"/>'s support list. If you spot a discrepancy, we'd love for you to contribute and [open an issue](https://github.com/dbt-labs/dbt/issues) in the <Constant name="core" /> repository!
:::

<BigQueryFunctionsTable />
