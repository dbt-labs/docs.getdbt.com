---
title: "Upgrading to v1.9"
id: upgrading-to-v1.9
description: New features and changes in dbt Core v1.9
displayed_sidebar: "docs"
---
 
## Resources 

- [dbt Core 1.9 changelog](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md)
- [dbt Core CLI Installation guide](/docs/core/installation-overview)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud#release-tracks)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x. Any behavior changes will be accompanied by a [behavior change flag](/reference/global-configs/behavior-changes#behavior-change-flags) to provide a migration window for existing projects. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

Starting in 2024, dbt Cloud provides the functionality from new versions of dbt Core via [release tracks](/docs/dbt-versions/cloud-release-tracks) with automatic upgrades. If you have selected the "Latest" release track in dbt Cloud, you already have access to all the features, fixes, and other functionality that is included in dbt Core v1.9! If you have selected the "Compatible" release track, you will have access in the next monthly "Compatible" release after the dbt Core v1.9 final release.

For users of dbt Core, since v1.8, we recommend explicitly installing both `dbt-core` and `dbt-<youradapter>`. This may become required for a future version of dbt. For example:

```sql
python3 -m pip install dbt-core dbt-snowflake
```

## New and changed features and functionality

Features and functionality new in dbt v1.9.

### Microbatch `incremental_strategy`

:::info 

If you use a custom microbatch macro, set the [`require_batched_execution_for_custom_microbatch_strategy`](/reference/global-configs/behavior-changes#custom-microbatch-strategy) behavior flag in your `dbt_project.yml` to enable batched execution. If you don't have a custom microbatch macro, you don't need to set this flag as dbt will handle microbatching automatically for any model using the microbatch strategy.
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
- [Automatic parallel batch execution](/docs/build/incremental-microbatch#parallel-batch-execution): Process multiple batches at the same time, instead of one after the other (sequentially) for faster processing of your microbatch models. dbt intelligently auto-detects if your batches can run in parallel, while also allowing you to manually override parallel execution with the [`concurrent_batches` config](/reference/resource-properties/concurrent_batches).


Currently microbatch is supported on these adapters with more to come:
 * postgres
 * redshift
 * snowflake
 * bigquery
 * spark
 * databricks
  
### Snapshots improvements

Beginning in dbt Core 1.9, we've streamlined snapshot configuration and added a handful of new configurations to make dbt **snapshots easier to configure, run, and customize.** These improvements include:

- New snapshot specification: Snapshots can now be configured in a YAML file, which provides a cleaner and more consistent set up.
- New `snapshot_meta_column_names` config: Allows you to customize the names of meta fields (for example, `dbt_valid_from`, `dbt_valid_to`, etc.) that dbt automatically adds to snapshots. This increases flexibility to tailor metadata to your needs.
- `target_schema` is now optional for snapshots: When omitted, snapshots will use the schema defined for the current environment.
- Standard `schema` and `database` configs supported: Snapshots will now be consistent with other dbt resource types. You can specify where environment-aware snapshots should be stored.
- Warning for incorrect `updated_at` data type: To ensure data integrity, you'll see a warning if the `updated_at` field specified in the snapshot configuration is not the proper data type or timestamp.
- Set a custom current indicator for the value of `dbt_valid_to`: Use the [`dbt_valid_to_current` config](/reference/resource-configs/dbt_valid_to_current) to set a custom indicator for the value of `dbt_valid_to` in current snapshot records (like a future date). By default, this value is `NULL`. When configured, dbt will use the specified value instead of `NULL` for `dbt_valid_to` for current records in the snapshot table. 
- Use the [`hard_deletes`](/reference/resource-configs/hard-deletes) configuration to get more control on how to handle deleted rows from the source. Supported methods are `ignore` (default), `invalidate` (replaces legacy `invalidate_hard_deletes=true`), and `new_record`. Setting  `hard_deletes='new_record'` allows you to track hard deletes by adding a new record when row becomes "deleted" in source. 

Read more about [Snapshots meta fields](/docs/build/snapshots#snapshot-meta-fields).

To learn how to safely migrate existing snapshots, refer to [Snapshot configuration migration](/reference/snapshot-configs#snapshot-configuration-migration) for more information. 

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
- (Introduced, disabled by default) [`require_nested_cumulative_type_params`](/reference/global-configs/behavior-changes#cumulative-metrics). If the flag is set to `True`, users will receive an error instead of a warning if they're not properly formatting cumulative metrics using the new [`cumulative_type_params`](/docs/build/cumulative#parameters) nesting.
- (Introduced, disabled by default) [`require_batched_execution_for_custom_microbatch_strategy`](/reference/global-configs/behavior-changes#custom-microbatch-strategy). Set to `True` if you use a custom microbatch macro to enable batched execution. If you don't have a custom microbatch macro, you don't need to set this flag as dbt will handle microbatching automatically for any model using the microbatch strategy.

## Adapter specific features and functionalities

### Redshift

- Support IAM Role auth

### Snowflake

- Iceberg Table Format &mdash; Support will be available on three out-of-the-box materializations: table, incremental, dynamic tables.
- Breaking change &mdash; When upgrading from dbt 1.8 to 1.9 `{{ target.account }}` replaces underscores with dashes. For example, if the `target.account` is set to `sample_company`, then the compiled code now generates `sample-company`. [Refer to the `dbt-snowflake` issue](https://github.com/dbt-labs/dbt-snowflake/issues/1286) for more information. 

### Bigquery

- Can cancel running queries on keyboard interrupt
- Auto-drop intermediate tables created by incremental models to save resources

### Spark

- Support overriding the ODBC driver connection string which now enables you to provide custom connections

## Quick hits

We also made some quality-of-life improvements in Core 1.9, enabling you to:

- Maintain data quality now that dbt returns an error (versioned models) or warning (unversioned models) when someone [removes a contracted model by deleting, renaming, or disabling](/docs/collaborate/govern/model-contracts#how-are-breaking-changes-handled) it.
- Document [data tests](/reference/resource-properties/description).
- Use `ref` and `source` in [foreign key constraints](/reference/resource-properties/constraints).
- Use `dbt test` with the `--resource-type` / `--exclude-resource-type` flag, making it possible to include or exclude data tests (`test`) or unit tests (`unit_test`).
