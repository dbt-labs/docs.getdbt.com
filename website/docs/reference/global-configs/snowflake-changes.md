---
title: "Snowflake adapter behavior changes"
id: "snowflake-changes"
sidebar: "Snowflake"
---


The `enable_truthy_nulls_equals_macro` flag is `False` by default. Setting it to `True` in your `dbt_project.yml` file enables null-safe equality on the dbt equals macro, which is used in the incremental and snapshot materializations. 

For example, without the flag, when you compare NULL using `=`, it does not return true, even when comparing NULL = NULL. Making it null safe allows for proper comparisons with NULL.
If both values are `NULL`, it evaluates to `TRUE` instead of `UNKNOWN`.

