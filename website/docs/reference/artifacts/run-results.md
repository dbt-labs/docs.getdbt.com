---
title: Run Results
---

_Current schema_: https://schemas.getdbt.com/dbt/run-results/v1.json
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

Each entry in `results` is a dictionary with the following keys:

- `unique_id`: Unique node identifier, which map results to `nodes` in the [manifest](artifacts/manifest)
- `status`: dbt's interpretation of runtime success, failure, or error
- `thread_id`: Which thread executed this node? E.g. `Thread-1`
- `execution_time`: Total time spent executing this node
- `timing`: Array that breaks down execution time into steps (often `compile` + `execute`)
- `adapter_response`: Dictionary of information returned from the database, which varies by adapter. E.g. success `code`, number of `rows_affected`, total `bytes_processed`, etc.
- `message`: How dbt will report this result on the CLI, based on information returned from the database
