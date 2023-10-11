---
title: "Test selection examples"
---

Test selection works a little differently from other resource selection. This makes it very easy to:
* run tests on a particular model
* run tests on all models in a subdirectory
* run tests on all models upstream / downstream of a model, etc.

Like all resource types, tests can be selected **directly**, by methods and operators that capture one of their attributes: their name, properties, tags, etc.

Unlike other resource types, tests can also be selected **indirectly**. If a selection method or operator includes a test's parent(s), the test will also be selected. [See below](#indirect-selection) for more details.

Test selection is powerful, and we know it can be tricky. To that end, we've included lots of examples below:

### Direct selection

Run generic tests only:


  ```bash
    dbt test --select test_type:generic
  ```

Run singular tests only:


  ```bash
    dbt test --select test_type:singular
  ```

In both cases, `test_type` checks a property of the test itself. These are forms of "direct" test selection.

### Indirect selection

<VersionBlock lastVersion="1.3">

There are two modes to configure the behavior when performing indirect selection (with `eager` as the default):

1. `eager` (default) - include ANY test that references the selected nodes
1. `cautious` - restrict to tests that ONLY refer to selected nodes

Note that test exclusion is always greedy: if ANY parent is explicitly excluded, the test will be excluded as well.

The "cautious" mode can be useful in environments when you're only building a subset of your DAG, and you want to avoid test failures in "eager" mode caused by unbuilt resources. (Another way to achieve this is with [deferral](/reference/node-selection/defer)).

</VersionBlock>

<VersionBlock firstVersion="1.4" lastVersion="1.4">

There are three modes to configure the behavior when performing indirect selection (with `eager` as the default):

1. `eager` (default) - include ANY test that references the selected nodes
1. `cautious` - restrict to tests that ONLY refer to selected nodes
1. `buildable` -  restrict to tests that ONLY refer to selected nodes (or their ancestors)

Note that test exclusion is always greedy: if ANY parent is explicitly excluded, the test will be excluded as well.

The "buildable" and "cautious" modes can be useful in environments when you're only building a subset of your DAG, and you want to avoid test failures in "eager" mode caused by unbuilt resources. (Another way to achieve this is with [deferral](/reference/node-selection/defer)).

</VersionBlock>

<VersionBlock firstVersion="1.5" >

These are the modes to configure the behavior when performing indirect selection (with `eager` as the default):

1. `eager` (default) - include ANY test that references the selected nodes
1. `cautious` - restrict to tests that ONLY refer to selected nodes
1. `buildable` -  restrict to tests that ONLY refer to selected nodes (or their ancestors)
1. `empty` - restrict to tests that are only for the selected node and ignore all tests from the attached nodes 

Note that test exclusion is always greedy: if ANY parent is explicitly excluded, the test will be excluded as well.

The "buildable", "cautious", and "empty" modes can be useful in environments when you're only building a subset of your DAG, and you want to avoid test failures in "eager" mode caused by unbuilt resources. (Another way to achieve this is with [deferral](/reference/node-selection/defer)).

</VersionBlock>

<!--tabs for eager mode, cautious mode, and buildable mode -->

<VersionBlock lastVersion="1.3">

<Tabs queryString="indirect-selection-mode">
<TabItem value="eager" label="Eager mode (default)">

By default, a test will run when ANY parent is selected; we call this "eager" indirect selection. In this example, that would include any test that references orders, even if it references other models as well.

In this mode, any test that depends on unbuilt resources will raise an error.

```shell
  dbt test --select orders
  dbt build --select orders
```

</TabItem>

<TabItem value="cautious" label="Cautious mode">

It is possible to prevent tests from running if one or more of its parents is unselected (and therefore unbuilt); we call this "cautious" indirect selection.

It will only include tests whose references are each within the selected nodes.

Put another way, it will prevent tests from running if one or more of its parents is unselected.

```shell
  dbt test --select orders --indirect-selection=cautious
  dbt build --select orders --indirect-selection=cautious
```

</TabItem>

</Tabs>

</VersionBlock>

<VersionBlock firstVersion="1.4" lastVersion="1.4">

<Tabs queryString="indirect-selection-mode">
<TabItem value="eager" label="Eager mode (default)">

By default, a test will run when ANY parent is selected; we call this "eager" indirect selection. In this example, that would include any test that references orders, even if it references other models as well.

In this mode, any test that depends on unbuilt resources will raise an error.

```shell
  dbt test --select orders
  dbt build --select orders
```

</TabItem>

<TabItem value="cautious" label="Cautious mode">

It is possible to prevent tests from running if one or more of its parents is unselected (and therefore unbuilt); we call this "cautious" indirect selection.

It will only include tests whose references are each within the selected nodes.

Put another way, it will prevent tests from running if one or more of its parents is unselected.

```shell
  dbt test --select orders --indirect-selection=cautious
  dbt build --select orders --indirect-selection=cautious
```

</TabItem>

