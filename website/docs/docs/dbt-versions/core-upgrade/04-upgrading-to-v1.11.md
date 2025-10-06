---
title: "Upgrading to v1.11 (beta)"
id: upgrading-to-v1.11
description: New features and changes in dbt Core v1.11
displayed_sidebar: "docs"
---
 
## Resources

- <Constant name="core" /> [v1.11 beta changelog](https://github.com/dbt-labs/dbt-core/blob/prep-release/nightly-release/1.11.0b2.dev10032025_18218007434/CHANGELOG.md)
- [<Constant name="core" /> CLI Installation guide](/docs/core/installation-overview)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud#release-tracks)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x. Any behavior changes will be accompanied by a [behavior change flag](/reference/global-configs/behavior-changes#behavior-change-flags) to provide a migration window for existing projects. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

Starting in 2024, <Constant name="cloud" /> provides the functionality from new versions of <Constant name="core" /> via [release tracks](/docs/dbt-versions/cloud-release-tracks) with automatic upgrades. If you have selected the "Latest" release track in <Constant name="cloud" />, you already have access to all the features, fixes, and other functionality included in the latest <Constant name="core" /> version! If you have selected the "Compatible" release track, you will have access in the next monthly "Compatible" release after the <Constant name="core" /> v1.11 final release.

We continue to recommend explicitly installing both `dbt-core` and `dbt-<youradapter>`. This may become required for a future version of dbt. For example:

```sql
python3 -m pip install dbt-core dbt-snowflake
```

## New and changed features and functionality

New features and functionality available in <Constant name="core" /> v1.11

### User-defined functions (UDFs)

dbt Core v1.11 introduces support for user-defined functions (UDFs), which enable you to define and register custom functions in your warehouse. Like macros, UDFs promote code reuse, but they run natively in the warehouse so you can reuse the same logic in tools outside dbt.

Key features include:

- **Define UDFs as first-class dbt resources**: Create UDF files in a `functions/` directory with corresponding YAML configuration.
- **Native warehouse execution**: Create, update, and rename UDFs as part of DAG execution.
- **DAG integration**: UDF files are built before models that reference them, ensuring proper dependency management.
- **New `function()` macro**: Reference UDFs in your models using the `{{ function('function_name') }}` Jinja macro.
- **Unit test support**: Validate models that use UDFs with unit tests (you should make sure functions exist first by running `dbt build --select "+model_to_test" --empty`).
- **List and select functions**: Manage UDFs by using `dbt list` and selection syntax like `dbt run --resource_type function` or `dbt run --select my_function`.

Read about defining and using UDFs, and prerequisites, such as supported adapters in the [UDF documentation](/docs/build/user-defined-functions).

### Catalog improvements

The catalog integration has been enhanced with new configuration options and validation:

- `file_format` configuration is now supported in catalog integration
- Improved catalog and config validation for sources, models, and tests
- Better error handling and validation messages

### Enhanced `dbt ls` output

The `dbt ls` command now supports nested key traversal, making it easier to query and filter complex metadata from your dbt project.

### Manifest metadata enhancements

Manifest metadata now includes `run_started_at`, providing better tracking of when dbt runs were initiated.

### Improved config validation

SQL-based configuration validation has been improved for models, catching configuration errors earlier in the development process.

### Managing changes to legacy behaviors

Starting with `v1.10`, you can [manage changes to legacy behaviors](/reference/global-configs/behavior-changes). You may opt into recently introduced changes (disabled by default), or opt out of mature changes (enabled by default), by setting `True` / `False` values, respectively, for `flags` in `dbt_project.yml`.

### Deprecation warnings

Starting with `v1.10`, you began receiving deprecation warnings for dbt code that will become invalid in the future. You can use the [`dbt-autofix` tool](https://github.com/dbt-labs/dbt-autofix) to fix invalid code.

## Quick hits

### Bug fixes and improvements

dbt Core v1.11 includes these bug fixes and performance improvements:

- **Config parsing improvements**: Fixed multiple issues in config parsing logic for more reliable configuration handling
- **Model and source freshness**: Resolved bugs related to model and source freshness checks
- **Partial parsing**: Enhanced partial parsing reliability and performance
- **JSONSchema validation**: Fixed validation issues for more accurate schema checking
- **Tags and meta handling**: Improved processing of tags and meta configurations
- **Event time quoting**: Better handling of event_time field quoting in configurations
- **Deprecation handling**: Enhanced deprecation warning messages and reduced redundant warnings
- **Error messages**: Improved error messaging throughout the codebase for easier debugging
- **Performance**: Various performance optimizations across the platform

### Dependency updates

dbt Core v1.11 updates several key dependencies to ensure compatibility and security:

- Updated minimum versions for `jsonschema`, `dbt-common`, `dbt-adapters`, and `dbt-semantic-interfaces`
- Loosened some dependency pins for better compatibility with other Python packages
- Fixed dependency installation issues for smoother setup
