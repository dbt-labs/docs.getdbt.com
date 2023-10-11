---
title: "Upgrading to v1.7 (beta)"
description: New features and changes in dbt Core v1.7
---

## Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/8aaed0e29f9560bc53d9d3e88325a9597318e375/CHANGELOG.md)
- [CLI Installation guide](/docs/core/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)
- [Release schedule](https://github.com/dbt-labs/dbt-core/issues/8260)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x, with the exception of any changes explicitly mentioned below. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

## New and changed features and functionality

- [`dbt docs generate`](/reference/commands/cmd-docs) now supports `--select` to generate documentation for a subset of your project. Currently available for Snowflake and Postgres only, but other adapters are coming soon. 
- [Source freshness](/docs/deploy/source-freshness) can now be generated from warehouse metadata tables, currently snowflake only, but other adapters that have metadata tables are coming soon. If you configure source freshness without a `loaded_at_field`, dbt will try to determine freshness from warehouse metadata tables.
- The nodes dictionary in the `catalog.json` can now be "partial" if `dbt docs generate` is run with a selector.

### MetricFlow enhancements

- Automatically create metrics on measures with `create_metric: true`.
- Optional [`label`](/docs/build/semantic-models) in semantic_models, measures, dimensions and entities.
- New configurations for semantic models - [enable/disable](/reference/resource-configs/enabled), [group](/reference/resource-configs/group), and [meta](/reference/resource-configs/meta).
- Support `fill_nulls_with` and `join_to_timespine` for metric nodes.
- `saved_queries` extends governance beyond the semantic objects to their consumption.

### For consumers of dbt artifacts (metadata)

- The [manifest](/reference/artifacts/manifest-json) schema version has been updated to v11.
- The [run_results](/reference/artifacts/run-results-json) schema version has been updated to v5.
- Added [node attributes](/reference/artifacts/run-results-json) related to compilation (`compiled`, `compiled_code`, `relation_name`).


### Model governance

dbt Core v1.5 introduced model governance which we're continuing to refine.  v1.7 includes these additional features and functionality:

- **[Breaking change detection](/reference/resource-properties/versions#detecting-breaking-changes) for models with contracts enforced:** When dbt detects a breaking change to a model with an enforced contract during state comparison, it will now raise an error for versioned models and a warning for models that are not versioned.
- **[Set `access` as a config](/reference/resource-configs/access):** You can now set a model's `access` within config blocks in the model's file or in the `dbt_project.yml` for an entire subfolder at once.
- **[Type aliasing for model contracts](/reference/resource-configs/contract):** dbt will use each adapter's built-in type aliasing for user-provided data types—meaning you can now write `string` always, and dbt will translate to `text` on Postgres/Redshift. This is "on" by default, but you can opt-out.
- **[Raise warning for numeric types](/reference/resource-configs/contract):** Because of issues when putting `numeric` in model contracts without considering that default values such as `numeric(38,0)` might round decimals accordingly. dbt will now warn you if it finds a numeric type without specified precision/scale.

### Quick hits

With these quick hits, you can now:
-  Configure a `delimiter` for a seed file.
- Use packages with the same git repo and unique subdirectory.
- Moved the `date_spine` macro from dbt-utils to dbt-core.
