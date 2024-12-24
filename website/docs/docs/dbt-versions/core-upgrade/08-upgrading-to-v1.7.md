---
title: "Upgrading to v1.7"
id: upgrading-to-v1.7
description: New features and changes in dbt Core v1.7
displayed_sidebar: "docs"
---

## Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.7.latest/CHANGELOG.md)
- [dbt Core CLI Installation guide](/docs/core/installation-overview)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud)
- [Release schedule](https://github.com/dbt-labs/dbt-core/issues/8260)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x, with the exception of any changes explicitly mentioned below. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### Behavior changes

dbt Core v1.7 expands the amount of sources you can configure freshness for. Previously, freshness was limited to sources with a `loaded_at_field`; now, freshness can be generated from warehouse metadata tables when available. 

As part of this change, the `loaded_at_field` is no longer required to generate source freshness. If a source has a `freshness:` block, dbt will attempt to calculate freshness for that source:
- If a `loaded_at_field` is provided, dbt will calculate freshness via a select query (previous behavior).
- If a `loaded_at_field` is _not_ provided, dbt will calculate freshness via warehouse metadata tables when possible (new behavior).

This is a relatively small behavior change, but worth calling out in case you notice that dbt is calculating freshness for _more_ sources than before. To exclude a source from freshness calculations, you have two options:
1. Don't add a `freshness:` block.
2. Explicitly set `freshness: null`

Beginning with v1.7, running [`dbt deps`](/reference/commands/deps) creates or updates the `package-lock.yml` file in the _project_root_ where `packages.yml` is recorded. The `package-lock.yml` file contains a record of all packages installed and, if subsequent `dbt deps` runs contain no updated packages in `dependencies.yml` or `packages.yml`, dbt-core installs from `package-lock.yml`.

To retain the behavior prior to v1.7, there are two main options:
1. Use `dbt deps --upgrade` everywhere `dbt deps` was used previously.
2. Add `package-lock.yml` to your `.gitignore` file.

## New and changed features and functionality

- [`dbt docs generate`](/reference/commands/cmd-docs) now supports `--select` to generate [catalog metadata](/reference/artifacts/catalog-json) for a subset of your project. Currently available for Snowflake and Postgres only, but other adapters are coming soon. 
- [Source freshness](/docs/deploy/source-freshness) can now be generated from warehouse metadata tables, currently Snowflake only, but other adapters that have metadata tables are coming soon. 

### MetricFlow enhancements

- Automatically create metrics on measures with [`create_metric: true`](/docs/build/semantic-models).
- Optional [`label`](/docs/build/semantic-models) in semantic_models, measures, dimensions and entities.
- New configurations for semantic models - [enable/disable](/reference/resource-configs/enabled), [group](/reference/resource-configs/group), and [meta](/reference/resource-configs/meta).
- Support `fill_nulls_with` and `join_to_timespine` for metric nodes.
- `saved_queries` extends governance beyond the semantic objects to their consumption.

### For consumers of dbt artifacts (metadata)

- The [manifest](/reference/artifacts/manifest-json) schema version has been updated to v11.
- The [run_results](/reference/artifacts/run-results-json) schema version has been updated to v5.
- There are a few specific changes to the [catalog.json](/reference/artifacts/catalog-json):
    - Added [node attributes](/reference/artifacts/run-results-json) related to compilation (`compiled`, `compiled_code`, `relation_name`) to the `catalog.json`. 
    - The nodes dictionary in the `catalog.json` can now be "partial" if `dbt docs generate` is run with a selector.

### Model governance

dbt Core v1.5 introduced model governance which we're continuing to refine.  v1.7 includes these additional features and functionality:

- **[Breaking change detection](/reference/resource-properties/versions#detecting-breaking-changes) for models with contracts enforced:** When dbt detects a breaking change to a model with an enforced contract during state comparison, it will now raise an error for versioned models and a warning for models that are not versioned.
- **[Set `access` as a config](/reference/resource-configs/access):** You can now set a model's `access` within config blocks in the model's file or in the `dbt_project.yml` for an entire subfolder at once.
- **[Type aliasing for model contracts](/reference/resource-configs/contract):** dbt will use each adapter's built-in type aliasing for user-provided data types—meaning you can now write `string` always, and dbt will translate to `text` on Postgres/Redshift. This is "on" by default, but you can opt-out.
- **[Raise warning for numeric types](/reference/resource-configs/contract):** Because of issues when putting `numeric` in model contracts without considering that default values such as `numeric(38,0)` might round decimals accordingly. dbt will now warn you if it finds a numeric type without specified precision/scale.

### dbt clean

Starting in v1.7, `dbt clean` will only clean paths within the current working directory. The `--no-clean-project-files-only` flag will delete all paths specified in the `clean-targets` section of `dbt_project.yml`, even if they're outside the dbt project.

Supported flags:
-  `--clean-project-files-only` (default) 
-  `--no-clean-project-files-only`

### Additional attributes in run_results.json

The run_results.json now includes three attributes related to the `applied` state that complement `unique_id`:

- `compiled`: Boolean entry of the node compilation status (`False` after parsing, but `True` after compiling).
- `compiled_code`: Rendered string of the code that was compiled (empty after parsing, but full string after compiling).
- `relation_name`: The fully-qualified name of the object that was (or will be) created/updated within the database.

### Deprecated functionality

The ability for installed packages to override built-in materializations without explicit opt-in from the user is being deprecated.

- Overriding a built-in materialization from an installed package raises a deprecation warning.
- Using a custom materialization from an installed package does not raise a deprecation warning.
- Using a built-in materialization package override from the root project via a wrapping materialization is still supported. For example:

  ```
  {% materialization view, default %}
  {{ return(my_cool_package.materialization_view_default()) }}
  {% endmaterialization %}
  ```


### Quick hits

With these quick hits, you can now:
- Configure a [`delimiter`](/reference/resource-configs/delimiter) for a seed file.
- Use packages with the same git repo and unique subdirectory.
- Access the `date_spine` macro directly from dbt-core (moved over from dbt-utils).
- Syntax for `DBT_ENV_SECRET_` has changed to `DBT_ENV_SECRET` and no longer requires the closing underscore.
