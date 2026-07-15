---
title: "Latest version pointer for versioned models"
id: "latest_version_pointer_enabled_by_default"
sidebar_label: "latest version pointer enabled by default"
---

:::info Beta feature
The `latest_version_pointer_enabled_by_default` flag is a beta feature in <Constant name="core" /> v1.12.
:::

| latest_version_pointer_enabled_by_default | <Constant name="dbt" /> **Latest** | <Constant name="core" /> | <Constant name="fusion" /> |
|---|---|---|---|
| Introduced | 2026.5 | 1.12.0 | Early preview |
| Matured (default → `true`) | — | — | Already `true` |
| Removed | — | — | — |

The `latest_version_pointer_enabled_by_default` flag is set to `false` by default in <Constant name="core_v1" />. In <Constant name="fusion" />, this flag defaults to `true`, which enables the latest version pointer for all versioned models automatically.

When you set it to `true`, dbt automatically creates a [latest version pointer](/docs/mesh/govern/model-versions#pointing-to-the-latest-version) view for every versioned model in the project, without requiring per-model configuration. The pointer view is named after the model's base name (for example, `dim_customers`) and always points to the relation for the model with `is_latest_version: true` (for example, `dim_customers_v2`).

Without this flag, you must opt in per model by setting [`latest_version_pointer.enabled: true`](/reference/resource-configs/latest_version_pointer) in the model config.
