---
title: What data tests are available for me to use in dbt?
description: "Types of data tests to use in dbt"
sidebar_label: 'Available data test to use in dbt'
id: available-tests

---
Out of the box, dbt ships with the following data tests:

* `unique`
* `not_null`
* `accepted_values`
* `relationships` (i.e. referential integrity)

You can also write your own [custom schema data tests](/docs/build/data-tests).

Some additional custom schema tests have been open-sourced in the [dbt-utils package](https://github.com/dbt-labs/dbt-utils?#generic-tests), check out the docs on [packages](/docs/build/packages) to learn how to make these tests available in your project.

Note that although you can't document data tests as of yet, we recommend checking out [this <Constant name="core" /> discussion](https://github.com/dbt-labs/dbt-core/issues/2578) where the dbt community shares ideas.
