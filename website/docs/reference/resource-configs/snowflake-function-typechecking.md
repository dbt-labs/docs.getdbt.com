---
title: "Snowflake function typechecking support"
id: "snowflake-function-typechecking"
description: "Reference table of all Snowflake built-in SQL functions and their static analysis support levels in dbt Fusion."
tags: ['Snowflake', 'dbt Fusion']
---

import SnowflakeFunctionsTable from '/snippets/_functions-table-snowflake.md';

dbt Fusion performs static analysis on your SQL at two levels:

- **L2 — typechecking (`static_analysis: strict`)** &mdash; validates that function arguments match the expected types. Available in the CLI and VS Code extension.
- **L3 — local execution (Enterprise)** &mdash; runs the function locally to return the exact results Snowflake would produce, without a warehouse connection.

The table below shows every Snowflake built-in SQL function and its Fusion support level. Use the search box and filter dropdowns to narrow by function name, category, or support status.

:::info Refreshed daily
This table is updated automatically each day by scraping [docs.snowflake.com](https://docs.snowflake.com/en/sql-reference/functions-all) and cross-referencing it with the Fusion function support list. If you notice a discrepancy, [open an issue](https://github.com/dbt-labs/dbt-fusion/issues/new?labels=SQL_understanding).
:::

<FilterableTable>

<SnowflakeFunctionsTable />

</FilterableTable>
