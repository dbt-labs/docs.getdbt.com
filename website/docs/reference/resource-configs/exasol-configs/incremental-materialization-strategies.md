---
title: "Incremental materialization strategies"
sidebar_label: "Incremental strategies"
description: "The incremental materialization strategies dbt-exasol supports, including append, merge, delete+insert, and microbatch."
---

In dbt-exasol, the following incremental materialization strategies are supported:

- `append` (default when `unique_key` is not defined)
- `merge`
- `delete+insert` (default when `unique_key` is defined)
- [`microbatch`](/docs/build/incremental-microbatch)

All of these strategies are inherited from dbt-core. For more information on incremental strategies, refer to the [incremental strategy documentation](/docs/build/incremental-strategy).
