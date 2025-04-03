---
title: "Upgrading to v1.10"
id: upgrading-to-v1.10
description: New features and changes in dbt Core v1.10
displayed_sidebar: "docs"
---
 
## Resources 

- dbt Core v1.10 changelog (coming soon)
- [dbt Core CLI Installation guide](/docs/core/installation-overview)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud#release-tracks)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x. Any behavior changes will be accompanied by a [behavior change flag](/reference/global-configs/behavior-changes#behavior-change-flags) to provide a migration window for existing projects. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

Starting in 2024, dbt Cloud provides the functionality from new versions of dbt Core via [release tracks](/docs/dbt-versions/cloud-release-tracks) with automatic upgrades. If you have selected the "Latest" release track in dbt Cloud, you already have access to all the features, fixes, and other functionality that is included in dbt Core v1.10! If you have selected the "Compatible" release track, you will have access in the next monthly "Compatible" release after the dbt Core v1.10 final release.

For users of dbt Core, since v1.8, we recommend explicitly installing both `dbt-core` and `dbt-<youradapter>`. This may become required for a future version of dbt. For example:

```sql
python3 -m pip install dbt-core dbt-snowflake
```

## New and changed features and functionality

New features and functionality available in dbt Core v1.10

### The `--sample` flag

Large data sets can slow down dbt build times, making it harder for developers to test new code efficiently. The [`--sample` flag](/docs/build/sample-flag), available for the `run` and `build` commands, helps reduce build times and warehouse costs by running dbt in sample mode. It generates filtered refs and sources using time-based sampling, allowing developers to validate outputs without building entire models.

### Managing changes to legacy behaviors

dbt Core v1.10 introduces new flags for [managing changes to legacy behaviors](/reference/global-configs/behavior-changes). You may opt into recently introduced changes (disabled by default), or opt out of mature changes (enabled by default), by setting `True` / `False` values, respectively, for `flags` in `dbt_project.yml`.

You can read more about each of these behavior changes in the following links:

- (Introduced, disabled by default) [`validate_macro_args`](/reference/global-configs/behavior-changes#macro-argument-validation). If the flag is set to `True`, dbt will raise a warning if the argument `type` names you've added in your macro YAMLs don't match the argument names in your macro or if the argument types aren't valid according to the [supported types](/reference/resource-properties/arguments#supported-types).

## Quick hits

- Provide the [`loaded_at_query`](/reference/resource-properties/freshness#loaded_at_query) property for source freshness to specify custom SQL to generate the `maxLoadedAt` time stamp on the source (versus the [built-in query](https://github.com/dbt-labs/dbt-adapters/blob/6c41bedf27063eda64375845db6ce5f7535ef6aa/dbt/include/global_project/macros/adapters/freshness.sql#L4-L16), which uses the `loaded_at_field`). You cannot define `loaded_at_query` if the `loaded_at_field` config is also provided.

- Provide validation for macro arguments using the [`validate_macro_args`](/reference/global-configs/behavior-changes#macro-argument-validation) flag, which is disabled by default. When enabled, this flag checks that documented macro argument names match those in the macro definition and validates their types against a supported format. Previously, dbt did not enforce standard argument types, treating the type field as documentation-only. If no arguments are documented, dbt infers them from the macro and includes them in the manifest.json file. Learn more about [supported types](/reference/resource-properties/arguments#supported-types).
 