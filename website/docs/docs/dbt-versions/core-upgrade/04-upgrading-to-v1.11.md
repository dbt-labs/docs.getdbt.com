---
title: "Upgrading to v1.11 (beta)"
id: upgrading-to-v1.11
description: New features and changes in dbt Core v1.11
displayed_sidebar: "docs"
---

# Upgrading to v1.11 <Lifecycle status="beta" />

:::note Installing Beta v1.11 on the command line 
When using Core v1.11 on the command line (not in <Constant name="dbt_platform" />), you need to install a beta version of dbt-core. For example, `install --upgrade --pre dbt-core`.
:::

## Resources

- <Constant name="core" /> [v1.11 Beta changelog](https://github.com/dbt-labs/dbt-core/blob/v1.11.0b3/CHANGELOG.md)
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
- **Execution**: Create, update, and rename UDFs as part of DAG execution using `dbt build --select "resource_type:function"`
- **DAG integration**: When executing `dbt build`, UDFs are built before models that reference them, ensuring proper dependency management.
- **New `function()` macro**: Reference UDFs in your models using the `{{ function('function_name') }}` Jinja macro.

Read more about UDFs, including prerequisites and how to define and use them in the [UDF documentation](/docs/build/udfs).


### Managing changes to legacy behaviors

<Constant name="core" /> v1.11 introduces new flags for [managing changes to legacy behaviors](/reference/global-configs/behavior-changes). You may opt into recently introduced changes (disabled by default), or opt out of mature changes (enabled by default), by setting `True` / `False` values, respectively, for `flags` in `dbt_project.yml`.

You can read more about each of these behavior changes in the following links:

- (Introduced, disabled by default) [`require_unique_project_resource_names`](/reference/global-configs/behavior-changes#unique-project-resource-names). This flag is set to `False` by default. With this setting, if two unversioned resources in the same package share the same name, dbt continues to run and raises a [`DuplicateNameDistinctNodeTypesDeprecation`](/reference/deprecations#duplicatenamedistinctnodetypesdeprecation) warning. When set to `True`, dbt raises a `DuplicateResourceNameError` error.

### Deprecation warnings enabled by default

Deprecation warnings from JSON schema validation are now enabled by default when validating your YAML configuration files (such as `schema.yml` and `dbt_project.yml`) for projects running using the Snowflake, Databricks, BigQuery, and Redshift adapters.

These warnings help you proactively identify and update deprecated configurations (such as misspelled config keys, deprecated properties, or incorrect data types).

You'll see the following deprecation warnings by default:
* [ConfigMetaFallbackDeprecation](/reference/deprecations#configmetafallbackdeprecation) 
* [CustomKeyInConfigDeprecation](/reference/deprecations#customkeyinconfigdeprecation)
* [CustomKeyInObjectDeprecation](/reference/deprecations#customkeyinobjectdeprecation)
* [CustomTopLevelKeyDeprecation](/reference/deprecations#customtoplevelkeydeprecation)
* [MissingPlusPrefixDeprecation](/reference/deprecations#missingplusprefixdeprecation)
* [SourceOverrideDeprecation](/reference/deprecations#sourceoverridedeprecation)

Each deprecation type can be silenced using the [warn-error-options](/reference/global-configs/warnings#configuration) project configuration. For example, to silence all of the above deprecations within `dbt_project.yml`: 

<File name='dbt_project.yml'>
```yml

flags:
  warn_error_options:
    silence:
      - CustomTopLevelKeyDeprecation
      - CustomKeyInConfigDeprecation
      - CustomKeyInObjectDeprecation
      - MissingPlusPrefixDeprecation
      - SourceOverrideDeprecation
```
</File>

Alternatively, the `--warn-error-options` flag can be used to silence specific deprecations from the command line:
```sh
dbt parse --warn-error-options '{"silence": ["CustomTopLevelKeyDeprecation", "CustomKeyInConfigDeprecation", "CustomKeyInObjectDeprecation", "MissingPlusPrefixDeprecation", "SourceOverrideDeprecation"]}'
```

To silence _all_ deprecation warnings within `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml

flags:
  warn_error_options:
    silence:
      - Deprecations
```
</File>

Similarly, all deprecation warnings can be silenced via the `--warn-error-options` command line flag:

```sh
dbt parse --warn-error-options '{"silence": ["Deprecations"]}'
```

## Adapter-specific features and functionalities

### Snowflake

- The Snowflake adapter supports basic table materialization on Iceberg tables registered in a Glue catalog through a [catalog-linked database](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database#label-catalog-linked-db-create). For more information, see [Glue Data Catalog](/docs/mesh/iceberg/snowflake-iceberg-support#external-catalogs).

### BigQuery

- To improve performance, dbt can issue a single batch query when calculating source freshness through metadata, instead of executing one query per source. To enable this feature, set [bigquery_use_batch_source_freshness](/reference/global-configs/bigquery-changes#the-bigquery_use_batch_source_freshness-flag) to `True`.

## Quick hits

You will find these quick hits in dbt Core v1.11:
- The `dbt ls` command can now write out nested keys. This makes it easier to debug and troubleshoot your project. Example: `dbt ls --output json --output-keys config.materialized`
- Manifest metadata now includes `run_started_at`, providing better tracking of when dbt runs were initiated.
- When a model is disabled, unit tests for that model are automatically disabled as well.

