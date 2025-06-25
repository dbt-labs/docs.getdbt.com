---
title: "Configure state selection"
description: "Learn how to configure state selection in dbt."
pagination_next: "reference/node-selection/state-comparison-caveats"
---

State and [defer](/reference/node-selection/defer) can be set by environment variables as well as CLI flags:

- `--state` or `DBT_STATE`: file path
- `--defer` or `DBT_DEFER`: boolean
- `--defer-state` or `DBT_DEFER_STATE`: file path to use for deferral only (optional)

If `--defer-state` is not specified, deferral will use the artifacts supplied by `--state`. This enables more granular control in cases where you want to compare against logical state from one environment or past point in time, and defer to applied state from a different environment or point in time.

If both the flag and env var are provided, the flag takes precedence.

#### Notes
- The `--state` artifacts must be of schema versions that are compatible with the currently running dbt version.
- These are powerful, complex features. Read about [known caveats and limitations](/reference/node-selection/state-comparison-caveats) to state comparison.

:::warning Syntax deprecated

In [dbt v1.5](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.5#behavior-changes), we deprecated the original syntax for state (`DBT_ARTIFACT_STATE_PATH`) and defer (`DBT_DEFER_TO_STATE`). Although dbt supports backward compatibility with the old syntax, we will remove it in a future release that we have not yet determined.

:::

### The "result" status

Another element of job state is the `result` of a prior dbt invocation. After executing a `dbt run`, for example, dbt creates the `run_results.json` artifact which contains execution times and success / error status for dbt models. You can read more about `run_results.json` on the ['run results'](/reference/artifacts/run-results-json) page. 

The following dbt commands produce `run_results.json` artifacts whose results can be referenced in subsequent dbt invocations:  
- `dbt run`
- `dbt test`
- `dbt build`
- `dbt seed` 

After issuing one of the above commands, you can reference the results by adding a selector to a subsequent command as follows: 

```bash
# You can also set the DBT_STATE environment variable instead of the --state flag.
dbt run --select "result:<status>" --defer --state path/to/prod/artifacts
```

The available options depend on the resource (node) type: 

|      `result:\<status>`        | model | seed | snapshot | test |
|----------------|-------|------|------|----------|
| `result:error`   | ✅  | ✅   | ✅   |  ✅      |
| `result:success` | ✅  | ✅   | ✅   |          |
| `result:skipped` | ✅  |      | ✅   |  ✅      |
| `result:fail`    |     |      |      |  ✅      |
| `result:warn`    |     |      |      |  ✅      |
| `result:pass`    |     |      |      |  ✅      |

### Combining `state` and `result` selectors

The state and result selectors can also be combined in a single invocation of dbt to capture errors from a previous run OR any new or modified models.

```bash
dbt run --select "result:<status>+" state:modified+ --defer --state ./<dbt-artifact-path>
```

### The "source_status" status

Another element of job state is the `source_status` of a prior dbt invocation. After executing `dbt source freshness`, for example, dbt creates the `sources.json` artifact which contains execution times and `max_loaded_at` dates for dbt sources. You can read more about `sources.json` on the ['sources'](/reference/artifacts/sources-json) page. 

The `dbt source freshness` command produces a `sources.json` artifact whose results can be referenced in subsequent dbt invocations. 

When a job is selected, <Constant name="cloud" /> will surface the artifacts from that job's most recent successful run. dbt will then use those artifacts to determine the set of fresh sources. In your job commands, you can signal dbt to run and test only on the fresher sources and their children by including the `source_status:fresher+` argument. This requires both the previous and current states to have the `sources.json` artifact available. Or plainly said, both job states need to run `dbt source freshness`.

After issuing the `dbt source freshness` command, you can reference the source freshness results by adding a selector to a subsequent command:

```bash
# You can also set the DBT_STATE environment variable instead of the --state flag.
dbt source freshness # must be run again to compare current to previous state
dbt build --select "source_status:fresher+" --state path/to/prod/artifacts
```
For more example commands, refer to [Pro-tips for workflows](/best-practices/best-practice-workflows#pro-tips-for-workflows).

## Related docs
- [About state in dbt](/reference/node-selection/state-selection)
- [State comparison caveats](/reference/node-selection/state-comparison-caveats)
