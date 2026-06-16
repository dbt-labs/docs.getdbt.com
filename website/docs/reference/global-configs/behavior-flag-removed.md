---
title: "Removed behavior flags"
id: "behavior-flag-removed"
sidebar: "Removed behavior flags"
---

When <Constant name="core_v2" /> removes a behavior flag, you can no longer configure the flag. The new behavior is always enabled and the old behavior is not supported. Any flag still set in `dbt_project.yml` will be ignored.

If you're upgrading to [<Constant name="core_v2" />](/docs/dbt-versions/core-upgrade/upgrading-to-v2), remove these flags from your `dbt_project.yml`.

## Flags removed in dbt Core v2

The following <Constant name="core_v2" /> behavior flags are removed in <Constant name="core_v2" />. For intro and maturity dates, refer to the [dbt Core behavior changes](/reference/global-configs/behavior-changes#dbt-core-behavior-changes) table.

| Flag | New behavior (always enabled) |
|---|---|
| `require_explicit_package_overrides_for_builtin_materializations` | Packages cannot override built-in materializations without explicit opt-in. |
| `require_resource_names_without_spaces` | Spaces in resource names raise an error. |
| `source_freshness_run_project_hooks` | Project hooks run during `dbt source freshness`. |
| `skip_nodes_if_on_run_start_fails` | All selected nodes are skipped if an `on-run-start` hook fails. |
| `state_modified_compare_more_unrendered_values` | `state:modified` comparisons use unrendered Jinja values. |
| `require_yaml_configuration_for_mf_time_spines` | MetricFlow time spine deprecation warning is suppressed. |
| `require_batched_execution_for_custom_microbatch_strategy` | Custom microbatch macros are called once per batch window. |

## dbt adapter flags removed in dbt Core v2

The following adapter behavior flags are also removed in <Constant name="core_v2" />:

| Flag | Adapter | New behavior (always enabled) |
|---|---|---|
| [`use_info_schema_for_columns`](/reference/global-configs/databricks-changes#use-information-schema-for-columns) | Databricks | Uses information schema for column metadata. |
| [`use_user_folder_for_python`](/reference/global-configs/databricks-changes#use-users-folder-for-python-model-notebooks) | Databricks | Uses user folder for Python model notebooks. |
