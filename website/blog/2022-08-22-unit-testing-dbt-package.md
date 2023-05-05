---
title: "An introduction to unit testing your dbt Packages"
description: "Traditionally, integration tests have been the primary strategy for testing dbt Packages. In this post, Yu Ishikawa walks us through adding in unit testing as well."
slug: unit-testing-dbt-packages
authors: [yu_ishikawa]
tags: [dbt tutorials]
hide_table_of_contents: false

date: 2022-08-25
is_featured: true
---

_Editors note - this post assumes working knowledge of dbt Package development. For an introduction to dbt Packages check out [So You Want to Build a dbt Package](https://docs.getdbt.com/blog/so-you-want-to-build-a-package)._

It’s important to be able to test any dbt Project, but it’s even more important to make sure you have robust testing if you are developing a [dbt Package](https://docs.getdbt.com/docs/build/packages).

I love dbt Packages, because it makes it easy to extend dbt’s functionality and create reusable analytics resources. Even better, we can find and share dbt Packages which others developed, finding great packages in [dbt hub](https://hub.getdbt.com/). However, it is a bit difficult to develop complicated dbt macros, because dbt on top of [Jinja2](https://palletsprojects.com/p/jinja/) is lacking some of the functionality you’d expect for software development - like unit testing.

In this article, I would like to share options for unit testing your dbt Package - first through discussing the commonly used pattern of integration testing and then by showing how we can implement unit tests as part of our testing arsenal.
<!--truncate-->

## Unit Testing vs. Integration Testing

Unit testing and integration testing are two common paradigms in create well-tested code. For a great deep dive into the difference between the two check out [this article](https://circleci.com/blog/unit-testing-vs-integration-testing/) from the CircleCI team. At a high level:

- **Integration tests** are tests which operate against the entire integrated project or application.
- **Unit tests** are tests which verify a single element within a software project, such as an individual function or macro.

Many dbt Packages use integration tests as their primary testing methodology. For example [dbt-utils](https://github.com/dbt-labs/dbt-utils) has [the integration_tests directory](https://github.com/dbt-labs/dbt-utils/tree/main/integration_tests) so that we can run integration tests by using the generic tests and macros contained within the package. The integration tests directory is essentially a standard dbt project within the dbt-utils package that is tested much the same way any dbt project would be.

To use the integration tests - you’d simply run `dbt test` within the `integration_tests` directory. The tests execute as normal - meaning you can use your favorite methods of running CI against your dbt project to ensure that your integration tests are passing.

Integration tests can help give you peace of mind that your package is performing as expected - but they have some drawbacks. Macros and generic tests frequently call other macros and the deeper dependency calls get, the more difficult it becomes to debug your macros using only integration tests.

In this scenario it can be helpful to go beyond integration tests and implement unit tests for your macros. These unit tests can be run with a [dbt run operation](https://docs.getdbt.com/reference/commands/run-operation). Let’s take a look at a quick example of how this can be done.

Consider a dbt Package called dbt_sample_package . We would like to implement a simple macro to create a string literal from a string text in a macro named `to_literal` in the file `macros/to_literal.sql`.

```sql
-- macros/to_literal.sql
{% macro to_literal(text) %}

    '{{- text -}}'

{% endmacro %}
```

---

To implement a unit testing macro corresponding to the `to_literal` macro we can create a macro to test our original macro in `integration_tests/macros/test_to_literal.sql`.

Then we call the `to_literal` macro in the testing macro. and if the result isn’t the same as expected, we raise an error using the [exceptions.raise_compiler_error macro](https://docs.getdbt.com/reference/dbt-jinja-functions/exceptions).

```sql
-- integration_tests/macros/test_to_literal.sql
{% macro test_to_literal() %}

    {% = dbt_sample_package.to_literal('test string') %}

    {% if result != "'test string'" %}

        {{ exceptions.raise_compiler_error('The test is failed') }}

    {% endif %}

{% endmacro %}
```

---

By doing that, we can call the testing macro in the dbt project of integration tests using `dbt run-operation`.

```shell
dbt run-operation test_to_literal
```

---

If we want to run all tests with a single command, it would be good to bundle them in a macro. Moreover, we can call the macro with `dbt run-operation`.

```sql
-- integration_tests/macros/run_unit_tests.sql
{% macro run_unit_tests() %}

    {% do test_to_literal() %}

    {% do another_test() %}

{% endmacro %}
```

---

## Unit tests for multiple adapters

Your dbt Package may support multiple adapters. If you are a postgres user, you understand that the preceding `to_literal` macro doesn’t work on postgres because the expression to deal with string literal is different. So, we have to implement a macro to handle a special case of postgres. Now, we implement the subsequent macro called `postgres__to_literal` in `macros/to_literal.sql` in addition to the implementation above.

```sql
-- macros/to_literal.sql
{% macro to_literal(text) %}

    {{ return(adapter.dispatch('to_literal', 'dbt_sample_package')(text)) }}

{% endmacro %}

{% macro default__to_literal(text) %}

    '{{- text -}}'

{% endmacro %}

{% macro postgres__to_literal(text) %}

    E'{{- text -}}'

{% endmacro %}
```

---

You may think of how we can implement unit testing macros efficiently. We can use the [the adapter.dispatch macro](https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch) even in unit testing macros. As we separate the behavior for postgres, we can implement an independent unit testing macro for postgres as well.

```sql
-- integration_tests/macros/test_to_literal.sql
{% macro test_to_literal() %}

    {{ return(adapter.dispatch('test_to_literal', 'integration_tests')(text)) }}

{% endmacro %}

{% macro default__test_to_literal() %}

    {% result = dbt_sample_package.to_literal('test string') %}

    {% if result != "'test string'" %}

        {{ exceptions.raise_compiler_error('The test is failed') }}

    {% endif %}

{% endmacro %}

{% macro postgres__test_to_literal() %}

    {% result = dbt_sample_package.to_literal('test string') %}

    {% if result != "E'test string'" %}

        {{ exceptions.raise_compiler_error('The test is failed') }}

    {% endif %}

{% endmacro%}
```

---

We can then select unit tests based on the specified adapter. Let’s assume we have different dbt profiles corresponding to BigQuery and postgres. By specifying a dbt profile based on the adapter, we can select what testing macros are called internally.

```shell
# Run unit tests on BigQuery
dbt run-operation run_unit_tests --profile bigquery
# `default__test_to_literal` is internally called.

# Run unit tests on postgres
dbt run-operation run_unit_tests --profile postgres
# `postgres__test_to_literal` is internally called.
```

---

## Introducing dbt-unittest

It’s historically been a challenge to do unit testing in your dbt packaging as Jinja2 doesn’t offer a built-in unit testing feature. But, we have good news: dbt provides the `exceptions.raise_compiler_error` macro so that we raise errors within a `dbt run-operation`. Using this, I implemented a dbt Package called [yu-iskw/dbt-unittest](https://hub.getdbt.com/yu-iskw/dbt_unittest/latest/), which is inspired by [python’s unittest module](https://docs.python.org/3/library/unittest.html), to enhance unit testing of dbt Package development.

[GitHub - yu-iskw/dbt-unittest: A dbt Package provides macros for unit testing](https://github.com/yu-iskw/dbt-unittest)

Using this, we can re-implement the example using the `dbt_unittest.assert_equals` macro and the implementation gets much simpler.

```sql
-- integration_tests/macros/test_to_literal.sql
{% macro test_to_literal() %}

    {{ return(adapter.dispatch('test_to_literal', 'integration_tests')(text)) }}

{% endmacro %}

{% macro default__test_to_literal() %}

    {% result = dbt_sample_package.to_literal('test string') %}

    {{ dbt_unittest.assert_equals(result, "'test string'") }}

{% endmacro %}

{% macro postgres__test_to_literal() %}

    {% result = dbt_sample_package.to_literal('test string') %}

    {{ dbt_unittest.assert_equals(result, "E'test string'") }}

{% endmacro %}
```

---

I practiced the idea even in the development of `yu-iskw/dbt-unittest`. The actual testing macros are located [here](https://github.com/yu-iskw/dbt-unittest/tree/main/integration_tests/macros/tests). Moreover, we are able to implement the continuous integration workflow as regular software development. For instance, I implemented [a workflow with GitHub Actions](https://github.com/yu-iskw/dbt-unittest/blob/main/.github/workflows/unit-tests.yml). It enables me to notice there is something wrong with changes.

Aside from that, it would be great to take a look at other dbt Packages for integration testing and unit testing on dbt hub. For instance, [the dbt_datamocktool package](https://hub.getdbt.com/mjirv/dbt_datamocktool/latest/) is another useful package for unit testing dbt projects. We can create mock CSV seeds to stand in for the sources and refs that your models use and test that the model produces the desired output. That would be useful to mock testing data for your dbt project.

## Summary

In this article we’ve:

- Introduced two approaches for testing your dbt Packages
- Demonstrated a simple unit testing example
- Shown how you can use existing tools to help build out your unit testing capabilities

Hopefully this is helpful to you in your dbt Package development journey.
