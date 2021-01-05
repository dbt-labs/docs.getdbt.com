---
title: "Upgrading to 0.19.0"

---

:::info Release Candidate

`dbt v0.19.0-rc1` is currently available. Please help us by testing, and post in [#dbt-prereleases](https://getdbt.slack.com/archives/C016X6ABVUK) with questions or issues.

:::

### Resources

- [Discourse](https://discourse.getdbt.com/t/1951)
- [Changelog](https://github.com/fishtown-analytics/dbt/blob/dev/kiyoshi-kuromiya/CHANGELOG.md)

## Breaking changes

### For dbt users

Please be aware of the following changes in v0.19.0:

- dbt artifacts have a new schema. From here on, artifact schemas are officially versioned at **schemas.getdbt.com**. Future breaking changes will be limited to minor version releases.
- Defer, a beta feature introduced in v0.18.0, has subtly changed to better support the "Slim CI" use case.

See the docs below for more details. We don't expect these to require action in most projects.

### For dbt plugin maintainers

(You know who you are!)

The `results` context and `run_results.json` artifact include a new unstructured dictionary called `adapter_response`. This reflects structured information returned by the database after dbt runs the "main" query for a model, seed, snapshot, etc.

By default, this dict accepts keys such as `code` (`OK`, `SUCCESS`, `CREATE TABLE`, etc) and `rows_affected` (integer). You can add custom arguments to reflect information specific to your adapter. For instance, `dbt-bigquery` populates an additional argument, `bytes_processed`.

As part of this change:
- the `SQLConnectionManager` method `get_status` has been renamed to `get_response`
- `execute` now returns a tuple instead of a string

See [dbt#2961](https://github.com/fishtown-analytics/dbt/pull/2961) for full implementation details. While `adapter_response` is not yet populated by tests or source freshness checks, we hope to add those in a future release ([dbt#2964](https://github.com/fishtown-analytics/dbt/issues/2964)).

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
