---
title: "Add tests to your DAG"
sidebar_label: "Tests"
description: "Read this tutorial to learn how to use tests when building in dbt."
search_weight: "heavy"
id: "tests"
keywords:
  - test, tests, testing, dag
---
## Related reference docs
* [Test command](/reference/commands/test)
* [Test properties](/reference/resource-properties/tests)
* [Test configurations](/reference/test-configs)
* [Test selection examples](/reference/node-selection/test-selection-examples)

## Overview

Tests are assertions you make about your models and other resources in your dbt project (e.g. sources, seeds and snapshots). When you run `dbt test`, dbt will tell you if each test in your project passes or fails.

You can use tests to improve the integrity of the SQL in each model by making assertions about the results generated. Out of the box, you can test whether a specified column in a model only contains non-null values, unique values, or values that have a corresponding value in another model (for example, a `customer_id` for an `order` corresponds to an `id` in the `customers` model), and values from a specified list. You can extend tests to suit business logic specific to your organization – any assertion that you can make about your model in the form of a select query can be turned into a test.

Both types of tests return a set of failing records. Previously, generic/schema tests returned a numeric value representing failures. Generic tests (f.k.a. schema tests) are defined using `test` blocks instead of macros prefixed `test_`.

Like almost everything in dbt, tests are SQL queries. In particular, they are `select` statements that seek to grab "failing" records, ones that disprove your assertion. If you assert that a column is unique in a model, the test query selects for duplicates; if you assert that a column is never null, the test seeks after nulls. If the test returns zero failing rows, it passes, and your assertion has been validated.

There are two ways of defining tests in dbt:
* A **singular** test is testing in its simplest form: If you can write a SQL query that returns failing rows, you can save that query in a `.sql` file within your [test directory](/reference/project-configs/test-paths). It's now a test, and it will be executed by the `dbt test` command.
* A **generic** test is a parameterized query that accepts arguments. The test query is defined in a special `test` block (like a [macro](jinja-macros)). Once defined, you can reference the generic test by name throughout your `.yml` files—define it on models, columns, sources, snapshots, and seeds. dbt ships with four generic tests built in, and we think you should use them!

Defining tests is a great way to confirm that your code is working correctly, and helps prevent regressions when your code changes. Because you can use them over and over again, making similar assertions with minor variations, generic tests tend to be much more common—they should make up the bulk of your dbt testing suite. That said, both ways of defining tests have their time and place.

:::tip Creating your first tests
If you're new to dbt, we recommend that you check out our [quickstart guide](/guides) to build your first dbt project with models and tests.
:::

## Singular tests

The simplest way to define a test is by writing the exact SQL that will return failing records. We call these "singular" tests, because they're one-off assertions usable for a single purpose.

These tests are defined in `.sql` files, typically in your `tests` directory (as defined by your [`test-paths` config](/reference/project-configs/test-paths)). You can use Jinja (including `ref` and `source`) in the test definition, just like you can when creating models. Each `.sql` file contains one `select` statement, and it defines one test:

<File name='tests/assert_total_payment_amount_is_positive.sql'>

```sql
-- Refunds have a negative amount, so the total amount should always be >= 0.
-- Therefore return records where this isn't true to make the test fail
select
    order_id,
    sum(amount) as total_amount
from {{ ref('fct_payments' )}}
group by 1
having not(total_amount >= 0)
```

</File>

The name of this test is the name of the file: `assert_total_payment_amount_is_positive`. Simple enough.

Singular tests are easy to write—so easy that you may find yourself writing the same basic structure over and over, only changing the name of a column or model. By that point, the test isn't so singular! In that case, we recommend...

## Generic tests
Certain tests are generic: they can be reused over and over again. A generic test is defined in a `test` block, which contains a parametrized query and accepts arguments. It might look like:

```sql
{% test not_null(model, column_name) %}

    select *
    from {{ model }}
    where {{ column_name }} is null

{% endtest %}
```

You'll notice that there are two arguments, `model` and `column_name`, which are then templated into the query. This is what makes the test "generic": it can be defined on as many columns as you like, across as many models as you like, and dbt will pass the values of `model` and `column_name` accordingly. Once that generic test has been defined, it can be added as a _property_ on any existing model (or source, seed, or snapshot). These properties are added in  `.yml` files in the same directory as your resource.

:::info
If this is your first time working with adding properties to a resource, check out the docs on [declaring properties](/reference/configs-and-properties).
:::

Out of the box, dbt ships with four generic tests already defined: `unique`, `not_null`, `accepted_values` and `relationships`. Here's a full example using those tests on an `orders` model:

```yml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: status
        tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'returned']
      - name: customer_id
        tests:
          - relationships:
              to: ref('customers')
              field: id
```

