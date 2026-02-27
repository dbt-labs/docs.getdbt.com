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
- Added the [`bigquery_reject_wildcard_metadata_source_freshness`](/reference/global-configs/bigquery-changes#the-bigquery_reject_wildcard_metadata_source_freshness-flag) flag. When the flag is set to `True`, dbt raises a `DbtRuntimeError` if metadata-based source freshness checks are used with wildcard table identifiers (for example, `events_*`), preventing incorrect freshness results.

## Quick hits

**Coming soon**
