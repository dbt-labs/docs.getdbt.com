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
 [`test`](/reference/commands/test) 
 [`run-operation`](/reference/commands/run-operation)
 

This file contains information about a completed invocation of dbt, including timing and status info for each node (model, test, etc) that was executed. In aggregate, many `run_results.json` can be combined to calculate average model runtime, test failure rates, the number of record changes captured by snapshots, etc.

Note that only executed nodes appear in the run results. If you have multiple run or test steps with different critiera, each will produce different run results.

Note: `dbt source freshness` produces a different artifact, [`sources.json`](/reference/artifacts/sources-json), with similar attributes.

### Top-level keys

- [`metadata`](/reference/artifacts/dbt-artifacts#common-metadata)
- `args`: Dictionary of arguments passed to the CLI command or RPC method that produced this artifact. Most useful is `which` (command) or `rpc_method`. This dict excludes null values, and includes default values if they are not null. Equivalent to [`invocation_args_dict`](/reference/dbt-jinja-functions/flags#invocation_args_dict) in the dbt-Jinja context.
- `elapsed_time`: Total invocation time in seconds.
- `results`: Array of node execution details.

Each entry in `results` is a [`Result` object](/reference/dbt-classes#result-objects), with one difference: Instead of including the entire `node` object, only the `unique_id` is included. (The full `node` object is recorded in [`manifest.json`](/reference/artifacts/manifest-json).)

- `unique_id`: Unique node identifier, which maps results to `nodes` in the [manifest](/reference/artifacts/manifest-json)
- `status`: dbt's interpretation of runtime success, failure, or error
- `thread_id`: Which thread executed this node? E.g. `Thread-1`
- `execution_time`: Total time spent executing this node
- `timing`: Array that breaks down execution time into steps (often `compile` + `execute`)
- `message`: How dbt will report this result on the CLI, based on information returned from the database

import RowsAffected from '/snippets/_run-result.md';

<RowsAffected/>

<!-- this partial comes from https://github.com/dbt-labs/docs.getdbt.com/tree/current/website/snippets/_run-result-->

The run_results.json includes three attributes related to the `applied` state that complement `unique_id`:

- `compiled`: Boolean entry of the node compilation status (`False` after parsing, but `True` after compiling).
- `compiled_code`: Rendered string of the code that was compiled (empty after parsing, but full string after compiling).
- `relation_name`: The fully-qualified name of the object that was (or will be) created/updated within the database.

Continue to look up additional information about the `logical` state of nodes using the full node object in manifest.json via the `unique_id`.

## Examples

Here are a few examples and the resulting output to the `run_results.json` file.

### Compile model results

Let's say that you have a model that looks like this:

<File name='models/my_model.sql'>

```sql
select {{ dbt.current_timestamp() }} as created_at
```

</File>

Compile the model:

```shell
dbt compile -s my_model
```

Here's a printed snippet from the `run_results.json`:

```json
    {
      "status": "success",
      "timing": [
        {
          "name": "compile",
          "started_at": "2023-10-12T16:35:28.510434Z",
          "completed_at": "2023-10-12T16:35:28.519086Z"
        },
        {
          "name": "execute",
          "started_at": "2023-10-12T16:35:28.521633Z",
          "completed_at": "2023-10-12T16:35:28.521641Z"
        }
      ],
      "thread_id": "Thread-2",
      "execution_time": 0.0408780574798584,
      "adapter_response": {},
      "message": null,
      "failures": null,
      "unique_id": "model.my_project.my_model",
      "compiled": true,
      "compiled_code": "select now() as created_at",
      "relation_name": "\"postgres\".\"dbt_dbeatty\".\"my_model\""
    }
```

### Run generic data tests

Use the [`store_failures_as`](/reference/resource-configs/store_failures_as) config to store failures for only one data test in the database:

<File name='models/_models.yml'>

```yaml
models:
  - name: my_model
    columns:
      - name: created_at
        tests:
          - not_null:
              config:
                store_failures_as: view
          - unique:
              config:
                store_failures_as: ephemeral
```

</File>

Run the built-in `unique` test and store the failures as a table:

```shell
dbt test -s my_model
```

Here's a printed snippet from the `run_results.json`:

```json
  "results": [
    {
      "status": "pass",
      "timing": [
        {
          "name": "compile",
          "started_at": "2023-10-12T17:20:51.279437Z",
          "completed_at": "2023-10-12T17:20:51.317312Z"
        },
        {
          "name": "execute",
          "started_at": "2023-10-12T17:20:51.319812Z",
          "completed_at": "2023-10-12T17:20:51.441967Z"
        }
      ],
      "thread_id": "Thread-2",
      "execution_time": 0.1807551383972168,
      "adapter_response": {
        "_message": "SELECT 1",
        "code": "SELECT",
        "rows_affected": 1
      },
      "message": null,
      "failures": 0,
      "unique_id": "test.my_project.unique_my_model_created_at.a9276afbbb",
      "compiled": true,
      "compiled_code": "\n    \n    \n\nselect\n    created_at as unique_field,\n    count(*) as n_records\n\nfrom \"postgres\".\"dbt_dbeatty\".\"my_model\"\nwhere created_at is not null\ngroup by created_at\nhaving count(*) > 1\n\n\n",
      "relation_name": null
    },
    {
      "status": "pass",
      "timing": [
        {
          "name": "compile",
          "started_at": "2023-10-12T17:20:51.274049Z",
          "completed_at": "2023-10-12T17:20:51.295237Z"
        },
        {
          "name": "execute",
          "started_at": "2023-10-12T17:20:51.296361Z",
          "completed_at": "2023-10-12T17:20:51.491327Z"
        }
      ],
      "thread_id": "Thread-1",
      "execution_time": 0.22345590591430664,
      "adapter_response": {
        "_message": "SELECT 1",
        "code": "SELECT",
        "rows_affected": 1
      },
      "message": null,
      "failures": 0,
      "unique_id": "test.my_project.not_null_my_model_created_at.9b412fbcc7",
      "compiled": true,
      "compiled_code": "\n    \n    \n\n\n\nselect *\nfrom \"postgres\".\"dbt_dbeatty\".\"my_model\"\nwhere created_at is null\n\n\n",
      "relation_name": "\"postgres\".\"dbt_dbeatty_dbt_test__audit\".\"not_null_my_model_created_at\""
    }
  ],
```
