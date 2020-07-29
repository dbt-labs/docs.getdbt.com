---
title: "Upgrading to 0.18.0 (prerelease)"

---

:::info Prerelease

dbt v0.18.0 is currently in beta. Please post in the dbt Slack #prereleases channel
if you uncover any bugs or issues.

:::

dbt v0.18.0 introduces several new features around model selection.

## Articles:

 - [Changelog](https://github.com/fishtown-analytics/dbt/blob/dev/marian-anderson/CHANGELOG.md)

## Breaking changes

Please be aware of the following changes in v0.18.0. While breaking, we do not expect these to affect the majority of projects.

### Adapter macros

* Previously, dbt put macros from all installed plugins into the namespace. This version of dbt will not include adapter plugin macros unless they are from the currently-in-use adapter or one of its dependencies.

## New and changed documentation

**Core**
- [model selection syntax](model-selection-syntax)
- [`dbt ls`](commands/list)
