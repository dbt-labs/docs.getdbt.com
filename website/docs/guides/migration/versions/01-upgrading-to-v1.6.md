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

**Coming soon**


## New and changed documentation

[`dbt retry`](/reference/commands/retry) is a new command that executes the previously run command from the point of failure. This convenient command enables you to continue a failed command without rebuilding all upstream dependencies. 

**Materialized view** support (for model and project configs) has been added for three data warehouses:
    - [Bigquery](/reference/resource-configs/bigquery-configs#materialized-view)
    - [Postgres](/reference/resource-configs/postgres-configs#materialized-view)
    - [Redshift](/reference/resource-configs/redshift-configs#materialized-view)

[**Namespacing:**](/faqs/Models/unique-model-names) Model names can be duplicated across different namespaces (packages/projects), so long as they are unique within each package/project. We strongly encourage using [two-argument `ref`](/reference/dbt-jinja-functions/ref#two-argument-variant) when referencing a model from a different package/project.

[**Project dependencies**](project-dependencies): Introduce `dependencies.yml`. Allow enforcing model access (public vs. protected/private) across project/package boundaries. Enable cross-project `ref` of public models, without requiring the installation of upstream source code, as a feature of dbt Cloud Enterprise.

### Quick hits

More consistency and flexibility around packages! Resources defined in a package will respect variable and global macro definitions within the scope of that package.
- `vars` defined in a package's `dbt_project.yml` are now available in the resolution order when compiling nodes in that package, though CLI `--vars` and the root project's `vars` will still take precedence. See ["Variable Precedence"](/docs/build/project-variables#variable-precedence) for details.
- `generate_x_name` macros (defining custom rules for database, schema, alias naming) follow the same pattern as other "global" macros for package-scoped overrides. See [macro dispatch](/reference/dbt-jinja-functions/dispatch) for an overview of the patterns that are possible.
