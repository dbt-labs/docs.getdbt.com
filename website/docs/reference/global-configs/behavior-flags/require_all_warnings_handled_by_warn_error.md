---
title: "Warn-error handler for all warnings"
id: "require_all_warnings_handled_by_warn_error"
sidebar_label: "require all warnings handled by warn error"
---



| require_all_warnings_handled_by_warn_error | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2025.06 | 1.10.0 |
| Matured (default → `true`) | Sep 1, 2026 | 1.12.0 |
| Removed | — | — |

<br />

Starting in <Constant name="core" /> v1.12, the `require_all_warnings_handled_by_warn_error` flag defaults to `true`.

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

## Impact

This only affects projects that use `warn_error: true` or `--warn-error` — common in CI or in <Constant name="dbt_platform" /> production jobs configured for strict mode. Projects without `--warn-error` are not affected.

Example warnings that switch from "log only" to "error" for `warn_error: true` users after the flag matures:

- `JinjaLogWarning` — emitted for column types declared for non-existent seed columns
- `WarnStateTargetEqual` — emitted when the `--state` and `--target` directories are the same path
- `SelectExcludeIgnoredWithSelectorWarning` — emitted when the legacy `--selector` flag is combined with `--select` or `--exclude`
- `RunResultWarningMessage` — emitted when a test or model returns `WARN` status
- Various adapter-level warnings not previously handled by `--warn-error`

<Expandable alt_header="Recommended actions">

If a job using `warn_error: true` or `--warn-error` fails with `EventCompilationError` at parse or run time for an event class that previously only appeared as a log line, you can silence specific warnings with `warn_error_options`:

<File name='dbt_project.yml'>

```yaml
flags:
  warn_error_options:
    silence:
      - JinjaLogWarning
      - WarnStateTargetEqual
      - RunResultWarningMessage
      - SelectExcludeIgnoredWithSelectorWarning
```

</File>

You can also use the `warn` list to keep specific events as warnings even when `--warn-error` would otherwise escalate them to errors.

To opt out of this behavior, set the flag to `false`:

<File name='dbt_project.yml'>

```yaml
flags:
  require_all_warnings_handled_by_warn_error: false
```

</File>

</Expandable>
