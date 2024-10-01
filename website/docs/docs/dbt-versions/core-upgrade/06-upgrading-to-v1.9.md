---
title: "Upgrading to v1.9 (beta)"
id: upgrading-to-v1.9
description: New features and changes in dbt Core v1.9
displayed_sidebar: "docs"
---
 
## Resources

- Changelog INSERT HERE - LINK to 1.9 changelog
- [dbt Core CLI Installation guide](/docs/core/installation-overview)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x, except for any changes explicitly mentioned on this page. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

Remember from version 1.8 that we're [going versionless](/docs/dbt-versions/core-upgrade/upgrading-to-v1.8#versionless) and we have a new [adapter installation procedure](/docs/dbt-versions/core-upgrade/upgrading-to-v1.8#new-dbt-core-adapter-installation-procedure).

## New and changed features and functionality

Features and functionality new in dbt v1.9.

### New microbatch `incremental_strategy`

INSERT HERE - link to docs

Historically, managing incremental models involved several manual steps and responsibilities, which involved using:

* Explicit filtering to define "new" data by writing your SQL within an `is_incremental` block.
* Custom logic for incremental loads by implementing your own logic to handle different loading strategies, such as `append` or `delete+insert`.
* Handle batches manually by implementing custom logic using variables.

These steps made the process error-prone and introduced performance concerns because you had to run a single large SQL query to process all new and updated records. 

Starting in Core 1.9, you can use the new microbatch strategy, which streamlines this process and automates many of these tasks. The benefits include:

* Simplified query design: Write your model query for a single day of data and no longer need `is_incremental()` logic or manual SQL for determining "new" records.
* Automatic batch processing: dbt automatically breaks down the loading process into smaller batches based on the specified `batch_size` and handles the SQL queries for each batch independently, improving efficiency and reducing the risk of query timeouts.
* Dynamic filtering: Use `event_time`, `lookback`, and `batch_size` configurations to generate necessary filters for you, making the process more streamlined and reducing the need for you to manage these details.
* Handling updates: Use the `lookback` configuration to keep track of late-arriving records instead of you making that calculation.


### Snapshots improvements

Originally, snapshots were defined directly in the `dbt_project.yml` file, which involved YAML configuration for source and target schemas without any SQL logic. This method was cumbersome, as it limited flexibility and made managing snapshots more complex. Over time, snapshots evolved to use Jinja blocks, allowing for SQL logic within `.sql` files, but this added parsing complexity and made the development process less efficient.

Beginning in dbt Core 1.9, we've streamlined snapshot configuration by defining snapshots purely in YAML without any SQL logic. This improvement includes:

* New snapshot specification: Snapshots are now configured in a YAML file doe a cleaner more structured set up.
* New `snapshot_meta_column_names` config: Allows you to customize the names of meta fields (for example, `dbt_valid_from`, `dbt_valid_to`, etc.) that dbt automatically adds to snapshots. This increases flexibility to tailor metadata to your needs.
* `target_schema` now optional for snapshots: This schema is now optional When ommitted, snapshots will use the schema defined for the current environment.
* Standard schema and database configs supported: Snapshots will now be consistent with other dbt resources You can specify where snapshots should be stored. 
* Warning for incorrect `updated_at` data type: To ensure data integrity, you'll see a warning if the `updated_at` field specified in the snapshot configuration is not the proper data type or timestamp.

### `state:modified` improvements

INSERT HERE Point me to a resource for this?

Fewer false positives in state:modified
state_modified_compare_more_unrendered_values
state_modified_compare_vars

### Deprecated functionality

INSERT HERE - any deprecated functionality to call out?


### Managing changes to legacy behaviors

dbt Core v1.9 has introduced flags for [managing changes to legacy behaviors](/reference/global-configs/behavior-changes). You may opt into recently introduced changes (disabled by default), or opt out of mature changes (enabled by default), by setting `True` / `False` values, respectively, for `flags` in `dbt_project.yml`.

You can read more about each of these behavior changes in the following links:

INSERT HERE! Any behavior changes?

## Quick hits

We also made some quality-of-life improvements in Core 1.9, enabling you to:

- Document [singular data tests](/docs/build/data-tests#document-singular-tests).
- Use `ref` and `source` in foreign key constraints
- New CLI flag for `dbt test`. Choose which resource types are included or excluded when you run the `dbt test` by including [`--resource-type`/`--exclude-resource-type`](/reference/global-configs/resource-type)
- New CLI flag for [`dbt show`](/reference/commands/show). `--inline-direct` enables you to avoid loading the entire manifest and
skip rendering any Jinja templates.

We also made improvements for adapters, enabling you to:
- Use arbitrary config options in `data_test` For example, you can set `snowflake_warehouse` for tests.
- Use behavior flags INSERT HERE MORE INFO
