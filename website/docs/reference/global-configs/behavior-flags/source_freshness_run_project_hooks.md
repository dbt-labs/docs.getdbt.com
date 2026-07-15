---
title: "Project hooks with source freshness"
id: "source_freshness_run_project_hooks"
sidebar_label: "source freshness run project hooks"
---

:::caution Removed in <Constant name="core_v2" />

This flag was removed in <Constant name="core_v2" /> and in <Constant name="fusion" />. The new behavior is always enabled. If you're upgrading, remove this flag from your `dbt_project.yml`.

:::

| source_freshness_run_project_hooks | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2024.03 | 1.8.0 |
| Matured (default → `true`) | 2025.05 | 1.10.0 |
| Removed | — | v2.0 |

Project hooks ([`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end)) now run as part of the `dbt source freshness` command by default. Previously, hooks did not execute during `dbt source freshness`.

If you have hooks that should not run before or after `dbt source freshness`, add a conditional check:

<File name='dbt_project.yml'>

```yaml
on-run-start:
  - "{{ ... if flags.WHICH != 'freshness' }}"
```

</File>
