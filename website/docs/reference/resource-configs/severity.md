---
resource_types: [tests]
datatype: string
---

<Changelog>

* `v0.14.0`: This config was introduced

</Changelog>

The "severity" of a test can be configured by supplying the `severity` configuration option in the test specification. The `severity` option can be one of `warn` or `error`. If `warn` is supplied, then dbt will log a warning for any failing tests, but the test will still be considered passing. This configuration is useful for tests in which a failure does not imply that action is required.

If a `severity` level is not provided, then tests are run with the `error` severity level.

Set the severity for a specific instance of a generic (schema) test:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique:
              severity: warn
```

</File>

Set the severity for a specific one-off (data) test:

<File name='tests/<filename>.sql'>

```sql
{{ config(severity = 'warn') }}

select ...
```

</File>

<Changelog>

* `v0.20.0`: Introduced configuration of tests from `dbt_project.yml`

</Changelog>

Change the default severity for all tests in a package or project in `dbt_project.yml`:

```yaml
tests:
  +severity: warn  # all tests
  
  <package_name>:
    +severity: error # tests in <package_name>
```


Change the default severity of a generic test:

<File name='macros/<filename>.sql'>

```sql
{% test <testname>(model, column_name) %}

{{ config(severity = 'warn') }}

select ...

{% endtest %}
```

</File>
