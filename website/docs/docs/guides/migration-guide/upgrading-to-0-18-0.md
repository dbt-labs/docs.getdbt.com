---
title: "Upgrading to 0.18.0 (prerelease)"

---

:::info Prerelease

dbt v0.18.0 is currently in beta. Please post in dbt Slack #prereleases with questions or issues.

:::

<FAQ src="beta-release" />
<FAQ src="prerelease-docs" />

## New features

### Node selection
- methods: `config`, `test_type`, `test_name`, `package`
- intersections
- nth-parent/child
- version-controlled YML selectors

See the updated docs on [model selection syntax](model-selection-syntax) for details.

### Not yet documented
- Adding policy tags to BigQuery columns
- Include static assets (such as images) in auto-generated docs


## Resources

 - [Changelog](https://github.com/fishtown-analytics/dbt/blob/dev/marian-anderson/CHANGELOG.md)

## Breaking changes

Please be aware of the following changes in v0.18.0. While breaking, we do not expect these to affect the majority of projects.

### Adapter macros

* Previously, dbt put macros from all installed plugins into the namespace. This version of dbt will not include adapter plugin macros unless they are from the currently-in-use adapter or one of its dependencies.

## New and changed documentation

**Core**
- [model selection syntax](model-selection-syntax)
- [list (ls)](commands/list)
- [Redshift profile](redshift-profile#specifying-an-iam-profile)
- [`asset-paths` config](asset-paths) (also updated [dbt_project.yml](dbt_project.yml.md) and the [description](description) docs to match)
