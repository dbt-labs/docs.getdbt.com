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

**Coming soon**
### Session configuration

The Redshift adapter now supports the `query_group` session parameter, enabling dbt runs to tag queries for the Redshift Workload Manager (WLM) and query logging. When configured, dbt sets the `query_group` value when opening a connection and applies it for the duration of that session. Support exists at both the profile and model level, allowing users to specify a default `query_group` for all executions or override it for individual model materializations.

#### Profile-level configuration

Configure `query_group` in your `profiles.yml` to apply a default value to all queries executed using that profile. dbt sets the `query_group` when opening a connection.

<File name="profiles.yml">

```yml
outputs:
  dev:
    type: redshift
    host: CLUSTER_ENDPOINT
    user: REDSHIFT_USER
    password: REDSHIFT_PASSWORD
    dbname: REDSHIFT_DBNAME
    port: 5439
    schema: analytics
    threads: 4
    query_group: QUERY_GROUP_NAME
```

</File>

#### Model-level configuration

Set `query_group` in a model’s `config()` block to override the profile-level value for that model only. The configured value applies for the duration of that model’s materialization.

```sql
{{ config(query_group='my_model_group') }}
select *
from {{ ref('some_source_table') }}
```

#### What SQL dbt executes

When `query_group` is configured, dbt issues a `SET query_group` statement in Redshift to apply the value at the session level.

```sql
SET query_group TO 'query_group'
```

Read more about the [`query_grouo`](https://docs.aws.amazon.com/redshift/latest/dg/r_query_group.html) configuration in the Redshift documentation.

## Quick hits

**Coming soon**
