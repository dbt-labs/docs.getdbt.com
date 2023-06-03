---
title: "Project state"
id: "project-state"
sidebar: "Project state"
---

One of the greatest underlying assumptions about dbt is that its operations should be **stateless** and **<Term id="idempotent" />**. That is, it doesn't matter how many times a model has been run before, or if it has ever been run before. It doesn't matter if you run it once or a thousand times. Given the same raw data, you can expect the same transformed result. A given run of dbt doesn't need to "know" about _any other_ run; it just needs to know about the code in the project and the objects in your database as they exist _right now_.

That said, dbt does store "state"—a detailed, point-in-time view of project resources, database objects, and invocation results—in the form of its [artifacts](/docs/deploy/artifacts). If you choose, dbt can use these artifacts to inform certain  operations. Crucially, the operations themselves are still stateless and <Term id="idempotent" />: given the same manifest and the same raw data, dbt will produce the same transformed result.

dbt can leverage artifacts from a prior invocation as long as their file path is passed to the `--state` flag. This is a prerequisite for:
- [The `state:` selector](/reference/node-selection/methods#the-state-method), whereby dbt can identify resources that are new or modified
by comparing code in the current project against the state manifest.
- [Deferring](/reference/node-selection/defer) to another environment, whereby dbt can identify upstream, unselected resources that don't exist in your current environment and instead "defer" their references to the environment provided by the state manifest.

Together, these two features enable ["slim CI"](/guides/legacy/best-practices#run-only-modified-models-to-test-changes-slim-ci). We expect to add more features in future releases that can leverage artifacts passed to the `--state` flag.

### Establishing state

State and defer can be set by environment variables as well as CLI flags:

<VersionBlock lastVersion="1.4">

- `--state` or `DBT_ARTIFACT_STATE_PATH`: file path
- `--defer` or `DBT_DEFER_TO_STATE`: boolean

</VersionBlock>

<VersionBlock firstVersion="1.5">

- `--state` or `DBT_STATE`: file path
- `--defer` or `DBT_DEFER`: boolean

:::warning Syntax deprecated

In dbt v1.5, we deprecated the original syntax for state (`DBT_ARTIFACT_STATE_PATH`) and defer (`DBT_DEFER_TO_STATE`). Although dbt supports backward compatibility with the old syntax, we will remove it in a future release that we have not yet determined.

:::

</VersionBlock>

If both the flag and env var are provided, the flag takes precedence.

#### Notes:
- The `--state` artifacts must be of schema versions that are compatible with the currently running dbt version.
- The path to state artifacts can be set via the `--state` flag or `DBT_ARTIFACT_STATE_PATH` environment variable. If both the flag and env var are provided, the flag takes precedence.
- These are powerful, complex features. Read about [known caveats and limitations](/reference/node-selection/state-comparison-caveats) to state comparison.

### The "result" status

Another element of job state is the `result` of a prior dbt invocation. After executing a `dbt run`, for example, dbt creates the `run_results.json` artifact which contains execution times and success / error status for dbt models. You can read more about `run_results.json` on the ['run results'](/reference/artifacts/run-results-json) page. 

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

The state and result selectors can also be combined in a single invocation of dbt to capture errors from a previous run OR any new or modified models.

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


Another element of job state is the `source_status` of a prior dbt invocation. After executing `dbt source freshness`, for example, dbt creates the `sources.json` artifact which contains execution times and `max_loaded_at` dates for dbt sources. You can read more about `sources.json` on the ['sources'](/reference/artifacts/sources-json) page. 

The following dbt commands produce `sources.json` artifacts whose results can be referenced in subsequent dbt invocations:  
- `dbt source freshness`

After issuing one of the above commands, you can reference the source freshness results by adding a selector to a subsequent command as follows: 

```bash
# You can also set the DBT_ARTIFACT_STATE_PATH environment variable instead of the --state flag.
$ dbt source freshness # must be run again to compare current to previous state
$ dbt build --select source_status:fresher+ --state path/to/prod/artifacts
```
</VersionBlock>

## Project state in dbt Cloud

dbt Cloud provides a stateful way of deploying dbt. Artifacts are accessible programmatically via the [Discovery API](/docs/dbt-cloud-apis/discovery-querying) in the metadata platform.

With the implementation of the `environment` endpoint in the Discovery API, we've introduced the idea of multiple states. The Discovery API provides a single API endpoint that returns the latest state of models, sources, and other nodes in the DAG. 

A single [deployment environment](/docs/collaborate/environments/environments-in-dbt) should represent the production state of a given dbt Cloud project.

There are two states that can be queried in dbt Cloud:

- **Applied state** refers to what exists in the data warehouse after a successful `dbt run`. The model build succeeds and now exists as a table in the warehouse.
    
- **Definition state** depends on what exists in the project given the code defined in it (for example, manifest state), which hasn’t necessarily been executed in the data platform (maybe just the result of `dbt compile`).

### Definition (logical) vs. applied state of dbt nodes

In a dbt project, the state of a _definition_ of a node represents the configuration, transformations, and dependencies defined in the SQL and YAML files. It captures how the node should be processed in relation to other nodes and tables in the data warehouse and may be produced by a `dbt build`, `run`, `parse`, or `compile`. It changes whenever the project code changes. 

A node’s _applied state_ refers to the node’s actual state after it has been successfully executed in the DAG; for example, models are executed; thus, their state is applied to the data warehouse via `dbt run` or `dbt build`. It changes whenever a node is executed. This state represents the result of the transformations and the actual data stored in the database, which for models can be a table or a view based on the defined logic.

The applied state includes execution info, which contains metadata about how the node arrived in the applied state: the most recent execution (successful or attempted), such as when it began, its status, and how long it took.

Here’s how you’d query and compare the definition  vs. applied state of a model using the Discovery API: 

```graphql
query Compare($environmentId: Int!, $first: Int!) {
	environment(id: $environmentId) {
		definition {
			models(first: $first) {
				edges {
					node {
						name
						rawCode
					}
				}
			}
		}
		applied {
			models(first: $first) {
				edges {
					node {
						name
						rawCode 
						executionInfo {
							executeCompletedAt
						}
					}
				}
			}
		}
	}
}

```

Most Discovery API use cases will favor the _applied state_ since it pertains to what has actually been run and can be analyzed.
 
### State nuance per node type

| Node      | Executed in DAG  | Created by execution | Exists in database | Lineage               | States               |
|-----------|------------------|----------------------|--------------------|-----------------------|----------------------|
| Model     | Yes              | Yes                  | Yes                | Upstream & downstream | Applied & definition |
| Source    | Yes              | No                   | Yes                | Downstream            | Applied & definition |
| Seed      | Yes              | Yes                  | Yes                | Downstream            | Applied & definition |
| Snapshot  | Yes              | Yes                  | Yes                | Upstream & downstream | Applied & definition |
| Test      | Yes              | Yes                  | No                 | Upstream              | Applied & definition |
| Exposure  | No               | No                   | No                 | Upstream              | Applied & definition |
| Metric    | No               | No                   | No                 | Upstream & downstream | Definition           |
| Semantic model | No          | No                   | No                 | Upstream & downstream | Definition           |
| Group     | No               | No                   | No                 | Downstream            | Definition           |
| Macro     | Yes              | No                   | No                 | N/A                   | Definition           |


 ### Caveats about state/metadata updates 

Over time, Cloud Artifacts will provide information to maintain state for features/services in dbt Cloud and enable you to access state in dbt Cloud and its downstream ecosystem. It is currently focused on the latest production state, but this focus will evolve.

Here are some limitations of the state representation in the Discovery API:

- Users must access the default production environment to know the latest state of a project.
- The API gets the definition from the latest manifest generated in a given deployment environment, but that often won’t reflect the latest project code state.
- Compiled code results may be outdated depending on dbt Cloud run step order and failures.
- Catalog info can be outdated, or incomplete (in the applied state), based on if/when docs were last generated.
- Source freshness checks can be out of date (in the applied state) depending on when the command was last run, and it’s not included in `build`. 
