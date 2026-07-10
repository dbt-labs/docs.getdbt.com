---
title: "Incremental materialization strategies"
sidebar_label: "Incremental materialization strategies"
description: "Review the incremental materialization strategies the Redshift adapter supports, including append, merge, delete+insert, and microbatch."
---

In dbt-redshift, the following incremental materialization strategies are supported:

- `append` (default when `unique_key` is not defined)
- `merge`
- `delete+insert` (default when `unique_key` is defined)
- [`microbatch`](/docs/build/incremental-microbatch)

All of these strategies are inherited from dbt-postgres.
