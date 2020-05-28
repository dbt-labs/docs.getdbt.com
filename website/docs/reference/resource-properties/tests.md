---
resource_types: all
datatype: test
---
<Alert type='warning'>
<h4>Heads up!</h4>
This is a work in progress document.

</Alert>

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
      - [<test_name>](#test_name)
      - [<test_name>](#test_name):
          <argument_name>: <argument_value>
          [severity](#severity): warn | error
          [tags](resource-properties/tags): [<string>]

    columns:
      - name: <column_name>
        tests:
          - [<test_name>](#test_name)
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              [severity](#severity): warn | error
              [tags](resource-properties/tags): [<string>]

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
            [severity](#severity): warn | error
            [tags](resource-properties/tags): [<string>]

      columns:
        - name: <column_name>
          tests:
            - [<test_name>](#test_name)

            - [<test_name>](#test_name):
                <argument_name>: <argument_value>
                [severity](#severity): warn | error
                [tags](resource-properties/tags): [<string>]

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='data/<filename>.yml'>

```yml
version: 2

seeds:
  - name: <seed_name>
    tests:
      - [<test_name>](#test_name)
      - [<test_name>](#test_name):
          <argument_name>: <argument_value>
          [severity](#severity): warn | error
          [tags](resource-properties/tags): [<string>]

    columns:
      - name: <column_name>
        tests:
          - [<test_name>](#test_name)
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              [severity](#severity): warn | error
              [tags](resource-properties/tags): [<string>]

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
          [severity](#severity): warn | error
          [tags](resource-properties/tags): [<string>]

    columns:
      - name: <column_name>
        tests:
          - [<test_name>](#test_name)
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              [severity](#severity): warn | error
              [tags](resource-properties/tags): [<string>]

```

</File>

</TabItem>


<TabItem value="analyses">

This feature is not implemented for analyses.

</TabItem>

</Tabs>

## Related documentation
* [Testing guide](tests)

## Description

The `tests` field is used to assert properties of a column or table.

Once these tests are defined, you can validate their correctness by running `dbt test`.

## test_name

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

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique
```

</File>

### `accepted_values`

This test validates that all of the values in a column are present in a supplied list of `values`. If any values other than those provided in the list are present, then the test will fail.

The `accepted_values` test supports an optional `quote` parameter which by default will single-quote the list of accepted values in the test query. To test non-strings (like integers or boolean values) explicitly set the `quote` config to `false`.

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
              values: [1, 2, 3 4]
              quote: false
```

</File>

### `relationships`

This test validates that all of the records in a child table have a corresponding record in a parent table. This property is referred to as "referential integrity".

The following example tests that every order's `customer_id` maps back to a valid `customer`.

<File name='schema.yml'>

```yaml
version: 2

models:
  - name: people
    columns:
      - name: customer_id
        tests:
          - relationships:
                to: ref('customers')
                field: id
```

</File>

The `to` argument accepts a [Relation](class-reference#relation) – this means you can pass it a `ref` to a model (e.g. `ref('customers')`), or a `source` (e.g. `source('jaffle_shop', 'customers')`).


## severity

<Changelog>

* `v0.14.0`: This parameter was introduced

</Changelog>

The "severity" of a test can be configured by supplying the `severity` configuration option in the test specification. The `severity` option can be one of `warn` or `error`. If `warn` is supplied, then dbt will log a warning for any failing tests, but the test will still be considered passing. This configuration is useful for tests in which a failure does not imply that action is required.

If a `severity` level is not provided, then tests are run with the `error` severity level. The `severity` config can be applied to any schema test, including those  [you define yourself](custom-schema-tests).

They can also be applied to [data tests](building-a-dbt-project/tests#data-tests)

## Additional examples
- Test a primary key
- Test an expression
- Advanced: define and use custom schema test (see the guide)

## FAQs:
- Thresholds
- Set all tests to warn severity by default
- reuse test logic
