---
title: "Amazon Redshift adapter behavior changes"
id: "redshift-changes"
sidebar: "Redshift"
---

## The restrict_direct_pg_catalog_access flag

Originally, the `dbt-redshift` adapter was built on top of the `dbt-postgres` adapter and used Postgres tables for metadata access. When this flag is enabled, the adapter uses the Redshift API (through the Python client) if available, or queries Redshift's `information_schema` tables instead of using the `pg_` tables.

While you shouldn't notice any behavior changes due to this change, however, to be cautious dbt Labs is gating it behind a behavior-change flag and encouraging you to test it before it becoming the default.
