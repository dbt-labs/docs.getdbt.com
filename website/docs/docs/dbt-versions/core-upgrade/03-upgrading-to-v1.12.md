---
title: "Upgrading to v1.12"
id: upgrading-to-v1.12
description: New features and changes in dbt Core v1.12
displayed_sidebar: "docs"
---

# Upgrading to v1.12

:::info Beta coming soon

<Constant name="core" /> v1.12 is not yet available in beta. We will update this guide when it becomes available.

:::

## Resources
- <Constant name="core" /> v1.12 changelog (coming soon)
- [<Constant name="core" /> CLI Installation guide](/docs/local/install-dbt)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud#release-tracks)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x. Any behavior changes will be accompanied by a [behavior change flag](/reference/global-configs/behavior-changes#behavior-change-flags) to provide a migration window for existing projects. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

<Constant name="dbt" /> provides the functionality from new versions of <Constant name="core" /> via [release tracks](/docs/dbt-versions/cloud-release-tracks) with automatic upgrades. If you have selected the **Latest** release track in <Constant name="dbt" />, you already have access to all the features, fixes, and other functionality included in the latest <Constant name="core" /> version! If you have selected the **Compatible** release track, you will have access to the next monthly **Compatible** release after the <Constant name="core" /> v1.12 final release.

We continue to recommend explicitly installing both `dbt-core` and `dbt-<youradapter>`. This may become required for a future version of dbt. For example:

```sql
python3 -m pip install dbt-core dbt-snowflake
```

## New and changed features and functionality

### Compiled SQL for snapshots <Lifecycle status="beta" />

`dbt compile` writes compiled SQL for [snapshots](/docs/build/snapshots) to `target/compiled/`, consistent with models, tests, and analyses. Each snapshot gets its own output file, named from the snapshot identifier, so multiple snapshot blocks in the same source file no longer share one compiled path.

For more information, refer to [About dbt compile](/reference/commands/compile).

### Support for `vars.yml` <Lifecycle status="beta" />

You can use the [`vars.yml`](/docs/build/project-variables#defining-variables-in-varsyml) file, located at the project root, to define project variables. This keeps variable definitions in one place and helps simplify `dbt_project.yml`. Variables defined in `vars.yml` are parsed _before_ `dbt_project.yml`, so you can reference them in `dbt_project.yml` using `{{ var('...') }}`. You can continue to define variables in `dbt_project.yml` as before, but you cannot define variables in both files. For details and precedence, refer to [Project variables](/docs/build/project-variables).

### Managing changes to legacy behaviors

<Constant name="core" /> v1.12 introduces new flags for [managing changes to legacy behaviors](/reference/global-configs/behavior-changes). You may opt into recently introduced changes (disabled by default), or opt out of mature changes (enabled by default), by setting `True` / `False` values, respectively, for `flags` in `dbt_project.yml`.

You can read more about each of these behavior changes in the following links:

- (Introduced, disabled by default) [`require_valid_schema_from_generate_schema_name`](/reference/global-configs/behavior-changes#valid-schema-from-generate_schema_name). This flag is set to `False` by default. With this setting, dbt raises the [`GenerateSchemaNameNullValueDeprecation`](/reference/deprecations#generateschemanamenullvaluedeprecation) warning when a custom `generate_schema_name` macro returns a `null` value. When set to `True`, dbt enforces stricter validation and raises a parsing error instead of a warning.
- (Introduced, disabled by default) [`require_sql_header_in_test_configs`](/reference/global-configs/behavior-changes#sql_header-in-data-tests). When set to `True`, you can set [`sql_header`](/reference/resource-configs/sql_header) in the `config` of a generic data test at the model or column level in your `properties.yml` file. For more information, refer to [Data test configurations](/reference/data-test-configs).

## Adapter-specific features and functionalities

### Snowflake

- You can create Snowflake dynamic tables as transient (no [Fail-safe period](https://docs.snowflake.com/en/user-guide/data-failsafe)) by setting the [`transient`](/reference/resource-configs/snowflake-configs#transient-dynamic-tables) config on models. 

    When `transient` is not set on a model, the [`snowflake_default_transient_dynamic_tables`](/reference/global-configs/snowflake-changes#the-snowflake_default_transient_dynamic_tables-flag) flag controls the default. Set this flag to `True` to make all dynamic tables transient by default.

### BigQuery

- Added the [`bigquery_reject_wildcard_metadata_source_freshness`](/reference/global-configs/bigquery-changes#the-bigquery_reject_wildcard_metadata_source_freshness-flag) flag. When you set this flag to `True`, dbt raises a `DbtRuntimeError` if you run metadata-based source freshness checks with wildcard table identifiers (for example, `events_*`), preventing incorrect freshness results.
- You can configure BigQuery job link logging with `job_link_info_level_log`. By default, dbt logs job links at the debug level. To log job links at the info level, set `job_link_info_level_log: true` in your BigQuery profile. This makes job links visible in dbt logs for easier access to the BigQuery console. For more information, see [BigQuery setup](/docs/local/connect-data-platform/bigquery-setup#job_link_info_level_log).
- You can set `job_execution_timeout_seconds` per model, snapshot, seed, or test, in addition to the profile-level configuration. The per-resource value takes precedence over the default value set in the profile level. For more information, refer to [BigQuery setup](/docs/local/connect-data-platform/bigquery-setup#job_execution_timeout_seconds).

### Redshift

- Added support for the `query_group` session parameter, allowing dbt to tag queries for Redshift Workload Manager routing and query logging. When configured in a profile, dbt sets `query_group` when opening a connection and the value applies for the duration of that session. You can also configure `query_group` at the model level to temporarily override the default value for a specific model, and dbt reverts the value at the end of model materialization. For more information, see [Redshift configurations](/reference/resource-configs/redshift-configs#session-configuration).

## Quick hits

**Coming soon**
