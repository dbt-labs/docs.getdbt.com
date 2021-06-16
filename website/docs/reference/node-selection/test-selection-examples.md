---
title: "Test selection examples"
---

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
$ dbt test --exclude source:*
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
