---
title: "Upgrading to v1.2 (prerelease)"
---
### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/main/CHANGELOG.md)
- [CLI Installation guide](/dbt-cli/install/overview)
- [Cloud upgrade guide](/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version)

<Snippet src="available-prerelease-beta-banner" />

## Breaking changes

There are no breaking changes for end users of dbt. We are committed to providing backwards compatibility for all versions 1.x. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### For consumers of dbt artifacts (metadata)

The manifest schema version has been updated to `v6`. The relevant changes are:
- Change to `config` default, which includes a new `grants` property with default value `{}`
- Addition of a `metrics` property, to any node which could reference metrics using the `metric()` function

For users of [state-based selection](understanding-state): This release also includes new logic declaring forwards compatibility for older manifest versions. While running dbt Coree v1.2, it should be possible to use `state:modified --state ...` selection against a manifest produced by dbt Core v1.0 or v1.1.

## For maintainers of adapter plugins

See GitHub discussion [dbt-labs/dbt-core#5468](https://github.com/dbt-labs/dbt-core/discussions/5468) for detailed information

## New and changed documentation

- **[Grants](/reference/resource-configs/grants)** are natively supported in `dbt-core` for the first time. That support extends to all standard materializations, and the most popular adapters. If you already use hooks to apply simple grants, we encourage you to use built-in `grants` to configure your models, seeds, and snapshots instead. This will enable you to [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) up your duplicated or boilerplate code.
- **[dbt-Jinja functions](reference/dbt-jinja-functions)** now include the [`itertools` Python module](dbt-jinja-functions/modules#itertools), as well as the [set](dbt-jinja-functions/set) and [zip](dbt-jinja-functions/zip) functions.
- **[Node selection](node-selection/syntax)** includes a [file selection method](node-selection/methods#the-file-method) (`-s model.sql`), and [yaml selector](node-selection/yaml-selectors) inheritance.
- **[Global configs](global-configs)** now include CLI flag and environment variable settings for [`target-path`](target-path) and [`log-path`](log-path), which can be used to override the values set in `dbt_project.yml`
- **[Metrics](building-a-dbt-project/metrics)** now support an `expression` type (metrics-on-metrics), as well as a `metric()` function to use when referencing metrics from within models, macros, or `expression`-type metrics. For more information how to use expression metrics, please reference the [**`dbt_metrics` package**](https://github.com/dbt-labs/dbt_metrics)


https://github.com/dbt-labs/docs.getdbt.com/labels/dbt-core%20v1.2
