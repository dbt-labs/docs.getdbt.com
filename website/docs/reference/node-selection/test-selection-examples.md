---
title: "Test selection examples"
---

The syntax used to select which nodes to test is based on model selection syntax. Hence, the selection syntax for testing models generally matches the selection syntax for running models:
```
dbt test -m <model_name>             # run tests on a particular model
dbt test -m <path.to.models.folder>  # run tests on models in a sub directory
dbt test -m +<model_name>+           # run tests on models upstream/downstream of a model
```

Tests have their own properties (set in yaml files or data test `config` blocks). Tests _also_ inherit the properties of the nodes they test (i.e. select from). dbt currently requires you to select which nodes to test using:
* the file paths of the models which tests are defined on
* the properties of a source or model

Selecting tests to run on nodes other than models, such as sources, is different from the usual model selection syntax.

A test is selected if the `--models` criteria includes any property of:

    * the test itself (e.g. tag: or test_name: selection method)
    * a resource (model/source/snapshot/seed) the test directly depends on

By the same token, a test is not selected if the --exclude criteria includes any property of:

    * the test itself
    * a resource the test directly depends on

In the future, we plan to make test selection syntax more intuitive. For now, here are several examples.

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
$ dbt test --models 'source:*'
```
`*` is a sometimes called a [wildcard](https://tldp.org/LDP/GNU-Linux-Tools-Summary/html/x11655.htm). To ensure `dbt` runs all source tests, prepend all instances of `*` with the `\`, or escape, character. "Escaping" wildcard characters is necessary both on the command line and in shell scripts.

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
$ dbt test --exclude 'sources:*'
```

### Run a specific data test

```shell
# syntax
$ dbt test --data --models model_name

# example
$ dbt test --data --models assert_total_payment_amount_is_positive
# alternate syntax
$ dbt test --models assert_total_payment_amount_is_positive  # The --data flag is optional
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
