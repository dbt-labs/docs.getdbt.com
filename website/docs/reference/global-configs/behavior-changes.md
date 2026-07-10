---
title: "About behavior changes"
id: "behavior-changes"
sidebar: "About behavior changes"
description: "Behavior change flags let you control when to adopt new runtime behaviors in dbt."
---

A behavior change is a deliberate update to dbt where the same project code and commands produce a different result than before—for example, a new validation error, a changed macro signature, or a breaking change to artifacts or structured logs. It is not a bug fix, a new warning, or a non-breaking addition.

dbt gates these changes behind behavior change flags, so you control when to adopt the new behavior.

The following are examples of behavior changes:
- dbt begins raising a validation _error_ that it didn't previously.
- dbt changes the signature of a built-in macro. Your project has a custom reimplementation of that macro. This could lead to errors, because your custom reimplementation will be passed arguments it cannot accept.
- A dbt adapter renames or removes a method that was previously available on the `{{ adapter }}` object in the dbt-Jinja context.

The following are *not* behavior changes:
- Fixing a bug where the previous behavior was defective, undesirable, or undocumented.
- dbt begins raising a _warning_ that it didn't previously.
- dbt updates the language of human-friendly messages in log events.

## Behavior change flags

These flags _must_ be set in the `flags` dictionary in `dbt_project.yml`. They configure behaviors closely tied to project code, which means they should be defined in version control and modified through pull or merge requests, with the same testing and peer review.

### Flag lifecycle

Behavior change flags go through three phases of development:

1. **Introduced (disabled by default):** dbt adds logic to support both 'old' and 'new' behaviors. The 'new' behavior is gated behind a flag, disabled by default, preserving the old behavior.
2. **Mature (enabled by default):** The default value of the flag is switched to the new behavior by default. You can still preserve the old behavior, but you may see deprecation warnings.
3. **Removed (generally enabled):** The old behavior is removed from the dbt codebase(s). Most flags are supported indefinitely, but there is no committement to supporting them forever. If a flag is removed, there will be significant advanced warning.

### Introduced in dbt Core v1.x

This table outlines which month of the **Latest** release track in <Constant name="dbt" /> and which version of <Constant name="core" /> contains the behavior change's introduction (disabled by default) or maturity (enabled by default).

| Flag | <Constant name="dbt" /> **Latest**: Intro | <Constant name="dbt" /> **Latest**: Maturity | <Constant name="core" />: Intro | <Constant name="core" />: Maturity | <Constant name="core" />: Removed |
|-----------------------------------------------------------------|------------------|---------------------|-----------------|--------------------|----|
| [require_explicit_package_overrides_for_builtin_materializations](/reference/global-configs/behavior-flags/require_explicit_package_overrides_for_builtin_materializations) | 2024.04 | 2024.06 | 1.6.14, 1.7.14 | 1.8.0 | 2.0 |
| [require_resource_names_without_spaces](/reference/global-configs/behavior-flags/require_resource_names_without_spaces) | 2024.05 | 2025.05 | 1.8.0 | 1.10.0 | 2.0 |
| [source_freshness_run_project_hooks](/reference/global-configs/behavior-flags/source_freshness_run_project_hooks) | 2024.03 | 2025.05 | 1.8.0 | 1.10.0 | 2.0 |
| [skip_nodes_if_on_run_start_fails](/reference/global-configs/behavior-flags/skip_nodes_if_on_run_start_fails) | 2024.10 | - | 1.9.0 | 1.12.0 | 2.0 |
| [state_modified_compare_more_unrendered_values](/reference/global-configs/behavior-flags/state_modified_compare_more_unrendered_values) | 2024.10 | - | 1.9.0 | 1.12.0 | 2.0 |
| [require_yaml_configuration_for_mf_time_spines](/reference/global-configs/behavior-flags/require_yaml_configuration_for_mf_time_spines) | 2024.10 | - | 1.9.0 | 1.12.0 | 2.0 |
| [require_batched_execution_for_custom_microbatch_strategy](/reference/global-configs/behavior-flags/require_batched_execution_for_custom_microbatch_strategy) | 2024.11 | - | 1.9.0 | 1.12.0 | 2.0 |
| [require_nested_cumulative_type_params](/reference/global-configs/behavior-flags/require_nested_cumulative_type_params) | 2024.11 | - | 1.9.0 | 1.12.0 | - |
| [enable_truthy_nulls_equals_macro](/reference/global-configs/behavior-flags/enable_truthy_nulls_equals_macro) | 2025.02 | - | 1.9.0 | - | - |
| [validate_macro_args](/reference/global-configs/behavior-flags/validate_macro_args) | 2025.03 | - | 1.10.0 | 1.12.0 | - |
| [require_all_warnings_handled_by_warn_error](/reference/global-configs/behavior-flags/require_all_warnings_handled_by_warn_error) | 2025.06 | - | 1.10.0 | 1.12.0 | - |
| [require_generic_test_arguments_property](/reference/global-configs/behavior-flags/require_generic_test_arguments_property) | 2025.07 | 2025.08 | 1.10.5 | 1.10.8 | - |
| [require_unique_project_resource_names](/reference/global-configs/behavior-flags/require_unique_project_resource_names) | 2025.12 | - | 1.11.0 | - | - |
| [require_ref_searches_node_package_before_root](/reference/global-configs/behavior-flags/require_ref_searches_node_package_before_root) | 2025.12 | - | 1.11.0 | - | - |
| [require_valid_schema_from_generate_schema_name](/reference/global-configs/behavior-flags/require_valid_schema_from_generate_schema_name) | 2026.1 | - | 1.12.0a1 | - | - |
| [require_sql_header_in_test_configs](/reference/global-configs/behavior-flags/require_sql_header_in_test_configs) | 2026.3 | - | 1.12.0 | - | - |
| [require_corrected_analysis_fqns](/reference/global-configs/behavior-flags/require_corrected_analysis_fqns) | 2026.3 | - | 1.12.0 | - | - |
| [require_source_and_semantic_model_names_without_spaces](/reference/global-configs/behavior-flags/require_source_and_semantic_model_names_without_spaces) | 2026.4 | - | 1.12.0 | - | - |
| [allow_jinja_file_extensions](/reference/global-configs/behavior-flags/allow_jinja_file_extensions) | 2026.5 | - | 1.12.0 | - | - |
| [latest_version_pointer_enabled_by_default](/reference/global-configs/behavior-flags/latest_version_pointer_enabled_by_default) | 2026.5 | - | 1.12.0 | - | - |

