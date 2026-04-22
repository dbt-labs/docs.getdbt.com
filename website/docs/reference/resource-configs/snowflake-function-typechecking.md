---
title: "Snowflake function typechecking support"
id: "snowflake-function-typechecking"
description: "Reference table of all Snowflake built-in SQL functions and their static analysis support levels in dbt Fusion."
tags: ['Snowflake', 'dbt Fusion']
---

import SnowflakeFunctionsTable from '/snippets/_functions-table-snowflake.md';

When `static_analysis: strict` is enabled, dbt Fusion validates that function arguments match the expected types directly in the CLI and VS Code extension.

The table below shows every Snowflake built-in SQL function and whether Fusion supports typechecking for it. Use the search box and filter dropdowns to narrow by function name, category, or support status.

:::info Refreshed daily
This table is updated automatically each day by scraping [docs.snowflake.com](https://docs.snowflake.com/en/sql-reference/functions-all) and cross-referencing it with the Fusion function support list. If you notice a discrepancy, [open an issue](https://github.com/dbt-labs/dbt-fusion/issues/new?labels=SQL_understanding).
:::

<FilterableTable>

<SnowflakeFunctionsTable />

</FilterableTable>
