---
title: What tests are available for me to use in dbt?
description: "Types of tests to use in dbt"
sidebar_label: 'Available test to use in dbt'
id: available-tests

---
Out of the box, dbt ships with the following tests:

* `unique`
* `not_null`
* `accepted_values`
* `relationships` (i.e. referential integrity)

You can also write your own [custom schema tests](/docs/build/data-tests).

Some additional custom schema tests have been open-sourced in the [dbt-utils package](https://github.com/dbt-labs/dbt-utils/tree/0.2.4/#schema-tests), check out the docs on [packages](/docs/build/packages) to learn how to make these tests available in your project.
