---
resource_types: [tests]
datatype: string
---

<Changelog>

* `v0.14.0`: Introduced `severity` config
* `v0.20.0`: Introduced `error_if` + `warn_if` configs. Enabled configuration of tests from `dbt_project.yml`
<<<<<<< HEAD
=======
* `v0.21.0`: Introduced `config` property for tests
>>>>>>> 0d0f94e87e138f3d13ad645c0b493bcf540fe8cb

</Changelog>

Tests return a number of failures—most often, this is the count of rows returned by the test query, but it could be a [custom calculation](resource-configs/fail_calc). Generally, if the number of failures is nonzero, the test returns an error. This makes sense, as test queries are designed to return all the rows you _don't_ want: duplicate records, null values, etc.

It's possible to configure tests to return warnings instead of errors, or to make the test status conditional on the number of failures returned. Maybe 1 duplicate record can count as a warning, but 10 duplicate records should count as an error.

The relevant configs are:
- `severity`: `error` or `warn` (default: `error`)
- `error_if`: conditional expression (default: `!=0`)
- `warn_if`: conditional expression (default: `!=0`)

Conditional expressions can be any comparison logic that is supported by your SQL syntax with an integer number of failures: `> 5`, `= 0`, `between 5 and 10`, and so on.

Here's how those play in practice:
- If `severity: error`, dbt will check the `error_if` condition first. If the error condition is met, the test returns an error. If it's not met, dbt will then check the `warn_if` condition. If the warn condition is met, the test warns; if it's not met, the test passes.
- If `severity: warn`, dbt will skip the `error_if` condition entirely and jump straight to the `warn_if` condition. If the warn condition is met, the test warns; if it's not met, the test passes.

Note that test warn statuses will return errors instead if the [`--warn-error`](global-cli-flags#warnings-as-errors) flag is passed. Unless dbt is told to treat warnings as errors, a test with `warn` severity will never return an error.

<Tabs
  defaultValue="specific"
  values={[
    { label: 'Specific test', value: 'specific', },
    { label: 'One-off test', value: 'one_off', },
    { label: 'Generic test block', value: 'generic', },
    { label: 'Project level', value: 'project', },
  ]
}>

<TabItem value="specific">

Configure a specific instance of a generic (schema) test:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: large_table
    columns:
      - name: slightly_unreliable_column
        tests:
          - unique:
<<<<<<< HEAD
              severity: error
              error_if: ">1000"
              warn_if: ">10"
=======
              config:
                severity: error
                error_if: ">1000"
                warn_if: ">10"
>>>>>>> 0d0f94e87e138f3d13ad645c0b493bcf540fe8cb
```

</File>

</TabItem>

<TabItem value="one_off">

Configure a one-off (data) test:

<File name='tests/<filename>.sql'>

```sql
{{ config(error_if = '>50') }}

select ...
```

</File>

</TabItem>

<TabItem value="generic">

Set the default for all instances of a generic (schema) test, by setting the config inside its test block (definition):

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
