---
title: "Supported Snowflake functions in dbt Fusion"
sidebar_label: "Snowflake functions in Fusion"
id: "snowflake-function-support"
description: "Check which Snowflake built-in SQL functions dbt Fusion can typecheck during static analysis."
tags: ['Snowflake', 'dbt Fusion', 'static_analysis']
---

import SnowflakeFunctionsTable from '/snippets/_functions-table-snowflake.md';


<Constant name="fusion"/> can validate that your Snowflake function arguments match expected types directly in <Constant name="dbt_platform"/>, the CLI, or using dbt VS Code extension. To enable this, set [`static_analysis: strict`](/docs/fusion/new-concepts?version=2.0) in your project configuration.

The following table lists _every_ Snowflake built-in function and its typechecking support status. Use the table's search and filters to find specific functions.

:::info Refreshed daily
This table is updated daily from the [Snowflake SQL function reference](https://docs.snowflake.com/en/sql-reference/functions-all)  and cross-referenced with <Constant name="fusion"/>'s support list. If you spot a discrepancy, we'd love for you to contribute and [open an issue](https://github.com/dbt-labs/dbt-fusion/issues/new?labels=SQL_understanding) in the <Constant name="fusion"/> repository!
:::

<SnowflakeFunctionsTable />
