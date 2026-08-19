---
title: "Failures in on-run-start hooks"
id: "skip_nodes_if_on_run_start_fails"
sidebar_label: "skip nodes if on run start fails"
---

:::caution Removed in <Constant name="core_v2" />

This flag was removed in <Constant name="core_v2" /> and in <Constant name="fusion" />. The new behavior is always enabled. If you're upgrading, remove this flag from your `dbt_project.yml`.

:::



| skip_nodes_if_on_run_start_fails | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2024.10 | 1.9.0 |
| Matured (default → `true`) | Sep 1, 2026 | 1.12.0 |
| Removed | — | v2.0 |

<br />

Starting in <Constant name="core" /> v1.12, `skip_nodes_if_on_run_start_fails` defaults to `true`, skipping all selected resources if there is a failure on an `on-run-start` hook.

For more information, refer to [`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end).

## Impact

If your project uses `on-run-start` hooks for non-critical work (for example, telemetry, notifications, audit inserts, attaching session settings), your build will stop producing output whenever a hook fails. Tables and views that previously refreshed daily will stop updating the next time the hook fails.

<Expandable alt_header="Recommended actions">

If every model is skipped after an `on-run-start` hook fails, find which `on-run-start` hook failed in the run log — it appears as an `ERROR` immediately before all the nodes marked `SKIP`. From there, either remove the hook if it's not required, or fix the root cause of the failure by reviewing the hook's SQL statements.

To opt out of this behavior, set the flag to `false`:

<File name='dbt_project.yml'>

```yaml
flags:
  skip_nodes_if_on_run_start_fails: false
```

</File>

</Expandable>
