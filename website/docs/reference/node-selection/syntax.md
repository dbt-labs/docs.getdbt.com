---
title: "Syntax overview"
---

dbt's node selection syntax makes it possible to run only specific resources in a given invocation of dbt. This selection syntax is used for the following subcommands:

| command                         | argument(s)                                                          |
| :------------------------------ | -------------------------------------------------------------------- |
| [run](/reference/commands/run)             | `--select`, `--exclude`, `--selector`, `--defer`                     |
| [test](/reference/commands/test)           | `--select`, `--exclude`, `--selector`, `--defer`                     |
| [seed](/reference/commands/seed)           | `--select`, `--exclude`, `--selector`                                |
| [snapshot](/reference/commands/snapshot)   | `--select`, `--exclude`  `--selector`                                |
| [ls (list)](/reference/commands/list)      | `--select`, `--exclude`, `--selector`, `--resource-type`             |
| [compile](/reference/commands/compile)     | `--select`, `--exclude`, `--selector`, `--inline`                    |
| [freshness](/reference/commands/source)    | `--select`, `--exclude`, `--selector`                                |
| [build](/reference/commands/build)         | `--select`, `--exclude`, `--selector`, `--resource-type`, `--defer`  |

:::info Nodes and resources

We use the terms <a href="https://en.wikipedia.org/wiki/Vertex_(graph_theory)">"nodes"</a> and "resources" interchangeably. These encompass all the models, tests, sources, seeds, snapshots, exposures, and analyses in your project. They are the objects that make up dbt's DAG (directed acyclic graph).
:::

## Specifying resources

By default, `dbt run` executes _all_ of the models in the dependency graph; `dbt seed` creates all seeds, `dbt snapshot` performs every snapshot. The `--select` flag is used to specify a subset of nodes to execute.

To follow [POSIX standards](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html) and make things easier to understand, we recommend CLI users use quotes when passing arguments to the `--select` or `--exclude` option (including single or multiple space-delimited, or comma-delimited arguments). Not using quotes might not work reliably on all operating systems, terminals, and user interfaces. For example, `dbt run --select "my_dbt_project_name"` runs all models in your project. 

### How does selection work?