In plain English, these tests translate to:
* `unique`: the `order_id` column in the `orders` model should be unique
* `not_null`: the `order_id` column in the `orders` model should not contain null values
* `accepted_values`: the `status` column in the `orders` should be  one of `'placed'`, `'shipped'`, `'completed'`, or  `'returned'`
* `relationships`: each `customer_id` in the `orders` model exists as an `id` in the `customers` <Term id="table" /> (also known as referential integrity)

Behind the scenes, dbt constructs a `select` query for each test, using the parametrized query from the generic test block. These queries return the rows where your assertion is _not_ true; if the test returns zero rows, your assertion passes.

You can find more information about these tests, and additional configurations (including [`severity`](/reference/resource-configs/severity) and [`tags`](/reference/resource-configs/tags)) in the [reference section](/reference/resource-properties/tests).

### More generic tests

Those four tests are enough to get you started. You'll quickly find you want to use a wider variety of tests—a good thing! You can also install generic tests from a package, or write your own, to use (and reuse) across your dbt project. Check out the [guide on custom generic tests](/guides/best-practices/writing-custom-generic-tests) for more information.

:::info
There are generic tests defined in some open source packages, such as [dbt-utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) and [dbt-expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest/) — skip ahead to the docs on [packages](/docs/build/packages) to learn more!
:::

### Example
To add a generic (or "schema") test to your project:

1. Add a `.yml` file to your `models` directory, e.g. `models/schema.yml`, with the following content (you may need to adjust the `name:` values for an existing model)

<File name='models/schema.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null

```

</File>

2. Run the [`dbt test` command](/reference/commands/test):

```
$ dbt test

Found 3 models, 2 tests, 0 snapshots, 0 analyses, 130 macros, 0 operations, 0 seed files, 0 sources

17:31:05 | Concurrency: 1 threads (target='learn')
17:31:05 |
17:31:05 | 1 of 2 START test not_null_order_order_id..................... [RUN]
17:31:06 | 1 of 2 PASS not_null_order_order_id........................... [PASS in 0.99s]
17:31:06 | 2 of 2 START test unique_order_order_id....................... [RUN]
17:31:07 | 2 of 2 PASS unique_order_order_id............................. [PASS in 0.79s]
17:31:07 |
17:31:07 | Finished running 2 tests in 7.17s.

Completed successfully

Done. PASS=2 WARN=0 ERROR=0 SKIP=0 TOTAL=2

```
3. Check out the SQL dbt is running by either:
   * **dbt Cloud:** checking the Details tab.
   * **dbt Core:** checking the `target/compiled` directory


**Unique test**
<Tabs
  defaultValue="compiled"
  values={[
    {label: 'Compiled SQL', value: 'compiled'},
    {label: 'Templated SQL', value: 'templated'},
  ]}>
  <TabItem value="compiled">

```sql
select *
from (

    select
        order_id

    from analytics.orders
    where order_id is not null
    group by order_id
    having count(*) > 1

) validation_errors
```

  </TabItem>
  <TabItem value="templated">

```sql
select *
from (

    select
        {{ column_name }}

    from {{ model }}
    where {{ column_name }} is not null
    group by {{ column_name }}
    having count(*) > 1

) validation_errors
```

  </TabItem>
</Tabs>

**Not null test**

<Tabs
  defaultValue="compiled"
  values={[
    {label: 'Compiled SQL', value: 'compiled'},
    {label: 'Templated SQL', value: 'templated'},
  ]}>
  <TabItem value="compiled">

```sql
select *
from analytics.orders
where order_id is null
```

  </TabItem>
  <TabItem value="templated">

```sql
select *
from {{ model }}
where {{ column_name }} is null
```

  </TabItem>
</Tabs>

## Storing test failures

Normally, a test query will calculate failures as part of its execution. If you set the optional `--store-failures` flag,  the [`store_failures`](/reference/resource-configs/store_failures), or the [`store_failures_as`](/reference/resource-configs/store_failures_as) configs, dbt will first save the results of a test query to a table in the database, and then query that table to calculate the number of failures.

This workflow allows you to query and examine failing records much more quickly in development:

<Lightbox src="/img/docs/building-a-dbt-project/test-store-failures.gif" title="Store test failures in the database for faster development-time debugging."/>

Note that, if you elect to store test failures:
* Test result tables are created in a schema suffixed or named `dbt_test__audit`, by default. It is possible to change this value by setting a `schema` config. (For more details on schema naming, see [using custom schemas](/docs/build/custom-schemas).)
- A test's results will always **replace** previous failures for the same test.

## FAQs

<FAQ path="Tests/test-one-model" />
<FAQ path="Runs/failed-tests" />
<FAQ path="Tests/recommended-tests" />
<FAQ path="Tests/when-to-test" />
<FAQ path="Tests/configurable-data-test-path" />
<FAQ path="Tests/testing-sources" />
<FAQ path="Tests/custom-test-thresholds" />
<FAQ path="Tests/uniqueness-two-columns" />
