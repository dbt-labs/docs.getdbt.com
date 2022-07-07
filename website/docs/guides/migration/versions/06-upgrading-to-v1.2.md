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

### For maintainers of adapter plugins

We added a collection of ["cross-database macros"](cross-database-macros) to dbt Core v1.2. Default implementations are automatically inherited by adapters and included in the testing suite. Adapter maintainers may need to override the implementation of one or more macros to align with database-specific syntax or optimize performance. For details on the testing suite, see: ["Testing a new adapter"](testing-a-new-adapter).

## New and changed documentation

- **[Grants](/reference/resource-configs/grants)**: You should now manage access to the datasets you're producing with dbt by using grants instead of using hooks.  If you already use post-hook to apply simple grants, moving to the grants feature will allow you to [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) up your duplicated or boilerplate code.


https://github.com/dbt-labs/docs.getdbt.com/labels/dbt-core%20v1.2