1. dbt gathers all the resources that are matched by one or more of the `--select` criteria, in the order of selection methods (e.g. `tag:`), then graph operators (e.g. `+`), then finally set operators ([unions](/reference/node-selection/set-operators#unions), [intersections](/reference/node-selection/set-operators#intersections), [exclusions](/reference/node-selection/exclude)).

2. The selected resources may be models, sources, seeds, snapshots, tests. (Tests can also be selected "indirectly" via their parents; see [test selection examples](/reference/node-selection/test-selection-examples) for details.)

3. dbt now has a list of still-selected resources of varying types. As a final step, it tosses away any resource that does not match the resource type of the current task. (Only seeds are kept for `dbt seed`, only models for `dbt run`, only tests for `dbt test`, and so on.)

### Shorthand

Select resources to build (run, test, seed, snapshot) or check freshness: `--select`, `-s`

### Examples

By default, `dbt run` will execute _all_ of the models in the dependency graph. During development (and deployment), it is useful to specify only a subset of models to run. Use the `--select` flag with `dbt run` to select a subset of models to run. Note that the following arguments (`--select`, `--exclude`, and `--selector`) also apply to other dbt tasks, such as `test` and `build`.

The `--select` flag accepts one or more arguments. Each argument can be one of:

1. a package name
2. a model name
3. a fully-qualified path to a directory of models
4. a selection method (`path:`, `tag:`, `config:`, `test_type:`, `test_name:`)

Examples:


  ```bash
dbt run --select "my_dbt_project_name"   # runs all models in your project
dbt run --select "my_dbt_model"          # runs a specific model
dbt run --select "path.to.my.models"     # runs all models in a specific directory
dbt run --select "my_package.some_model" # run a specific model in a specific package
dbt run --select "tag:nightly"           # run models with the "nightly" tag
dbt run --select "path/to/models"        # run models contained in path/to/models
dbt run --select "path/to/my_model.sql"  # run a specific model by its path
  ```

dbt supports a shorthand language for defining subsets of nodes. This language uses the characters `+`, `@`, `*`, and `,`.


  ```bash
# multiple arguments can be provided to --select
 dbt run --select "my_first_model my_second_model"

# these arguments can be projects, models, directory paths, tags, or sources
dbt run --select "tag:nightly my_model finance.base.*"

# use methods and intersections for more complex selectors
dbt run --select "path:marts/finance,tag:nightly,config.materialized:table"
```

As your selection logic gets more complex, and becomes unwieldly to type out as command-line arguments,
consider using a [yaml selector](/reference/node-selection/yaml-selectors). You can use a predefined definition with the `--selector` flag.
Note that when you're using `--selector`, most other flags (namely `--select` and `--exclude`) will be ignored.

<Snippet path="discourse-help-feed-header" />
<DiscourseHelpFeed tags="node-selection"/>

## Stateful selection

One of the greatest underlying assumptions about dbt is that its operations should be **stateless** and **<Term id="idempotent" />**. That is, it doesn't matter how many times a model has been run before, or if it has ever been run before. It doesn't matter if you run it once or a thousand times. Given the same raw data, you can expect the same transformed result. A given run of dbt doesn't need to "know" about _any other_ run; it just needs to know about the code in the project and the objects in your database as they exist _right now_.

That said, dbt does store "state"—a detailed, point-in-time view of project resources (also referred to as nodes), database objects, and invocation results—in the form of its [artifacts](/docs/deploy/artifacts). If you choose, dbt can use these artifacts to inform certain  operations. Crucially, the operations themselves are still stateless and <Term id="idempotent" />: given the same manifest and the same raw data, dbt will produce the same transformed result.

dbt can leverage artifacts from a prior invocation as long as their file path is passed to the `--state` flag. This is a prerequisite for:
- [The `state:` selector](/reference/node-selection/methods#the-state-method), whereby dbt can identify resources that are new or modified
by comparing code in the current project against the state manifest.
- [Deferring](/reference/node-selection/defer) to another environment, whereby dbt can identify upstream, unselected resources that don't exist in your current environment and instead "defer" their references to the environment provided by the state manifest.
- The [`dbt clone` command](/reference/commands/clone), whereby dbt can clone nodes based on their location in the manifest provided to the `--state` flag.

Together, the `state:` selector and deferral enable ["slim CI"](/guides/legacy/best-practices#run-only-modified-models-to-test-changes-slim-ci). We expect to add more features in future releases that can leverage artifacts passed to the `--state` flag.

### Establishing state

State and defer can be set by environment variables as well as CLI flags:

<VersionBlock lastVersion="1.4">

- `--state` or `DBT_ARTIFACT_STATE_PATH`: file path
- `--defer` or `DBT_DEFER_TO_STATE`: boolean

</VersionBlock>

<VersionBlock firstVersion="1.5" lastVersion="1.6">

- `--state` or `DBT_STATE`: file path
- `--defer` or `DBT_DEFER`: boolean

:::warning Syntax deprecated

In dbt v1.5, we deprecated the original syntax for state (`DBT_ARTIFACT_STATE_PATH`) and defer (`DBT_DEFER_TO_STATE`). Although dbt supports backward compatibility with the old syntax, we will remove it in a future release that we have not yet determined.

:::

</VersionBlock>

<VersionBlock firstVersion="1.6">

- `--state` or `DBT_STATE`: file path
- `--defer` or `DBT_DEFER`: boolean
- `--defer-state` or `DBT_DEFER_STATE`: file path to use for deferral only (optional)

If `--defer-state` is not specified, deferral will use the artifacts supplied by `--state`. This enables more granular control in cases where you want to compare against logical state from one environment or past point in time, and defer to applied state from a different environment or point in time.

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
dbt run --select "result:<status> --defer --state path/to/prod/artifacts"
```

The available options depend on the resource (node) type: 

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
dbt run --select "result:<status>+ state:modified+ --defer --state ./<dbt-artifact-path>"
```

### Fresh rebuilds

Only supported by v1.1 or newer.

When a job is selected, dbt Cloud will surface the artifacts from that job's most recent successful run. dbt will then use those artifacts to determine the set of fresh sources. In your job commands, you can signal to dbt to run and test only on these fresher sources and their children by including the `source_status:fresher+` argument. This requires both previous and current state to have the `sources.json` artifact be available. Or plainly said, both job states need to run `dbt source freshness`.

As example:

```bash
# Command step order
dbt source freshness
dbt build --select "source_status:fresher+"
```


For more example commands, refer to [Pro-tips for workflows](/guides/legacy/best-practices.md#pro-tips-for-workflows).

### The "source_status" status

Only supported by v1.1 or newer.

Another element of job state is the `source_status` of a prior dbt invocation. After executing `dbt source freshness`, for example, dbt creates the `sources.json` artifact which contains execution times and `max_loaded_at` dates for dbt sources. You can read more about `sources.json` on the ['sources'](/reference/artifacts/sources-json) page. 

The following dbt commands produce `sources.json` artifacts whose results can be referenced in subsequent dbt invocations:  
- `dbt source freshness`

After issuing one of the above commands, you can reference the source freshness results by adding a selector to a subsequent command as follows: 

```bash
# You can also set the DBT_ARTIFACT_STATE_PATH environment variable instead of the --state flag.
dbt source freshness # must be run again to compare current to previous state
dbt build --select "source_status:fresher+" --state path/to/prod/artifacts
```
