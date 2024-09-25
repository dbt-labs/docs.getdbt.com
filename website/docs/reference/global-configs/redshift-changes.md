---
title: "Redshift adapter behavior changes"
id: "redshift-changes"
sidebar: "Redshift"
---

## restrict_direct_pg_catalog_access

Originally, the `dbt-redshift` adapter was built on top of the `dbt-postgres` adapter and used Postgres tables for metadata access. With this flag enabled, the adapter will use the Redshift API (through the Python client) if available, or query Redshift's `information_schema` tables instead of using `pg_` tables.

While we don't expect any user-noticeable behavior changes due to this change, out of caution we are gating it behind a behavior-change flag and encouraging users to test it before it becomes the default for everyone.
