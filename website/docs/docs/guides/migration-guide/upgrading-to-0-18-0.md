---
title: "Upgrading to 0.18.0"

---

### Resources

- [Changelog](https://github.com/fishtown-analytics/dbt/blob/dev/marian-anderson/CHANGELOG.md)
- [Discussion: Prerelease](https://discourse.getdbt.com/t/prerelease-v0-18-0-marian-anderson/1545)

## Breaking changes

Please be aware of the following changes in v0.18.0. While breaking, we do not expect these to affect the majority of projects.

### Adapter macros

- dbt only has access to adapter plugin macros from the currently-in-use adapter or one of its dependencies, rather than all installed adapters in the namespace.
- `adapter_macro` is no longer a macro and will raise a deprecation warning. Use `adapter.dispatch` instead.

### Data tests

- Data tests are written as CTEs instead of subqueries. Adapter plugins for databases that don't support CTEs may need to override this behavior.

### Python requirements
- Upgraded `snowflake-connector-python` dependency to 2.2.10 and enabled the SSO token cache

## New features

For more details, see [new and changed documentation](#new-and-changed-documentation) below.

:::info [β] Beta Features
There are several pieces of net-new functionality in v0.18.0, with iterative improvements to come. If you encounter unexpected behavior, please post in Slack or open an issue.
:::

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
- Project-level overviews

### Database-specific
- Specify IAM profile when connecting to Redshift
- Snowflake query tags at connection and model level
- Impersonate a BigQuery service account when connecting via oauth
- Adding policy tags to BigQuery columns
- Configure time-to-live for BigQuery tables

## New and changed documentation

**Core**
- [node selection syntax](node-selection/syntax)
- [list (ls)](commands/list)
- [deferring to previous run state](run#deferring-to-previous-run-state)
- [adapter.dispatch](adapter#dispatch)
- [`asset-paths` config](asset-paths) (also updated [dbt_project.yml](dbt_project.yml.md) and [description](description))
- [flag for colorized logs](run#enable-or-disable-colorized-logs)
- [`full_refresh` config](full_refresh)

**Docs**
- [project-level overviews](documentation#custom-project-level-overviews)

**Redshift**
- [`iam_profile`](redshift-profile#specifying-an-iam-profile)

**Snowflake**
- `query_tag` in [profile](snowflake-profile), [model config](snowflake-configs#query-tags)
- automatic SSO [session caching](snowflake-configs#sso-authentication) support

**BigQuery**
- [`impersonate_service_account`](https://docs.getdbt.com/reference/warehouse-profiles/bigquery-profile#service-account-impersonation)
- [`policy_tags`](bigquery-configs#policy-tags)
- [`hours_to_expiration`](bigquery-configs#controlling-table-expiration)
