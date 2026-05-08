---
title: "Upgrading to v1.11"
id: upgrading-to-v1.11
description: New features and changes in dbt Core v1.11
displayed_sidebar: "docs"
---

# Upgrading to v1.11

## Resources

- [<Constant name="core" /> v1.11 changelog](https://github.com/dbt-labs/dbt-core/blob/1.11.latest/CHANGELOG.md)
- [<Constant name="core" /> CLI Installation guide](/docs/local/install-dbt)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud#release-tracks)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x. Any behavior changes will be accompanied by a [behavior change flag](/reference/global-configs/behavior-changes#behavior-change-flags) to provide a migration window for existing projects. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

Starting in 2024, <Constant name="dbt" /> provides the functionality from new versions of <Constant name="core" /> via [release tracks](/docs/dbt-versions/cloud-release-tracks) with automatic upgrades. If you have selected the **Latest** release track in <Constant name="dbt" />, you already have access to all the features, fixes, and other functionality included in the latest <Constant name="core" /> version! If you have selected the **Compatible** release track, you will have access in the next monthly **Compatible** release after the <Constant name="core" /> v1.11 final release.

## New and changed features and functionality

New features and functionality available in <Constant name="core" /> v1.11

### User-defined functions (UDFs)

dbt Core v1.11 introduces support for user-defined functions (UDFs), which enable you to define and register custom functions in your warehouse. Like macros, UDFs promote code reuse, but they are objects in the warehouse so you can reuse the same logic in tools outside dbt.

Key features include:

- **Define UDFs as first-class dbt resources**: Create UDF files in a `functions/` directory with corresponding YAML configuration.
- **Execution**: Create, update, and rename UDFs as part of DAG execution using `dbt build --select "resource_type:function"`
- **DAG integration**: When executing `dbt build`, UDFs are built before models that reference them, ensuring proper dependency management.
- **New `function()` macro**: Reference UDFs in your models using the `{{ function('function_name') }}` Jinja macro.
- **Deferral**: When you run a dbt command with `--defer` and `--state`, `function()` calls resolve to the UDF in the state manifest, so you can run models that depend on UDFs without building those UDFs first.

Read more about UDFs, including prerequisites and how to define and use them in the [UDF documentation](/docs/build/udfs).

### `DBT_ENGINE_` prefix for environment variables

Engine configuration environment variables use the `DBT_ENGINE_` prefix. For example, `DBT_STATE` becomes `DBT_ENGINE_STATE`, `DBT_PROJECT_DIR` becomes `DBT_ENGINE_PROJECT_DIR`, and so on. Refer to [About flags (global configs)](/reference/global-configs/about-global-configs) for the full mapping.

### Managing changes to legacy behaviors

<Constant name="core" /> v1.11 introduces new flags for [managing changes to legacy behaviors](/reference/global-configs/behavior-changes). You may opt into recently introduced changes (disabled by default), or opt out of mature changes (enabled by default), by setting `true` / `false` values, respectively, for `flags` in `dbt_project.yml`.

You can read more about each of these behavior changes in the following links:

- (Introduced, disabled by default) [`require_unique_project_resource_names`](/reference/global-configs/behavior-changes#unique-project-resource-names). This flag is set to `false` by default. With this setting, if two unversioned resources in the same package share the same name, dbt continues to run and raises a [`DuplicateNameDistinctNodeTypesDeprecation`](/reference/deprecations#duplicatenamedistinctnodetypesdeprecation) warning. When set to `true`, dbt raises a `DuplicateResourceNameError` error.

- (Introduced, disabled by default) [`require_ref_searches_node_package_before_root`](/reference/global-configs/behavior-changes#package-ref-search-order). This flag is set to `false` by default. With this setting, when dbt resolves a `ref()` in a package model, it searches for the referenced model in the root project _first_, then in the package where the model is defined. When set to `true`, dbt searches the package where the model is defined _before_ searching the root project.

### Deprecation warnings enabled by default

Deprecation warnings from JSON schema validation are now enabled by default when validating your YAML configuration files (such as `schema.yml` and `dbt_project.yml`) for projects running using the Snowflake, Databricks, BigQuery, and Redshift adapters.

These warnings help you proactively identify and update deprecated configurations (such as misspelled config keys, deprecated properties, or incorrect data types).

You'll see the following deprecation warnings by default:
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
- The `cluster_by` configuration is supported in dynamic tables. For more information, see [Dynamic table clustering](/reference/resource-configs/snowflake-configs#dynamic-table-clustering).
- The `immutable_where` configuration is supported in dynamic tables. For more information, see [Snowflake configurations](/reference/resource-configs/snowflake-configs#immutable-where).

### BigQuery

- To improve performance, dbt can issue a single batch query when calculating source freshness through metadata, instead of executing one query per source. To enable this feature, set [bigquery_use_batch_source_freshness](/reference/global-configs/bigquery-changes#the-bigquery_use_batch_source_freshness-flag) to `true`.

### Redshift

- The new `datasharing` profile credential enables `dbt-redshift` to use Redshift-native metadata commands (`SHOW` commands such as `SHOW TABLES` and `SHOW COLUMNS`) instead of PostgreSQL catalog tables such as `pg_*` and `information_schema`. This supports cross-database and cross-cluster access with [Redshift Datasharing](https://docs.aws.amazon.com/redshift/latest/dg/datashare-overview.html). For configuration details, refer to [Redshift setup](/docs/local/connect-data-platform/redshift-setup#datasharing).<Lifecycle status="beta" />

### Spark

- New profile configurations have been added to enhance [retry handling for PyHive connections](/reference/resource-configs/spark-configs#retry-handling-for-pyhive-connections):
  - `poll_interval`: Controls how frequently the adapter polls the Thrift server to check if an async query has completed.
  - `query_timeout`: Adds an overall timeout (in seconds) for query execution. If a query exceeds the set duration during polling, it raises a `DbtRuntimeError`. This helps prevent indefinitely hanging queries.
  - `query_retries`: Handles connection loss during query polling by automatically retrying.

## Quick hits

You will find these quick hits in dbt Core v1.11:
- The [`--sqlparse`](/reference/global-configs/sqlparse) flag sets [`sqlparse`](https://sqlparse.readthedocs.io/en/latest/api.html#security-and-performance-considerations) `MAX_GROUPING_DEPTH` and `MAX_GROUPING_TOKENS` when dbt parses SQL during compilation.
- The `dbt ls` command can now write out nested keys. This makes it easier to debug and troubleshoot your project. Example: `dbt ls --output json --output-keys config.materialized`
- Manifest metadata now includes `run_started_at`, providing better tracking of when dbt runs were initiated.
- When a model is disabled, unit tests for that model are automatically disabled as well.
- You can use the new [`config.meta_get()`](/reference/dbt-jinja-functions/config#configmeta_get) and [`config.meta_require()`](/reference/dbt-jinja-functions/config#configmeta_require) functions to access custom configurations stored under `meta`. These functions have been backported to <Constant name="core" /> v1.10. 


