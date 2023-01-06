---
title: "Syntax overview"
---

dbt's node selection syntax makes it possible to run only specific resources in a given invocation of dbt. This selection syntax is used for the following subcommands:

| command                         | argument(s)                                                          |
| :------------------------------ | -------------------------------------------------------------------- |
| [run](commands/run)             | `--select`, `--exclude`, `--selector`, `--defer`                     |
| [test](commands/test)           | `--select`, `--exclude`, `--selector`, `--defer`                     |
| [seed](commands/seed)           | `--select`, `--exclude`, `--selector`                                |
| [snapshot](commands/snapshot)   | `--select`, `--exclude`  `--selector`                                |
| [ls (list)](commands/list)      | `--select`, `--exclude`, `--selector`, `--resource-type`             |
| [compile](commands/compile)     | `--select`, `--exclude`, `--selector`                                |
| [freshness](commands/source)    | `--select`, `--exclude`, `--selector`                                |
| [build](commands/build)         | `--select`, `--exclude`, `--selector`, `--resource-type`, `--defer`  |

:::info Nodes and resources

We use the terms <a href="https://en.wikipedia.org/wiki/Vertex_(graph_theory)">"nodes"</a> and "resources" interchangeably. These  encompass all the models, tests, sources, seeds, snapshots, exposures, and analyses in your project. They are the objects that make up dbt's DAG (directed acyclic graph).
:::

## Specifying resources

By default, `dbt run` executes _all_ of the models in the dependency graph; `dbt seed` creates all seeds, `dbt snapshot` performs every snapshot. The `--select` flag is used to specify a subset of nodes to execute.

:::info
Before dbt v0.21, certain commands (notably `run`, `test`, and `compile`) used a flag called `--models` instead of `--select`. The two were functionally identical. Those commands still support the `--models` flag for backwards compatibility.
:::

### How does selection work?

1. dbt gathers all the resources that are matched by one or more of the `--select` criteria, in the order of selection methods (e.g. `tag:`), then graph operators (e.g. `+`), then finally set operators (unions, intersections, exclusions).

2. The selected resources may be models, sources, seeds, snapshots, tests. (Tests can also be selected "indirectly" via their parents; see [test selection examples](test-selection-examples) for details.)

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

<VersionBlock firstVersion="0.21">

  ```bash
  $ dbt run --select my_dbt_project_name   # runs all models in your project
  $ dbt run --select my_dbt_model          # runs a specific model
  $ dbt run --select path.to.my.models     # runs all models in a specific directory
  $ dbt run --select my_package.some_model # run a specific model in a specific package
  $ dbt run --select tag:nightly           # run models with the "nightly" tag
  $ dbt run --select path/to/models        # run models contained in path/to/models
  $ dbt run --select path/to/my_model.sql  # run a specific model by its path
  ```

</VersionBlock>
<VersionBlock lastVersion="0.20">

  ```bash
  $ dbt run --models my_dbt_project_name   # runs all models in your project
  $ dbt run --models my_dbt_model          # runs a specific model
  $ dbt run --models path.to.my.models     # runs all models in a specific directory
  $ dbt run --models my_package.some_model # run a specific model in a specific package
  $ dbt run --models tag:nightly           # run models with the "nightly" tag
  $ dbt run --models path/to/models        # run models contained in path/to/models
  $ dbt run --models path/to/my_model.sql  # run a specific model by its path
  ```

</VersionBlock>

dbt supports a shorthand language for defining subsets of nodes. This language uses the characters `+`, `@`, `*`, and `,`.

<VersionBlock firstVersion="0.21">

  ```bash
  # multiple arguments can be provided to --select
  $ dbt run --select my_first_model my_second_model

  # these arguments can be projects, models, directory paths, tags, or sources
  $ dbt run --select tag:nightly my_model finance.base.*

  # use methods and intersections for more complex selectors
  $ dbt run --select path:marts/finance,tag:nightly,config.materialized:table
  ```

</VersionBlock>
<VersionBlock lastVersion="0.20">

  ```bash
  # multiple arguments can be provided to --select
  $ dbt run --models my_first_model my_second_model

  # these arguments can be projects, models, directory paths, tags, or sources
  $ dbt run --models tag:nightly my_model finance.base.*

  # use methods and intersections for more complex selectors
  $ dbt run --models path:marts/finance,tag:nightly,config.materialized:table
  ```

</VersionBlock>

As your selection logic gets more complex, and becomes unwieldly to type out as command-line arguments,
consider using a [yaml selector](yaml-selectors). You can use a predefined definition with the `--selector` flag.
Note that when you're using `--selector`, most other flags (namely `--select` and `--exclude`) will be ignored.

<Snippet src="discourse-help-feed-header" />
<DiscourseHelpFeed tags="node-selection"/>
