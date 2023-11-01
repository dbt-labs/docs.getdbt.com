---
title: "Upgrading to v1.1"
description: New features and changes in dbt Core v1.1
id: "upgrading-to-v1.1"
displayed_sidebar: "docs"
---

import UpgradeMove from '/snippets/_upgrade-move.md';

<UpgradeMove />

### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.1.latest/CHANGELOG.md)
- [CLI Installation guide](/docs/core/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)

## What to know before upgrading

There are no breaking changes for code in dbt projects and packages. We are committed to providing backwards compatibility for all versions 1.x. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### For maintainers of adapter plugins

We have reworked the testing suite for adapter plugin functionality. For details on the new testing suite, see: [Testing a new adapter](/guides/dbt-ecosystem/adapter-development/4-testing-a-new-adapter).

The abstract methods `get_response` and `execute` now only return `connection.AdapterReponse` in type hints. Previously, they could return a string. We encourage you to update your methods to return an object of class `AdapterResponse`, or implement a subclass specific to your adapter. This also gives you the opportunity to add fields specific to your adapter's query execution, such as `rows_affected` or `bytes_processed`.

### For consumers of dbt artifacts (metadata)

The manifest schema version will be updated to v5. The only change is to the default value of `config` for parsed nodes.

For users of [state-based functionality](/reference/node-selection/syntax#about-node-selection), such as the `state:modified` selector, recall that:

> The `--state` artifacts must be of schema versions that are compatible with the currently running dbt version.

If you have two jobs, whereby one job compares or defers to artifacts produced by the other, you'll need to upgrade both at the same time. If there's a mismatch, dbt will alert you with this error message:

```
Expected a schema version of "https://schemas.getdbt.com/dbt/manifest/v5.json" in <state-path>/manifest.json, but found "https://schemas.getdbt.com/dbt/manifest/v4.json". Are you running with a different version of dbt?
```

## New and changed documentation

[**Incremental models**](/docs/build/incremental-models) can now accept a list of multiple columns as their `unique_key`, for models that need a combination of columns to uniquely identify each row. This is supported by the most common <Term id="data-warehouse">data warehouses</Term>, for incremental strategies that make use of the `unique_key` config (`merge` and `delete+insert`).

[**Generic tests**](/reference/resource-properties/tests) can define custom names. This is useful to "prettify" the synthetic name that dbt applies automatically. It's needed to disambiguate the case when the same generic test is defined multiple times with different configurations.

[**Sources**](/reference/source-properties) can define configuration inline with other `.yml` properties, just like other resource types. The only supported config is `enabled`; you can use this to dynamically enable/disable sources based on environment or package variables.

### Advanced and experimental functionality

**Fresh Rebuilds.** There's a new _experimental_ selection method in town: [`source_status:fresher`](/reference/node-selection/methods#the-source_status-method). Much like the `state:` and `result` methods, the goal is to use dbt metadata to run your DAG more efficiently. If dbt has access to previous and current results of `dbt source freshness` (the `sources.json` artifact), dbt can compare them to determine which sources have loaded new data, and select only resources downstream of "fresher" sources. Read more in [Understanding State](/reference/node-selection/syntax#about-node-selection) and [CI/CD in dbt Cloud](/docs/deploy/continuous-integration).


[**dbt-Jinja functions**](/reference/dbt-jinja-functions) have a new landing page, and two new members:
- [`print`](/reference/dbt-jinja-functions/print) exposes the Python `print()` function. It can be used as an alternative to `log()`, and together with the `QUIET` config, for advanced macro-driven workflows.
- [`selected_resources`](/reference/dbt-jinja-functions/selected_resources) exposes, at runtime, the list of DAG nodes selected by the current task.

[**Global configs**](/reference/global-configs/about-global-configs) include some new additions:

- `QUIET` and `NO_PRINT`, to control which log messages dbt prints to terminal output. For use in advanced macro-driven workflows, such as [codegen](https://hub.getdbt.com/dbt-labs/codegen/latest/).
- `CACHE_SELECTED_ONLY` is an _experimental_ config that can significantly speed up dbt's start-of-run preparations, in cases where you're running only a few models from a large project that manages many schemas.

### For users of specific adapters

**dbt-bigquery** added Support for <Term id="grain">finer-grained</Term> configuration of query timeout and retry when defining your [connection profile](/docs/core/connect-data-platform/bigquery-setup).

**dbt-spark** added support for a [`session` connection method](/docs/core/connect-data-platform/spark-setup#session), for use with a pySpark session, to support rapid iteration when developing advanced or experimental functionality. This connection method is not recommended for new users, and it is not supported in dbt Cloud.

### Dependencies

[Python compatibility](/faqs/Core/install-python-compatibility): dbt Core officially supports Python 3.10
