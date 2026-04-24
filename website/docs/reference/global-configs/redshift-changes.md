---
title: "Amazon Redshift adapter behavior changes"
id: "redshift-changes"
sidebar: "Redshift"
---

The following are the current [behavior change flags](/docs/reference/global-configs/behavior-changes.md#behavior-change-flags) that are specific to `dbt-redshift`:

<SimpleTable>
| Flag                          | `dbt-redshift`: Intro | `dbt-redshift`: Maturity | Status |
| ----------------------------- | --------------------- | ------------------------ | ------ |
| [`redshift_skip_autocommit_transaction_statements`](#redshift_skip_autocommit_transaction_statements-flag) | 1.12.0 | TBD | Active |
</SimpleTable>

<!--
## `restrict_direct_pg_catalog_access` flag

Originally, the `dbt-redshift` adapter was built on top of the `dbt-postgres` adapter and used Postgres tables for metadata access. When this flag is enabled, the adapter uses the Redshift API (through the Python client) if available, or queries Redshift's `information_schema` tables instead of using the `pg_` tables _for some metadata queries_.

Note that this flag does not apply to all metadata queries emitted by the adapter. For example, a list relations query may continue to query `information_schema` even when the flag is disabled.

While you shouldn't notice any behavior changes due to this change, however, to be cautious dbt Labs is gating it behind a behavior-change flag and encouraging you to test it before it becoming the default.
-->

## `redshift_skip_autocommit_transaction_statements` flag

The `redshift_skip_autocommit_transaction_statements` flag is `False` by default, preserving legacy transaction behavior.

When `autocommit=True` (the default since `dbt-redshift 1.5`), each statement is automatically committed by the driver. By default, dbt still sends explicit `BEGIN` / `COMMIT` / `ROLLBACK` statements, which are unnecessary and add extra round trips to Redshift.

When you set the `redshift_skip_autocommit_transaction_statements` flag set to `True`, dbt skips sending transaction management statements when autocommit is enabled, reducing unnecessary round trips and improving performance.

#### Key behaviors

When the flag is `True` and autocommit is `True`:

- `begin()` skips sending `BEGIN`
- `commit()` skips sending `COMMIT`
- `rollback_if_open()` skips sending `ROLLBACK`

dbt still maintains its internal `transaction_open` state to preserve compatibility with dbt’s transaction tracking, even when actual statements are skipped.

### Enabling the optimization

To skip unnecessary transaction statements when autocommit is enabled, set the flag to `True` in your `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
flags:
  redshift_skip_autocommit_transaction_statements: true
```

</File>

### Backward compatibility

- **`autocommit=False`**: Unchanged. Explicit transactions still work as before regardless of this flag.
- **`autocommit=True` with flag set to `True`**: Skips unnecessary transaction statements for better performance.
- **`autocommit=True` with flag set to `False` (default)**: Sends `BEGIN`/`COMMIT`/`ROLLBACK` statements (legacy behavior).
