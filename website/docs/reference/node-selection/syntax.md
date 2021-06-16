---
title: "Syntax overview"
---

dbt's node selection syntax makes it possible to run only specific resources in a given invocation of dbt. This selection syntax is used for the following subcommands:

| command   | argument(s)                                                          |
| :-------- | -------------------------------------------------------------------- |
| run       | `--models`, `--exclude`, `--selector`, `--defer`                     |
| test      | `--models`, `--exclude`, `--selector`, `--defer`                     |
| seed      | `--select`, `--exclude`, `--selector`                                |
| snapshot  | `--select`, `--exclude`  `--selector`                                |
| ls (list) | `--select`, `--models`, `--exclude`, `--selector`, `--resource-type` |
| compile   | `--select`, `--exclude`, `--selector`                                |

:::info Nodes and resources

We use the terms <a href="https://en.wikipedia.org/wiki/Vertex_(graph_theory)">"nodes"</a> and "resources" interchangeably. These  encompass all the models, tests, sources, seeds, snapshots, and analyses in your project. They are the objects that make up dbt's DAG (directed acyclic graph).
:::

## Specifying resources

By default, `dbt run` executes _all_ of the models in the dependency graph; `dbt seed` creates all seeds, `dbt snapshot` performs every snapshot. The `--models` and `--select` flags are used to specify a subset of nodes to execute.

### Shorthand

Select models to run or test: `--models`, `--model`, `-m`
Select resources to list, seed, or snapshot: `--select`, `-s`

### Examples

By default, `dbt run` will execute _all_ of the models in the dependency graph. During development (and deployment), it is useful to specify only a subset of models to run. Use the `--models` flag with `dbt run` to select a subset of models to run. Note that the following arguments (`--models`, `--exclude`, and `--selector`) also apply to `dbt test`!

The `--models` and `--select` flags accept one or more arguments. Each argument can be one of:

1. a package name
2. a model name
3. a fully-qualified path to a directory of models
4. a selector method (`path:`, `tag:`, `config:`, `test_type:`, `test_name:`)

Examples:
```bash
$ dbt run --models my_dbt_project_name   # runs all models in your project
$ dbt run --models my_dbt_model          # runs a specific model
$ dbt run --models path.to.my.models     # runs all models in a specific directory
$ dbt run --models my_package.some_model # run a specific model in a specific package
$ dbt run --models tag:nightly           # run models with the "nightly" tag
$ dbt run --models path/to/models        # run models contained in path/to/models
$ dbt run --models path/to/my_model.sql  # run a specific model by its path
```

dbt supports a shorthand language for defining subsets of nodes. This language uses the characters `+`, `@`, `*`, and `,`.

```bash
# multiple arguments can be provided to --models
$ dbt run --models my_first_model my_second_model

# these arguments can be projects, models, directory paths, tags, or sources
$ dbt run --models tag:nightly my_model finance.base.*

# use methods and intersections for more complex selectors
$ dbt run --models path:marts/finance,tag:nightly,config.materialized:table
```
