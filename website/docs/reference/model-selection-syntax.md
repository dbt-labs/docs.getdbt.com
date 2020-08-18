---
title: "Model selection syntax"
id: "model-selection-syntax"
---

dbt's model selection syntax makes it possible to run only specific resources in a given invocation of dbt. The model selection syntax is used for the following subcommands:

| command   | argument(s)                                       |
| :-------- | ------------------------------------------------- |
| run       | `--models`, `--exclude`, `--selector`             |
| test      | `--models`, `--exclude`, `--selector`             |
| seed      | `--select`, `--exclude`                           |
| snapshot  | `--select`, `--exclude`                           |
| ls (list) | `--select`, `--models`, `--exclude`, `--selector` |
| compile   | `--select`, `--exclude`                           |




## Specifying models to run

By default, `dbt run` will execute _all_ of the models in the dependency graph. During development (and deployment), it is useful to specify only a subset of models to run. Use the `--models` flag with `dbt run` to select a subset of models to run. Note that the following arguments (`--models`, `--exclude`, and `--selector`) also apply to `dbt test`!

The `--models` flag accepts one or more arguments. Each argument can be one of:

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
$ dbt run --models 

# multiple arguments can be provided to --models
$ dbt run --models my_first_model my_second_model

# these arguments can be projects, models, directory paths, tags, or sources
$ dbt run --models tag:nightly my_model finance.base.*

# use methods and intersections for more complex selectors
$ dbt run --models path:marts/finance,tag:nightly,config.materialized:table
```

## Model selection
The flags `--models`, `--model`, and `-m` are all equivalent ways to select models in `dbt run` and `dbt test` invocations.
Tests are associated with models; it is possible to select them based on properties

## Operators
dbt supports a shorthand language for selecting nodes to run. This language uses the characters `+`, `@`, and `*`.

### The "plus" operator
If placed at the front of the model selector, `+` will select all parents of the selected model. If placed at the end of the string, `+` will select all children of the selected model.

```bash
$ dbt run --models my_model+          # select my_model and all children
$ dbt run --models +my_model          # select my_model and all parents
$ dbt run --models +my_model+         # select my_model, and all of its parents and children
```

### The "n-plus" operator
<Changelog>New in v0.18.0</Changelog>
You can adjust the behavior of the `+` operator by quantifying the number of edges
to step through.

```bash
$ dbt run --models my_model+1          # select my_model and its first-degree children
$ dbt run --models 2+my_model          # select my_model, its first-degree parents, and its second-degree parents ("grandparents")
$ dbt run --models 3+my_model+4        # select my_model, its parents up to the 3rd degree, and its children down to the 4th degree
```

### The "at" operator
The `@` operator is similar to `+`, but will also include _the parents of the children of the selected model_. This is useful in continuous integration environments where you want to build a model and all of its children, but the _parents_ of those children might not exist in the database yet. The selector `@snowplow_web_page_context` will build all three models shown in the diagram below.

<Lightbox src="/img/docs/running-a-dbt-project/command-line-interface/1643e30-Screen_Shot_2019-03-11_at_7.18.20_PM.png" title="@snowplow_web_page_context will select all of the models shown here"/>

### The "star" operator
The `*` operator matches all models within a package or directory.

```bash
$ dbt run --models snowplow.*      # run all of the models in the snowplow package
$ dbt run --models finance.base.*  # run all of the models in models/finance/base
```

## Set Operators

### Unions
Providing multiple space-delineated arguments to the `--models`, `--exclude`, or `--selector` flags selects
the union of them all. If a resource is included in at least one selector, it will be 
included in the final set.

### Intersections
<Changelog>New in v0.18.0</Changelog>
If multiple arguments to `--models`, `--exclude`, and `--select` can be comma-separated (with no whitespace in between),
dbt will select only resources which satisfy _all_ arguments.

Run all the common ancestors of snowplow_sessions and fct_orders:
```bash
$ dbt run --models +snowplow_sessions,+fct_orders
```

Run all the common descendents of stg_invoices and stg_accounts:
```bash
$ dbt run --models stg_invoices+,stg_accounts+
```

Run models that are in the marts/finance subdirectory *and* tagged nightly:
```bash
$ dbt run --models marts.finance,tag:nightly
```

### Excluding models
dbt provides an `--exclude` flag with the same semantics as `--models`. Models specified with the `--exclude` flag will be removed from the set of models selected with `--models`.

```bash
$ dbt run --models my_package.*+ --exclude my_package.a_big_model+
```

Exclude a specific resource by its name or lineage:

```bash
# test
$ dbt test --exclude not_null_orders_order_id
$ dbt test --exclude orders

