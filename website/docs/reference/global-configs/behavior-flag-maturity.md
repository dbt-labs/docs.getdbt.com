---
title: "Behavior flag maturity and impact"
id: "behavior-flag-maturity"
sidebar: "Behavior flag maturity"
---

Several behavior change flags are planned to reach maturity on the <Constant name="dbt_platform" /> **Latest** release track, which will switch their default values from `false` to `true`. This page describes what each change means for your project and what action, if any, you need to take.

To preserve the legacy behavior for any flag, set it explicitly to `false` in your `dbt_project.yml` before the change takes effect:

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

## Summary

The following table shows all flags reaching maturity and their potential impact.

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

For migration guidance and syntax examples, refer to [Cumulative metrics](/reference/global-configs/behavior-changes#cumulative-metrics).


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

For recommended rollout steps, refer to [Warn-error handler for all warnings](/reference/global-configs/behavior-changes#warn-error-handler-for-all-warnings).


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

For more information, refer to [Source definitions for state:modified](/reference/global-configs/behavior-changes#source-definitions-for-state).


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

For more information, refer to [MetricFlow time spine YAML](/reference/global-configs/behavior-changes#metricflow-time-spine-yaml).


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

For more information, refer to [Macro argument validation](/reference/global-configs/behavior-changes#macro-argument-validation).

