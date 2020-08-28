---
title: "Upgrading to 0.18.0 (prerelease)"

---

:::info Prerelease

dbt v0.18.0 is currently in beta. Please post in dbt Slack #prereleases with questions or issues.

:::

<FAQ src="beta-release" />
<FAQ src="prerelease-docs" />

## New features

For more details, see [new and changed documentation](#new-and-changed-documentation) below.

### Node selection
- methods: `config`, `test_type`, `test_name`, `package`, [β] `state`
- intersections
- nth-parent/child
- [β] version-controlled YAML selectors
- [β] defer unselected node references to state defined by a previous run's artifacts

### Adapter macros
- `adapter.dispatch` replaces `adapter_macro`, with much greater flexibility
- Schema tests are now defined via `dispatch`, such that non-core plugins
can override schema test definitions

### Docs
- Include static assets (such as images) in auto-generated docs site
- Improved resource search

### Database-specific
- Specify IAM profile when connecting to Redshift
- Impersonate a BigQuery service account when connecting via oauth
- Adding policy tags to BigQuery columns [not yet documented]
- Snowflake query tags at connection and model level [not yet documented]


## Resources

 - [Changelog](https://github.com/fishtown-analytics/dbt/blob/dev/marian-anderson/CHANGELOG.md)

## Breaking changes

Please be aware of the following changes in v0.18.0. While breaking, we do not expect these to affect the majority of projects.

### Adapter macros

* Previously, dbt put macros from all installed plugins into the namespace. This version of dbt will not include adapter plugin macros unless they are from the currently-in-use adapter or one of its dependencies.

## New and changed documentation

**Core**
- [node selection syntax](node-selection/syntax)
- [list (ls)](commands/list)
- [Redshift profile](redshift-profile#specifying-an-iam-profile)
- [`asset-paths` config](asset-paths) (also updated [dbt_project.yml](dbt_project.yml.md) and the [description](description) docs to match)
- [`impersonate_service_account` in the BigQuery profile configuration](https://docs.getdbt.com/reference/warehouse-profiles/bigquery-profile#service-account-impersonation)
- [adapter.dispatch](adapter#dispatch)
- [Enable or Disable colorized logs](run#enable-or-disable-colorized-logs)
- [deferring to previous run state](run#deferring-to-previous-run-state)
