---
title: "Unit test limitations"
sidebar_label: "Unit test limitations"
description: "Learn the unit testing limitations in Redshift, including unsupported CTE functions and cross-database source restrictions."
---

- Redshift doesn't support [unit tests](/docs/build/unit-tests) when the SQL in the common table expression (CTE) contains functions such as `LISTAGG`, `MEDIAN`, `PERCENTILE_CONT`, and so on. These functions must be executed against a user-created table. dbt combines given rows to be part of the CTE, which Redshift does not support.

  In order to support this pattern in the future, dbt would need to "materialize" the input fixtures as tables, rather than interpolating them as CTEs. If you are interested in this functionality, we'd encourage you to participate in this issue in GitHub: [dbt-labs/<Constant name="core" />#8499](https://github.com/dbt-labs/dbt-core/issues/8499)

- Redshift doesn't support unit tests that rely on sources in a database that differs from the models. See this issue in GitHub for more detail: https://github.com/dbt-labs/dbt-redshift/issues/995
