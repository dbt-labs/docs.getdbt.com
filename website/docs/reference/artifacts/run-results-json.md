---
title: "Run results JSON file"
sidebar_label: "Run results"
---

**Current schema**: [`v5`](https://schemas.getdbt.com/dbt/run-results/v5/index.html)

 **Produced by:**
 [`build`](/reference/commands/build)
 [`compile`](/reference/commands/compile)
 [`docs generate`](/reference/commands/cmd-docs)
 [`run`](/reference/commands/run)
 [`seed`](/reference/commands/seed)
 [`snapshot`](/reference/commands/snapshot)
 [`test`](/reference/commands/test) <VersionBlock firstVersion="1.6">[`run-operation`](/reference/commands/run-operation) </VersionBlock>
 

This file contains information about a completed invocation of dbt, including timing and status info for each node (model, test, etc) that was executed. In aggregate, many `run_results.json` can be combined to calculate average model runtime, test failure rates, the number of record changes captured by snapshots, etc.

Note that only executed nodes appear in the run results. If you have multiple run or test steps with different critiera, each will produce different run results.

Note: `dbt source freshness` produces a different artifact, [`sources.json`](/reference/artifacts/sources-json), with similar attributes.

### Top-level keys

- [`metadata`](/reference/artifacts/dbt-artifacts#common-metadata)
- `args`: Dictionary of arguments passed to the CLI command or RPC method that produced this artifact. Most useful is `which` (command) or `rpc_method`. This dict excludes null values, and includes default values if they are not null. <VersionBlock firstVersion="1.3">Equivalent to [`invocation_args_dict`](/reference/dbt-jinja-functions/flags#invocation_args_dict) in the dbt-Jinja context.</VersionBlock>
- `elapsed_time`: Total invocation time in seconds.
- `results`: Array of node execution details.

Each entry in `results` is a [`Result` object](/reference/dbt-classes#result-objects), with one difference: Instead of including the entire `node` object, only the `unique_id` is included. (The full `node` object is recorded in [`manifest.json`](/reference/artifacts/manifest-json).)

- `unique_id`: Unique node identifier, which map results to `nodes` in the [manifest](/reference/artifacts/manifest-json)
- `status`: dbt's interpretation of runtime success, failure, or error
- `thread_id`: Which thread executed this node? E.g. `Thread-1`
- `execution_time`: Total time spent executing this node
- `timing`: Array that breaks down execution time into steps (often `compile` + `execute`)
- `message`: How dbt will report this result on the CLI, based on information returned from the database

import RowsAffected from '/snippets/_run-result.md'; 

<RowsAffected/>

<!-- this partial comes from https://github.com/dbt-labs/docs.getdbt.com/tree/current/website/snippets/_run-result-->


