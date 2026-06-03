---
title: "Behavior changes"
id: "behavior-changes"
sidebar: "Behavior changes"
intro_text: "Behavior change flags let you control when to adopt new runtime behaviors in dbt. They're configured in your dbt_project.yml file."
---

import AnalysesProjectLevelConfig from '/snippets/_analyses-project-level-config.md';

:::caution Behavior change flags reaching maturity

Several behavior change flags are planned to be enabled by default on the <Constant name="dbt_platform" /> **Latest** release track. Refer to [Behavior flag maturity and impact](/reference/global-configs/behavior-flag-maturity) and the [Mature and maturing flags](#mature-and-maturing-flags) section below to see which flags are affected, how they may impact your project, and how to opt out before the change takes effect.

:::

:::info How this relates to other changes

Since behavior change flags are different from other dbt changes, it's important to understand the difference:
- [Deprecation warnings](/reference/deprecations) &mdash; Features in your project code that will stop working (behavior flags often control when these become errors)
- [Deprecated CLI flags](/docs/dbt-versions/core-upgrade/upgrading-to-fusion#deprecated-flags) &mdash; Command-line flags being removed in dbt Fusion

See the [Changes overview](/reference/changes-overview) for a quick comparison.

If you're upgrading to [dbt Fusion](/docs/dbt-versions/core-upgrade/upgrading-to-fusion) or [<Constant name="core_v2" />](/docs/dbt-versions/core-upgrade/upgrading-to-v2), all behavior change flags are removed and the new behavior is always enabled.

:::

Most flags exist to configure runtime behaviors with multiple valid choices. The right choice may vary based on the environment, user preference, or the specific invocation.

Another category of flags provides existing projects with a migration window for runtime behaviors that are changing in newer releases of dbt. These flags help us achieve a balance between these goals, which can otherwise be in tension, by:
- Providing a better, more sensible, and more consistent default behavior for new users/projects.
- Providing a migration window for existing users/projects &mdash; nothing changes overnight without warning.
- Providing maintainability of dbt software. Every fork in behavior requires additional testing & cognitive overhead that slows future development. These flags exist to facilitate migration from "current" to "better," not to stick around forever.

These flags go through three phases of development:
1. **Introduction (disabled by default):** dbt adds logic to support both 'old' and 'new' behaviors. The 'new' behavior is gated behind a flag, disabled by default, preserving the old behavior.
2. **Maturity (enabled by default):** The default value of the flag is switched, from `false` to `true`, enabling the new behavior by default. Users can preserve the 'old' behavior and opt out of the 'new' behavior by setting the flag to `false` in their projects. They may see deprecation warnings when they do so.
3. **Removal (generally enabled):** After marking the flag for deprecation, we remove it along with the 'old' behavior it supported from the dbt codebases. We aim to support most flags indefinitely, but we're not committed to supporting them forever. If we choose to remove a flag, we'll offer significant advance notice.

## What is a behavior change?

The same dbt project code and the same dbt commands return one result before the behavior change, and they return a different result after the behavior change.

Examples of behavior changes:
- dbt begins raising a validation _error_ that it didn't previously.
- dbt changes the signature of a built-in macro. Your project has a custom reimplementation of that macro. This could lead to errors, because your custom reimplementation will be passed arguments it cannot accept.
- A dbt adapter renames or removes a method that was previously available on the `{{ adapter }}` object in the dbt-Jinja context.
- dbt makes a breaking change to contracted metadata artifacts by deleting a required field, changing the name or type of an existing field, or removing the default value of an existing field ([README](https://github.com/dbt-labs/dbt-core/blob/1.latest/docs/arch/7_Artifacts.md#breaking-changes)).
- dbt removes one of the fields from [structured logs](/reference/events-logging#structured-logging).

The following are **not** behavior changes:
- Fixing a bug where the previous behavior was defective, undesirable, or undocumented.
- dbt begins raising a _warning_ that it didn't previously.
- dbt updates the language of human-friendly messages in log events.
- dbt makes a non-breaking change to contracted metadata artifacts by adding a new field with a default, or deleting a field with a default ([README](https://github.com/dbt-labs/dbt-core/blob/1.latest/docs/arch/7_Artifacts.md#non-breaking-changes)).

The vast majority of changes are not behavior changes. Because introducing these changes does not require any action on the part of users, they are included in continuous releases of <Constant name="dbt" /> and patch releases of <Constant name="core" />.

By contrast, behavior change migrations happen slowly, over the course of months, facilitated by behavior change flags. The flags are loosely coupled to the specific dbt runtime version. By setting flags, users have control over opting in (and later opting out) of these changes.

## Behavior change flags

These flags _must_ be set in the `flags` dictionary in `dbt_project.yml`. They configure behaviors closely tied to project code, which means they should be defined in version control and modified through pull or merge requests, with the same testing and peer review.

The following example displays the current flags and their current default values in the latest <Constant name="dbt" /> and <Constant name="core" /> versions. To opt out of a specific behavior change, set the values of the flag to `false` in `dbt_project.yml`. You will continue to see warnings for legacy behaviors you've opted out of, until you either:

- Resolve the issue (by switching the flag to `true`)
- Silence the warnings using the `warn_error_options.silence` flag

Here's an example of the available behavior change flags with their default values:

<File name='dbt_project.yml'>

```yml
flags:
  require_explicit_package_overrides_for_builtin_materializations: true
  require_resource_names_without_spaces: true
  source_freshness_run_project_hooks: true
  skip_nodes_if_on_run_start_fails: false
  state_modified_compare_more_unrendered_values: false
  require_yaml_configuration_for_mf_time_spines: false
  require_batched_execution_for_custom_microbatch_strategy: false
  require_nested_cumulative_type_params: false
  validate_macro_args: false
  require_all_warnings_handled_by_warn_error: false
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

#### dbt Core behavior changes

This table outlines which month of the **Latest** release track in <Constant name="dbt" /> and which version of <Constant name="core" /> contains the behavior change's introduction (disabled by default) or maturity (enabled by default).

| Flag                                                            | <Constant name="dbt" /> **Latest**: Intro | <Constant name="dbt" /> **Latest**: Maturity | <Constant name="core" />: Intro | <Constant name="core" />: Maturity | <Constant name="core_v2" />: Maturity | <Constant name="core_v2" />: Removed |
|-----------------------------------------------------------------|------------------|---------------------|-----------------|--------------------|---|---|
| [require_explicit_package_overrides_for_builtin_materializations](/reference/global-configs/behavior-flag-maturity#require_explicit_package_overrides_for_builtin_materializations) | 2024.04          | 2024.06             | 1.6.14, 1.7.14  | 1.8.0             | 2.0 | 2.0 |
| [require_resource_names_without_spaces](/reference/global-configs/behavior-flag-maturity#require_resource_names_without_spaces)                           | 2024.05          | 2025.05                | 1.8.0           | 1.10.0             | 2.0 | 2.0 |
| [source_freshness_run_project_hooks](/reference/global-configs/behavior-flag-maturity#source_freshness_run_project_hooks)                              | 2024.03          | 2025.05                | 1.8.0           | 1.10.0             | 2.0 | 2.0 |
| [skip_nodes_if_on_run_start_fails](/reference/global-configs/behavior-flag-maturity#skip_nodes_if_on_run_start_fails)                                | 2024.10          | TBD*                | 1.9.0           | TBD*              | 2.0 | 2.0 |
| [state_modified_compare_more_unrendered_values](/reference/global-configs/behavior-flag-maturity#state_modified_compare_more_unrendered_values)                   | 2024.10          | TBD*                | 1.9.0           | TBD*              | 2.0 | 2.0 |
| [require_yaml_configuration_for_mf_time_spines](/reference/global-configs/behavior-flag-maturity#require_yaml_configuration_for_mf_time_spines)                  | 2024.10          | TBD*                | 1.9.0           | TBD*              | 2.0 | 2.0 |
| [require_batched_execution_for_custom_microbatch_strategy](/reference/global-configs/behavior-flag-maturity#require_batched_execution_for_custom_microbatch_strategy)                  | 2024.11         | TBD*                | 1.9.0           | TBD*              | 2.0 | 2.0 |
| [require_nested_cumulative_type_params](/reference/global-configs/behavior-flag-maturity#require_nested_cumulative_type_params)         |   2024.11         | TBD*                 | 1.9.0           | TBD*            | - | - |
| [enable_truthy_nulls_equals_macro](#null-safe-equality) | 2025.02 | TBD* | 1.9.0 | TBD* | - | - |
| [validate_macro_args](/reference/global-configs/behavior-flag-maturity#validate_macro_args)         | 2025.03           | TBD*                 | 1.10.0          | TBD*            | - | - |
| [require_all_warnings_handled_by_warn_error](/reference/global-configs/behavior-flag-maturity#require_all_warnings_handled_by_warn_error)         |   2025.06         | TBD*                 | 1.10.0          | TBD*            | - | - |
| [require_generic_test_arguments_property](/reference/global-configs/behavior-flag-maturity#require_generic_test_arguments_property) | 2025.07 | 2025.08 | 1.10.5 | 1.10.8 | - | - |
| [require_unique_project_resource_names](#unique-project-resource-names) | 2025.12 | TBD* | 1.11.0 | TBD* | - | - |
| [require_ref_searches_node_package_before_root](#package-ref-search-order) | 2025.12 | TBD* | 1.11.0 | TBD* | - | - |
| [require_valid_schema_from_generate_schema_name](#valid-schema-from-generate_schema_name) | 2026.1 | TBD* | 1.12.0a1 | TBD* | - | - |
| [require_sql_header_in_test_configs](#sql_header-in-data-tests) | 2026.3 | TBD* | 1.12.0 | TBD* | - | - |
| [require_corrected_analysis_fqns](#project-level-configuration-for-analyses) | 2026.3 | TBD* | 1.12.0 | TBD* | - | - |
| [require_source_and_semantic_model_names_without_spaces](#no-spaces-in-source-and-semantic-model-names) | 2026.4 | TBD* | 1.12.0 | TBD* | - | - |
| [allow_jinja_file_extensions](#jinja-file-extensions) | 2026.5 | TBD* | 1.12.0 | TBD* | - | - |
| [latest_version_pointer_enabled_by_default](#latest-version-pointer-for-versioned-models) | 2026.5 | TBD* | 1.12.0 | TBD* | - | - |


#### dbt adapter behavior changes

This table outlines which version of the dbt adapter contains the behavior change's introduction (disabled by default) or maturity (enabled by default).

| Flag                          | dbt-ADAPTER: Intro | dbt-ADAPTER: Maturity | <Constant name="core_v2" />: Removed |
| ----------------------------- | ----------------------- | -------------------------- |-----------------|
| [use_info_schema_for_columns](/reference/global-configs/databricks-changes#use-information-schema-for-columns) | Databricks 1.9.0                   | TBD | 2.0 |
| [use_user_folder_for_python](/reference/global-configs/databricks-changes#use-users-folder-for-python-model-notebooks)  | Databricks 1.9.0                   | TBD  | 2.0 |
| [use_managed_iceberg](/reference/global-configs/databricks-changes#use-managed-iceberg)  | Databricks 1.11.0  |  1.12.0                                                     | - |
| [use_materialization_v2](/reference/global-configs/databricks-changes#use-restructured-materializations)      | Databricks 1.10.0                  | TBD| - |
| [use_replace_on_for_insert_overwrite](/reference/global-configs/databricks-changes#use-replace-on-for-insert_overwrite-strategy)   | Databricks 1.11.0  | 1.11.0  | - |
| [redshift_skip_autocommit_transaction_statements](/reference/global-configs/redshift-changes#redshift_skip_autocommit_transaction_statements-flag) | Redshift 1.12.0 | TBD | - |
| [bigquery_use_batch_source_freshness](/reference/global-configs/bigquery-changes#bigquery-use-batch-source-freshness) | BigQuery 1.11.0rc2 | TBD | - |
| [bigquery_reject_wildcard_metadata_source_freshness](/reference/global-configs/bigquery-changes#the-bigquery_reject_wildcard_metadata_source_freshness-flag) | BigQuery 1.12.0 | TBD | - |
| [snowflake_default_transient_dynamic_tables](/reference/global-configs/snowflake-changes#the-snowflake_default_transient_dynamic_tables-flag) | Snowflake 1.12.0 | TBD | - |

## Mature and maturing flags

These behavior change flags have reached maturity or are planned to reach maturity on the <Constant name="dbt_platform" /> **Latest** release track. This section lists each flag by name and links to [Behavior flag maturity and impact](/reference/global-configs/behavior-flag-maturity) for full detail, including what changed, impact on your project, and how to opt out. For introduction dates, see the [dbt Core behavior changes](#dbt-core-behavior-changes) table above.

### Already mature

| Flag | Maturity date | <Constant name="core" /> |
|---|---|---|
| [`require_explicit_package_overrides_for_builtin_materializations`](/reference/global-configs/behavior-flag-maturity#require_explicit_package_overrides_for_builtin_materializations) | 2024.06 | v1.8.0 |
| [`require_resource_names_without_spaces`](/reference/global-configs/behavior-flag-maturity#require_resource_names_without_spaces) | 2025.05 | v1.10.0 |
| [`source_freshness_run_project_hooks`](/reference/global-configs/behavior-flag-maturity#source_freshness_run_project_hooks) | 2025.05 | v1.10.0 |
| [`require_generic_test_arguments_property`](/reference/global-configs/behavior-flag-maturity#require_generic_test_arguments_property) | 2025.08 | v1.10.8 |

### Reaching maturity

| Flag | Maturity date |
|---|---|
| [`skip_nodes_if_on_run_start_fails`](/reference/global-configs/behavior-flag-maturity#skip_nodes_if_on_run_start_fails) | TBD* |
| [`require_nested_cumulative_type_params`](/reference/global-configs/behavior-flag-maturity#require_nested_cumulative_type_params) | TBD* |
| [`require_all_warnings_handled_by_warn_error`](/reference/global-configs/behavior-flag-maturity#require_all_warnings_handled_by_warn_error) | TBD* |
| [`require_batched_execution_for_custom_microbatch_strategy`](/reference/global-configs/behavior-flag-maturity#require_batched_execution_for_custom_microbatch_strategy) | TBD* |
| [`state_modified_compare_more_unrendered_values`](/reference/global-configs/behavior-flag-maturity#state_modified_compare_more_unrendered_values) | TBD* |
| [`require_yaml_configuration_for_mf_time_spines`](/reference/global-configs/behavior-flag-maturity#require_yaml_configuration_for_mf_time_spines) | TBD* |
| [`validate_macro_args`](/reference/global-configs/behavior-flag-maturity#validate_macro_args) | TBD* |

When the <Constant name="dbt" /> Maturity is "TBD," it means we have not yet determined the exact date when these flags' default values will change. Affected users will see deprecation warnings in the meantime, and they will receive emails providing advance warning ahead of the maturity date. In the meantime, if you are seeing a deprecation warning, you can either:

- Migrate your project to support the new behavior, and then set the flag to `true` to stop seeing the warnings.
- Set the flag to `false`. You will continue to see warnings, and you will retain the legacy behavior even after the maturity date (when the default value changes).

## Flags in introduction

The sections below document flags that have not yet reached maturity (default still `false`).

### No spaces in source and semantic model names

The `require_source_and_semantic_model_names_without_spaces` flag is set to `false` by default.

Source names and semantic model names should contain letters, numbers, and underscores &mdash; _not_ spaces. dbt raises the [`ResourceNamesWithSpacesDeprecation`](/reference/deprecations#resourcenameswithspacesdeprecation) warning if it detects a space in a source name or semantic model name. When the `require_source_and_semantic_model_names_without_spaces` flag is set to `true`, dbt raises an error.

### Null-safe equality (equals macro) {#null-safe-equality}

The `enable_truthy_nulls_equals_macro` flag is `false` by default. Setting it to `true` in your `dbt_project.yml` enables null-safe equality in the dbt [equals](/reference/dbt-jinja-functions/cross-database-macros#equals) macro, which is used in incremental and snapshot materializations.

By default, the `equals()` macro follows SQL's [three-valued logic (3VL)](https://modern-sql.com/concept/three-valued-logic), so `NULL = NULL` evaluates to `UNKNOWN` rather than `TRUE`.

When the `enable_truthy_nulls_equals_macro` flag is enabled, the `equals()` macro uses the semantics of the [`IS NOT DISTINCT FROM`](https://modern-sql.com/feature/is-distinct-from) operator with two `NULL` values treated as equal.

To enable the flag, add it under `flags` in `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
flags:
  enable_truthy_nulls_equals_macro: true
```

</File>

### Unique project resource names

The `require_unique_project_resource_names` flag enforces uniqueness of resource names within the same package. dbt resources such as models, seeds, snapshots, analyses, tests, and functions share a common namespace. When two resources in the same package have the same name, dbt must decide which one a `ref()` or `source()` refers to. Previously, this check was not always enforced, which meant duplicate names could result in dbt referencing the wrong resource.

The `require_unique_project_resource_names` flag is set to `false` by default. With this setting, if two unversioned resources in the same package share the same name, dbt continues to run and raises a [`DuplicateNameDistinctNodeTypesDeprecation`](/reference/deprecations#duplicatenamedistinctnodetypesdeprecation) warning. When set to `true`, dbt raises a `DuplicateResourceNameError` error.

For example, if your project contains a model and a seed named `sales`:

```
models/sales.sql
seeds/sales.csv
```

And a model contains:

```sql
select * from {{ ref('sales') }}
```

When the flag is set to `true`, dbt will raise:

```
DuplicateResourceNameError: Found resources with the same name 'sales' in package 'project': 'model.project.sales' and 'seed.project.sales'. Please update one of the resources to have a unique name.
```

When this error is raised, you should rename one of the resources, or refactor the project structure to avoid name conflicts.


### Package `ref` search order

The `require_ref_searches_node_package_before_root` flag controls the search order when dbt resolves `ref()` calls defined within a package. 

The flag is set to `false` by default in **Latest** and <Constant name="core" /> v1.11. When dbt resolves a `ref()` in a package model, it searches for the referenced model in the root project _first_, then in the package where the model is defined. 

For example, the following model in the package `my_package` is imported by the project `my_project`:

<File name='my_package/model_downstream.sql'>

```sql
select * from {{ ref('model_upstream') }}
```
</File>

By default, dbt searches for `model_upstream` in this order:
1. First in `my_project` (root project)
2. Then in `my_package` (where the model is defined)

When you set the `require_ref_searches_node_package_before_root` flag to `true`, dbt searches the package where the model is defined _before_ searching the root project.

Using the same example, dbt searches for `model_upstream` in this order:
1. First in `my_package` (where the model is defined)
2. Then in `my_project` (root project)

The current default behavior is considered a [bug in dbt-core](https://github.com/dbt-labs/dbt-core/issues/11351) because it can _potentially_ lead to unexpected dependency cycles. However, because this is long-standing behavior, changing the default requires setting `require_ref_searches_node_package_before_root` to `true` to avoid breaking existing projects.


### Valid schema from `generate_schema_name`

The `generate_schema_name` macro determines the schema where dbt creates models and other resources. Returning a `null` value from this macro can result in invalid schema names and lead to unpredictable behavior during dbt runs.

The `require_valid_schema_from_generate_schema_name` behavior flag is set to `false` by default. When `false`, dbt raises the [`GenerateSchemaNameNullValueDeprecation`](/reference/deprecations#generateschemanamenullvaluedeprecation) warning when a custom `generate_schema_name` macro returns a `null` value.

When `require_valid_schema_from_generate_schema_name` is set to `true`, dbt enforces stricter validation and raises a parsing error.

For example, if your project has a custom `generate_schema_name` macro that returns `null`:

<File name='macros/get_custom_schema.sql'>

```sql
{% macro generate_schema_name(custom_schema_name, node) -%}
    {%- if custom_schema_name is none -%}
        {{ return(none) }}
    {%- else -%}
        {{ custom_schema_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

</File>

With the default behavior, dbt raises a deprecation warning. When `require_valid_schema_from_generate_schema_name` is set to `true`, dbt raises an error.

To resolve this, update your macro to return a valid schema name (`target.schema` in this example):

<File name='macros/get_custom_schema.sql'>

```sql
{% macro generate_schema_name(custom_schema_name, node) -%}
    {%- if custom_schema_name is none -%}
        {{ return(target.schema) }}
    {%- else -%}
        {{ custom_schema_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

</File>

### `sql_header` in data tests

Set the `require_sql_header_in_test_configs` flag to `true` to enable support for the [`sql_header`](/reference/resource-configs/sql_header) config for generic data tests. When enabled, you can set `sql_header` in the `config` of a generic data test at the model or column level in your `properties.yml` file. You can use `sql_header` to define SQL that should run before the test executes (for example, to create temporary functions, to set session parameters, or to declare variables required by the test query). dbt runs this SQL before executing the test.

For example:

<File name="models/properties.yml">

```yaml
models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - not_null:
              name: not_null_orders_order_id
              config:
                sql_header: "-- SQL_HEADER_TEST_MARKER"
```

</File>



For more information, refer to [Data test configurations](/reference/data-test-configs).

### Project-level configuration for analyses <Lifecycle status="beta" />

:::info Beta feature
The project-level configuration for analyses is a beta feature in <Constant name="core" /> v1.12.
:::

Previously, project-level configuration for [analyses](/docs/build/analyses) in `dbt_project.yml` was silently ignored. Fully qualified names (FQNs) for analyses also contained an extra `analyses` path segment that was inconsistent with other resource types.

When `require_corrected_analysis_fqns` is set to `true`, dbt:
- Routes analysis configurations from the `analyses` block in `dbt_project.yml`, enabling project-level configurations to take effect.
- Removes the extra FQN segment so that analysis FQNs are consistent with other resource types (for example, `your_project.my_analysis` instead of `your_project.analyses.my_analysis`).

<AnalysesProjectLevelConfig />

<File name='dbt_project.yml'>

```yaml
flags:
  require_corrected_analysis_fqns: true

analyses:
  +enabled: true | false
```
</File>

For more information, refer to [Analyses](/docs/build/analyses) and [Analysis properties](/reference/analysis-properties).

### Jinja file extensions <Lifecycle status="beta" /> {#jinja-file-extensions}

:::info Beta feature
Support for Jinja file extensions is a beta feature in <Constant name="core" /> v1.12.
:::

The `allow_jinja_file_extensions` flag is set to `false` by default.

When set to `true`, dbt recognizes Jinja-style extension suffixes (for example,`.j2`, `.jinja`, and `.jinja2`) appended to `.sql` and `.md` files. This lets you use Jinja-aware syntax highlighting in IDEs that associate these suffixes with Jinja templating.

dbt strips the Jinja suffix when determining node names; resource names remain unchanged regardless of whether the Jinja suffix is present. For example, a [docs block](/docs/build/documentation#using-docs-blocks) file named `my_docs.md.j2` is parsed identically to `my_docs.md`, and a model file named `my_model.sql.j2` is parsed as the model `my_model`.

When this flag is `false` or unset, dbt ignores files with these suffixes without logging a warning. If you've already added schema properties for that file, you'll see a "Did not find matching node for patch warning on schema.yml" warning.

### Latest version pointer for versioned models <Lifecycle status="beta" />

:::info Beta feature
The `latest_version_pointer_enabled_by_default` flag is a beta feature in <Constant name="core" /> v1.12.
:::

The `latest_version_pointer_enabled_by_default` flag is set to `false` by default.

When you set it to `true`, dbt automatically creates a [latest version pointer](/docs/mesh/govern/model-versions#pointing-to-the-latest-version) view for every versioned model in the project, without requiring per-model configuration. The pointer view is named after the model's base name (for example, `dim_customers`) and always points to the relation for the model with `is_latest_version: true` (for example, `dim_customers_v2`).

Without this flag, you must opt in per model by setting [`latest_version_pointer.enabled: true`](/reference/resource-configs/latest_version_pointer) in the model config.

