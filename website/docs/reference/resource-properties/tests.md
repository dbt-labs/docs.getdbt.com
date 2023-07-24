---
title: "About tests property"
sidebar_label: "tests"
resource_types: all
datatype: test
keywords: [test, tests, custom tests, custom test name, test name]
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value: 'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Analyses', value: 'analyses', },
  ]
}>

<TabItem value="models">

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - name: <model_name>
    tests:
      - [<test_name>](#test_name):
          <argument_name>: <argument_value>
          [config](/reference/resource-properties/config):
            [<test_config>](/reference/test-configs): <config-value>

    [columns](/reference/resource-properties/columns):
      - name: <column_name>
        tests:
          - [<test_name>](#test_name)
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              [config](/reference/resource-properties/config):
                [<test_config>](/reference/test-configs): <config-value>
```

</File>

</TabItem>

<TabItem value="sources">

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <source_name>
    tables:
    - name: <table_name>
      tests:
        - [<test_name>](#test_name)
        - [<test_name>](#test_name):
            <argument_name>: <argument_value>
            [config](/reference/resource-properties/config):
              [<test_config>](/reference/test-configs): <config-value>

      columns:
        - name: <column_name>
          tests:
            - [<test_name>](#test_name)
            - [<test_name>](#test_name):
                <argument_name>: <argument_value>
                [config](/reference/resource-properties/config):
                  [<test_config>](/reference/test-configs): <config-value>

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='seeds/<filename>.yml'>

```yml
version: 2

seeds:
  - name: <seed_name>
    tests:
      - [<test_name>](#test_name)
      - [<test_name>](#test_name):
          <argument_name>: <argument_value>
          [config](/reference/resource-properties/config):
            [<test_config>](/reference/test-configs): <config-value>

    columns:
      - name: <column_name>
        tests:
          - [<test_name>](#test_name)
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              [config](/reference/resource-properties/config):
                [<test_config>](/reference/test-configs): <config-value>

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/<filename>.yml'>

```yml
version: 2

snapshots:
  - name: <snapshot_name>
    tests:
      - [<test_name>](#test_name)
      - [<test_name>](#test_name):
          <argument_name>: <argument_value>
          [config](/reference/resource-properties/config):
            [<test_config>](/reference/test-configs): <config-value>

    columns:
      - name: <column_name>
        tests:
          - [<test_name>](#test_name)
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              [config](/reference/resource-properties/config):
                [<test_config>](/reference/test-configs): <config-value>

```

</File>

</TabItem>


<TabItem value="analyses">

This feature is not implemented for analyses.

</TabItem>

</Tabs>

## Related documentation

* [Testing guide](/docs/build/tests)

## Description

The `tests` property defines assertions about a column, <Term id="table" />, or <Term id="view" />. The property contains a list of [generic tests](/docs/build/tests#generic-tests), referenced by name, which can include the four built-in generic tests available in dbt. For example, you can add tests that ensure a column contains no duplicates and zero null values. Any arguments or [configurations](/reference/test-configs) passed to those tests should be nested below the test name.

Once these tests are defined, you can validate their correctness by running `dbt test`.

## Out-of-the-box tests

There are four generic tests that are available out of the box, for everyone using dbt.

### `not_null`

This test validates that there are no `null` values present in a column.

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - not_null
```

</File>

### `unique`

This test validates that there are no duplicate values present in a field.
                
The config and where clause are optional.

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique:
              config:
                where: "order_id > 21"
```

</File>

### `accepted_values`

This test validates that all of the values in a column are present in a supplied list of `values`. If any values other than those provided in the list are present, then the test will fail.

The `accepted_values` test supports an optional `quote` parameter which, by default, will single-quote the list of accepted values in the test query. To test non-strings (like integers or boolean values) explicitly set the `quote` config to `false`.

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: status
        tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'returned']

      - name: status_id
        tests:
          - accepted_values:
              values: [1, 2, 3, 4]
              quote: false
```

</File>

### `relationships`

This test validates that all of the records in a child <Term id="table" /> have a corresponding record in a parent table. This property is referred to as "referential integrity".

The following example tests that every order's `customer_id` maps back to a valid `customer`.

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: customer_id
        tests:
          - relationships:
              to: ref('customers')
              field: id
```

</File>

The `to` argument accepts a [Relation](/reference/dbt-classes#relation) – this means you can pass it a `ref` to a model (e.g. `ref('customers')`), or a `source` (e.g. `source('jaffle_shop', 'customers')`).

## Additional examples

### Test an expression
Some tests require multiple columns, so it doesn't make sense to nest them under the `columns:` key. In this case, you can apply the test to the model (or source, seed, or snapshot) instead:

<File name='models/orders.yml'>

```yml
version: 2

models:
  - name: orders
    tests:
      - unique:
          column_name: "country_code || '-' || order_id"
```

</File>

### Use custom generic test

If you've defined your own custom generic test, you can use that as the `test_name`:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - primary_key  # name of my custom generic test

```

</File>

Check out the guide on writing a [custom generic test](/guides/best-practices/writing-custom-generic-tests) for more information.

<VersionBlock firstVersion="1.1">

### Custom test name

By default, dbt will synthesize a name for your generic test by concatenating:
- test name (`not_null`, `unique`, etc)
- model name (or source/seed/snapshot)
- column name (if relevant)
- arguments (if relevant, e.g. `values` for `accepted_values`)

It does not include any configurations for the test. If the concatenated name is too long, dbt will use a truncated and hashed version instead. The goal is to preserve unique identifiers for all resources in your project, including tests.

You may also define your own name for a specific test, via the `name` property.

**When might you want this?** dbt's default approach can result in some wonky (and ugly) test names. By defining a custom name, you get full control over how the test will appear in log messages and metadata artifacts. You'll also be able to select the test by that name.

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: status
        tests:
          - accepted_values:
              name: unexpected_order_status_today
              values: ['placed', 'shipped', 'completed', 'returned']
              config:
                where: "order_date = current_date"
```

</File>

```sh
$ dbt test --select unexpected_order_status_today
12:43:41  Running with dbt=1.1.0
12:43:41  Found 1 model, 1 test, 0 snapshots, 0 analyses, 167 macros, 0 operations, 1 seed file, 0 sources, 0 exposures, 0 metrics
12:43:41
12:43:41  Concurrency: 5 threads (target='dev')
12:43:41
12:43:41  1 of 1 START test unexpected_order_status_today ................................ [RUN]
12:43:41  1 of 1 PASS unexpected_order_status_today ...................................... [PASS in 0.03s]
12:43:41
12:43:41  Finished running 1 test in 0.13s.
12:43:41
12:43:41  Completed successfully
12:43:41
12:43:41  Done. PASS=1 WARN=0 ERROR=0 SKIP=0 TOTAL=1
```

A test's name must be unique for all tests defined on a given model-column combination. If you give the same name to tests defined on several different columns, or across several different models, then `dbt test --select <repeated_custom_name>` will select them all. 

**When might you need this?** In cases where you have defined the same test twice, with only a difference in configuration, dbt will consider these tests to be duplicates:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: status
        tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'returned']
              config:
                where: "order_date = current_date"
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'returned']
              config:
                # only difference is in the 'where' config
                where: "order_date = (current_date - interval '1 day')" # PostgreSQL syntax
```

</File>

```sh
Compilation Error
  dbt found two tests with the name "accepted_values_orders_status__placed__shipped__completed__returned" defined on column "status" in "models.orders".

  Since these resources have the same name, dbt will be unable to find the correct resource
  when running tests.

  To fix this, change the name of one of these resources:
  - test.testy.accepted_values_orders_status__placed__shipped__completed__returned.69dce9e5d5 (models/one_file.yml)
  - test.testy.accepted_values_orders_status__placed__shipped__completed__returned.69dce9e5d5 (models/one_file.yml)
```

By providing a custom name, you help dbt differentiate tests:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: status
        tests:
          - accepted_values:
              name: unexpected_order_status_today
              values: ['placed', 'shipped', 'completed', 'returned']
              config:
                where: "order_date = current_date"
          - accepted_values:
              name: unexpected_order_status_yesterday
              values: ['placed', 'shipped', 'completed', 'returned']
              config:
                where: "order_date = (current_date - interval '1 day')" # PostgreSQL
```

</File>

```sh
$ dbt test
12:48:03  Running with dbt=1.1.0-b1
12:48:04  Found 1 model, 2 tests, 0 snapshots, 0 analyses, 167 macros, 0 operations, 1 seed file, 0 sources, 0 exposures, 0 metrics
12:48:04
12:48:04  Concurrency: 5 threads (target='dev')
12:48:04
12:48:04  1 of 2 START test unexpected_order_status_today ................................ [RUN]
12:48:04  2 of 2 START test unexpected_order_status_yesterday ............................ [RUN]
12:48:04  1 of 2 PASS unexpected_order_status_today ...................................... [PASS in 0.04s]
12:48:04  2 of 2 PASS unexpected_order_status_yesterday .................................. [PASS in 0.04s]
12:48:04
12:48:04  Finished running 2 tests in 0.21s.
12:48:04
12:48:04  Completed successfully
12:48:04
12:48:04  Done. PASS=2 WARN=0 ERROR=0 SKIP=0 TOTAL=2
```

**If using [`store_failures`](/reference/resource-configs/store_failures):** dbt uses each test's name as the name of the table in which to store any failing records. If you have defined a custom name for one test, that custom name will also be used for its table of failures. You may optionally configure an [`alias`](/reference/resource-configs/alias) for the test, to separately control both the name of the test (for metadata) and the name of its database table (for storing failures).

</VersionBlock>

<VersionBlock firstVersion="1.1">

### Alternative format for defining tests

When defining a generic test with several arguments and configurations, the YAML can look and feel unwieldy. If you find it easier, you can define the same test properties as top-level keys of a single dictionary, by providing the test name as `test_name` instead. It's totally up to you.

This example is identical to the one above:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: status
        tests:
          - name: unexpected_order_status_today
            test_name: accepted_values  # name of the generic test to apply
            values:
              - placed
              - shipped
              - completed
              - returned
            config:
              where: "order_date = current_date"
```

</File>

</VersionBlock>
