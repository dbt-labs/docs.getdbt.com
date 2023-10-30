---
title: "Upgrading to v0.20"

---

import UpgradeMove from '/snippets/_upgrade-move.md';

<UpgradeMove />

:::caution Unsupported version
dbt Core v0.20 has reached the end of critical support. No new patch versions will be released, and it will stop running in dbt Cloud on June 30, 2022. Read ["About dbt Core versions"](/docs/dbt-versions/core) for more details.
:::

### Resources

- [Discourse](https://discourse.getdbt.com/t/2621)
- [Release notes](https://github.com/dbt-labs/dbt-core/releases/tag/v0.20.0)
- [Full changelog](https://github.com/dbt-labs/dbt-core/blob/0.20.latest/CHANGELOG.md)

## Breaking changes

- Schema test macros are now `test` blocks, which we're going to start calling "generic tests." There is backwards compatibility for schema test macros prefixed `test_`, and you can still use them without switching to test blocks (though we hope you will soon!). The biggest breaking change is that _all_ tests now return a set of failing rows, rather than a single numeric value. This resolved a longstanding inconsistency between schema tests and data tests.
- **For package maintainers (and some users):** The syntax for `adapter.dispatch()` has changed; see linked documentation below.
- **For adapter plugin maintainers:** Macro dispatch now includes "parent" adapter implementations before using the default implementation. If you maintain an adapter plugin that inherits from another adapter (e.g. `dbt-redshift` inherits from `dbt-postgres`), `adapter.dispatch()` will now look for prefixed macros in the following order: `redshift__`, `postgres__`, `default__`.
- **For artifact users:** The [manifest](/reference/artifacts/manifest-json) and [run_results](/reference/artifacts/run-results-json) now use a v2 schema. What changed: there are a handful of new properties in the manifest; the number of failures for a test has been moved to a new property `failures`, so that `message` can be the human-readable failure message.

## New and changed documentation

### Tests

- [Building a dbt Project: tests](/docs/build/tests)
- [Test Configs](/reference/test-configs)
- [Test properties](/reference/resource-properties/tests)
- [Node Selection](/reference/node-selection/syntax) (with updated [test selection examples](/reference/node-selection/test-selection-examples))
- [Writing custom generic tests](/guides/best-practices/writing-custom-generic-tests)

### Elsewhere in Core
- [Parsing](/reference/parsing): rework of partial parsing, introduction of experimental parser
- The [graph](/reference/dbt-jinja-functions/graph) Jinja context variable includes `exposures`
- [Packages](/docs/build/packages) can now be installed from git with a specific commit hash as the revision, or via sparse checkout if the dbt project is located in a `subdirectory`.
- [adapter.dispatch](/reference/dbt-jinja-functions/dispatch) supports new arguments, a new [project-level config](/reference/project-configs/dispatch-config), and includes parent adapters when searching for macro implementations.
- [Exposures](/reference/exposure-properties) support `tags` and `meta` properties

### Plugins
- New partition-related [BigQuery configs](/reference/resource-configs/bigquery-configs#additional-partition-configs): `require_partition_filter` and `partition_expiration_days`
- On BigQuery, dbt can now add [query comment](/reference/project-configs/query-comment) items as job labels
- Snowflake and BigQuery [incremental models](/docs/build/incremental-models#strategy-specific-configs) using the `merge` strategy accept a new optional config, `merge_update_columns`.
- [Postgres configs](/reference/resource-configs/postgres-configs) now include first-class support for `indexes`
