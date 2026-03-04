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
- [<Constant name="core" /> CLI Installation guide](/docs/core/installation-overview)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud#release-tracks)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x. Any behavior changes will be accompanied by a [behavior change flag](/reference/global-configs/behavior-changes#behavior-change-flags) to provide a migration window for existing projects. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

<Constant name="cloud" /> provides the functionality from new versions of <Constant name="core" /> via [release tracks](/docs/dbt-versions/cloud-release-tracks) with automatic upgrades. If you have selected the **Latest** release track in <Constant name="cloud" />, you already have access to all the features, fixes, and other functionality included in the latest <Constant name="core" /> version! If you have selected the **Compatible** release track, you will have access to the next monthly **Compatible** release after the <Constant name="core" /> v1.12 final release.

We continue to recommend explicitly installing both `dbt-core` and `dbt-<youradapter>`. This may become required for a future version of dbt. For example:

```sql
python3 -m pip install dbt-core dbt-snowflake
```

## New and changed features and functionality

**Coming soon**

### Managing changes to legacy behaviors

<Constant name="core" /> v1.12 introduces new flags for [managing changes to legacy behaviors](/reference/global-configs/behavior-changes). You may opt into recently introduced changes (disabled by default), or opt out of mature changes (enabled by default), by setting `True` / `False` values, respectively, for `flags` in `dbt_project.yml`.

You can read more about each of these behavior changes in the following links:

- (Introduced, disabled by default) [`require_valid_schema_from_generate_schema_name`](/reference/global-configs/behavior-changes#valid-schema-from-generate_schema_name). This flag is set to `False` by default. With this setting, dbt raises the [`GenerateSchemaNameNullValueDeprecation`](/reference/deprecations#generateschemanamenullvaluedeprecation) warning when a custom `generate_schema_name` macro returns a `null` value. When set to `True`, dbt enforces stricter validation and raises a parsing error instead of a warning.

## Adapter-specific features and functionalities

### BigQuery

- Added the [`bigquery_reject_wildcard_metadata_source_freshness`](/reference/global-configs/bigquery-changes#the-bigquery_reject_wildcard_metadata_source_freshness-flag) flag. When you set this flag to `True`, dbt raises a `DbtRuntimeError` if you run metadata-based source freshness checks with wildcard table identifiers (for example, `events_*`), preventing incorrect freshness results.
- You can configure BigQuery job link logging with `job_link_info_level_log`. By default, dbt logs job links at the debug level. To log job links at the info level, set `job_link_info_level_log: true` in your BigQuery profile. This makes job links visible in dbt logs for easier access to the BigQuery console. For more information, see [BigQuery setup](/docs/core/connect-data-platform/bigquery-setup#job_link_info_level_log).
- You can set `job_execution_timeout_seconds` per model, snapshot, seed, or test, in addition to the profile-level configuration. The per-resource value takes precedence over the default value set in the profile level. For more information, see [BigQuery setup](/docs/core/connect-data-platform/bigquery-setup#job_execution_timeout_seconds).

### Redshift

- Added support for the `query_group` session parameter, allowing dbt to tag queries for Redshift Workload Manager routing and query logging. When configured in a profile, dbt sets `query_group` when opening a connection and the value applies for the duration of that session. You can also configure `query_group` at the model level to temporarily override the default value for a specific model, and dbt reverts the value at the end of model materialization. For more information, see [Redshift configurations](/reference/resource-configs/redshift-configs#session-configuration).

## Quick hits

**Coming soon**
