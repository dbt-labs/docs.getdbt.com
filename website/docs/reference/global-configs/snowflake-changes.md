---
title: "Snowflake adapter behavior changes"
id: "snowflake-changes"
sidebar: "Snowflake"
---

## The enable_truthy_nulls_equals_macro flag

The `enable_truthy_nulls_equals_macro` flag is `False` by default. If this is set to `True` in your dbt_project.yml, this will enable null-safe equality on the dbt equals macro which is utilized in the incremental and snapshot materializations. 