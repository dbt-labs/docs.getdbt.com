---
title: "Upgrading to 0.19.0"

---

import UpgradeMove from '/snippets/_upgrade-move.md';

<UpgradeMove />

### Resources

- [Discourse](https://discourse.getdbt.com/t/1951)
- [Release notes](https://github.com/dbt-labs/dbt-core/releases/tag/v0.19.0)
- [Full changelog](https://github.com/dbt-labs/dbt-core/blob/0.19.latest/CHANGELOG.md)

## Breaking changes

### For dbt users

Please be aware of the following changes in v0.19.0:

1. dbt artifacts have a new schema. From here on, artifact schemas are officially versioned at **schemas.getdbt.com**. Future breaking changes will be limited to minor version releases. Some dbt classes, such as the `Result` object, have associated breaking changes.
2. Defer, a beta feature introduced in v0.18.0, has subtly changed to better support the "Slim CI" use case.
3. The `call statement` block returns a structured `response` instead of a `status` string, though they print identically. If you previously accessed `statement['status']` within a custom macro or materalization, you should now use `statement['response']`.

See the docs below for more details. We don't expect these to require action in most projects.

#### Deprecations

Removed support for `config-version: 1` of dbt_project.yml, which was deprecated in v0.17.0. Use `config-version: 2` in all projects and installed packages. Otherwise, dbt will raise an error. See docs on [config-version](/reference/project-configs/config-version) and the [v0.17.0 Migration Guide](/guides/migration/versions) for details.

### For dbt plugin maintainers

(You know who you are!)

Related to change #3 above: The `results` context and `run_results.json` artifact include a new unstructured dictionary called `adapter_response`. This reflects structured information returned by the database after dbt runs the "main" query for a model, seed, snapshot, etc.

By default, this dict accepts keys such as `code` (`OK`, `SUCCESS`, `CREATE TABLE`, etc) and `rows_affected` (integer). You can add custom arguments to reflect information specific to your adapter. For instance, `dbt-bigquery` populates an additional argument, `bytes_processed`.

As part of this change:
- the `SQLConnectionManager` method `get_status` has been renamed to `get_response`
- `execute` now returns a tuple instead of a string

See [dbt#2961](https://github.com/dbt-labs/dbt-core/pull/2961) for full implementation details. While `adapter_response` is not yet populated by tests or source freshness checks, we hope to add those in a future release ([dbt#2964](https://github.com/dbt-labs/dbt-core/issues/2964)).

## New and changed documentation

### Core
- [dbt Artifacts](/docs/deploy/artifacts): The <Term id="json" /> artifacts produced by dbt—manifest, catalog, run results, and sources—are simpler to consume and more clearly documented.
- [dbt Classes](/reference/dbt-classes#result-objects), [on-run-end Context](/reference/dbt-jinja-functions/on-run-end-context#results): The `Result` object has a new schema, in line with changes to `run_results.json`.
- [Statement blocks](/reference/dbt-jinja-functions/statement-blocks): The `call statement` result `status` string is now a structured object named `response`.
- [Snapshots](/docs/build/snapshots#snapshot-configurations): If the config `invalidate_hard_deletes` is enabled, `dbt snapshot` will update records whose unique key no longer exist in the snapshot query. Should those uniquely identified records "revive," `dbt snapshot` will re-add them.
- [YAML selectors](/reference/node-selection/yaml-selectors) support a `description` property and record their expanded dictionary representations in the manifest.
- [Modules](/reference/dbt-jinja-functions/modules): The regex python module, `re`, is available in dbt's Jinja context.
- [parse](/reference/commands/parse): New command to parse a dbt project and write detailed timing info.

#### State
- [About state](/reference/node-selection/syntax#about-node-selection): New docs outlining the conceptual background of state-informed runs, as well as the [known caveats](/reference/node-selection/state-comparison-caveats) for state comparison. In v0.19.0, dbt is a little bit smarter at identifying `state:modified` "false positives" that previously resulted from env-based configurations in `dbt_project`.
- [Defer](/reference/node-selection/defer) has changed: Instead of deferring all unselected node references, dbt now defers an unselected node reference _if and only if_ it does not exist in the current environment. Tests can defer their upstream references as well. This better supports the "Slim CI" use case by addressing the current environment's resources across `seed`, `run`, and `test` steps.
- [RPC](/reference/commands/rpc): Added `state` and `defer` as arguments to RPC methods for which it is supported on the CLI.

### BigQuery
- [BigQuery profile](/docs/core/connect-data-platform/bigquery-setup): dbt can connect via OAuth tokens (one-time or refresh), and it can use the default project when connecting via `gcloud` oauth.
- [Hourly, monthly and yearly partitions](/reference/resource-configs/bigquery-configs#partitioning-by-a-date-or-timestamp): With a new `granularity` attribute of the `partition_by` config, dbt can materialize models as tables partitioned by hour, month, or year.

### Spark
- [Spark profile](/docs/core/connect-data-platform/spark-setup): The `thrift` and `http` connection methods require installation of a `PyHive` extra.
