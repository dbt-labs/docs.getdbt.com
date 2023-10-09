---
title: "Upgrading to v1.7 (beta)"
description: New features and changes in dbt Core v1.7
---

## Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/8aaed0e29f9560bc53d9d3e88325a9597318e375/CHANGELOG.md)
- [CLI Installation guide](/docs/core/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)
- [Release schedule](https://github.com/dbt-labs/dbt-core/issues/7481)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x, with the exception of any changes explicitly mentioned below. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### Behavior changes

**COMING SOON**

## New and changed documentation

- `dbt docs generate` now supports `--select` to generate documentation for a subset of your project
- currently Snowflake and Postgres only, but other adapters on their way

### source freshness can now be generated from warehouse metadata tables
- currently snowflake only, but other adapters that have metadata tables on their way
-  if you configure source freshness without a `loaded_at_field`, dbt will try to determine freshness from warehouse metadata tables

### MetricFlow enhancements
- automatically create metrics on measures, `create_metric: true`
- optional `label` in semantic_models, measures, dimensions and
  entities
- new configurations for semantic models - enable/disable, group, meta
- support `fill_nulls_with` and `join_to_timespine` for metric nodes
- `saved_queries` extend governance beyond the semantic objects to their consumption

## For consumers of dbt artifacts (metadata)

The [manifest](https://docs.getdbt.com/reference/artifacts/manifest-json) schema version has been updated to v11. Specific changes:
- ???

@dbeatty10 do you know what the manifest schema changes were? The [PR that bumped the version](https://github.com/dbt-labs/dbt-core/pull/8335) didn't seem to make any other changes.

The [run_results](https://docs.getdbt.com/reference/artifacts/run-results-json) schema version has been updated to v5. Specific changes:
- Add node attributes related to compilation (`compiled`, `compiled_code`, `relation_name`)

The nodes dictionary in the `catalog.json` can now be "partial" if `dbt docs generate` is run with a selector.

### Quick hits

- You can configure a `delimiter` for a seed file.
- Allow setting `access` as a config.
- Support packages with same git repo and unique subdirectory.
- Moved `date_spine` macro from dbt-utils to dbt-core.


