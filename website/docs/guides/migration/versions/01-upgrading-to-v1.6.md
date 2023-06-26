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

[**Namespacing:**](/faqs/Models/unique-model-names) Model names can be duplicated across different namespaces (packages/projects), so long as they are unique within each package/project. We strongly encourage using [two-argument `ref`](/reference/dbt-jinja-functions/ref#two-argument-variant) when referencing a model from a different package/project.

### Quick hits

**Coming Soon**