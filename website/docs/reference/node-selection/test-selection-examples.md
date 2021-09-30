---
title: "Test selection examples"
---

Test selection works a little differently from other resource selection. This makes it very easy to:
* run tests on a particular model
* run tests on all models in a subdirectory
* run tests on all models upstream / downstream of a model, etc.

Like all resource types, tests can be selected **directly**, by methods and operators that capture one of their attributes: their name, properties, tags, etc.

Unlike other resource types, tests can also be selected **indirectly**. If a selection method or operator includes a test's parent(s), the test will also be selected.

<Changelog>

* `v0.20.0`: Test selection is no longer greedy for indirect inclusion (ALL parents must be selected for the test to be selected). It is still greedy for indirect exclusion (if ANY parent is excluded, the test is excluded).
* `v0.21.0`: Introduce `--greedy` flag (and `greedy` selector property), to optionally include tests that are indirectly selected and have an unselected parent.

</Changelog>

This can be complex for tests with multiple parents (e.g. `relationships`, or custom tests that `ref()` multiple models). To prevent tests from running when they aren't wanted, a test will be indirectly selected only if **ALL** of its parents are included by the selection criteria. If any parent is missing, that test won't run. On the other hand, if **ANY** parent is excluded, the test will be aggressively excluded as well.

Starting in dbt v0.21, dbt will warn you about tests that have not been indirectly selected because they have at least one unselected parent. You may optionally include them by turning on "greedy" selection: pass the `--greedy` flag, or define a `greedy` property in [yaml selectors](yaml-selectors). When enabled, dbt will include tests that have ANY parent selected, even if other parents are not selected.

We've included lots of examples below:

### Direct selection

<Changelog>

* `v0.18.0`: Introduced the `test_type` selection method. In previous versions, similar behavior is possible via the `--schema` or `--data` flags.
- `v1.0.0`: Renamed test types: "generic" (formerly "schema") and "singular" (formerly "data"). Removed support for the `--schema` and `--data` flags.

</Changelog>

Run generic tests only:

```shell
$ dbt test --select test_type:generic
```

Run singular tests only:

```shell
$ dbt test --select test_type:singular
```

In both cases, `test_type` checks a property of the test itself. These are forms of "direct" test selection.

### Indirect selection

```shell
$ dbt test --select customers
$ dbt test --select orders
```

These are examples of "indirect" selection: `customers` and `orders` select models (whether by name or path). Any tests defined on `customers` or `orders` will be selected indirectly, and thereby included.

If a test depends on both `customers` _and_ `orders` (e.g. a `relationships` test between them), it will _not_ be selected indirectly in the example above. Instead, it would only be selected indirectly if both parents are selected:

```shell
$ dbt test --select customers orders
```

Or if you pass the `--greedy` flag:
```shell
$ dbt test --select customers --greedy
$ dbt test --select orders --greedy
```

### Syntax examples

The following examples should feel somewhat familiar if you're used to executing `dbt run` with the `--select` option to build parts of your DAG:

```shell
# Run tests on a model (indirect selection)
$ dbt test --select customers

# Run tests on all models in the models/staging/jaffle_shop directory (indirect selection)
$ dbt test --select staging.jaffle_shop

# Run tests downstream of a model (note this will select those tests directly!)
$ dbt test --select stg_customers+

# Run tests upstream of a model (indirect selection)
$ dbt test --select +stg_customers

# Run tests on all models with a particular tag (direct + indirect)
$ dbt test --select tag:my_model_tag

# Run tests on all models with a particular materialization (indirect selection)
$ dbt test --select config.materialized:table

```

The same principle can be extended to tests defined on other resource types. In these cases, we will execute all tests defined on certain sources via the `source:` selection method:

```shell
# tests on all sources
$ dbt test --select source:*

# tests on one source
$ dbt test --select source:jaffle_shop

# tests on one source table
$ dbt test --select source:jaffle_shop.customers

# tests on everything _except_ sources
$ dbt test --exclude source:*
```

### More complex selection

Through the combination of direct and indirect selection, there are many ways to accomplish the same outcome. Let's say we have a data test named `assert_total_payment_amount_is_positive` that depends on a model named `payments`. All of the following would manage to select and execute that test specifically:

```shell
$ dbt test --select assert_total_payment_amount_is_positive # directly select the test by name
$ dbt test --select payments,test_type:data # indirect selection, v0.18.0
$ dbt test --select payments --data  # indirect selection, earlier versions
```

As long as you can select a common property of a group of resources, indirect selection allows you to execute all the tests on those resources, too. In the example above, we saw it was possible to test all table-materialized models. This principle can be extended to other resource types, too:

```shell
# Run tests on all models with a particular materialization
$ dbt test --select config.materialized:table

# Run tests on all seeds, which use the 'seed' materialization
$ dbt test --select config.materialized:seed

# Run tests on all snapshots, which use the 'snapshot' materialization
$ dbt test --select config.materialized:snapshot
```

Note that this functionality may change in future versions of dbt.

### Run tests on tagged columns

Because the column `order_id` is tagged `my_column_tag`, the test itself also receives the tag `my_column_tag`. Because of that, this is an example of direct selection.

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
$ dbt test --select tag:my_column_tag
```

Currently, tests "inherit" tags applied to columns, sources, and source tables. They do _not_ inherit tags applied to models, seeds, or snapshots. In all likelihood, those tests would still be selected indirectly, because the tag selects its parent. This is a subtle distinction, and it may change in future versions of dbt.

### Run tagged tests only

This is an even clearer example of direct selection: the test itself is tagged `my_test_tag`, and selected accordingly.

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
$ dbt test --select tag:my_test_tag
```
