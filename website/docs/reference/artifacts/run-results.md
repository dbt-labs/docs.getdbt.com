---
title: Run Results
---

_Produced by:_
- `dbt run`
- `dbt test`
- `dbt seed`
- `dbt snapshot`
- `dbt docs generate`

This file contains information about the last run of dbt. Crucially, it contains the compiled SQL for every model in your project. dbt uses this file to render the compiled SQL directly into the documentation site.

### Top-level keys

- [`metadata`](dbt-artifacts#common-metadata)
- `args`: Dictionary of CLI or RPC arguments passed to the command that produced this artifact. Excludes null values, and includes default values if they are not null.
- `elapsed_time`: Total invocation time in seconds.
- `results`: Array of node execution details.
