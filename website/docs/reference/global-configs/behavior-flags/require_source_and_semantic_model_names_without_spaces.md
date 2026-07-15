---
title: "No spaces in source and semantic model names"
id: "require_source_and_semantic_model_names_without_spaces"
sidebar_label: "require source and semantic model names without spaces"
---

| require_source_and_semantic_model_names_without_spaces | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2026.4 | 1.12.0 |
| Matured (default → `true`) | — | — |
| Removed | — | — |

The `require_source_and_semantic_model_names_without_spaces` flag is set to `false` by default.

Source names and semantic model names should contain letters, numbers, and underscores — _not_ spaces. dbt raises the [`ResourceNamesWithSpacesDeprecation`](/reference/deprecations#resourcenameswithspacesdeprecation) warning if it detects a space in a source name or semantic model name. When the `require_source_and_semantic_model_names_without_spaces` flag is set to `true`, dbt raises an error.

This flag extends [`require_resource_names_without_spaces`](/reference/global-configs/behavior-flags/require_resource_names_without_spaces) to cover source and semantic model names specifically.