<TabItem value="buildable" label="Buildable mode">

This mode is similarly conservative like "cautious", but is slightly more inclusive.

It will only include tests whose references are each within the selected nodes (or their ancestors).

This is useful in the same scenarios as "cautious", but also includes when a test depends on a model **and** a direct ancestor of that model (like confirming an aggregation has the same totals as its input).

```shell
  dbt test --select orders --indirect-selection=buildable
  dbt build --select orders --indirect-selection=buildable
```

</TabItem>

</Tabs>

</VersionBlock>

<VersionBlock firstVersion="1.5">

<Tabs queryString="indirect-selection-mode">
<TabItem value="eager" label="Eager mode (default)">

By default, a test will run when ANY parent is selected; we call this "eager" indirect selection. In this example, that would include any test that references orders, even if it references other models as well.

In this mode, any test that depends on unbuilt resources will raise an error.

```shell
  dbt test --select orders
  dbt build --select orders
```

</TabItem>

<TabItem value="cautious" label="Cautious mode">

It is possible to prevent tests from running if one or more of its parents is unselected (and therefore unbuilt); we call this "cautious" indirect selection.

It will only include tests whose references are each within the selected nodes.

Put another way, it will prevent tests from running if one or more of its parents is unselected.

```shell
  dbt test --select orders --indirect-selection=cautious
  dbt build --select orders --indirect-selection=cautious
```

</TabItem>

<TabItem value="buildable" label="Buildable mode">

This mode is similarly conservative like "cautious", but is slightly more inclusive.

It will only include tests whose references are each within the selected nodes (or their ancestors).

This is useful in the same scenarios as "cautious", but also includes when a test depends on a model **and** a direct ancestor of that model (like confirming an aggregation has the same totals as its input).

```shell
dbt test --select orders --indirect-selection=buildable
dbt build --select orders --indirect-selection=buildable
```

</TabItem>

<TabItem value="empty" label="Empty mode">

This mode will only include tests whose references are each within the selected nodes and will ignore all tests from attached nodes.

```shell
  dbt test --select orders --indirect-selection=empty
  dbt build --select orders --indirect-selection=empty
```

</TabItem>

</Tabs>

</VersionBlock>

<!--End of tabs for eager mode, cautious mode, buildable mode, and empty mode -->

### Syntax examples

Setting `indirect_selection` can also be specified in a [yaml selector](/reference/node-selection/yaml-selectors#indirect-selection).

The following examples should feel somewhat familiar if you're used to executing `dbt run` with the `--select` option to build parts of your DAG:


  ```bash
  # Run tests on a model (indirect selection)
    dbt test --select customers

  # Run tests on two or more specific models (indirect selection)
    dbt test --select customers orders

  # Run tests on all models in the models/staging/jaffle_shop directory (indirect selection)
    dbt test --select staging.jaffle_shop

  # Run tests downstream of a model (note this will select those tests directly!)
    dbt test --select stg_customers+

  # Run tests upstream of a model (indirect selection)
    dbt test --select +stg_customers

  # Run tests on all models with a particular tag (direct + indirect)
    dbt test --select tag:my_model_tag

  # Run tests on all models with a particular materialization (indirect selection)
    dbt test --select config.materialized:table

  ```

 The same principle can be extended to tests defined on other resource types. In these cases, we will execute all tests defined on certain sources via the `source:` selection method:


  ```bash
  # tests on all sources
    dbt test --select source:*

  # tests on one source
    dbt test --select source:jaffle_shop

  # tests on two or more specific sources
   dbt test --select source:jaffle_shop source:raffle_bakery 

  # tests on one source table
    dbt test --select source:jaffle_shop.customers

  # tests on everything _except_ sources
    dbt test --exclude source:*
  ```

 ### More complex selection

Through the combination of direct and indirect selection, there are many ways to accomplish the same outcome. Let's say we have a data test named `assert_total_payment_amount_is_positive` that depends on a model named `payments`. All of the following would manage to select and execute that test specifically:


  ```bash
  dbt test --select assert_total_payment_amount_is_positive # directly select the test by name
  dbt test --select payments,test_type:singular # indirect selection, v1.2
  dbt test --select payments,test_type:data # indirect selection, v0.18.0
  dbt test --select payments --data  # indirect selection, earlier versions
  ```


 As long as you can select a common property of a group of resources, indirect selection allows you to execute all the tests on those resources, too. In the example above, we saw it was possible to test all table-materialized models. This principle can be extended to other resource types, too:


  ```bash
  # Run tests on all models with a particular materialization
    dbt test --select config.materialized:table

  # Run tests on all seeds, which use the 'seed' materialization
    dbt test --select config.materialized:seed

  # Run tests on all snapshots, which use the 'snapshot' materialization
    dbt test --select config.materialized:snapshot
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


  ```bash
    dbt test --select tag:my_column_tag
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


  ```bash
    dbt test --select tag:my_test_tag
  ```
