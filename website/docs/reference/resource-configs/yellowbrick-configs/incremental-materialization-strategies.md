---
title: "Incremental materialization strategies"
sidebar_label: "Incremental strategies"
description: "Learn which incremental materialization strategies the dbt-yellowbrick adapter supports, inherited from dbt-postgres."
---

The dbt-yellowbrick adapter supports the following incremental materialization strategies:

- `append` (default when `unique_key` is not defined)
- `delete+insert` (default when `unique_key` is defined)

All of these strategies are inherited from the dbt-postgres adapter.
