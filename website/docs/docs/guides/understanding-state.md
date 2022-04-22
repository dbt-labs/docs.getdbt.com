---
title: "Understanding state"
---

<Changelog>

 - The `--state` flag was introduced in dbt v0.18.0
 - The `result` selector was introduced in dbt v1.0.0

</Changelog>

One of the greatest underlying assumptions about dbt is that its operations should be **stateless** and **<Term id="idempotent" />**. That is, it doesn't matter how many times a model has been run before, or if it has ever been run before. It doesn't matter if you run it once or a thousand times. Given the same raw data, you can expect the same transformed result. A given run of dbt doesn't need to "know" about _any other_ run; it just needs to know about the code in the project and the objects in your database as they exist _right now_.

That said, dbt does store "state"—a detailed, point-in-time view of project resources, database objects, and invocation results—in the form of its [artifacts](dbt-artifacts). If you choose, dbt can use these artifacts to inform certain  operations. Crucially, the operations themselves are still stateless and <Term id="idempotent" />: given the same manifest and the same raw data, dbt will produce the same transformed result.

dbt can leverage artifacts from a prior invocation as long as their file path is passed to the `--state` flag. This is a prerequsite for:
- [The `state:` selector](methods#the-state-method), whereby dbt can identify resources that are new or modified
by comparing code in the current project against the state manifest.
- [Deferring](defer) to another environment, whereby dbt can identify upstream, unselected resources that don't exist in your current environment and instead "defer" their references to the environment provided by the state manifest.

Together, these two features enable ["slim CI"](best-practices#run-only-modified-models-to-test-changes-slim-ci). We expect to add more features in future releases that can leverage artifacts passed to the `--state` flag.

### Establishing state

State and defer can be set by environment variables as well as CLI flags:

- `--state` or `DBT_ARTIFACT_STATE_PATH`: file path
- `--defer` or `DBT_DEFER_TO_STATE`: boolean

If both the flag and env var are provided, the flag takes precedence.

#### Notes:
- The `--state` artifacts must be of schema versions that are compatible with the currently running dbt version.
- The path to state artifacts can be set via the `--state` flag or `DBT_ARTIFACT_STATE_PATH` environment variable. If both the flag and env var are provided, the flag takes precedence.
- These are powerful, complex features. Read about [known caveats and limitations](node-selection/state-comparison-caveats) to state comparison.

### The "result" status

Another element of job state is the `result` of a prior dbt invocation. After executing a `dbt run`, for example, dbt creates the `run_results.json` artifact which contains execution times and success / error status for dbt models. You can read more about `run_results.json` on the ['run results'](/docs/reference/artifacts/run-results-json) page. 

The following dbt commands produce `run_results.json` artifacts whose results can be referenced in subsequent dbt invocations:  
- `dbt run`
- `dbt test`
- `dbt build` (new in dbt version v0.21.0)
- `dbt seed` 

After issuing one of the above commands, you can reference the results by adding a selector to a subsequent command as follows: 

```bash
# You can also set the DBT_ARTIFACT_STATE_PATH environment variable instead of the --state flag.
$ dbt run --select result:<status> --defer --state path/to/prod/artifacts
```

The available options depend on the node type: 

|                | model | seed | snapshot | test |
|----------------|-------|------|------|----------|
| `result:error`   | ✅    | ✅    | ✅    |  ✅      |
| `result:success` | ✅    | ✅    | ✅     |         |
| `result:skipped` | ✅    |      |  ✅    | ✅       |
| `result:fail`    |       |      |     |   ✅       |
| `result:warn`    |       |      |      |  ✅        |
| `result:pass`    |       |      |      |  ✅      |

### Combining `state` and `result` selectors

The state and result selectors can also be combined in a single invocation of dbt to capture errors from a previous run AND any new or modified models.

```bash
$ dbt run --select result:<status>+ state:modified+ --defer --state ./<dbt-artifact-path>
```

### The "source_status" status
<VersionBlock lastVersion="1.0">

Only supported by v1.1 or newer.

</VersionBlock>

<VersionBlock firstVersion="1.1">

Only supported by v1.1 or newer.

:::caution Experimental functionality
The `source_status` selection method is experimental and subject to change. During this time, ongoing improvements may limit this feature’s availability and cause breaking changes to its functionality.
:::


Another element of job state is the `source_status` of a prior dbt invocation. After executing `dbt source freshness`, for example, dbt creates the `sources.json` artifact which contains execution times and `max_loaded_at` dates for dbt sources. You can read more about `sources.json` on the ['sources'](/docs/reference/artifacts/sources-json) page. 

The following dbt commands produce `sources.json` artifacts whose results can be referenced in subsequent dbt invocations:  
- `dbt source freshness`

After issuing one of the above commands, you can reference the source freshness results by adding a selector to a subsequent command as follows: 

```bash
# You can also set the DBT_ARTIFACT_STATE_PATH environment variable instead of the --state flag.
$ dbt source freshness # must be run again to compare current to previous state
$ dbt build --select source_status:fresher+ --state path/to/prod/artifacts
```
</VersionBlock>