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

## The `redshift_skip_autocommit_transaction_statements` flag {#redshift_skip_autocommit_transaction_statements-flag}

Available starting `dbt-redshift` 1.12.0.

The `redshift_skip_autocommit_transaction_statements` flag controls whether dbt sends explicit [`BEGIN`](https://docs.aws.amazon.com/redshift/latest/dg/r_BEGIN.html), [`COMMIT`](https://docs.aws.amazon.com/redshift/latest/dg/r_COMMIT.html), and [`ROLLBACK`](https://docs.aws.amazon.com/redshift/latest/dg/r_ROLLBACK.html) statements to Amazon Redshift when autocommit is enabled. Since `dbt-redshift` 1.5, the default Redshift connection uses `autocommit=True`, so the driver already commits each statement. In that setup, the statements are redundant when autocommit is enabled and add extra round trips to Redshift.

- When set to `False` (default), dbt sends `BEGIN`, `COMMIT`, and `ROLLBACK` statements (legacy behavior).
- When set to `True`, dbt does not send `BEGIN`, `COMMIT`, or `ROLLBACK` statements to Redshift, which can reduce round trips and improve performance. dbt still calls `begin()`, `commit()`, and `rollback_if_open()` on the connection, but no longer issues the matching SQL:

  - `begin()` is invoked, but dbt does not execute `BEGIN` on Redshift.
  - `commit()` is invoked, but dbt does not execute `COMMIT` on Redshift.
  - `rollback_if_open()` is invoked, but dbt does not execute `ROLLBACK` on Redshift.

dbt still maintains its internal `transaction_open` state so transaction tracking remains consistent even when those SQL statements are skipped.

To skip unnecessary transaction statements when `autocommit` is enabled, set the flag to `True` in your `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
flags:
  redshift_skip_autocommit_transaction_statements: true
```

</File>

### How this flag interacts with `autocommit`

- If the connection uses `autocommit=False`, dbt’s explicit transaction behavior is unchanged.
- If the connection uses `autocommit=True` (default) and the flag is `False` (default), dbt still sends `BEGIN`, `COMMIT`, and `ROLLBACK`.
- If the connection uses `autocommit=True` and the flag is `True`, dbt skips those statements.
