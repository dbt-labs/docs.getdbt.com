---
title: "Warn-error handler for all warnings"
id: "require_all_warnings_handled_by_warn_error"
sidebar_label: "require all warnings handled by warn error"
---



| require_all_warnings_handled_by_warn_error | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2025.06 | 1.10.0 |
| Matured (default → `true`) | 2026.09 | 1.12.0 |
| Removed | — | — |

<br />

Starting in <Constant name="core" /> v1.12, the `require_all_warnings_handled_by_warn_error` flag defaults to `true`.

With this flag enabled, all warnings raised during a run are routed through the `--warn-error` / `--warn-error-options` handler. This ensures consistent behavior when promoting warnings to errors or silencing them. When the flag is `false`, only some warnings are processed by the handler while others may bypass it.

Projects that use `--warn-error` (or `--warn-error-options='{"error":"all"}'`) may have builds fail on warnings that were previously ignored.

## Impact

This only affects projects that use `warn_error: true` or `--warn-error` — common in CI or in <Constant name="dbt_platform" /> production jobs configured for strict mode. Projects without `--warn-error` are not affected.

Example warnings that switch from "log only" to "error" for `warn_error: true` users:

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
