---
title: "Upgrading to 0.19.0"

---

:::info Prerelease

dbt v0.19.0 is currently in beta. Please post in dbt Slack #dbt-prereleases with questions or issues.

:::

### Resources

- [Changelog](https://github.com/fishtown-analytics/dbt/blob/dev/kiyoshi-kuromiya/CHANGELOG.md)

## Breaking changes

Please be aware of the following changes in v0.19.0:

- dbt artifacts have a new schema. From here on, artifact schemas will be versioned, with breaking
changes limited to minor versions and announced accordingly.

## New features

### Artifacts
- The JSON artifacts produced by dbt—manifest, catalog, run results, and sources—are simpler to consume and more clearly documented.

### State
- dbt is a little bit smarter at identifying `state:modified` "false positives" that previously resulted from env-based config in `dbt_project`.

### Snapshots
- If the config `invalidate_hard_deletes` is enabled, `dbt snapshot` will update records whose unique key no longer exist in the snapshot query. Should those uniquely identified records "revive," `dbt snapshot` will re-add them.

### Database-specific
- BigQuery supports connecting via OAuth tokens

### Docs
- Added select/deselect options to dropdown menus in the bottom bar of the DAG view

### RPC
- Added `state` and `defer` as arguments to the associated command request types

## New and changed documentation

**Core**
- [dbt-artifacts](dbt-artifacts)
- [bigquery-profile](bigquery-profile)
- [rpc](rpc)
- [snapshots](snapshots) ([invalidate_hard_deletes](invalidate_hard_deletes))
- [state](understanding-state)

**BigQuery**
- [`Hourly, monthly and yearly partitions`](bigquery-configs#partitioning-by-a-date-or-timestamp)
