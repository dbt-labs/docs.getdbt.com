---
title: "No spaces in resource names"
id: "require_resource_names_without_spaces"
sidebar_label: "require resource names without spaces"
---

:::caution Removed in <Constant name="core_v2" />

This flag was removed in <Constant name="core_v2" /> and in <Constant name="fusion" />. The new behavior is always enabled. If you're upgrading, remove this flag from your `dbt_project.yml`.

:::

| require_resource_names_without_spaces | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2024.05 | 1.8.0 |
| Matured (default → `true`) | 2025.05 | 1.10.0 |
| Removed | — | v2.0 |

dbt raises an error if it detects a space in a resource name. Resource names should contain letters, numbers, and underscores only.

dbt raises the [`ResourceNamesWithSpacesDeprecation`](/reference/deprecations#resourcenameswithspacesdeprecation) warning if it detects a space in a resource name. When this flag is set to `true` (now always-on in <Constant name="core_v2" />), dbt raises an error instead.

<File name='models/model name with spaces.sql'>

```sql
-- This model file should be renamed to model_name_with_underscores.sql
```

</File>

See also [`require_source_and_semantic_model_names_without_spaces`](/reference/global-configs/behavior-flags/require_source_and_semantic_model_names_without_spaces), which extends this behavior to source and semantic model names.
