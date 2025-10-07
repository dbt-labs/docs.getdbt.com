---
title: "Upgrading to v1.11 (beta)"
id: upgrading-to-v1.11
description: New features and changes in dbt Core v1.11
displayed_sidebar: "docs"
---

# Upgrading to v1.1 <Lifecycle status="beta" />

## Resources

- <Constant name="core" /> [v1.11 beta changelog](https://github.com/dbt-labs/dbt-core/blob/prep-release/nightly-release/1.11.0b2.dev10062025_18275799839/CHANGELOG.md)
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

### User-defined functions (UDFs) <Lifecycle status="beta" />

dbt Core v1.11 introduces support for user-defined functions (UDFs), which enable you to define and register custom functions in your warehouse. Like macros, UDFs promote code reuse, but they are objects in the warehouse so you can reuse the same logic in tools outside dbt.

Key features include:

- **Define UDFs as first-class dbt resources**: Create UDF files in a `functions/` directory with corresponding YAML configuration.
- **Native warehouse execution**: Create, update, and rename UDFs as part of DAG execution.
- **DAG integration**: UDF files are built before models that reference them, ensuring proper dependency management.
- **New `function()` macro**: Reference UDFs in your models using the `{{ function('function_name') }}` Jinja macro.
- **List and select functions**: Manage UDFs by using `dbt list` and selection syntax like `dbt build --select "resource_type:function"`.

Read more about UDFs, including prerequisites and how to define and use them in the UDF documentation.

### Deprecation warnings

You can use the [`dbt-autofix` tool](https://github.com/dbt-labs/dbt-autofix) to fix invalid code and resolve deprecations warnings.

## Quick hits

You will find these quick hits in dbt Core v1.11:
* The `dbt ls` command now supports nested key traversal. This makes it easier to query and filter complex metadata from your dbt project.
* Manifest metadata now includes `run_started_at`, providing better tracking of when dbt runs were initiated.
* SQL-based configuration validation has been improved for models. This enables earlier detection of configuration errors during development.
* The dbt Catalog integration has been enhanced with new configuration options (including `file_format` support), improved validation for sources, models, and tests, and better error handling messages.

