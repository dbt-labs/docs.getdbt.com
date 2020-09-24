---
title: "Upgrading to 0.19.0"

---

:::info Prerelease

dbt v0.19.0 is currently in development. Please post in dbt Slack #prereleases with questions or issues.

:::

### Resources

- [Changelog](https://github.com/fishtown-analytics/dbt/blob/dev/kiyoshi-kuromiya/CHANGELOG.md)

## Breaking changes

Please be aware of the following changes in v0.19.0, which are most relevant to
projects or developers who consume dbt artifacts.

## New features

### Snapshots
- If the config `invalidate_hard_deletes` is enabled, `dbt snapshot` will update records that no longer exist

## New and changed documentation

**Core**
- [artifacts](artifacts)
- [snapshots](snapshots) ([invalidate_hard_deletes](invalidate_hard_deletes))
