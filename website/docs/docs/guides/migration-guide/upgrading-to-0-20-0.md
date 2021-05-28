---
title: "Upgrading to 0.20.0"

---

:::info Beta
`dbt v0.20.0b1` is currently available as a beta prerelease. Please help us by testing, and post in [#dbt-prereleases](https://getdbt.slack.com/archives/C016X6ABVUK) with questions or issues.
:::

### Resources

- [Changelog](https://github.com/fishtown-analytics/dbt/blob/develop/CHANGELOG.md)

## Breaking changes

### For dbt users

Schema test macros are now `test` blocks, which we're going to start calling "generic tests." There is backwards compatibility for schema test macros prefixed `test_`, and you can still use them without switching to test blocks (though we hope you will soon!). The biggest breaking change is that _all_ tests now return a set of failing rows, rather than a single numeric value. This resolved a longstanding inconsistency between schema tests and data tests.

### For dbt plugin maintainers

Macro dispatch now includes "parent" adapter implementations before using the default implementation. If you maintain an adapter plugin that inherits from another adapter (e.g. `dbt-redshift` inherits from `dbt-postgres`), `adapter.dispatch()` will now look for prefixed macros in the following order: `redshift__`, `postgres__`, `default__`.

## New and changed documentation

### Tests
- [Building a dbt Project: tests](building-a-dbt-project/tests)
- [Test Configs](test-configs)
- [Test properties](resource-properties/tests)
- [Node Selection](node-selection/syntax) (with updated [test selection examples](test-selection-examples))
- [Writing custom generic tests](custom-generic-tests)

### Elsewhere in Core
- The [graph](graph) Jinja context variable includes `exposures`
- [Packages](package-management) can now be installed from git with a specific commit hash as the revision, or via sparse checkout if the dbt project is located in a `subdirectory`.
- [adapter.dispatch](adapter#dispatch) includes parent adapters when searching for macro implementations.

### Plugins
- New partition-related [BigQuery configs](bigquery-configs#additional-partition-configs): `require_partition_filter` and `partition_expiration_days`
- On BigQuery, dbt can now add [query comment](query-comment) items as job labels
- Snowflake and BigQuery [incremental models](configuring-incremental-models#strategy-specific-configs) using the `merge` strategy accept a new optional config, `merge_update_columns`.
- [Postgres configs](postgres-configs) now include first-class support for `indexes`
