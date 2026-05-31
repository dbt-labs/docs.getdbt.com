---
title: "Behavior flag maturity and impact"
id: "behavior-flag-maturity"
sidebar: "Behavior flag maturity"
---

When a behavior change flag reaches maturity, its default value switches from `false` to `true`. This page documents flags on the <Constant name="dbt_platform" /> **Latest** release track that have reached maturity or are planned to reach maturity. For each flag, it describes what the change means for your project and how to preserve the previous behavior.

For flags still in the introduction phase, refer to [Behavior changes](/reference/global-configs/behavior-changes).

To preserve the previous behavior for any flag on this page, set it explicitly to `false` in your `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
flags:
  require_explicit_package_overrides_for_builtin_materializations: false
  require_resource_names_without_spaces: false
  source_freshness_run_project_hooks: false
  require_generic_test_arguments_property: false
  skip_nodes_if_on_run_start_fails: false
  require_nested_cumulative_type_params: false
  require_all_warnings_handled_by_warn_error: false
  require_batched_execution_for_custom_microbatch_strategy: false
  state_modified_compare_more_unrendered_values: false
  require_yaml_configuration_for_mf_time_spines: false
  validate_macro_args: false
```

</File>

## Reaching maturity

Several behavior change flags are planned to reach maturity on the <Constant name="dbt_platform" /> **Latest** release track, which will switch their default values from `false` to `true`.

