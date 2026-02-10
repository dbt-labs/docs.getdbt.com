---
title: "Amazon Redshift adapter behavior changes"
id: "redshift-changes"
sidebar: "Redshift"
---

The following are the current [behavior change flags](/docs/reference/global-configs/behavior-changes.md#behavior-change-flags) that are specific to `dbt-redshift`:

| Flag                          | `dbt-redshift`: Intro | `dbt-redshift`: Maturity | Status |
| ----------------------------- | --------------------- | ------------------------ | ------ |
| [`restrict_direct_pg_catalog_access`](#the-restrict_direct_pg_catalog_access-flag) | 1.9.0 | TBD | Active |
| [`redshift_skip_autocommit_transaction_statements`](#the-redshift_skip_autocommit_transaction_statements-flag) | 1.12.0 | TBD | Active |

## The `restrict_direct_pg_catalog_access` flag

Originally, the `dbt-redshift` adapter was built on top of the `dbt-postgres` adapter and used Postgres tables for metadata access. When this flag is enabled, the adapter uses the Redshift API (through the Python client) if available, or queries Redshift's `information_schema` tables instead of using the `pg_` tables.

While you shouldn't notice any behavior changes due to this change, however, to be cautious dbt Labs is gating it behind a behavior-change flag and encouraging you to test it before it becoming the default.

## The `redshift_skip_autocommit_transaction_statements` flag

The `redshift_skip_autocommit_transaction_statements` flag is `True` by default.

When `autocommit=True` (the default since dbt-redshift 1.5), dbt previously sent explicit `BEGIN`/`COMMIT`/`ROLLBACK` statements even though they were unnecessary. When autocommit is enabled, each statement is automatically committed by the driver, so these extra statements only add unnecessary round trips to Redshift.

With this flag enabled (the default), dbt skips sending these transaction management statements when autocommit is enabled, improving performance by reducing unnecessary round trips to the database.

### Key behaviors

When the flag is `True` (default) AND autocommit is `True`:
- `begin()` skips sending `BEGIN`
- `commit()` skips sending `COMMIT`
- `rollback_if_open()` skips sending `ROLLBACK`

dbt's internal `transaction_open` state is still properly managed to maintain compatibility with dbt's transaction tracking, even when actual statements are skipped.

### Preserving legacy behavior

To preserve the legacy behavior of sending `BEGIN`/`COMMIT`/`ROLLBACK` statements even when autocommit is enabled, set the flag to `False` in your `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
flags:
  redshift_skip_autocommit_transaction_statements: false
```

</File>

### Backward compatibility

- **`autocommit=False` unaffected**: When autocommit is disabled, explicit transactions still work as before regardless of this flag.
- **`autocommit=True` with flag (default)**: Skips unnecessary transaction statements for better performance.
- **`autocommit=True` without flag**: Sends `BEGIN`/`COMMIT`/`ROLLBACK` (legacy behavior).
