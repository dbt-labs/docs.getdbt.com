---
title: "Snowflake adapter behavior changes"
id: "snowflake-changes"
sidebar: "Snowflake"
---

The following are the current [behavior change flags](/reference/global-configs/behavior-changes#behavior-change-flags) that are specific to `dbt-snowflake`:

| Flag | `dbt-snowflake`: Intro | `dbt-snowflake`: Maturity | Status |
| ---- | ---------------------- | ------------------------- | ------ |
| [`snowflake_default_transient_dynamic_tables`](#the-snowflake_default_transient_dynamic_tables-flag) | 1.12.0 | TBD | Active |
| [`snowflake_managed_iceberg_default`](#the-snowflake_managed_iceberg_default-flag) | 1.12.0 | TBD | Active |
| [`snowflake_dynamic_table_create_or_alter`](#the-snowflake_dynamic_table_create_or_alter-flag) | 1.13.0 | TBD | Active |

## The `snowflake_default_transient_dynamic_tables` flag

Available starting `dbt-snowflake` v1.12. The `snowflake_default_transient_dynamic_tables` flag controls whether Snowflake dynamic tables are created as transient when the model config does not explicitly set the [`transient`](/reference/resource-configs/snowflake-configs#transient-dynamic-tables) config.

- When set to `false` (default): Dynamic tables are created as permanent tables with a [Fail-safe period](https://docs.snowflake.com/en/user-guide/data-failsafe) unless you set `transient: true` for a specific model.
- When set to `true`: Dynamic tables are created as transient (no Fail-safe period) when `transient` is not specified in the model config. Transient dynamic tables can reduce storage costs.

Set the `snowflake_default_transient_dynamic_tables` flag in your `dbt_project.yml` under the `flags` key. You can override the default setting using the [`transient`](/reference/resource-configs/snowflake-configs#transient-dynamic-tables) config on dynamic table models.

## The `snowflake_managed_iceberg_default` flag

:::note dbt v2

In v2, this behavior is the default and there's no flag to set. `external_volume` defaults to `SNOWFLAKE_MANAGED`, and dbt omits `base_location` whenever the table uses Snowflake-managed storage.

:::

Available starting `dbt-snowflake` v1.12. The `snowflake_managed_iceberg_default` flag controls what dbt does when a model sets `table_format: iceberg` for an [Iceberg table](/docs/build/iceberg/adapters/snowflake-iceberg-support) without an `external_volume`.

Snowflake rejects `BASE_LOCATION` for Iceberg tables that use [Snowflake-managed storage](https://docs.snowflake.com/en/user-guide/tables-iceberg-internal-storage) and returns the error `BASE_LOCATION property is not supported for Iceberg tables using Snowflake Managed Storage`. This flag lets dbt generate data definition language (DDL) that Snowflake Horizon accepts without requiring you to configure a catalog.

- When set to `false` (default): dbt doesn't emit `external_volume`. Snowflake falls back to any [default external volume](https://docs.snowflake.com/user-guide/tables-iceberg-configure-external-volume#set-a-default-external-volume-at-the-account-database-or-schema-level) set at the account, database, or schema level, and dbt still generates a `base_location`.
- When set to `true`: dbt emits `external_volume = 'SNOWFLAKE_MANAGED'` and omits `base_location`, so the table uses Snowflake-managed storage.

The flag defaults to `false` to avoid changing the target storage for projects that rely on a default external volume set at the account, database, or schema level.

Two cases don't depend on this flag:

- When you set `external_volume` to `SNOWFLAKE_MANAGED`, dbt always omits `base_location`. dbt resolves `external_volume` from the model config first and then from the catalog definition in `catalogs.yml`, so setting it in either place omits `base_location`.
- When you set `external_volume` to a user-defined volume, such as Amazon S3, Azure, or Google Cloud Storage, dbt always emits both `external_volume` and `base_location`.

Set the flag in your `dbt_project.yml` under the `flags` key:

<File name='dbt_project.yml'>

```yaml
flags:
  snowflake_managed_iceberg_default: true
```

</File>

## The `snowflake_dynamic_table_create_or_alter` flag

Available starting `dbt-snowflake` v1.13. The `snowflake_dynamic_table_create_or_alter` flag controls whether <Constant name="dbt" /> updates [Snowflake dynamic table](/reference/resource-configs/snowflake-configs#dynamic-tables) SQL definitions in place during `dbt run` without requiring `--full-refresh`.

By default, <Constant name="dbt" /> only compares configuration settings on dynamic tables, so editing a model's SQL query without changing its configuration leaves the existing query running until you pass `--full-refresh`. When you enable this flag, <Constant name="dbt" /> runs Snowflake's [`CREATE OR ALTER DYNAMIC TABLE`](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table) (or [`CREATE OR ALTER DYNAMIC ICEBERG TABLE`](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-iceberg-table)) on every `dbt run`. As a result, SQL edits deploy automatically while keeping existing privileges, row access policies, and tags on the table.

- When set to `false` (default): <Constant name="dbt" /> only checks dynamic table configuration changes during `dbt run`. Deploying a SQL-only change requires `dbt run --full-refresh`.
- When set to `true`: <Constant name="dbt" /> syncs native dynamic tables and [Snowflake-managed Iceberg](/docs/build/iceberg/adapters/snowflake-iceberg-support) dynamic tables with `CREATE OR ALTER` on every run. If nothing changed, Snowflake treats the statement as a no-op.

Set the flag in your `dbt_project.yml` under the `flags` key:

<File name='dbt_project.yml'>

```yaml
flags:
  snowflake_dynamic_table_create_or_alter: true
```

</File>

:::caution Reinitialization in `INCREMENTAL` and `AUTO` refresh modes

When [`refresh_mode`](/reference/resource-configs/snowflake-configs#refresh-mode) is `INCREMENTAL` or `AUTO`, editing a dynamic table's SQL query causes Snowflake to reinitialize the table (recomputing all rows and discarding existing incremental state). This differs from <Constant name="dbt" /> [incremental models](/docs/build/incremental-models), where SQL changes do not rebuild existing data unless you run `--full-refresh`.

Snowflake also compares stored query text character for character, including whitespace. If an `INCREMENTAL` or `AUTO` dynamic table was created by an earlier <Constant name="dbt" /> version that formatted the query with different indentation, the first run after enabling this flag may reinitialize the table once even if your model SQL has not changed.

:::

Keep these behaviors and limitations in mind when enabling the flag:

- **Iceberg dynamic tables:** Snowflake-managed Iceberg dynamic tables sync in place with `CREATE OR ALTER DYNAMIC ICEBERG TABLE`, as long as their external volume, base location, and Iceberg version stay the same. Changing those settings requires `dbt run --full-refresh`. Dynamic Iceberg tables in externally managed catalogs keep standard `CREATE OR REPLACE` behavior, and switching a model between a native dynamic table and an Iceberg dynamic table also rebuilds with `CREATE OR REPLACE`.
- **Unsupported schema changes:** `CREATE OR ALTER` cannot apply every schema change in place, such as reordering columns, inserting a column into the middle of the column list, narrowing a data type, or making an incompatible type change. When Snowflake rejects a change, the run fails and <Constant name="dbt" /> includes a hint to rerun with `dbt run --full-refresh`.
- **Changes to `transient` and `refresh_mode`:** When <Constant name="dbt" /> detects an explicit change to [`transient`](/reference/resource-configs/snowflake-configs#transient-dynamic-tables) or [`refresh_mode`](/reference/resource-configs/snowflake-configs#refresh-mode), it rebuilds the table with `CREATE OR REPLACE`. However, if `transient` is omitted from the model config and the project default no longer matches the existing table (for example, after changing [`snowflake_default_transient_dynamic_tables`](#the-snowflake_default_transient_dynamic_tables-flag) or removing `transient` from the model), Snowflake rejects the `CREATE OR ALTER` statement. Set `transient` explicitly to match the table, or run `dbt run --full-refresh`.
- **Interaction with `on_configuration_change`:** When [`on_configuration_change`](/reference/resource-configs/on_configuration_change) is `continue` and a single run includes both a configuration change and a SQL edit, <Constant name="dbt" /> skips both changes and logs a warning. When set to `fail`, <Constant name="dbt" /> stops with an error when it detects configuration changes.
- **Policies, tags, and table properties:** Existing privileges, [row access policies](/reference/resource-configs/snowflake-configs#setting-row-access-policies), and tags stay attached across `CREATE OR ALTER` runs. Because Snowflake's `CREATE OR ALTER DYNAMIC TABLE` does not accept policy or tag clauses, updates to `row_access_policy` or tags in your model config require `dbt run --full-refresh` to take effect. Properties not managed by this statement, such as `COMMENT`, `DATA_RETENTION_TIME_IN_DAYS`, and `MAX_DATA_EXTENSION_TIME_IN_DAYS`, reset to their default or inherited values on each run.