| Flag | Impact |
|---|---|
| [`skip_nodes_if_on_run_start_fails`](#skip_nodes_if_on_run_start_fails) | Can stop build |
| [`require_nested_cumulative_type_params`](#require_nested_cumulative_type_params) | Can stop build (parse error) |
| [`require_all_warnings_handled_by_warn_error`](#require_all_warnings_handled_by_warn_error) | Can stop build (when `--warn-error` is set) |
| [`require_batched_execution_for_custom_microbatch_strategy`](#require_batched_execution_for_custom_microbatch_strategy) | Behavior change for custom microbatch macros |
| [`state_modified_compare_more_unrendered_values`](#state_modified_compare_more_unrendered_values) | Selection-set change with potential CI impact |
| [`require_yaml_configuration_for_mf_time_spines`](#require_yaml_configuration_for_mf_time_spines) | Suppresses a deprecation warning (no functional change) |
| [`validate_macro_args`](#validate_macro_args) | New warning for mismatched macro arguments |

## `skip_nodes_if_on_run_start_fails`

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Previous behavior (`false`)</h4>

If an `on-run-start` hook fails, dbt logs the error and continues executing all selected nodes. The run finishes with one `ERROR` (the hook) but models still build.

</div>

<div>

<h4 style={{marginTop: 0}}>New behavior (`true`)</h4>

If any `on-run-start` hook fails, every selected node is skipped. The run finishes with the hook `ERROR` and every model marked `SKIP`.

</div>

</div>

#### Impact

If your project uses `on-run-start` hooks for non-critical work (for example, telemetry, notifications, audit inserts, attaching session settings), your build will stop producing output whenever a hook fails. Tables and views that previously refreshed daily will stop updating the next time the hook fails.

For more information, refer to [`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end).


## `require_nested_cumulative_type_params`

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Previous behavior (`false`)</h4>

A cumulative metric using the legacy `type_params.window` / `type_params.grain_to_date` syntax is parsed successfully and emits a `MFCumulativeTypeParamsDeprecation` warning.

</div>

<div>

<h4 style={{marginTop: 0}}>New behavior (`true`)</h4>

The legacy structure raises a validation error from the semantic manifest validator. `dbt parse` fails &mdash; no nodes run, no models build, no tests execute.

</div>

</div>

#### Impact

Any project with a cumulative metric still using the un-nested syntax stops parsing entirely on the first command. Because parsing fails, the error affects every dbt command: `run`, `build`, `test`, `compile`, `docs generate`, the <Constant name="semantic_layer" />, and more.


## `require_all_warnings_handled_by_warn_error`

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Previous behavior (`false`)</h4>

`--warn-error` only escalates warnings that explicitly call the internal `warn_or_error()` handler. Warnings fired through the standard event system are logged to output only and bypass `--warn-error` entirely.

</div>

<div>

<h4 style={{marginTop: 0}}>New behavior (`true`)</h4>

Every `warn`-level event is routed through the `--warn-error` / `--warn-error-options` handler. Warnings that were previously log only can now stop the build.

</div>

</div>

#### Impact

This only affects projects that use `warn_error: true` or `--warn-error` &mdash; common in CI or in <Constant name="dbt_platform" /> production jobs configured for strict mode. Projects without `--warn-error` are not affected.

Example warnings that switch from "log only" to "error" for `warn_error: true` users after the flag matures:

- `JinjaLogWarning` — emitted for column types declared for non-existent seed columns
- `WarnStateTargetEqual` — emitted when the `--state` and `--target` directories are the same path
- `SelectExcludeIgnoredWithSelectorWarning` — emitted when the legacy `--selector` flag is combined with `--select` or `--exclude`
- `RunResultWarningMessage` — emitted when a test or model returns `WARN` status
- Various adapter-level warnings not previously handled by `--warn-error`

Note that enabling this for projects that use `--warn-error` may cause builds to fail on warnings that were previously ignored. We recommend enabling it gradually.

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


## `require_batched_execution_for_custom_microbatch_strategy`

This flag is only relevant if your project has a custom `get_incremental_microbatch_sql` macro. If you don't have a custom microbatch macro, you don't need to set this flag.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Previous behavior (`false`)</h4>

The custom `get_incremental_microbatch_sql` macro is called once with the full date range per run. dbt emits a `MicrobatchMacroOutsideOfBatchesDeprecation` warning.

</div>

<div>

<h4 style={{marginTop: 0}}>New behavior (`true`)</h4>

dbt orchestrates batches and calls the macro once per `event_time_start` / `event_time_end` window. The deprecation warning is suppressed.

</div>

</div>

#### Impact

If you have overridden `get_incremental_microbatch_sql` &mdash; typically to work around an adapter limitation or implement a custom partition strategy &mdash; your macro is invoked under a batched contract for which it was never written. Possible outcomes:

- The macro ignores the smaller `event_time_start` / `event_time_end` window and re-processes the full range every batch, leading to wasted compute, duplicate rows, or `MERGE`/`INSERT` conflicts.
- The macro errors because it expects a single invocation per run.
- Row counts in the destination table differ between flag values.

Projects without a custom microbatch macro are unaffected; the built-in macro already runs in batches.


## `state_modified_compare_more_unrendered_values`

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Previous behavior (`false`)</h4>

`unrendered_config` stores the rendered value of Jinja expressions in YAML configs. For example, `materialized: "{{ env_var('MAT', 'view') }}"` is stored as `materialized: "view"`. `state:modified` comparisons use the post-render value.

</div>

<div>

<h4 style={{marginTop: 0}}>New behavior (`true`)</h4>

`unrendered_config` stores the literal Jinja text. `state:modified` comparisons reflect changes to the expression itself, even when the rendered value is identical.

</div>

</div>

#### Impact

Flipping the default to `true` for this flag silently changes the `state:modified` selection set that most CI, Slim CI, and `dbt build --defer` workflows rely on. There are two ways this surfaces:

- **False "modified" on the first run after the flag flips.** If the baseline manifest was captured before the flag flipped (rendered values stored) and the current parse runs after the flip (literal text stored), every node whose YAML config contains Jinja will appear as `state:modified`, even if nothing has changed. This causes a full rebuild on the first CI run after the upgrade.
- **New positives going forward.** After both manifests are captured with the flag enabled, `state:modified` will catch cases where two equivalent Jinja expressions render to the same value (for example, switching from `"{{ env_var('MAT', 'view') }}"` to `view`).


## `require_yaml_configuration_for_mf_time_spines`

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Previous behavior (`false`)</h4>

A project using the legacy `metricflow_time_spine.sql` model without a YAML `time_spine` declaration parses successfully and emits `MFTimespineWithoutYamlConfigurationDeprecation`.

</div>

<div>

<h4 style={{marginTop: 0}}>New behavior (`true`)</h4>

The project continues to parse and run in exactly the same way, but the deprecation warning is suppressed.

</div>

</div>

#### Impact

This flag has no functional impact; the legacy time-spine model continues to work in both cases. The only visible changes are:

- The `MFTimespineWithoutYamlConfigurationDeprecation` warning no longer appears in logs.
- If you use `--warn-error`, the warning no longer fires and will no longer escalate to an error.

For more information, refer to [MetricFlow timespine](/docs/build/metricflow-time-spine).


## `validate_macro_args`

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Previous behavior (`false`)</h4>

When a macro has a YAML patch whose argument names, count, or types don't match the Jinja `{% macro name(args) %}` signature, dbt silently accepts the patch.

</div>

<div>

<h4 style={{marginTop: 0}}>New behavior (`true`)</h4>

dbt parses the Jinja signature, compares it against the YAML patch, and raises `InvalidMacroAnnotation` warnings for any mismatches. These warnings are handled by `--warn-error`.

</div>

</div>

#### Impact

On its own, the flag emits warnings and builds continue. However, these warnings use the force-handled path and respect `--warn-error`, so projects with `--warn-error` set will see build failures at parse time.

This affects projects where the `arguments:` listed in a macro's YAML patch no longer match the macro's actual Jinja signature. For those projects, every command fails at parse time until you either update the YAML arguments to match the macro or remove the `arguments:` block entirely.


## Already mature

The following flags have already reached maturity in prior releases.

| Flag | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| [`require_explicit_package_overrides_for_builtin_materializations`](#require_explicit_package_overrides_for_builtin_materializations) | 2024.06 | <Constant name="core" /> v1.8.0 |
| [`require_resource_names_without_spaces`](#require_resource_names_without_spaces) | 2025.05 | <Constant name="core" /> v1.10.0 |
| [`source_freshness_run_project_hooks`](#source_freshness_run_project_hooks) | 2025.05 | <Constant name="core" /> v1.10.0 |
| [`require_generic_test_arguments_property`](#require_generic_test_arguments_property) | 2025.08 | <Constant name="core" /> v1.10.8 |

## `require_explicit_package_overrides_for_builtin_materializations`

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

## `require_resource_names_without_spaces`

The `require_resource_names_without_spaces` flag enforces using resource names without spaces.

The names of dbt resources (for example, models) should contain letters, numbers, and underscores. We highly discourage the use of other characters, especially spaces. To that end, we have deprecated support for spaces in resource names. When the `require_resource_names_without_spaces` flag is set to `true`, dbt will raise an exception (instead of a deprecation warning) if it detects a space in a resource name.

<File name='models/model name with spaces.sql'>

```sql
-- This model file should be renamed to model_name_with_underscores.sql
```

</File>

## `source_freshness_run_project_hooks`

Set the `source_freshness_run_project_hooks` flag to include/exclude "project hooks" ([`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end)) in the `dbt source freshness` command execution. The flag is set to `true` (include) by default.

If you have a specific project [`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end) hooks that should not run before/after `source freshness` command, you can add a conditional check to those hooks:

<File name='dbt_project.yml'>

```yaml
on-run-start:
  - '{{ ... if flags.WHICH != 'freshness' }}'
```
</File>

## `require_generic_test_arguments_property`

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
