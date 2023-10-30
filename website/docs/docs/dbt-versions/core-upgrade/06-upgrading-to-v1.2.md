---
title: "Upgrading to v1.2"
description: New features and changes in dbt Core v1.2
---

import UpgradeMove from '/snippets/_upgrade-move.md';

<UpgradeMove />

### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.2.latest/CHANGELOG.md)
- [CLI Installation guide](/docs/core/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)

## What to know before upgrading

There are no breaking changes for code in dbt projects and packages. We are committed to providing backwards compatibility for all versions 1.x. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### For consumers of dbt artifacts (metadata)

The manifest schema version has been updated to `v6`. The relevant changes are:
- Change to `config` default, which includes a new `grants` property with default value `{}`
- Addition of a `metrics` property, to any node which could reference metrics using the `metric()` function

For users of [state-based selection](/reference/node-selection/syntax#about-node-selection): This release also includes new logic declaring forwards compatibility for older manifest versions. While running dbt Core v1.2, it should be possible to use `state:modified --state ...` selection against a manifest produced by dbt Core v1.0 or v1.1.

## For maintainers of adapter plugins

See GitHub discussion [dbt-labs/dbt-core#5468](https://github.com/dbt-labs/dbt-core/discussions/5468) for detailed information

## New and changed functionality

- **[Grants](/reference/resource-configs/grants)** are natively supported in `dbt-core` for the first time. That support extends to all standard materializations, and the most popular adapters. If you already use hooks to apply simple grants, we encourage you to use built-in `grants` to configure your models, seeds, and snapshots instead. This will enable you to [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) up your duplicated or boilerplate code.
- **[Metrics](/docs/build/metrics)** now support an `expression` type (metrics-on-metrics), as well as a `metric()` function to use when referencing metrics from within models, macros, or `expression`-type metrics. For more information on how to use expression metrics, check out the [**`dbt_metrics` package**](https://github.com/dbt-labs/dbt_metrics)
- **[dbt-Jinja functions](/reference/dbt-jinja-functions)** now include the [`itertools` Python module](/reference/dbt-jinja-functions/modules#itertools), as well as the [set](/reference/dbt-jinja-functions/set) and [zip](/reference/dbt-jinja-functions/zip) functions.
- **[Node selection](/reference/node-selection/syntax)** includes a [file selection method](/reference/node-selection/methods#the-file-method) (`-s model.sql`), and [yaml selector](/reference/node-selection/yaml-selectors) inheritance.
- **[Global configs](/reference/global-configs/about-global-configs)** now include CLI flag and environment variable settings for [`target-path`](/reference/project-configs/target-path) and [`log-path`](/reference/project-configs/log-path), which can be used to override the values set in `dbt_project.yml`

### Specific adapters

- [Postgres](/docs/core/connect-data-platform/postgres-setup) and [Redshift](/docs/core/connect-data-platform/redshift-setup) profiles support a `retries` config, if dbt encounters an operational error or timeout when opening a connection. The default is 1 retry.
