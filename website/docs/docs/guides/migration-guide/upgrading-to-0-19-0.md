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

- dbt artifacts have a new schema. From here on, artifact schemas are officially versioned at **schemas.getdbt.com**. Future breaking changes will be limited to minor version releases.
- Defer, a beta feature introduced in v0.18.0, has changed to better support the "Slim CI" use case.

## New and changed documentation

### Core
- [dbt-artifacts](dbt-artifacts): The JSON artifacts produced by dbt—manifest, catalog, run results, and sources—are simpler to consume and more clearly documented.
- [snapshots](snapshots) ([invalidate_hard_deletes](invalidate_hard_deletes)): If the config `invalidate_hard_deletes` is enabled, `dbt snapshot` will update records whose unique key no longer exist in the snapshot query. Should those uniquely identified records "revive," `dbt snapshot` will re-add them.
- [YAML selectors](yaml-selectors) support a `description` property and record their expanded dictionary representations in the manifest.
- [modules](modules): The regex python module, `re`, is available in dbt's Jinja context.

#### State
- [Understanding state](understanding-state): New docs outlining the conceptual background of state-informed runs, as well as the [known caveats](state-comparison-caveats) for state comparison. In v0.19.0, dbt is a little bit smarter at identifying `state:modified` "false positives" that previously resulted from env-based configurations in `dbt_project`.
- [Defer](defer) has changed: Instead of deferring all unselected node references, dbt now defers an unselected node reference _if and only if_ it does not exist in the current environment. Tests can defer their upstream references as well. This better supports the "Slim CI" use case by addressing the current environment's resources across `seed`, `run`, and `test` steps.
- [rpc](rpc): Added `state` and `defer` as arguments to RPC methods for which it is supported on the CLI.

### BigQuery
- [bigquery-profile](bigquery-profile): dbt can connect via OAuth tokens (one-time or refresh), and it can use the default project when connecting via `gcloud` oauth.
- [Hourly, monthly and yearly partitions](bigquery-configs#partitioning-by-a-date-or-timestamp): With a new `granularity` attribute of the `partition_by` config, dbt can materialize models as tables partitioned by hour, month, or year.

### Spark
- [spark-profile](spark-profile): The `thrift` and `http` connection methods require installation of a `PyHive` extra.
