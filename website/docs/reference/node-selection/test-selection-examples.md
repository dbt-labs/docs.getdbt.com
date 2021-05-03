---
title: "Test selection examples"
---

Test selection works a little differently, in order to make it very easy to:
* run tests on a particular model
* run tests on all models in a subdirectory
* run tests on all models upstream / downstream of a model, etc.

Like all resource types, tests can be selected **directly**, by methods and operators that capture one of their attributes: their name, properties, tags, or so on. Unlike other resource types, tests can also be selected **indirectly**. If a selection method or operator includes a test's parent(s), the test will also be selected.

<Changelog>

* `v0.20.0`: Test selection is no longer greedy for indirect inclusion (ALL parents must be selected for the test to be selected). It is still greedy for indirect exclusion (if ANY parent is excluded, the test is excluded).

</Changelog>

This can be complex for tests with multiple parents (e.g. `relationships`, or custom tests that `ref()` multiple models). To prevent tests from running when they aren't expected, a test will be indirectly selected only if **ALL** of its parents are included by the selection criteria. If any parent is missing, that test won't run. On the other hand, if **ANY** parent is excluded, the test will be "greedily" excluded as well.

We've included lots of examples below:

### Direct selection

Run schema tests only:

```shell
$ dbt test --models test_type:schema

# before v0.18.0:
$ dbt test --schema # technically this runs all schema tests, tests tagged 'schema', and tests on anything else tagged 'schema'
```

Run data tests only:

```shell
$ dbt test --models test_type:data

# before v0.18.0:
$ dbt test --data  # technically this runs all data tests, tests tagged 'data', and tests of models tagged 'data'
```

In both cases, `test_type` checks a property of the test itself. These are forms of "direct" test selection.

### Indirect selection

```shell
$ dbt test --models customers
$ dbt test --models orders
```

These are examples of "indirect" selection: `customers` and `orders` select models (whether by name or FQN). Any tests defined on `customers` or `orders` will be selected indirectly.

If a test depends on both `customers` _and_ `orders`, e.g. a `relationships` test between them, it will _not_ be selected indirectly in the example above. It would be selected indirectly by:

```shell
$ dbt test --models customers orders
```

The following examples should feel somewhat familiar if you're used to executing `dbt run` with the `--models` option to build parts of your DAG:

```shell
# Run tests on a model (indirect selection)
$ dbt test --models customers

# Run tests on all models in the models/staging/jaffle_shop directory (indirect selection)
$ dbt test --models staging.jaffle_shop

# Run tests downstream of a model (note this will select those tests directly!)
$ dbt tests --models stg_customers+

# Run tests upstream of a model (indirect selection)
$ dbt tests --models +stg_customers

# Run tests on all models with a particular tag (direct + indirect)
$ dbt test --models tag:my_model_tag

# Run tests on all models with a particular materialization (indirect selection)
$ dbt test --models config.materialized:table

```

The same principle can be extended to tests defined on other resource types. In these cases, we will execute all tests defined on certain sources via the `source:` selection method:

```shell
# tests on all sources
$ dbt test --models source:*

# tests on one source
$ dbt test --models source:jaffle_shop

# tests on one source table
$ dbt test --models source:jaffle_shop.customers

# tests on everything _except_ sources
$ dbt test --exclude source:*
```

### More complex selection

Through the combination of direct and indirect selection, there are many ways to accomplish the same outcome. Let's say we have a data test named `assert_total_payment_amount_is_positive` that depends on a model named `payments`. All of the following would manage to select and execute that test specifically:

```shell
$ dbt test --models assert_total_payment_amount_is_positive # directly select the test by name
$ dbt test --models payments,test_type:data # indirect selection, v0.18.0
$ dbt test --models payments --data  # indirect selection, earlier versions
```

As long as you can select a common property of a group of resources, indirect selection allows you to execute all the tests on those resources, too. In the example above, we saw it was possible to test all table-materialized models. This principle can be extended to other resource types, too:

```shell
# Run tests on all models with a particular materialization
$ dbt test --models config.materialized:table

# Run tests on all seeds, which use the 'seed' materialization
$ dbt test --models config.materialized:seed

# Run tests on all snapshots, which use the 'snapshot' materialization
$ dbt test --models config.materialized:snapshot
```

Note that this functionality may change in future versions of dbt.

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
