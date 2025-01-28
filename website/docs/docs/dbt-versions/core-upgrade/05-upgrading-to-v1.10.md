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

**Coming soon**

## Quick hits

**Coming soon**