# seed
$ dbt seed --exclude account_parent_mappings

# snapshot
$ dbt snapshot --exclude snap_order_statuses
$ dbt test --exclude orders+
```


## Methods

Selector methods return all resources that share a common property, using the
syntax `method:value`.

### The "tag" method
The `tag:` method is used to select models that match a specified [tag](resource-configs/tags).

```bash
$ dbt run --models tag:nightly    # run all models with the `nightly` tag
```

### The "source" method
The `source` method is used to select models that select from a specified [source](using-sources). Use in conjunction with the `+` operator.

```bash
$ dbt run --models source:snowplow+    # run all models that select from Snowplow sources
```

### The "path" method
The `path` method is used to select models located at or under a specific path.
While the `path` prefix is not explicitly required, it may be used to make
selectors unambiguous.

```bash
# These two selectors are equivalent
dbt run --models path:models/staging/github
dbt run --models models/staging/github

# These two selectors are equivalent
dbt run --models path:models/staging/github/stg_issues.sql
dbt run --models models/staging/github/stg_issues.sql
```

### The "package" method
<Changelog>New in v0.18.0</Changelog>
The `package` method is used to select models defined within the root project
or an installed dbt package. While the `package:` prefix is not explicitly required, it may be used to make
selectors unambiguous.

```bash
# These three selectors are equivalent
dbt run --models package:snowplow
dbt run --models snowplow
dbt run --models snowplow.*
```

### The "config" method
<Changelog>New in v0.18.0</Changelog>
The `config` method is used to select models that match a specified [node config](config).

```bash
$ dbt run --models config.materialized:incremental    # run all models that are materialized incrementally
$ dbt run --models config.schema:audit                # run all models that are created in the `audit` schema
$ dbt run --models config.cluster_by:geo_country      # run all models clustered by `geo_country`
```

### The "test_type" method
<Changelog>New in v0.18.0</Changelog>
The `test_type` method is used to select tests based on their type, `schema` or `data`:

```bash
$ dbt test --models test_type:schema        # run all schema tests
$ dbt test --models test_type:data          # run all data tests
```

### The "test_name" method
<Changelog>New in v0.18.0</Changelog>
The `test_name` method is used to select schema tests based on the name of the `test_` macro
that defines it. For more information about how schema tests are defined, read about
[custom schema tests](custom-schema-tests).

```bash
$ dbt test --models test_name:unique            # run all instances of the `unique` test
$ dbt test --models test_name:equality          # run all instances of the `dbt_utils.equality` test
$ dbt test --models test_name:range_min_max     # run all instances of a custom schema test defined in the local project, `range_min_max`
```

### The "state" method
<Changelog>New in v0.18.0</Changelog>

:::info [β] Beta Feature
This is net-new functionality in v0.18.0, with iterative improvements to come.
If you encounter unexpected behavior, please post in Slack or open an issue.
:::

The `state` method is used to select nodes by comparing them against a supplied
manifest. The file path of the comparison manifest _must_ be specified via the
`--state` flag or `DBT_ARTIFACT_STATE_PATH` environment variable.

`state:new`: There is no node with the same `unique_id` in the comparison manifest

`state:modified`: Everything new, plus any changes to:
* file/node contents
* configs (`materialized`, `bind`, `transient`, `quote`, etc.)
* descriptions (if `persist_docs`)
* database representations (`database`, `schema`, `alias`)

```bash
$ dbt test --models state:new            # run all tests on new models + and new tests on old models
$ dbt run --models state:modified        # run all models that have been modified
$ dbt ls --models state:modified     # list all modified nodes (not just models)
```

**N.B.** State comparison works by identifying discrepancies between two manifests. 
Those discrepancies could be the result of:

1. Changes made to a project in development
2. Env-aware logic that causes different behavior based on the `target`, env vars, etc.

dbt will do its best to capture *only* changes that are the result of development.
In projects with intricate env-aware logic, dbt will err on the side of running 
too many models (i.e. false positives). We're working on better options for more 
complex projects, in the form of more-specific subselectors.
Track [this issue](https://github.com/fishtown-analytics/dbt/issues/2704) for progress.

## Putting it all together
```bash
$ dbt run --models my_package.*+      # select all models in my_package and their children
$ dbt run --models +some_model+       # select some_model and all parents and children