### Flags reaching maturity

Several behavior change flags on the <Constant name="dbt_platform" /> `Latest` release track are planned to reach maturity on September 1, 2026, switching their default values from `false` to `true`. The September 1 date applies only to the <Constant name="dbt_platform" /> release tracks. The flags have reached maturity in <Constant name="core" /> v1.12. For intro dates, refer to the <Constant name="core" /> behavior changes table.

| Flag | Impact |
|---|---|
| [skip_nodes_if_on_run_start_fails](/reference/global-configs/behavior-flags/skip_nodes_if_on_run_start_fails) | Can stop build |
| [require_nested_cumulative_type_params](/reference/global-configs/behavior-flags/require_nested_cumulative_type_params) | Can stop build (parse error) |
| [require_all_warnings_handled_by_warn_error](/reference/global-configs/behavior-flags/require_all_warnings_handled_by_warn_error) | Can stop build (when `--warn-error` is set) |
| [require_batched_execution_for_custom_microbatch_strategy](/reference/global-configs/behavior-flags/require_batched_execution_for_custom_microbatch_strategy) | Behavior change for custom microbatch macros |
| [state_modified_compare_more_unrendered_values](/reference/global-configs/behavior-flags/state_modified_compare_more_unrendered_values) | Selection-set change with potential CI impact |
| [require_yaml_configuration_for_mf_time_spines](/reference/global-configs/behavior-flags/require_yaml_configuration_for_mf_time_spines) | Suppresses a deprecation warning (no functional change) |
| [validate_macro_args](/reference/global-configs/behavior-flags/validate_macro_args) | New warning for mismatched macro arguments; errors with `--warn-error` |

### Introduced in Fusion and Core v2

The following flags are specific to <Constant name="fusion" /> and have no equivalent in <Constant name="core" />. They are configured the same way — in the `flags:` block of `dbt_project.yml`.

| Flag | Adapter | Default | Introduced | Becomes default |
|---|---|---|---|---|
| use_catalogs_v2 | All | `false` | Fusion preview.174 (Apr 22, 2026) | Not yet set |
| bigquery_noop_alter_relation_comment | BigQuery | `false` | Fusion preview.124 (Feb 19, 2026) | Not yet set |


### Adapter-specific behavior change flags

This table outlines which version of the dbt adapter contains the behavior change's introduction (disabled by default) or maturity (enabled by default).

