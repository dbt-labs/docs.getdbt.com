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

### UDF



### Managing changes to legacy behaviors

Starting with `v1.10`, you can [manage changes to legacy behaviors](/reference/global-configs/behavior-changes). You may opt into recently introduced changes (disabled by default), or opt out of mature changes (enabled by default), by setting `True` / `False` values, respectively, for `flags` in `dbt_project.yml`.


### Deprecation warnings

Starting with `v1.10`, you began receiving deprecation warnings for dbt code that will become invalid in the future. You can use the [`dbt-autofix` tool](https://github.com/dbt-labs/dbt-autofix) to fix invalid code. 


## Quick hits