$ dbt run --models tag:nightly+       # select "nightly" models and all children
$ dbt run --models +tag:nightly+      # select "nightly" models and all parents and children

$ dbt run --models @source:snowplow   # build all models that select from snowplow sources, plus their parents

$ dbt test --models config.incremental_strategy:insert_overwrite,test_name:unique   # execute all `unique` tests that select from models using the `insert_overwrite` incremental strategy
```

This can get complex! Let's say I want a nightly run of models that build off snowplow data
and feed exports, while _excluding_ the biggest incremental models (and one other model, to boot).

```bash
$ dbt run --models @source:snowplow,tag:nightly models/export --exclude package:snowplow,config.materialized:incremental export_performance_timing
```

This command selects all models that:
* Select from snowplow sources, plus their parents, _and_ are tagged "nightly"
* Are defined in the `export` model subfolder

Except for models that are:
* Defined in the snowplow package and materialized incrementally
* Named `export_performance_timing`


## Selectors
<Changelog>New in v0.18.0</Changelog>

:::info [β] Beta Feature
This is net-new functionality in v0.18.0, with iterative improvements to come.
If you encounter unexpected behavior, please post in Slack or open an issue.
:::

Write model selectors in YAML, save them with a human-friendly name, and reference them using the `--selector` flag.
By recording selectors in a top-level `selectors.yml` file:

* **Legibility:** complex selection criteria are composed of dictionaries and arrays
* **Version control:** selector definitions are stored in the same git repository as the dbt project
* **Reusability:** selectors can be referenced in multiple job definitions, and their definitions are extensible (via YAML anchors)

Selectors each have a `name` and a `definition`. Each `definition` is comprised of
one or more arguments, which can be one of the following:
* **CLI-style:** strings, representing CLI-style) arguments
* **Key-value:** pairs in the form `method: value`
* **Dictionaries:** `method`, `value`, operator-equivalent keywords, and support for `exclude`
    
Use `union` and `intersection` to organize multiple arguments.

#### CLI-style
```yml
definition:
  'tag:nightly'
```

This simple syntax supports use of the `+`, `@`, and `*` operators. It does
not support `exclude`.

#### Key-value
```yml
definition:
  tag: nightly
```

This simple syntax does not support any operators or `exclude`.

#### Dictionaries
```yml
definition:
  method: tag
  value: nightly
```

Optional keywords map to the `+` and `@` operators:
```yml
  children: true | false
  parents: true | false

  children_depth: 1    # if children: true, degrees to include
  parents_depth: 1     # if parents: true, degrees to include

  childrens_parents: true | false     # @ operator
```

The `*` operator to select all nodes can be written as:
```yml
definition:
  method: fqn
  value: "*"
```

The `exclude` keyword may be passed as an argument to each dictionary, or as
an item in a `union`. The following are equivalent:

```yml
- method: tag
  value: nightly
  exclude:
    - "@tag:daily"
```

```yml
- union:
    - method: tag
      value: nightly
    - exclude:
       - method: tag
         value: daily
