---
title: "Databricks adapter behavior changes"
id: "databricks-changes"
sidebar: "Databricks"
---

The following are the current [behavior change flags](/docs/reference/global-configs/behavior-changes.md#behavior-change-flags) that are specific to `dbt-databricks`:

| Flag                          | `dbt-databricks`: Intro | `dbt-databricks`: Maturity |
| ----------------------------- | ----------------------- | -------------------------- |
| `use_info_schema_for_columns` | 1.9.0                   | TBD                        |
| `use_user_folder_for_python`  | 1.9.0                   | TBD                        |

### Use information schema for columns

The `use_info_schema_for_columns` flag is `False` by default.

Setting this flag to `True` will use `information_schema` rather than `describe extended` to get column metadata for Unity Catalog tables. This setting helps you avoid issues where `describe extended` truncates information when the type is a complex struct. However, this setting is not yet the default behavior, as there are performance impacts due to a Databricks metadata limitation because of the need to run `REPAIR TABLE {{relation}} SYNC METADATA` before querying to ensure the `information_schema` is complete. 

This flag will become the default behavior when this additional query is no longer needed. 

### Use user's folder for Python model notebooks

The `use_user_folder_for_python` flag is `False` by default and results in writing uploaded python model notebooks to `/Shared/dbt_python_models/{{schema}}/`. Setting this flag to `True` will write notebooks to `/Users/{{current user}}/{{catalog}}/{{schema}}/` Writing to the `Shared` folder is deprecated by Databricks as it does not align with governance best practices.

We plan to promote this flag to maturity in v1.10.0.
