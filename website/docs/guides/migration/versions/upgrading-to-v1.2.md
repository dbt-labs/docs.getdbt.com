---
title: "Upgrading to v1.2 (prerelease)"
---
### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/main/CHANGELOG.md)
- [CLI Installation guide](/dbt-cli/install/overview)
- [Cloud upgrade guide](/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version)

:::info Beta
dbt Core v1.2 will soon be available as a **beta prerelease.** Join the #dbt-prereleases channel in the Community Slack so that you're the first to know!
:::

## Breaking changes

There are no breaking changes for end users of dbt. We are committed to providing backwards compatibility for all versions 1.x. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### For maintainers of adapter plugins

We added a collection of ["cross-database macros"](cross-database-macros) to dbt Core v1.2. Default implementations are automatically inherited by adapters and included in the testing suite. Adapter maintainers may need to override the implementation of one or more macros to align with database-specific syntax or optimize performance. For details on the testing suite, see: ["Testing a new adapter"](testing-a-new-adapter).

## New and changed documentation

_Under construction_

https://github.com/dbt-labs/docs.getdbt.com/labels/dbt-core%20v1.2

- [Modules](modules): The `itertools` Python module is available in dbt's Jinja templating context.
