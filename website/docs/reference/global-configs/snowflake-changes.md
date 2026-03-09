---
title: "Snowflake adapter behavior changes"
id: "snowflake-changes"
sidebar: "Snowflake"
---

## The `enable_truthy_nulls_equals_macro` flag

The `enable_truthy_nulls_equals_macro` flag is `False` by default. Setting it to `True` in your `dbt_project.yml` file enables null-safe equality on the dbt equals macro, which is used in the incremental and snapshot materializations. 

For example, when you compare NULL using `=` without the flag, it doesn't return `TRUE`, even when comparing `NULL = NULL`. Making it null safe allows for proper comparisons with `NULL`.
If both values are `NULL`, it evaluates to `TRUE` instead of `UNKNOWN`.

## The `snowflake_default_transient_dynamic_tables` flag

The `snowflake_default_transient_dynamic_tables` flag controls whether Snowflake dynamic tables are created as transient when the model config does not explicitly set the [`transient`](/reference/resource-configs/snowflake-configs#transient-dynamic-tables) config.

- When set to `False` (default): Dynamic tables are created as permanent tables with a [Fail-safe period](https://docs.snowflake.com/en/user-guide/data-failsafe) unless you set `transient: true` for a specific model.
- When set to `True`: Dynamic tables are created as transient (no Fail-safe period) when `transient` is not specified in the model config. Transient dynamic tables can reduce storage costs.

Set the `snowflake_default_transient_dynamic_tables` flag in your `dbt_project.yml` under the `flags` key. You can override the default setting using the [`transient`](/reference/resource-configs/snowflake-configs#transient-dynamic-tables) config on dynamic table models.