| Flag | dbt-ADAPTER: Intro | dbt-ADAPTER: Maturity | <Constant name="core" />: Removed |
| ----------------------------- | ----------------------- | -------------------------- |-----------------|
| [use_info_schema_for_columns](/reference/global-configs/databricks-changes#use-information-schema-for-columns) | Databricks 1.9.0 | - | 2.0 |
| [use_user_folder_for_python](/reference/global-configs/databricks-changes#use-users-folder-for-python-model-notebooks) | Databricks 1.9.0 | - | 2.0 |
| [use_managed_iceberg](/reference/global-configs/databricks-changes#use-managed-iceberg) | Databricks 1.11.0 | 1.12.0 | - |
| [use_materialization_v2](/reference/global-configs/databricks-changes#use-restructured-materializations) | Databricks 1.10.0 | - | - |
| [use_replace_on_for_insert_overwrite](/reference/global-configs/databricks-changes#use-replace-on-for-insert_overwrite-strategy) | Databricks 1.11.0 | 1.11.0 | - |
| [use_describe_as_json_for_relation_metadata](/reference/global-configs/databricks-changes#use-describe-as-json-for-relation-metadata) | Databricks 1.12.0 | - | - |
| [redshift_skip_autocommit_transaction_statements](/reference/global-configs/redshift-changes#redshift_skip_autocommit_transaction_statements-flag) | Redshift 1.12.0 | - | - |
| [bigquery_use_batch_source_freshness](/reference/global-configs/bigquery-changes#bigquery-use-batch-source-freshness) | BigQuery 1.11.0rc2 | - | - |
| [bigquery_reject_wildcard_metadata_source_freshness](/reference/global-configs/bigquery-changes#the-bigquery_reject_wildcard_metadata_source_freshness-flag) | BigQuery 1.12.0 | - | - |
| [bigquery_use_standard_sql_for_partitions](/reference/global-configs/bigquery-changes#the-bigquery_use_standard_sql_for_partitions-flag) | BigQuery 1.12.0 | 1.12.0 | - |
| [snowflake_default_transient_dynamic_tables](/reference/global-configs/snowflake-changes#the-snowflake_default_transient_dynamic_tables-flag) | Snowflake 1.12.0 | - | - |

## FAQs

<Expandable alt_header="How do I implement behavior change flags in my project?" >

The following example displays the current flags and their current default values in the latest <Constant name="dbt" /> and <Constant name="core" /> versions. To opt out of a specific behavior change, set the value of the flag to `false` in `dbt_project.yml`. You will continue to see warnings for legacy behaviors you've opted out of, until you either:

- Resolve the issue (by switching the flag to `true`)
- Silence the warnings using the `warn_error_options.silence` flag

<File name='dbt_project.yml'>

```yml
flags:
  require_explicit_package_overrides_for_builtin_materializations: true
  require_resource_names_without_spaces: true
  source_freshness_run_project_hooks: true
  skip_nodes_if_on_run_start_fails: false  # true in dbt Core v1.12
  state_modified_compare_more_unrendered_values: false  # true in dbt Core v1.12
  require_yaml_configuration_for_mf_time_spines: false  # true in dbt Core v1.12
  require_batched_execution_for_custom_microbatch_strategy: false  # true in dbt Core v1.12
  require_nested_cumulative_type_params: false  # true in dbt Core v1.12
  validate_macro_args: false  # true in dbt Core v1.12
  require_all_warnings_handled_by_warn_error: false  # true in dbt Core v1.12
  require_generic_test_arguments_property: true
  require_unique_project_resource_names: false
  require_ref_searches_node_package_before_root: false
  require_valid_schema_from_generate_schema_name: false
  enable_truthy_nulls_equals_macro: false
  require_sql_header_in_test_configs: false
  require_corrected_analysis_fqns: false
  require_source_and_semantic_model_names_without_spaces: false
  allow_jinja_file_extensions: false
  latest_version_pointer_enabled_by_default: false
```

</File>

</Expandable>

<Expandable alt_header="What does it mean if there's no maturity date? ">

When a maturity date has not yet been set (shown as -), we have not yet determined the exact date when the flag's default value will change. Affected users will see deprecation warnings in the meantime, and they will receive emails providing advance warning ahead of the maturity date. In the meantime, if you are seeing a deprecation warning, you can either:

- Migrate your project to support the new behavior, and then set the flag to true to stop seeing the warnings.
- Explicitly set the flag to `false`. You will continue to see warnings, and you will retain the legacy behavior even after the maturity date (when the default value changes).

</Expandable>

<Expandable alt_header="How do behavior change flags related to other changes?">

Since behavior change flags are different from other dbt changes, it's important to understand the difference:
- [Deprecation warnings](/reference/deprecations) &mdash; Features in your project code that will stop working (behavior flags often control when these become errors)
- [Deprecated CLI flags](/docs/dbt-versions/core-upgrade/upgrading-to-v2#deprecated-flags) &mdash; Command-line flags being removed in dbt Fusion

See the [Changes overview](/reference/changes-overview) for a quick comparison.

If you're upgrading to [dbt Fusion](/docs/dbt-versions/core-upgrade/upgrading-to-v2) or [<Constant name="core_v2" />](/docs/dbt-versions/core-upgrade/upgrading-to-v2), a subset of behavior change flags are removed and their new behavior is always enabled.

</Expandable>