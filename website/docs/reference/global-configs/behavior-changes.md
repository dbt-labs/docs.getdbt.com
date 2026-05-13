---
title: "Behavior changes"
id: "behavior-changes"
sidebar: "Behavior changes"
intro_text: "Behavior change flags let you control when to adopt new runtime behaviors in dbt. They're configured in your dbt_project.yml file."
---

import StateModified from '/snippets/_state-modified-compare.md';
import AnalysesProjectLevelConfig from '/snippets/_analyses-project-level-config.md';

:::info How this relates to other changes

Since behavior change flags are different from other dbt changes, it's important to understand the difference:
- [Deprecation warnings](/reference/deprecations) &mdash; Features in your project code that will stop working (behavior flags often control when these become errors)
- [Deprecated CLI flags](/docs/dbt-versions/core-upgrade/upgrading-to-fusion#deprecated-flags) &mdash; Command-line flags being removed in dbt Fusion

See the [Changes overview](/reference/changes-overview) for a quick comparison.

If you're upgrading to [dbt Fusion](/docs/dbt-versions/core-upgrade/upgrading-to-fusion), all behavior change flags are removed and the new behavior is always enabled.

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
- dbt makes a breaking change to contracted metadata artifacts by deleting a required field, changing the name or type of an existing field, or removing the default value of an existing field ([README](https://github.com/dbt-labs/dbt-core/blob/main/docs/arch/7_Artifacts.md#breaking-changes)).
- dbt removes one of the fields from [structured logs](/reference/events-logging#structured-logging).

The following are **not** behavior changes:
- Fixing a bug where the previous behavior was defective, undesirable, or undocumented.
- dbt begins raising a _warning_ that it didn't previously.
- dbt updates the language of human-friendly messages in log events.
- dbt makes a non-breaking change to contracted metadata artifacts by adding a new field with a default, or deleting a field with a default ([README](https://github.com/dbt-labs/dbt-core/blob/main/docs/arch/7_Artifacts.md#non-breaking-changes)).

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
```

</File>

#### dbt Core behavior changes

This table outlines which month of the **Latest** release track in <Constant name="dbt" /> and which version of <Constant name="core" /> contains the behavior change's introduction (disabled by default) or maturity (enabled by default).

| Flag                                                            | <Constant name="dbt" /> **Latest**: Intro | <Constant name="dbt" /> **Latest**: Maturity | <Constant name="core" />: Intro | <Constant name="core" />: Maturity | Removed in Fusion |
|-----------------------------------------------------------------|------------------|---------------------|-----------------|--------------------|---------------|
| [require_explicit_package_overrides_for_builtin_materializations](#package-override-for-built-in-materialization) | 2024.04          | 2024.06             | 1.6.14, 1.7.14  | 1.8.0             | ✅|
| [require_resource_names_without_spaces](#no-spaces-in-resource-names)                           | 2024.05          | 2025.05                | 1.8.0           | 1.10.0             | ✅ |
| [source_freshness_run_project_hooks](#project-hooks-with-source-freshness)                              | 2024.03          | 2025.05                | 1.8.0           | 1.10.0             | ✅ |
| [skip_nodes_if_on_run_start_fails](#failures-in-on-run-start-hooks)                                | 2024.10          | TBD*                | 1.9.0           | TBD*              | ✅ |
| [state_modified_compare_more_unrendered_values](#source-definitions-for-state)                   | 2024.10          | TBD*                | 1.9.0           | TBD*              | ✅ |
| [require_yaml_configuration_for_mf_time_spines](#metricflow-time-spine-yaml)                  | 2024.10          | TBD*                | 1.9.0           | TBD*              | ✅ |
| [require_batched_execution_for_custom_microbatch_strategy](#custom-microbatch-strategy)                  | 2024.11         | TBD*                | 1.9.0           | TBD*              | ✅ |
| [require_nested_cumulative_type_params](#cumulative-metrics)         |   2024.11         | TBD*                 | 1.9.0           | TBD*            | - |
| [enable_truthy_nulls_equals_macro](#null-safe-equality) | 2025.02 | TBD* | 1.9.0 | TBD* | - |
| [validate_macro_args](#macro-argument-validation)         | 2025.03           | TBD*                 | 1.10.0          | TBD*            | - |
| [require_all_warnings_handled_by_warn_error](#warn-error-handler-for-all-warnings)         |   2025.06         | TBD*                 | 1.10.0          | TBD*            | - |
| [require_generic_test_arguments_property](#generic-test-arguments-property) | 2025.07 | 2025.08 | 1.10.5 | 1.10.8 | - |
| [require_unique_project_resource_names](#unique-project-resource-names) | 2025.12 | TBD* | 1.11.0 | TBD* | - |
| [require_ref_searches_node_package_before_root](#package-ref-search-order) | 2025.12 | TBD* | 1.11.0 | TBD* | - |
| [require_valid_schema_from_generate_schema_name](#valid-schema-from-generate_schema_name) | 2026.1 | TBD* | 1.12.0a1 | TBD* | - |
| [require_sql_header_in_test_configs](#sql_header-in-data-tests) | 2026.3 | TBD* | 1.12.0 | TBD* | - |
| [require_corrected_analysis_fqns](#project-level-configuration-for-analyses) | 2026.3 | TBD* | 1.12.0 | TBD* | - |
| [require_source_and_semantic_model_names_without_spaces](#no-spaces-in-source-and-semantic-model-names) | 2026.4 | TBD* | 1.12.0 | TBD* | - |
| [allow_jinja_file_extensions](#jinja-file-extensions) | 2026.5 | TBD* | 1.12.0 | TBD* | - |


#### dbt adapter behavior changes

This table outlines which version of the dbt adapter contains the behavior change's introduction (disabled by default) or maturity (enabled by default).

| Flag                          | dbt-ADAPTER: Intro | dbt-ADAPTER: Maturity | Removed in Fusion |
| ----------------------------- | ----------------------- | -------------------------- |-----------------|
| [use_info_schema_for_columns](/reference/global-configs/databricks-changes#use-information-schema-for-columns) | Databricks 1.9.0                   | TBD | ✅ |
| [use_user_folder_for_python](/reference/global-configs/databricks-changes#use-users-folder-for-python-model-notebooks)  | Databricks 1.9.0                   | TBD  | ✅ |
| [use_managed_iceberg](/reference/global-configs/databricks-changes#use-managed-iceberg)  | Databricks 1.11.0  |  1.12.0                                                     | - |
| [use_materialization_v2](/reference/global-configs/databricks-changes#use-restructured-materializations)      | Databricks 1.10.0                  | TBD| - |
| [use_replace_on_for_insert_overwrite](/reference/global-configs/databricks-changes#use-replace-on-for-insert_overwrite-strategy)   | Databricks 1.11.0  | 1.11.0  | - |
| [redshift_skip_autocommit_transaction_statements](/reference/global-configs/redshift-changes#redshift_skip_autocommit_transaction_statements-flag) | Redshift 1.12.0 | TBD | - |
| [bigquery_use_batch_source_freshness](/reference/global-configs/bigquery-changes#bigquery-use-batch-source-freshness) | BigQuery 1.11.0rc2 | TBD | - |
| [bigquery_reject_wildcard_metadata_source_freshness](/reference/global-configs/bigquery-changes#the-bigquery_reject_wildcard_metadata_source_freshness-flag) | BigQuery 1.12.0 | TBD | - |
| [snowflake_default_transient_dynamic_tables](/reference/global-configs/snowflake-changes#the-snowflake_default_transient_dynamic_tables-flag) | Snowflake 1.12.0 | TBD | - |

When the <Constant name="dbt" /> Maturity is "TBD," it means we have not yet determined the exact date when these flags' default values will change. Affected users will see deprecation warnings in the meantime, and they will receive emails providing advance warning ahead of the maturity date. In the meantime, if you are seeing a deprecation warning, you can either:

- Migrate your project to support the new behavior, and then set the flag to `true` to stop seeing the warnings.
- Set the flag to `false`. You will continue to see warnings, and you will retain the legacy behavior even after the maturity date (when the default value changes).

### Failures in on-run-start hooks

The flag is `false` by default.

Set the `skip_nodes_if_on_run_start_fails` flag to `true` to skip all selected resources from running if there is a failure on an `on-run-start` hook. 

### Source definitions for state:modified

:::info

<StateModified features={'/snippets/_state-modified-compare.md'}/>

:::

The flag is `false` by default.

Set `state_modified_compare_more_unrendered_values` to `true` to reduce false positives during `state:modified` checks (especially when configs differ by target environment like `prod` vs. `dev`).

Setting the flag to `true` changes the `state:modified` comparison from using rendered values to unrendered values instead. It accomplishes this by persisting `unrendered_config` during model parsing and `unrendered_database` and `unrendered_schema` configs during source parsing.

###  Package override for built-in materialization 

Setting the `require_explicit_package_overrides_for_builtin_materializations` flag to `true` prevents this automatic override. 

We have deprecated the behavior where installed packages could override built-in materializations without your explicit opt-in. When this flag is set to `true`, a materialization defined in a package that matches the name of a built-in materialization will no longer be included in the search and resolution order. Unlike macros, materializations don't use the `search_order` defined in the project `dispatch` config.

The built-in materializations are `'view'`, `'table'`, `'incremental'`, `'materialized_view'` for models as well as `'test'`, `'unit'`, `'snapshot'`, `'seed'`, and `'clone'`.

You can still explicitly override built-in materializations, in favor of a materialization defined in a package, by reimplementing the built-in materialization in your root project and wrapping the package implementation.

<File name='macros/materialization_view.sql'>

```sql
{% materialization view, snowflake %}
  {{ return(my_installed_package_name.materialization_view_snowflake()) }}
{% endmaterialization %}
```

</File>

In the future, we may extend the project-level [`dispatch` configuration](/reference/project-configs/dispatch-config) to support a list of authorized packages for overriding built-in materialization.

### No spaces in resource names

The `require_resource_names_without_spaces` flag enforces using resource names without spaces. 

The names of dbt resources (for example, models) should contain letters, numbers, and underscores. We highly discourage the use of other characters, especially spaces. To that end, we have deprecated support for spaces in resource names. When the `require_resource_names_without_spaces` flag is set to `true`, dbt will raise an exception (instead of a deprecation warning) if it detects a space in a resource name.

<File name='models/model name with spaces.sql'>

```sql
-- This model file should be renamed to model_name_with_underscores.sql
```

</File>

### No spaces in source and semantic model names

The `require_source_and_semantic_model_names_without_spaces` flag is set to `false` by default.

Source names and semantic model names should contain letters, numbers, and underscores &mdash; _not_ spaces. dbt raises the [`ResourceNamesWithSpacesDeprecation`](/reference/deprecations#resourcenameswithspacesdeprecation) warning if it detects a space in a source name or semantic model name. When the `require_source_and_semantic_model_names_without_spaces` flag is set to `true`, dbt raises an error.

### Project hooks with source freshness

Set the `source_freshness_run_project_hooks` flag to include/exclude "project hooks" ([`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end)) in the `dbt source freshness` command execution. The flag is set to `true` (include) by default. 

If you have a specific project [`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end) hooks that should not run before/after `source freshness` command, you can add a conditional check to those hooks:

<File name='dbt_project.yml'>

```yaml
on-run-start:
  - '{{ ... if flags.WHICH != 'freshness' }}'
```
</File>


### MetricFlow time spine YAML
The `require_yaml_configuration_for_mf_time_spines` flag is set to `false` by default.

In previous versions (dbt Core 1.8 and earlier), the MetricFlow time spine configuration was stored in a `metricflow_time_spine.sql` file.

When the flag is set to `true`, dbt will continue to support the SQL file configuration. When the flag is set to `false`, dbt will raise a deprecation warning if it detects a MetricFlow time spine configured in a config block in a SQL file. 

The MetricFlow properties YAML file should have the `time_spine:` field. Refer to [MetricFlow timespine](/docs/build/metricflow-time-spine) for more details.

### Custom microbatch strategy
The `require_batched_execution_for_custom_microbatch_strategy` flag is set to `false` by default and is only relevant if you already have a custom microbatch macro in your project.  If you don't have a custom microbatch macro, you don't need to set this flag as dbt will handle microbatching automatically for any model using the [microbatch strategy](/docs/build/incremental-microbatch#how-microbatch-compares-to-other-incremental-strategies).

Set the flag is set to `true` if you have a custom microbatch macro set up in your project. When the flag is set to `true`, dbt will execute the custom microbatch strategy in batches. 

If you have a custom microbatch macro and the flag is left as `false`, dbt will issue a deprecation warning.

Previously, users needed to set the `DBT_EXPERIMENTAL_MICROBATCH` environment variable to `true` to prevent unintended interactions with existing custom incremental strategies. But this is no longer necessary, as setting `DBT_EXPERMINENTAL_MICROBATCH` will no longer have an effect on runtime functionality.

### Cumulative metrics

[Cumulative-type metrics](/docs/build/cumulative#parameters) are nested under the `cumulative_type_params` field in [the <Constant name="dbt" /> **Latest** release track](/docs/dbt-versions/dbt-release-tracks), dbt Core v1.9 and newer. Currently, dbt will warn users if they have cumulative metrics improperly nested. To enforce the new format (resulting in an error instead of a warning), set the `require_nested_cumulative_type_params` to `true`.

Use the following metric configured with the syntax before v1.9 as an example:

```yaml

    type: cumulative
    type_params:
      measure: order_count
      window: 7 days

```

If you run `dbt parse` with that syntax on Core v1.9 or [the <Constant name="dbt" /> **Latest** release track](/docs/dbt-versions/dbt-release-tracks), you will receive a warning like: 

```bash

15:36:22  [WARNING]: Cumulative fields `type_params.window` and
`type_params.grain_to_date` has been moved and will soon be deprecated. Please
nest those values under `type_params.cumulative_type_params.window` and
`type_params.cumulative_type_params.grain_to_date`. See documentation on
behavior changes:
https://docs.getdbt.com/reference/global-configs/behavior-changes

```

If you set `require_nested_cumulative_type_params` to `true` and re-run `dbt parse` you will now receive an error like:

```bash

21:39:18  Cumulative fields `type_params.window` and `type_params.grain_to_date` should be nested under `type_params.cumulative_type_params.window` and `type_params.cumulative_type_params.grain_to_date`. Invalid metrics: orders_last_7_days. See documentation on behavior changes: https://docs.getdbt.com/reference/global-configs/behavior-changes.

```

Once the metric is updated, it will work as expected:

```yaml

    type: cumulative
    type_params:
      measure:
        name: order_count
      cumulative_type_params:
        window: 7 days

```

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

### Macro argument validation

dbt supports optional validation for macro arguments using the `validate_macro_args` flag. By default, the `validate_macro_args` flag is set to `false`, which means that dbt won't validate the names or types of documented macro arguments.

In the past, dbt didn't enforce a standard vocabulary for the [`type`](/reference/resource-properties/arguments#type) field on macro arguments in YAML. Because of this, the `type` field was used for documentation only, and dbt didn't check that:
- the argument names matched those in your macro
- the argument types were valid or consistent with the macro's Jinja definition

Here's an example of a documented macro:
<File name='macros/filename.yml'>

```yaml

macros:
  - name: <macro name>
    arguments:
      - name: <arg name>
        type: <string>
```
</File>

When you set the `validate_macro_args` flag to `true`, dbt will:
- Validate macro arguments during project parsing.
- Check that all argument names in your YAML match those in the macro definition.
- Raise warnings if the names or types don't match.
- Validate that the [`type` values follow the supported format](/reference/resource-properties/arguments#supported-types).
- If no arguments are documented in the YAML, infer them from the macro and include them in the [`manifest.json` file](/reference/artifacts/manifest-json).

<Expandable alt_header="When does validation occur?">

Macro argument validation runs during project parsing, not during macro execution. Any dbt command that parses the project will trigger validation if you enable the `validate_macro_args` flag.

- In <Constant name="core"/>:
  - Validation runs as part of parsing for most commands (`parse`, `build`, `run`, `test`, `seed`, `snapshot`, `compile`).
  - With a full parse, dbt validates all macros.
  - With partial parsing (the default), dbt validates only macros affected by changed files.
  - Use `--no-partial-parse` to force validation of all macros.
 
<Constant name="fusion_engine" /> will support macro argument validation in a future release. <!--add when avail: When available, <Constant name="fusion" /> will validate all macros on every parse (no partial parsing support needed).-->
</Expandable>

### Warn-error handler for all warnings

By default, the `require_all_warnings_handled_by_warn_error` flag is set to `false`.

When you set `require_all_warnings_handled_by_warn_error` to `true`, all warnings raised during a run are routed through the `--warn-error` / `--warn-error-options` handler. This ensures consistent behavior when promoting warnings to errors or silencing them. When the flag is `false`, only some warnings are processed by the handler while others may bypass it.

Note that enabling this for projects that use `--warn-error` (or `--warn-error-options='{"error":"all"}'`) may cause builds to fail on warnings that were previously ignored. We recommend enabling it gradually.

<Expandable alt_header="Recommended steps to enable the flag">

We recommend the following rollout plan when setting the `require_all_warnings_handled_by_warn_error` flag to `true`:

1. Run a full build without partial parsing to surface parse-time warnings, and confirm it finishes successfully:

   ```bash
   dbt build --no-partial-parse
   ```

   - Some warnings are only emitted at parse time.
   - If the build fails because warnings are already treated as errors (via `--warn-error` or `--warn-error-options`), fix those first and re-run.
2. Review the logs:
   - If you have any warnings at this point, it means they weren't handled by `--warn-error`/`--warn-error-options`. Continue to the next step.
   - If there are no warnings, enable the flag in all environments and that's it!
3. Enable `require_all_warnings_handled_by_warn_error` in your development environment and fix any warnings that now surface as errors.
4. Enable the flag in your CI environment (if you have one) and ensure builds pass.
5. Enable the flag in your production environment.

</Expandable>

### Generic test arguments property

dbt supports parsing key-value arguments that are inputs to generic tests when specified under the `arguments` property. In the past, dbt didn't support a way to clearly disambiguate between properties that were inputs to generic tests and framework configurations, and only accepted arguments as top-level properties.

In **Latest**, the `require_generic_test_arguments_property` flag is set to `true` by default. In dbt Core versions prior to 1.10.8, the default value is `false`. Using the `arguments` property in test definitions is optional in either case.

If you do use `arguments` while the flag is `false`, dbt will recognize it but raise the `ArgumentsPropertyInGenericTestDeprecation` warning. This warning lets you know that the flag will eventually default to `true` across all releases and will be parsed as keyword arguments to the data test.

Here's an example using the new `arguments` property:

<File name='model.yml'>

```yaml
models:
  - name: my_model_with_generic_test
    data_tests:
      - dbt_utils.expression_is_true:
          arguments: 
            expression: "order_items_subtotal = subtotal"
```

</File>

Here's an example using the alternative `test_name` format:

<File name='model.yml'>

```yaml
models:
  - name: my_model_with_generic_test
    data_tests:
    - name: arbitrary_name
      test_name: dbt_utils.expression_is_true
      arguments:
         expression: "order_items_subtotal = subtotal"
      config:
        where: "1=1"
```

</File>

When you set the `require_generic_test_arguments_property` flag to `true`, dbt will:
- Parse any key-value pairs under `arguments` in generic tests as inputs to the generic test macro.
- Raise a `MissingArgumentsPropertyInGenericTestDeprecation` warning if additional non-config arguments are specified outside of the `arguments` property.

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


To enable the flag, add it under `flags` in `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
flags:
  allow_jinja_file_extensions: true
```

</File>

