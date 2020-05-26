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
      - <test_name>
      - <test_name>:
          <argument_name>: <argument_value>
          severity: warn | error
          tags: [<string>]

    columns:
      - name: <column_name>
        tests:
          - <test_name>
          - <test_name>:
              <argument_name>: <argument_value>
              severity: warn | error
              tags: [<string>]

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
        - <test_name>

        - <test_name>:
            <argument_name>: <argument_value>
            severity: warn | error
            tags: [<string>]

      columns:
        - name: <column_name>
          tests:
            - <test_name>

            - <test_name>:
                <argument_name>: <argument_value>
                severity: warn | error
                tags: [<string>]

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
      - <test_name>
      - <test_name>:
          <argument_name>: <argument_value>
          severity: warn | error
          tags: [<string>]

    columns:
      - name: <column_name>
        tests:
          - <test_name>
          - <test_name>:
              <argument_name>: <argument_value>
              severity: warn | error
              tags: [<string>]

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
      - <test_name>
      - <test_name>:
          <argument_name>: <argument_value>
          severity: warn | error
          tags: [<string>]

    columns:
      - name: <column_name>
        tests:
          - <test_name>
          - <test_name>:
              <argument_name>: <argument_value>
              severity: warn | error
              tags: [<string>]

```

</File>

</TabItem>


<TabItem value="analyses">

This feature is not implemented for analyses.

</TabItem>

</Tabs>

## Related documentation
* testing guide

## Description

The `tests` field is used to assert properties of a column or table. Defining tests is a great way to confirm that your code is working correctly, and also helps prevent regressions when your code changes.

Once these tests are defined, you can validate their correctness by running `dbt test`. More information on the options and syntax for these schema tests can be found in the [Testing](testing) guide.

## test_name
### unique

### not_null

### accepted_values

### relationships

## severity


## Examples
- Test a primary key
- Test an expression
- Advanced: define and use custom schema test (see the guide)

## FAQs:
- Thresholds
- Set all tests to warn severity by default
- reuse test logic
