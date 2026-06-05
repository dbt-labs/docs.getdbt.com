---
title: "Mature behavior flags"
id: "behavior-flag-maturity"
sidebar: "Mature behavior flags"
---

When a behavior change flag reaches maturity, its default value switches from `false` to `true`. This page covers two categories of flags:

- **[Mature flags](#mature-flags)**: Flags that have already reached maturity and are enabled by default
- **[Flags reaching maturity](#flags-reaching-maturity)**: Flags planned to reach maturity on the <Constant name="dbt_platform" /> **Latest** release track, where the default will switch to `true`

For each flag, this page describes what the change means for your project and how to preserve the previous behavior. For flags still in the introduction phase, refer to [Behavior changes](/reference/global-configs/behavior-changes).

## Mature flags

The following flags have reached maturity:

| Flag | <Constant name="dbt" /> **Latest**: Maturity | <Constant name="core" />: Maturity |
|---|---|---|
| [`require_explicit_package_overrides_for_builtin_materializations`](#require_explicit_package_overrides_for_builtin_materializations) | 2024.06 | v1.8.0 |
| [`require_resource_names_without_spaces`](#require_resource_names_without_spaces) | 2025.05 | v1.10.0 |
| [`source_freshness_run_project_hooks`](#source_freshness_run_project_hooks) | 2025.05 | v1.10.0 |
| [`require_generic_test_arguments_property`](#require_generic_test_arguments_property) | 2025.08 | v1.10.8 |

To opt out of mature flags and preserve the previous behavior, set them explicitly to `false` in your `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
flags:
  require_explicit_package_overrides_for_builtin_materializations: false
  require_resource_names_without_spaces: false
  source_freshness_run_project_hooks: false
  require_generic_test_arguments_property: false
```

</File>

### `require_explicit_package_overrides_for_builtin_materializations`

Installed packages can no longer override built-in materializations without your explicit opt-in. A materialization defined in a package that matches the name of a built-in materialization is no longer included in the search and resolution order. Unlike macros, materializations don't use the `search_order` defined in the project `dispatch` config.

The built-in materializations are `'view'`, `'table'`, `'incremental'`, `'materialized_view'` for models as well as `'test'`, `'unit'`, `'snapshot'`, `'seed'`, and `'clone'`.

You can still explicitly override built-in materializations by reimplementing the built-in materialization in your root project and wrapping the package implementation.

<File name='macros/materialization_view.sql'>

```sql
{% materialization view, snowflake %}
  {{ return(my_installed_package_name.materialization_view_snowflake()) }}
{% endmaterialization %}
```

</File>

In the future, we may extend the project-level [`dispatch` configuration](/reference/project-configs/dispatch-config) to support a list of authorized packages for overriding built-in materialization.

### `require_resource_names_without_spaces`

dbt now raises an error if it detects a space in a resource name, rather than a deprecation warning. Resource names should contain letters, numbers, and underscores only.

<File name='models/model name with spaces.sql'>

```sql
-- This model file should be renamed to model_name_with_underscores.sql
```

</File>

### `source_freshness_run_project_hooks`

Project hooks ([`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end)) now run as part of the `dbt source freshness` command by default. If you have hooks that should not run before or after `dbt source freshness`, add a conditional check:

<File name='dbt_project.yml'>

```yaml
on-run-start:
  - "{{ ... if flags.WHICH != 'freshness' }}"
```
</File>

### `require_generic_test_arguments_property`

dbt supports parsing key-value arguments that are inputs to generic tests when specified under the `arguments` property. In the past, dbt didn't support a way to clearly disambiguate between properties that were inputs to generic tests and framework configurations, and only accepted arguments as top-level properties.

If you are on an older Core version where the flag is `false`, dbt will recognize the `arguments` property but raise the `ArgumentsPropertyInGenericTestDeprecation` warning.

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

With this flag enabled, dbt will:
- Parse any key-value pairs under `arguments` in generic tests as inputs to the generic test macro.
- Raise a `MissingArgumentsPropertyInGenericTestDeprecation` warning if additional non-config arguments are specified outside of the `arguments` property.

## Flags reaching maturity

Several behavior change flags are planned to reach maturity on the <Constant name="dbt_platform" /> **Latest** release track, which will switch their default values from `false` to `true`. For intro dates, refer to the [dbt Core behavior changes](/reference/global-configs/behavior-changes#dbt-core-behavior-changes) table.

| Flag | Impact |
|---|---|
| [`skip_nodes_if_on_run_start_fails`](#skip_nodes_if_on_run_start_fails) | Can stop build |
| [`require_nested_cumulative_type_params`](#require_nested_cumulative_type_params) | Can stop build (parse error) |
| [`require_all_warnings_handled_by_warn_error`](#require_all_warnings_handled_by_warn_error) | Can stop build (when `--warn-error` is set) |
| [`require_batched_execution_for_custom_microbatch_strategy`](#require_batched_execution_for_custom_microbatch_strategy) | Behavior change for custom microbatch macros |
| [`state_modified_compare_more_unrendered_values`](#state_modified_compare_more_unrendered_values) | Selection-set change with potential CI impact |
| [`require_yaml_configuration_for_mf_time_spines`](#require_yaml_configuration_for_mf_time_spines) | Suppresses a deprecation warning (no functional change) |
| [`validate_macro_args`](#validate_macro_args) | New warning for mismatched macro arguments |

To retain the legacy behavior after these flags reach maturity, set them to `false` in your `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
flags:
  skip_nodes_if_on_run_start_fails: false
  require_nested_cumulative_type_params: false
  require_all_warnings_handled_by_warn_error: false
  require_batched_execution_for_custom_microbatch_strategy: false
  state_modified_compare_more_unrendered_values: false
  require_yaml_configuration_for_mf_time_spines: false
  validate_macro_args: false
```

</File>

### `skip_nodes_if_on_run_start_fails`

If your project uses `on-run-start` hooks for non-critical work (for example, telemetry, notifications, audit inserts, attaching session settings), your build will stop producing output whenever a hook fails. Tables and views that previously refreshed daily will stop updating the next time the hook fails.

For more information, refer to [`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end).


### `require_nested_cumulative_type_params`

Any project with a cumulative metric still using the un-nested syntax stops parsing entirely on the first command. Because parsing fails, the error affects every dbt command: `run`, `build`, `test`, `compile`, `docs generate`, the <Constant name="semantic_layer" />, and more.


### `require_all_warnings_handled_by_warn_error`

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


### `require_batched_execution_for_custom_microbatch_strategy`

This flag is only relevant if your project has a custom `get_incremental_microbatch_sql` macro. If you don't have a custom microbatch macro, you don't need to set this flag.

If you have overridden `get_incremental_microbatch_sql` &mdash; typically to work around an adapter limitation or implement a custom partition strategy &mdash; your macro is invoked under a batched contract for which it was never written. Possible outcomes:

- The macro ignores the smaller `event_time_start` / `event_time_end` window and re-processes the full range every batch, leading to wasted compute, duplicate rows, or `MERGE`/`INSERT` conflicts.
- The macro errors because it expects a single invocation per run.
- Row counts in the destination table differ between flag values.

Projects without a custom microbatch macro are unaffected; the built-in macro already runs in batches.


### `state_modified_compare_more_unrendered_values`

Flipping the default to `true` for this flag silently changes the `state:modified` selection set that most CI, Slim CI, and `dbt build --defer` workflows rely on. There are two ways this surfaces:

- **False "modified" on the first run after the flag flips.** If the baseline manifest was captured before the flag flipped (rendered values stored) and the current parse runs after the flip (literal text stored), every node whose YAML config contains Jinja will appear as `state:modified`, even if nothing has changed. This causes a full rebuild on the first CI run after the upgrade.
- **New positives going forward.** After both manifests are captured with the flag enabled, `state:modified` will catch cases where two equivalent Jinja expressions render to the same value (for example, switching from `"{{ env_var('MAT', 'view') }}"` to `view`).


### `require_yaml_configuration_for_mf_time_spines`

This flag has no functional impact; the legacy time-spine model continues to work in both cases. The only visible changes are:

- The `MFTimespineWithoutYamlConfigurationDeprecation` warning no longer appears in logs.
- If you use `--warn-error`, the warning no longer fires and will no longer escalate to an error.

For more information, refer to [MetricFlow timespine](/docs/build/metricflow-time-spine).


### `validate_macro_args`

On its own, the flag emits warnings and builds continue. However, these warnings use the force-handled path and respect `--warn-error`, so projects with `--warn-error` set will see build failures at parse time.

This affects projects where the `arguments:` listed in a macro's YAML patch no longer match the macro's actual Jinja signature. For those projects, every command fails at parse time until you either update the YAML arguments to match the macro or remove the `arguments:` block entirely.
