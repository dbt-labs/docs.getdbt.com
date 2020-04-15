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
The `tag:` prefix is used to select models that match a specified [tag](tags-guide) .

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
