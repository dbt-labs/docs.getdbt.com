---
title: "Upgrading to v1.9 (beta)"
id: upgrading-to-v1.9
description: New features and changes in dbt Core v1.9
displayed_sidebar: "docs"
---
 
## Resources 

- [dbt Core 1.9 changelog](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md)
- [dbt Core CLI Installation guide](/docs/core/installation-overview)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x. Any behavior changes will be accompanied by a [behavior change flag](/reference/global-configs/behavior-changes#behavior-change-flags) to provide a migration window for existing projects. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

dbt Cloud is now [versionless](/docs/dbt-versions/versionless-cloud). If you have selected "Versionless" in dbt Cloud, you already have access to all the features, fixes, and other functionality that is included in dbt Core v1.9.
For users of dbt Core, since v1.8 we recommend explicitly installing both `dbt-core` and `dbt-<youradapter>`. This may become required for a future version of dbt. For example:

```sql
python3 -m pip install dbt-core dbt-snowflake
```

## New and changed features and functionality

Features and functionality new in dbt v1.9.

### Microbatch `incremental_strategy`

:::info 
While microbatch is in "beta", this functionality is still gated behind an env var, which will change to a behavior flag when 1.9 is GA. To use microbatch, set `DBT_EXPERIMENTAL_MICROBATCH` to `true` wherever you're running dbt Core.
:::

Incremental models are, and have always been, a *performance optimization* — for datasets that are too large to be dropped and recreated from scratch every time you do a `dbt run`. Learn more about [incremental models](/docs/build/incremental-models-overview).

Historically, managing incremental models involved several manual steps and responsibilities, including:

- Add a snippet of dbt code (in an `is_incremental()` block) that uses the already-existing table (`this`) as a rough bookmark, so that only new data gets processed.
- Pick one of the strategies for smushing old and new data together (`append`, `delete+insert`, or `merge`).
- If anything goes wrong, or your schema changes, you can always "full-refresh", by running the same simple query that rebuilds the whole table from scratch.

While this works for many use-cases, there’s a clear limitation with this approach: *Some datasets are just too big to fit into one query.*

Starting in Core 1.9, you can use the new [microbatch strategy](/docs/build/incremental-microbatch#what-is-microbatch-in-dbt) to optimize your largest datasets  -- **process your event data in discrete periods with their own SQL queries, rather than all at once.** The benefits include:

- Simplified query design: Write your model query for a single batch of data. dbt will use your `event_time`, `lookback`, and `batch_size` configurations to automatically generate the necessary filters for you, making the process more streamlined and reducing the need for you to manage these details.
- Independent batch processing: dbt automatically breaks down the data to load into smaller batches based on the specified `batch_size` and processes each batch independently, improving efficiency and reducing the risk of query timeouts. If some of your batches fail, you can use `dbt retry` to load only the failed batches.
- Targeted reprocessing: To load a *specific* batch or batches, you can use the CLI arguments `--event-time-start` and `--event-time-end`.

Currently microbatch is supported on these adapters with more to come:
 * postgres
 * snowflake
 * bigquery
 * spark
  
### Snapshots improvements

Beginning in dbt Core 1.9, we've streamlined snapshot configuration and added a handful of new configurations to make dbt **snapshots easier to configure, run, and customize.** These improvements include:

- New snapshot specification: Snapshots can now be configured in a YAML file, which provides a cleaner and more consistent set up.
- New `snapshot_meta_column_names` config: Allows you to customize the names of meta fields (for example, `dbt_valid_from`, `dbt_valid_to`, etc.) that dbt automatically adds to snapshots. This increases flexibility to tailor metadata to your needs.
- `target_schema` is now optional for snapshots: When omitted, snapshots will use the schema defined for the current environment.
- Standard `schema` and `database` configs supported: Snapshots will now be consistent with other dbt resource types. You can specify where environment-aware snapshots should be stored.
- Warning for incorrect `updated_at` data type: To ensure data integrity, you'll see a warning if the `updated_at` field specified in the snapshot configuration is not the proper data type or timestamp.

Read more about [Snapshots meta fields](/docs/build/snapshots#snapshot-meta-fields).

### `state:modified` improvements

We’ve made improvements to `state:modified` behaviors to help reduce the risk of false positives and negatives. Read more about [the `state:modified` behavior flag](#managing-changes-to-legacy-behaviors) that unlocks this improvement:

- Added environment-aware enhancements for environments where the logic purposefully differs (for example, materializing as a table in `prod` but a `view` in dev).

### Managing changes to legacy behaviors

dbt Core v1.9 has a handful of new flags for [managing changes to legacy behaviors](/reference/global-configs/behavior-changes). You may opt into recently introduced changes (disabled by default), or opt out of mature changes (enabled by default), by setting `True` / `False` values, respectively, for `flags` in `dbt_project.yml`.

You can read more about each of these behavior changes in the following links:

- (Introduced, disabled by default) [`state_modified_compare_more_unrendered_values`](/reference/global-configs/behavior-changes#behavior-change-flags). Set to `True` to start persisting `unrendered_database` and `unrendered_schema` configs during source parsing, and do comparison on unrendered values during `state:modified` checks to reduce false positives due to environment-aware logic when selecting `state:modified`.
- (Introduced, disabled by default) [`skip_nodes_if_on_run_start_fails` project config flag](/reference/global-configs/behavior-changes#behavior-change-flags). If the flag is set and **any** `on-run-start` hook fails, mark all selected nodes as skipped.
    - `on-run-start/end` hooks are **always** run, regardless of whether they passed or failed last time.
- (Introduced, disabled by default) [[Redshift] `restrict_direct_pg_catalog_access`](/reference/global-configs/behavior-changes#redshift-restrict_direct_pg_catalog_access). If the flag is set the adapter will use the Redshift API (through the Python client) if available, or query Redshift's `information_schema` tables instead of using `pg_` tables.

## Adapter specific features and functionalities

### Redshift

- Support IAM Role auth

### Snowflake

- Iceberg Table Format support will be available on three out of the box materializations: table, incremental, dynamic tables. 

### Bigquery

- Can cancel running queries on keyboard interrupt
- Auto-drop intermediate tables created by incremental models to save resources

### Spark

- Support overriding the ODBC driver connection string which now enables you to provide custom connections

## Quick hits

We also made some quality-of-life improvements in Core 1.9, enabling you to:

- Maintain data quality now that dbt returns an an error (versioned models) or warning (unversioned models) when someone [removes a contracted model by deleting, renaming, or disabling](/docs/collaborate/govern/model-contracts#how-are-breaking-changes-handled) it.
- Document [singular data tests](/docs/build/data-tests#document-singular-tests).
- Use `ref` and `source` in [foreign key constraints](/reference/resource-properties/constraints).
- Use `dbt test` with the `--resource-type` / `--exclude-resource-type` flag, making it possible to include or exclude data tests (`test`) or unit tests (`unit_test`).
