---
title: "Test selection examples"
---

import IndirSelect from '/snippets/_indirect-selection-definitions.md';

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
    dbt test --select "test_type:generic"
  ```

Run singular tests only:


  ```bash
    dbt test --select "test_type:singular"
  ```

In both cases, `test_type` checks a property of the test itself. These are forms of "direct" test selection.

### Indirect selection

<IndirSelect features={'/snippets/indirect-selection-definitions.md'}/>

<!--tabs for eager mode, cautious mode, empty, and buildable mode -->
<!--Tabs for 1.5+ -->

### Indirect selection examples

To visualize these methods, suppose you have `model_a`, `model_b`, and `model_c` and associated data tests. The following illustrates which tests will be run when you execute `dbt build` with the various indirect selection modes:

<DocCarousel slidesPerView={1}>

<Lightbox src src="/img/docs/reference/indirect-selection-dbt-build.png" width="85%" title="dbt build" />

<Lightbox src src="/img/docs/reference/indirect-selection-eager.png" width="85%" title="Eager (default)"/>

<Lightbox src src="/img/docs/reference/indirect-selection-buildable.png" width="85%" title="Buildable"/>

<Lightbox src src="/img/docs/reference/indirect-selection-cautious.png" width="85%" title="Cautious"/>

<Lightbox src src="/img/docs/reference/indirect-selection-empty.png" width="85%" title="Empty"/>

</DocCarousel>

<Tabs queryString="indirect-selection-mode">
<TabItem value="eager" label="Eager mode (default)">

In this example, during the build process, any test that depends on the selected "orders" model or its dependent models will be executed, even if it depends other models as well.
 
```shell
dbt test --select "orders"
dbt build --select "orders"
```

</TabItem>

<TabItem value="buildable" label="Buildable mode">

In this example, dbt executes tests that reference "orders" within the selected nodes (or their ancestors).


```shell
dbt test --select "orders" --indirect-selection=buildable
dbt build --select "orders" --indirect-selection=buildable
```

</TabItem>

<TabItem value="cautious" label="Cautious mode">

In this example, only tests that depend _exclusively_ on the "orders" model will be executed:

```shell
dbt test --select "orders" --indirect-selection=cautious
dbt build --select "orders" --indirect-selection=cautious

```

</TabItem>

<TabItem value="empty" label="Empty mode">

This mode does not execute any tests, whether they are directly attached to the selected node or not.

```shell

dbt test --select "orders" --indirect-selection=empty
dbt build --select "orders" --indirect-selection=empty

```

</TabItem>

</Tabs>

<!--End of tabs for eager mode, cautious mode, buildable mode, and empty mode -->

### Test selection syntax examples

Setting `indirect_selection` can also be specified in a [yaml selector](/reference/node-selection/yaml-selectors#indirect-selection).

The following examples should feel somewhat familiar if you're used to executing `dbt run` with the `--select` option to build parts of your DAG:


  ```bash
  # Run tests on a model (indirect selection)
  dbt test --select "customers"
  
  # Run tests on two or more specific models (indirect selection)
  dbt test --select "customers orders"

  # Run tests on all models in the models/staging/jaffle_shop directory (indirect selection)
  dbt test --select "staging.jaffle_shop"

  # Run tests downstream of a model (note this will select those tests directly!)
  dbt test --select "stg_customers+"

  # Run tests upstream of a model (indirect selection)
  dbt test --select "+stg_customers"

  # Run tests on all models with a particular tag (direct + indirect)
  dbt test --select "tag:my_model_tag"

  # Run tests on all models with a particular materialization (indirect selection)
  dbt test --select "config.materialized:table"

  ```

 The same principle can be extended to tests defined on other resource types. In these cases, we will execute all tests defined on certain sources via the `source:` selection method:


  ```bash
  # tests on all sources

  dbt test --select "source:*"

  # tests on one source
  dbt test --select "source:jaffle_shop"
  
  # tests on two or more specific sources
   dbt test --select "source:jaffle_shop source:raffle_bakery"

  # tests on one source table
  dbt test --select "source:jaffle_shop.customers"

  # tests on everything _except_ sources
  dbt test --exclude "source:*"
  ```

 ### More complex selection

Through the combination of direct and indirect selection, there are many ways to accomplish the same outcome. Let's say we have a data test named `assert_total_payment_amount_is_positive` that depends on a model named `payments`. All of the following would manage to select and execute that test specifically:


  ```bash

  dbt test --select "assert_total_payment_amount_is_positive" # directly select the test by name
  dbt test --select "payments,test_type:singular" # indirect selection, v1.2
  dbt test --select "payments,test_type:data" # indirect selection, v0.18.0
  dbt test --select "payments" --data  # indirect selection, earlier versions

  ```


 As long as you can select a common property of a group of resources, indirect selection allows you to execute all the tests on those resources, too. In the example above, we saw it was possible to test all table-materialized models. This principle can be extended to other resource types, too:


  ```bash
  # Run tests on all models with a particular materialization
  dbt test --select "config.materialized:table"

  # Run tests on all seeds, which use the 'seed' materialization
  dbt test --select "config.materialized:seed"

  # Run tests on all snapshots, which use the 'snapshot' materialization
  dbt test --select "config.materialized:snapshot"

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
        tags: [my_column_tag]
        tests:
          - unique

```

</File>


  ```bash
  dbt test --select "tag:my_column_tag"

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
  dbt test --select "tag:my_test_tag"

  ```
