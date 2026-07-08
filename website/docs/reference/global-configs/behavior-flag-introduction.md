---
title: "Introduced behavior flags"
id: "behavior-flag-introduction"
sidebar: "Introduced behavior flags"
---

import AnalysesProjectLevelConfig from '/snippets/_analyses-project-level-config.md';
import BehaviorFlagsMaturityCallout from '/snippets/_behavior-flags-maturity-callout.md';
import StateModified from '/snippets/_state-modified-compare.md';

<BehaviorFlagsMaturityCallout />

The sections below document flags that have not yet reached maturity (default still `false`). For intro and maturity dates, refer to the [dbt Core behavior changes](/reference/global-configs/behavior-changes#dbt-core-behavior-changes) table.

### Failures in on-run-start hooks {#failures-in-on-run-start-hooks}

This flag is planned to reach maturity on the <Constant name="dbt_platform" /> **Latest** release track. Before it takes effect, review [how it may impact your project](/reference/global-configs/behavior-flag-maturity#skip_nodes_if_on_run_start_fails).

The flag is `false` by default.

Set the `skip_nodes_if_on_run_start_fails` flag to `true` to skip all selected resources from running if there is a failure on an `on-run-start` hook.

### Source definitions for state:modified {#source-definitions-for-statemodified}

This flag is planned to reach maturity on the <Constant name="dbt_platform" /> **Latest** release track. Before it takes effect, review [how it may impact your project](/reference/global-configs/behavior-flag-maturity#state_modified_compare_more_unrendered_values).

:::info

<StateModified features={'/snippets/_state-modified-compare.md'}/>

:::

The flag is `false` by default.

Set `state_modified_compare_more_unrendered_values` to `true` to reduce false positives during `state:modified` checks (especially when configs differ by target environment like `prod` vs. `dev`).

Setting the flag to `true` changes the `state:modified` comparison from using rendered values to unrendered values instead. It accomplishes this by persisting `unrendered_config` during model parsing and `unrendered_database` and `unrendered_schema` configs during source parsing.

### No spaces in source and semantic model names {#no-spaces-in-source-and-semantic-model-names}

The `require_source_and_semantic_model_names_without_spaces` flag is set to `false` by default.

Source names and semantic model names should contain letters, numbers, and underscores &mdash; _not_ spaces. dbt raises the [`ResourceNamesWithSpacesDeprecation`](/reference/deprecations#resourcenameswithspacesdeprecation) warning if it detects a space in a source name or semantic model name. When the `require_source_and_semantic_model_names_without_spaces` flag is set to `true`, dbt raises an error.

### MetricFlow time spine YAML {#metricflow-time-spine-yaml}

This flag is planned to reach maturity on the <Constant name="dbt_platform" /> **Latest** release track. Before it takes effect, review [how it may impact your project](/reference/global-configs/behavior-flag-maturity#require_yaml_configuration_for_mf_time_spines).

The `require_yaml_configuration_for_mf_time_spines` flag is set to `false` by default.

In previous versions (dbt Core 1.8 and earlier), the MetricFlow time spine configuration was stored in a `metricflow_time_spine.sql` file.

When the flag is set to `true`, dbt will continue to support the SQL file configuration. When the flag is set to `false`, dbt will raise a deprecation warning if it detects a MetricFlow time spine configured in a config block in a SQL file.

The MetricFlow properties YAML file should have the `time_spine:` field. Refer to [MetricFlow timespine](/docs/build/metricflow-time-spine) for more details.

### Custom microbatch strategy {#custom-microbatch-strategy}

This flag is planned to reach maturity on the <Constant name="dbt_platform" /> **Latest** release track. Before it takes effect, review [how it may impact your project](/reference/global-configs/behavior-flag-maturity#require_batched_execution_for_custom_microbatch_strategy).

The `require_batched_execution_for_custom_microbatch_strategy` flag is set to `false` by default and is only relevant if you already have a custom microbatch macro in your project. If you don't have a custom microbatch macro, you don't need to set this flag as dbt will handle microbatching automatically for any model using the [microbatch strategy](/docs/build/incremental-microbatch#how-microbatch-compares-to-other-incremental-strategies).

Set the flag to `true` if you have a custom microbatch macro set up in your project. When the flag is set to `true`, dbt will execute the custom microbatch strategy in batches.

If you have a custom microbatch macro and the flag is left as `false`, dbt will issue a deprecation warning.

Previously, users needed to set the `DBT_EXPERIMENTAL_MICROBATCH` environment variable to `true` to prevent unintended interactions with existing custom incremental strategies. But this is no longer necessary, as setting `DBT_EXPERMINENTAL_MICROBATCH` will no longer have an effect on runtime functionality.

### Cumulative metrics {#cumulative-metrics}

This flag is planned to reach maturity on the <Constant name="dbt_platform" /> **Latest** release track. Before it takes effect, review [how it may impact your project](/reference/global-configs/behavior-flag-maturity#require_nested_cumulative_type_params).

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

### Macro argument validation {#macro-argument-validation}

This flag is planned to reach maturity on the <Constant name="dbt_platform" /> **Latest** release track. Before it takes effect, review [how it may impact your project](/reference/global-configs/behavior-flag-maturity#validate_macro_args).

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

</Expandable>

### Warn-error handler for all warnings {#warn-error-handler-for-all-warnings}

This flag is planned to reach maturity on the <Constant name="dbt_platform" /> **Latest** release track. Before it takes effect, review [how it may impact your project](/reference/global-configs/behavior-flag-maturity#require_all_warnings_handled_by_warn_error).

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

### Unique project resource names {#unique-project-resource-names}

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


### Package `ref` search order {#package-ref-search-order}

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


### Valid schema from `generate_schema_name` {#valid-schema-from-generate_schema_name}

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

### `sql_header` in data tests {#sql_header-in-data-tests}

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

### Project-level configuration for analyses <Lifecycle status="beta" /> {#project-level-configuration-for-analyses}

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

### Latest version pointer for versioned models <Lifecycle status="beta" /> {#latest-version-pointer-for-versioned-models}

:::info Beta feature
The `latest_version_pointer_enabled_by_default` flag is a beta feature in <Constant name="core" /> v1.12.
:::

The `latest_version_pointer_enabled_by_default` flag is set to `false` by default in <Constant name="core_v1" />. In <Constant name="fusion" />, this flag defaults to `true`, which enables the latest version pointer for all versioned models automatically.

When you set it to `true`, dbt automatically creates a [latest version pointer](/docs/mesh/govern/model-versions#pointing-to-the-latest-version) view for every versioned model in the project, without requiring per-model configuration. The pointer view is named after the model's base name (for example, `dim_customers`) and always points to the relation for the model with `is_latest_version: true` (for example, `dim_customers_v2`).

Without this flag, you must opt in per model by setting [`latest_version_pointer.enabled: true`](/reference/resource-configs/latest_version_pointer) in the model config.