```

Here is the same example from above, written two different ways:

<Tabs
  defaultValue="part_yml"
  values={[
    { label: 'CLI-style', value: 'cli_style', },
    { label: 'Full YML', value: 'all_yml', },
  ]
}>

<TabItem value="cli_style">
<File name='selectors.yml'>

```yml
selectors:
  - name: nightly_diet_snowplow
    definition:
      union:
        - intersection:
            - '@source:snowplow'
            - 'tag:nightly'
        - 'models/export'
        - exclude:
            - intersection:
                - 'package:snowplow'
                - 'config.materialized:incremental'
            - export_performance_timing
```
</File>
</TabItem>

<TabItem value="all_yml">
<File name='selectors.yml'>

```yml
selectors:
  - name: nightly_diet_snowplow
    definition:
      union:
        - intersection:
            - method: source
              value: snowplow
              childrens_parents: true
            - method: tag
              value: nightly
        - method: path
          value: models/export
        - exclude:
            - intersection:
                - method: package
                  value: snowplow
                - method: config.materialized
                  value: incremental
            - method: fqn
              value: export_performance_timing
```
</File>
</TabItem>

</Tabs>

Then in our job definition:
```bash
$ dbt run --select nightly_diet_snowplow
```

## Test selection examples
The test selection syntax grew out of the model selection syntax. As such, the syntax will look familiar if you wish to:
* run tests on a particular model
* run tests on models in a sub directory
* run tests on all models upstream / downstream of a model, etc.

Tests have their own properties _and_ inherit the properties of the nodes they select from. This means you:
* select tests based on the file path of the models being tested, rather than the file paths of the `.yml` files that configure the tests
* can use selector methods that check config properties of the resources being tested

Things start to get a little unfamiliar when you want to test things other than models, so we've included lots of examples below. In the future, we plan to make this syntax more intuitive.

### Run schema tests only

```shell
$ dbt test --models test_type:schema

# before v0.18.0:
$ dbt test --schema # technically this runs all schema tests, tests tagged 'schema', and tests of models tagged 'schema'
```

### Run data tests only

```shell
$ dbt test --models test_type:data

# before v0.18.0:
$ dbt test --data  # technically this runs all data tests, tests tagged 'data', and tests of models tagged 'data'
```

### Run tests on a particular model

```shell
# syntax
$ dbt test --models model_name
# example
$ dbt test --models customers
```


### Run tests on models

These should feel somewhat familiar if you're used to executing `dbt run` with the `--models` option to build parts of your DAG.

Check out the more in-depth examples of the model selection syntax above for more details:

```shell
# Run tests on a model
$ dbt test --models customers

# Run tests on all models in the models/staging/jaffle_shop directory
$ dbt test --models staging.jaffle_shop

# Run tests downstream of a model
$ dbt tests --models stg_customers+

# Run tests upstream of a model
$ dbt tests --models +stg_customers

# Run tests on all models with a particular tag
$ dbt test --models tag:my_model_tag

# Run tests on all models with a particular materialization
$ dbt test --models config.materialized:table

```

### Run tests on all sources

```shell
$ dbt test --models source:*
```

### Run tests on one source

```shell
# syntax
$ dbt test --models source:<source_name>
# example
$ dbt test --models source:jaffle_shop
```

### Run tests on one source table

```shell
# syntax
$ dbt test --models source:<source_name>.<table_name>
# example
$ dbt test --models source:jaffle_shop.customers
```


### Run tests on everything _but_ sources

```shell
$ dbt test --exclude sources:*
```

### Run tests on seeds / snapshots only

Currently it is not possible to:
* Run tests on all seeds, OR
* Run tests on all snapshots

Instead, you will have to provide the name of the resource as the argument to the `--models` option:

```shell
$ dbt test --models orders_snapshot
```

### Run tests on tagged columns
<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
        tags: [my_column_tag]
          - unique

```

</File>

```shell
$ dbt test --models tag:my_column_tag
```

### Run tagged tests only

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique:
              tags: [my_test_tag]

```

</File>


```shell
$ dbt test --models tag:my_test_tag
```
