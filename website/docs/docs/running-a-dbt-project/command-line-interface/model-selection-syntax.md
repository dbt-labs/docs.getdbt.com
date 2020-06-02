---
title: "Model selection syntax"
id: "model-selection-syntax"
---

## Overview

dbt's model selection syntax makes it possible to run only specific resources in a given invocation of dbt. The model selection syntax is used for the following subcommands:

| command   | argument(s)                         |
| :-------- | ----------------------------------- |
| run       | `--models`, `--exclude`             |
| test      | `--models`, `--exclude`             |
| seed      | `--select`, `--exclude`             |
| snapshot  | `--select`, `--exclude`             |
| ls (list) | `--select`, `--models`, `--exclude` |
| compile   | `--select`, `--exclude`             |




## Specifying models to run

By default, `dbt run` will execute _all_ of the models in the dependency graph. During development (and deployment), it is useful to specify only a subset of models to run. Use the `--models` flag with `dbt run` to select a subset of models to run. Note that the following arguments (`--models` and `--exclude`) also apply to `dbt test`!

The `--models` flag accepts one or more arguments. Each argument can be one of:

1. a package name
2. a model name
3. a path hierarchy to a models directory
4. a tag selector
5. a source selector

Examples:
```bash
dbt run --models my_dbt_project_name   # runs all models in your project
dbt run --models my_dbt_model          # runs a specific model
dbt run --models path.to.my.models     # runs all models in a specific directory
dbt run --models my_package.some_model # run a specific model in a specific package
dbt run --models tag:nightly           # run models with the "nightly" tag

# multiple arguments can be provided to --models
dbt run --models my_first_model my_second_model

# these arguments can be projects, models, directory paths, tags, or sources
dbt run --models tag:nightly my_model finance.base.*
```

## Model selection shorthand
The flags `--models`, `--model`, and `-m` are all equivalent ways to select models in `dbt run` and `dbt test` invocations.

## Model Selectors
dbt supports a shorthand language for selecting models to run. This language uses the characters `+`, `@`, and `*`.

### The "plus" operator
If placed at the front of the model selector, `+` will select all parents of the selected model. If placed at the end of the string, `+` will select all children of the selected model.

```bash
dbt run --models my_model+          # select my_model and all children
dbt run --models +my_model          # select my_model and all parents
dbt run --models +my_model+         # select my_model, and all of its parents and children
```

### The "at" operator
The `@` operator is similar to `+`, but will also include _the parents of the children of the selected model_. This is useful in continuous integration environments where you want to build a model and all of its children, but the _parents_ of those children might not exist in the database yet. The selector `@snowplow_web_page_context` will build all three models shown in the diagram below.

<Lightbox src="/img/docs/running-a-dbt-project/command-line-interface/1643e30-Screen_Shot_2019-03-11_at_7.18.20_PM.png" title="@snowplow_web_page_context will select all of the models shown here"/>

### The "star" operator
The `*` operator matches all models within a package or directory.

```bash
dbt run --models snowplow.*      # run all of the models in the snowplow package
dbt run --models finance.base.*  # run all of the models in models/finance/base
```

### The "tag:" operator
The `tag:` prefix is used to select models that match a specified [tag](tags) .

```
dbt run --models tag:nightly    # run all models with the `nightly` tag
```

### The "source:" operator
The `source:` prefix is used to select models that select from a specified [source](using-sources). Use in conjunction with the `+` operator.

```
dbt run --models source:snowplow+    # run all models that select from Snowplow sources
```

### Putting it all together
```bash

dbt run --models my_package.*+      # select all models in my_package and their children
dbt run --models +some_model+       # select some_model and all parents and children

dbt run --models tag:nightly+       # select "nightly" models and all children
dbt run --models +tag:nightly+      # select "nightly" models and all parents and children

dbt run --models @source:snowplow   # build all models that select from snowplow sources, plus their parents
```

## Excluding models
dbt provides an `--exclude` flag with the same semantics as `--models`. Models specified with the `--exclude` flag will be removed from the set of models selected with `--models`

```bash
dbt run --models my_package.*+ --exclude my_package.a_big_model+
```


## Test selection examples
The test selection syntax grew out of the model selection syntax. As such, the syntax will look familiar if you wish to :
* run tests on a particular model
* run tests on models in a sub directory
* run tests on all models upstream / downstream of a model, etc.

However, things start to get a little unfamiliar when you want to test things other than models, so we've included lots of examples below. In the future, we plan to make this syntax more intuitive.

### Run schema tests only

```shell
$ dbt test --schema
```

### Run data tests only

```shell
$ dbt test --data
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
$ dbt test --tags tag:my_column_tag
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

<!---
## List selection examples
### List all models that are materialized as tables

--->
