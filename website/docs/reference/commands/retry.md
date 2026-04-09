---
title: "About dbt retry command"
sidebar_label: "retry"
id: "retry"
---


`dbt retry` re-executes the last `dbt` command from the node point of failure.
- If no nodes are executed before the failure (for example, if a run failed early due to a warehouse connection or permission errors), `dbt retry` won't run anything since there's no recorded nodes to retry from.
- In these cases, we recommend checking your [`run_results.json` file](/reference/artifacts/run-results-json) and manually re-running the full job so the nodes build. 
- Once some nodes have run, you can use `dbt retry` to re-execute from any new point of failure.
- If the previously executed command completed successfully, `dbt retry` will finish as `no operation`. 

## Retry flags

`dbt retry` accepts the following flags:

| Flag | Input value | Description | Example |
|------|-------------|-------------|---------|
| `--threads` | int | Override the number of threads used in the original run | `--threads 8` |
| `--vars` | yaml | Override variables from the original run | `--vars '{"my_var": "new_value"}'` |
| `--target` | target | Override the target from the original run | `--target prod` |
| `--profile` | profile | Override the profile from the original run | `--profile jaffle_shop` |
| `--profiles-dir` | path | Path to the directory containing `profiles.yml` | `--profiles-dir ~/.dbt` |
| `--project-dir` | path | Path to the directory containing `dbt_project.yml` | `--project-dir .` |
| `--target-path` | path | Override the target directory path | `--target-path target` |
| `--state` | path | Path to a directory containing `run_results.json` from a previous run (defaults to the target directory) | `--state path/to/previous/run` |
| `--full-refresh` | — | Override incremental models to run as full refreshes | `--full-refresh` |

All other flags (selectors, `--select`, `--exclude`, etc.) are inherited from the original command and cannot be overridden.

### Examples

Basic retry re-runs failed nodes from the previous command:
```shell
dbt retry
```

Retry using a specific target:
```shell
dbt retry --target prod
```

Retry with more threads:
```shell
dbt retry --threads 8
```

Retry with variable overrides:
```shell
dbt retry --vars '{"my_var": "new_value"}'
```

Retry using run results from a different directory (for example, from CI artifacts):
```shell
dbt retry --state path/to/previous/run
```

Retry with full refresh for incremental models:
```shell
dbt retry --full-refresh
```

## Supported commands

Retry works with the following commands:

- [`build`](/reference/commands/build)
- [`compile`](/reference/commands/compile)
- [`clone`](/reference/commands/clone)
- [`docs generate`](/reference/commands/cmd-docs#dbt-docs-generate)
- [`seed`](/reference/commands/seed)
- [`snapshot`](/reference/commands/build)
- [`test`](/reference/commands/test)
- [`run`](/reference/commands/run)
- [`run-operation`](/reference/commands/run-operation)

`dbt retry` references [run_results.json](/reference/artifacts/run-results-json) to determine where to start. Executing `dbt retry` without correcting the previous failures will garner <Term id="idempotent" /> results.

`dbt retry` reuses the [selectors](/reference/node-selection/yaml-selectors) from the previously executed command.


Example results of executing `dbt retry` after a successful `dbt run`:

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models
 
Nothing to do. Try checking your model configs and model specification args
```

Example of when `dbt run` encounters a syntax error in a model: 

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models

Concurrency: 24 threads (target='dev')
 
1 of 5 START sql view model main.stg_customers ................................. [RUN]
2 of 5 START sql view model main.stg_orders .................................... [RUN]
3 of 5 START sql view model main.stg_payments .................................. [RUN]
1 of 5 OK created sql view model main.stg_customers ............................ [OK in 0.06s]
2 of 5 OK created sql view model main.stg_orders ............................... [OK in 0.06s]
3 of 5 OK created sql view model main.stg_payments ............................. [OK in 0.07s]
4 of 5 START sql table model main.customers .................................... [RUN]
5 of 5 START sql table model main.orders ....................................... [RUN]
4 of 5 ERROR creating sql table model main.customers ........................... [ERROR in 0.03s]
5 of 5 OK created sql table model main.orders .................................. [OK in 0.04s]
 
Finished running 3 view models, 2 table models in 0 hours 0 minutes and 0.15 seconds (0.15s).
  
Completed with 1 error and 0 warnings:
  
Runtime Error in model customers (models/customers.sql)
 Parser Error: syntax error at or near "selct"

Done. PASS=4 WARN=0 ERROR=1 SKIP=0 TOTAL=5
```


Example of a subsequent failed `dbt retry` run without fixing the error(s):

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models

Concurrency: 24 threads (target='dev')

1 of 1 START sql table model main.customers .................................... [RUN]
1 of 1 ERROR creating sql table model main.customers ........................... [ERROR in 0.03s]

Done. PASS=4 WARN=0 ERROR=1 SKIP=0 TOTAL=5
```

Example of a successful `dbt retry` run after fixing error(s):

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models
 
Concurrency: 24 threads (target='dev')

1 of 1 START sql table model main.customers .................................... [RUN]
1 of 1 OK created sql table model main.customers ............................... [OK in 0.05s]

Finished running 1 table model in 0 hours 0 minutes and 0.09 seconds (0.09s).
 
Completed successfully
  
Done. PASS=1 WARN=0 ERROR=0 SKIP=0 TOTAL=1
```

In each scenario `dbt retry` picks up from the error rather than running all of the upstream dependencies again. 
