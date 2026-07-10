---
title: "Incremental materialization strategies"
sidebar_label: "Incremental strategies"
description: "Review the incremental materialization strategies supported in dbt-postgres, including append, merge, and microbatch."
---

In dbt-postgres, the following incremental materialization strategies are supported:

- `append` (default when `unique_key` is not defined)
- `merge`
- `delete+insert` (default when `unique_key` is defined)
- [`microbatch`](/docs/build/incremental-microbatch)
