---
title: "Upgrading to v1.6 (latest)"
description: New features and changes in dbt Core v1.6
id: "upgrading-to-v1.6"
displayed_sidebar: "docs"
---

import UpgradeMove from '/snippets/_upgrade-move.md';

<UpgradeMove />

dbt Core v1.6 has three significant areas of focus:
1. Next milestone of [multi-project deployments](https://github.com/dbt-labs/dbt-core/discussions/6725): improvements to contracts, groups/access, versions; and building blocks for cross-project `ref`
1. Semantic layer re-launch: dbt Core and [MetricFlow](https://docs.getdbt.com/docs/build/about-metricflow) integration
1. Mechanisms to support mature deployment at scale (`dbt clone` and `dbt retry`)

## Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.6.latest/CHANGELOG.md)
- [CLI Installation guide](/docs/core/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)
- [Release schedule](https://github.com/dbt-labs/dbt-core/issues/7481)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x, with the exception of any changes explicitly mentioned below. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### Behavior changes

:::info Action required if your project defines `metrics`

The [spec for metrics](https://github.com/dbt-labs/dbt-core/discussions/7456) has changed and now uses [MetricFlow](/docs/build/about-metricflow). 

:::

If your dbt project defines metrics, you must migrate to dbt v1.6 because the YAML spec has moved from dbt_metrics to MetricFlow. Any tests you have won't compile on v1.5 or older. 

- dbt Core v1.6 does not support Python 3.7, which reached End Of Life on June 23. Support Python versions are 3.8, 3.9, 3.10, and 3.11.
- As part of the [dbt Semantic layer](/docs/use-dbt-semantic-layer/dbt-sl) re-launch (in beta), the spec for `metrics` has changed significantly. Refer to the [migration guide](/guides/migration/sl-migration) for more info on how to migrate to the re-launched dbt Semantic Layer.
- The manifest schema version is now v10.
- dbt Labs is ending support for Homebrew installation of dbt-core and adapters. See [the discussion](https://github.com/dbt-labs/dbt-core/discussions/8277) for more details.

### For consumers of dbt artifacts (metadata)

The [manifest](/reference/artifacts/manifest-json) schema version has been updated to `v10`. Specific changes:
- Addition of `semantic_models` and changes to `metrics` attributes
- Addition of `deprecation_date` as a model property
- Addition of `on_configuration_change` as default node configuration (to support materialized views)
- Small type changes to `contracts` and `constraints`
- Manifest `metadata` includes `project_name`

### For maintainers of adapter plugins

For more detailed information and to ask questions, please read and comment on the GH discussion: [dbt-labs/dbt-core#7958](https://github.com/dbt-labs/dbt-core/discussions/7958).

## New and changed documentation

### MetricFlow

- [**Build your metrics**](/docs/build/build-metrics-intro) with MetricFlow, a key component of the dbt Semantic Layer. You can define your metrics and build semantic models with MetricFlow, available on the command line (CLI) for dbt Core v1.6 beta or higher.

### Materialized views

Supported on:
- [Postgres](/reference/resource-configs/postgres-configs#materialized-view)
- [Redshift](/reference/resource-configs/redshift-configs#materialized-view)
- [Snowflake](/reference/resource-configs/snowflake-configs#dynamic-tables)
- [Databricks](/reference/resource-configs/databricks-configs#materialized-views-and-streaming-tables)

Support for BigQuery coming soon.

### New commands for mature deployment

[`dbt retry`](/reference/commands/retry) executes the previously run command from the point of failure. Rebuild just the nodes that errored or skipped in a previous run/build/test, rather than starting over from scratch.

[`dbt clone`](/reference/commands/clone) leverages each data platform's functionality for creating lightweight copies of dbt models from one environment into another. Useful when quickly spinning up a new development environment, or promoting specific models from a staging environment into production.

### Multi-project collaboration

[**Deprecation date**](/reference/resource-properties/deprecation_date): Models can declare a deprecation date that will warn model producers and downstream consumers. This enables clear migration windows for versioned models, and provides a mechanism to facilitate removal of immature or little-used models, helping to avoid project bloat.

[Model names](/faqs/Models/unique-model-names) can be duplicated across different namespaces (projects/packages), so long as they are unique within each project/package. We strongly encourage using [two-argument `ref`](/reference/dbt-jinja-functions/ref#two-argument-variant) when referencing a model from a different package/project.

More consistency and flexibility around packages. Resources defined in a package will respect variable and global macro definitions within the scope of that package.
- `vars` defined in a package's `dbt_project.yml` are now available in the resolution order when compiling nodes in that package, though CLI `--vars` and the root project's `vars` will still take precedence. See ["Variable Precedence"](/docs/build/project-variables#variable-precedence) for details.
- `generate_x_name` macros (defining custom rules for database, schema, alias naming) follow the same pattern as other "global" macros for package-scoped overrides. See [macro dispatch](/reference/dbt-jinja-functions/dispatch) for an overview of the patterns that are possible.

:::caution Closed Beta - dbt Cloud Enterprise
[**Project dependencies**](/docs/collaborate/govern/project-dependencies): Introduces `dependencies.yml` and dependent `projects` as a feature of dbt Cloud Enterprise. Allows enforcing model access (public vs. protected/private) across project/package boundaries. Enables cross-project `ref` of public models, without requiring the installation of upstream source code.
:::

### Quick hits

- [`state:unmodified` and `state:old`](/reference/node-selection/methods#the-state-method) for [MECE](https://en.wikipedia.org/wiki/MECE_principle) stateful selection
- [`invocation_args_dict`](/reference/dbt-jinja-functions/flags#invocation_args_dict) includes full `invocation_command` as string
- [`dbt debug --connection`](/reference/commands/debug) to test just the data platform connection specified in a profile
- [`dbt docs generate --empty-catalog`](/reference/commands/cmd-docs) to skip catalog population while generating docs
- [`--defer-state`](/reference/node-selection/defer) enables more-granular control 
- [`dbt ls`](/reference/commands/list) adds the Semantic model selection method to allow for `dbt ls -s "semantic_model:*"` and the ability to execute `dbt ls --resource-type semantic_model`.

