---
title: Run Results
---

_Current schema_: [`v4`](https://schemas.getdbt.com/dbt/run-results/v4/index.html)

_Produced by:_
- `dbt run`
- `dbt test`
- `dbt seed`
- `dbt snapshot`
- `dbt compile`
- `dbt docs generate`
- `dbt build`

This file contains information about a completed invocation of dbt, including timing and status info for each node (model, test, etc) that was executed. In aggregate, many `run_results.json` can be combined to calculate average model runtime, test failure rates, the number of record changes captured by snapshots, etc.

Note that only executed nodes appear in the run results. If you have multiple run or test steps with different critiera, each will produce different run results.

Note: `dbt source freshness` produces a different artifact, [`sources.json`](sources-json), with similar attributes.

### Top-level keys

- [`metadata`](dbt-artifacts#common-metadata)
- `args`: Dictionary of arguments passed to the CLI command or RPC method that produced this artifact. Most useful is `which` (command) or `rpc_method`. This dict excludes null values, and includes default values if they are not null. <VersionBlock firstVersion="1.3">Equivalent to [`invocation_args_dict`](flags#invocation_args_dict) in the dbt-Jinja context.</VersionBlock>
- `elapsed_time`: Total invocation time in seconds.
- `results`: Array of node execution details.

Each entry in `results` is a [`Result` object](dbt-classes#result-objects), with one difference: Instead of including the entire `node` object, only the `unique_id` is included. (The full `node` object is recorded in [`manifest.json`](manifest-json).)

- `unique_id`: Unique node identifier, which map results to `nodes` in the [manifest](manifest-json)
- `status`: dbt's interpretation of runtime success, failure, or error
- `thread_id`: Which thread executed this node? E.g. `Thread-1`
- `execution_time`: Total time spent executing this node
- `timing`: Array that breaks down execution time into steps (often `compile` + `execute`)
- `adapter_response`: Dictionary of metadata returned from the database, which varies by adapter. E.g. success `code`, number of `rows_affected`, total `bytes_processed`, etc. Not populated by tests, as of v0.19.0; we plan to fix in a future release ([dbt#2580](https://github.com/dbt-labs/dbt-core/issues/2580)).
- `message`: How dbt will report this result on the CLI, based on information returned from the database
