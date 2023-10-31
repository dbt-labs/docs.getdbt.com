---
title: "Configuring test `severity`"
id: "severity"
description: "You can use error thresholds to configure the severity of test results and set when to produce an error or warning based on the number of failed tests."
resource_types: [tests]
datatype: string
---

Tests return a number of failures—most often, this is the count of rows returned by the test query, but it could be a [custom calculation](/reference/resource-configs/fail_calc). Generally, if the number of failures is nonzero, the test returns an error. This makes sense, as test queries are designed to return all the rows you _don't_ want: duplicate records, null values, etc.

It's possible to configure tests to return warnings instead of errors, or to make the test status conditional on the number of failures returned. Maybe 1 duplicate record can count as a warning, but 10 duplicate records should count as an error.

The relevant configs are:
- `severity`: `error` or `warn` (default: `error`)
- `error_if`: conditional expression (default: `!=0`)
- `warn_if`: conditional expression (default: `!=0`)

Conditional expressions can be any comparison logic that is supported by your SQL syntax with an integer number of failures: `> 5`, `= 0`, `between 5 and 10`, and so on.

Here's how those play in practice:
- If `severity: error`, dbt will check the `error_if` condition first. If the error condition is met, the test returns an error. If it's not met, dbt will then check the `warn_if` condition (defaulted to `!=0`). If it's not specified or the warn condition is met, the test warns; if it's not met, the test passes.
- If `severity: warn`, dbt will skip the `error_if` condition entirely and jump straight to the `warn_if` condition. If the warn condition is met, the test warns; if it's not met, the test passes.

Note that test warn statuses will return errors instead if the [`--warn-error`](/reference/global-cli-flags#warnings-as-errors) flag is passed. Unless dbt is told to treat warnings as errors, a test with `warn` severity will never return an error.

<Tabs
  defaultValue="generic"
  values={[
    { label: 'Out-of-the-box generic tests', value: 'generic', },
    { label: 'Singular tests', value: 'singular', },
    { label: 'Custom generic tests', value: 'custom-generic', },
    { label: 'Project level', value: 'project', },
  ]
}>

<TabItem value="generic">

Configure a specific instance of a out-of-the-box generic test:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: large_table
    columns:
      - name: slightly_unreliable_column
        tests:
          - unique:
              config:
                severity: error
                error_if: ">1000"
                warn_if: ">10"
```

</File>

</TabItem>

<TabItem value="singular">

Configure a singular test:

<File name='tests/<filename>.sql'>

```sql
{{ config(error_if = '>50') }}

select ...
```

</File>

</TabItem>

<TabItem value="custom-generic">

Set the default for all instances of a custom generic test, by setting the config inside its test block (definition):

<File name='macros/<filename>.sql'>

```sql
{% test <testname>(model, column_name) %}

{{ config(severity = 'warn') }}

select ...

{% endtest %}
```

</File>

</TabItem>

<TabItem value="project">

Set the default for all tests in a package or project:

<File name='dbt_project.yml'>

```yaml
tests:
  +severity: warn  # all tests

  <package_name>:
    +warn_if: >10 # tests in <package_name>
```

</File>

</TabItem>

</Tabs>
