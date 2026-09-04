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

## The `snowflake_default_transient_dynamic_tables` flag

Available starting `dbt-snowflake` v1.12. The `snowflake_default_transient_dynamic_tables` flag controls whether Snowflake dynamic tables are created as transient when the model config does not explicitly set the [`transient`](/reference/resource-configs/snowflake-configs#transient-dynamic-tables) config.

- When set to `false` (default): Dynamic tables are created as permanent tables with a [Fail-safe period](https://docs.snowflake.com/en/user-guide/data-failsafe) unless you set `transient: true` for a specific model.
- When set to `true`: Dynamic tables are created as transient (no Fail-safe period) when `transient` is not specified in the model config. Transient dynamic tables can reduce storage costs.

Set the `snowflake_default_transient_dynamic_tables` flag in your `dbt_project.yml` under the `flags` key. You can override the default setting using the [`transient`](/reference/resource-configs/snowflake-configs#transient-dynamic-tables) config on dynamic table models.

## The `snowflake_managed_iceberg_default` flag

:::note dbt v2

In dbt v2, this behavior is the default and there's no flag to set. `external_volume` defaults to `SNOWFLAKE_MANAGED`, and dbt omits `base_location` whenever the table uses Snowflake-managed storage.

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
