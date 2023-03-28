---
title: "Trying v1.5 (prerelease)"
description: New features and changes in dbt Core v1.5
---

:::info
v1.5 is currently available as a **beta prerelease.** Availability in dbt Cloud coming soon!
:::

### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/main/CHANGELOG.md)
- [CLI Installation guide](/docs/core/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)
- [Release schedule](https://github.com/dbt-labs/dbt-core/issues/6715)

:::info

Planned release date: April 26, 2023

:::

dbt Core v1.5 is a feature release with two significant additions planned:
1. Models as APIs &mdash; the first phase of [multi-project deployments](https://github.com/dbt-labs/dbt-core/discussions/6725)
2. An initial Python API for dbt-core supporting programmatic invocations at parity with the CLI.

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x, with the exception of any changes explicitly mentioned below. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### Breaking changes

As part of our refactor of `dbt-core` internals, we must make precise changes to runtime configuration. The net result of these changes is more practical configuration options, clearer documentation, cleaner APIs, and a more legible codebase.

Wherever possible, we will provide backward compatibility and deprecation warnings for at least one minor version before actually removing the old functionality. In those cases, we still reserve the right to fully remove the backward-compatible functionality in a future v1.x minor version of `dbt-core`.

Changes planned for v1.5:
- Renaming ["global configs"](global-configs) for consistency ([dbt-core#6903](https://github.com/dbt-labs/dbt-core/issues/6903))
- Moving `log-path` and `target-path` out of `dbt_project.yml` for consistency with other global configs ([dbt-core#6882](https://github.com/dbt-labs/dbt-core/issues/6882))
- As described in [dbt-core#7169](https://github.com/dbt-labs/dbt-core/pull/7169), command-line parameters that could be silent before will no longer be silent. See [dbt-labs/dbt-core#7158](https://github.com/dbt-labs/dbt-core/issues/7158) and [dbt-labs/dbt-core#6800](https://github.com/dbt-labs/dbt-core/issues/6800) for more examples of the behavior we are fixing.

### For consumers of dbt artifacts (metadata)

The manifest schema version will be updated to `v9`. Specific changes to be noted here.

### For maintainers of adapter plugins

Coming soon: GH discussion detailing interface changes and offering a forum for Q&A

## New and changed documentation

:::caution Under construction 🚧
More to come!
:::

### Publishing models as APIs
- [Model contracts](model-contracts) ([#2839](https://github.com/dbt-labs/docs.getdbt.com/issues/2839))
- [Model access](model-access) ([#2840](https://github.com/dbt-labs/docs.getdbt.com/issues/2840))
- [Model versions](model-versions) ([#2841](https://github.com/dbt-labs/docs.getdbt.com/issues/2841))

### dbt-core Python API
- Auto-generated documentation ([#2674](https://github.com/dbt-labs/docs.getdbt.com/issues/2674)) for dbt-core CLI & Python API for programmatic invocations
