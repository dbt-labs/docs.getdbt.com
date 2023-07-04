---
title: "Upgrading to v1.6 (beta)"
description: New features and changes in dbt Core v1.6
---

:::warning Beta Functionality

dbt Core v1.6 is in beta, and the features and functionality on this page are subject to change.

:::

## Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/main/CHANGELOG.md)
- [CLI Installation guide](/docs/core/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)
- [Release schedule](https://github.com/dbt-labs/dbt-core/issues/7481)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x, with the exception of any changes explicitly mentioned below. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### Behavior changes

:::info Action required if your project defines metrics 

The [spec for metrics](https://github.com/dbt-labs/dbt-core/discussions/7456) has changed and now uses [MetricFlow](/docs/build/about-metricflow). 

:::

If your dbt project defines metrics, you'll need to migrate to dbt v1.6 because the YAML spec has moved from dbt_metrics to the MetricFlow. This means any tests you have won't compile on v1.5 or older. 

NEED TO ADD MORE INFO RE: migration script


## New and changed documentation

- [**Build your metrics**](/docs/build/build-metrics-intro) with MetricFlow, a key component of the dbt Semantic Layer. You can define your metrics and build semantic models with MetricFlow, available on the command line (CLI) for dbt Core v1.6 beta or higher.

- [`dbt retry`](/reference/commands/retry) is a new command that executes the previously run command from the point of failure. This convenient command enables you to continue a failed command without rebuilding all upstream dependencies. 

- **Materialized view** support (for model and project configs) has been added for three data warehouses:
    - [Bigquery](/reference/resource-configs/bigquery-configs#materialized-view)
    - [Postgres](/reference/resource-configs/postgres-configs#materialized-view)
    - [Redshift](/reference/resource-configs/redshift-configs#materialized-view)

- [**Namespacing:**](/faqs/Models/unique-model-names) Model names can be duplicated across different namespaces (packages/projects), so long as they are unique within each package/project. We strongly encourage using [two-argument `ref`](/reference/dbt-jinja-functions/ref#two-argument-variant) when referencing a model from a different package/project.

### Quick hits

More consistency and flexibility around packages! Resources defined in a package will respect variable and global macro definitions within the scope of that package.
- `vars` defined in a package's `dbt_project.yml` are now available in the resolution order when compiling nodes in that package, though CLI `--vars` and the root project's `vars` will still take precedence. See ["Variable Precedence"](/docs/build/project-variables#variable-precedence) for details.
- `generate_x_name` macros (defining custom rules for database, schema, alias naming) follow the same pattern as other "global" macros for package-scoped overrides. See [macro dispatch](/reference/dbt-jinja-functions/dispatch) for an overview of the patterns that are possible.


