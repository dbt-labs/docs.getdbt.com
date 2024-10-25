---
title: "Databricks adapter behavior changes"
id: "databricks-changes"
sidebar: "Databricks"
---

## Behavior Changes

Here are the current [behavior change flags](/docs/reference/global-configs/behavior-changes.md#behavior-change-flags) that are specific to `dbt-databricks`:

| Flag                          | `dbt-databricks`: Intro | `dbt-databricks`: Maturity |
| ----------------------------- | ----------------------- | -------------------------- |
| `use_info_schema_for_columns` | 1.9.0                   | TBD                        |
| `use_user_folder_for_python`  | 1.9.0                   | TBD                        |

### Use information schema for columns

The `use_info_schema_for_columns` flag is `False` by default.
Setting this flag to `True` will use `information_schema`, rather than `describe extended`, to get column metadata for Unity Catalog tables.
This setting is to avoid issues where `describe extended` truncates type information when the type is a complex struct;
however, this setting is not ready to be default behavior, as in order to ensure that `information_schema` is complete, we must run `REPAIR TABLE {{relation}} SYNC METADATA` prior to querying, which adds overhead.
This flag cannot be considered for maturity until we no longer need to add this overhead to every incremental materialization.

### Use user's folder for Python model notebooks

The `use_user_folder_for_python` flag is `False` by default, and results in writing uploaded python model notebooks to `/Shared/dbt_python_models/{{schema}}/`.
Setting this flag to `True` will instead write notebooks to `/Users/{{current user}}/{{catalog}}/{{schema}}/`
Writing to the `Shared` folder is being deprecated by Databricks as not following governance best practices.
We plan to promote this flag to maturity in 1.10.0.
