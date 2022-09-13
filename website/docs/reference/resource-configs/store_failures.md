---
resource_types: [tests]
datatype: boolean
---

<Changelog>

* `v0.20.0`: Introduced `store_failures` config and functionality
* `v0.21.0`: Introduced `config` property for tests

</Changelog>

The configured test(s) will store their failures when `dbt test --store-failures` is invoked.

## Description
Optionally set a test to always or never store its failures in the database.
- If specified as `true` or `false`, the
`store_failures` config will take precedence over the presence or absence of the `--store-failures` flag.
- If the `store_failures` config is `none` or omitted, the resource will use the value of the `--store-failures` flag.

This logic is encoded in the [`should_store_failures()`](https://github.com/dbt-labs/dbt-core/blob/98c015b7754779793e44e056905614296c6e4527/core/dbt/include/global_project/macros/materializations/helpers.sql#L77) macro.

<Tabs
  defaultValue="specific"
  values={[
    { label: 'Specific test', value: 'specific', },
    { label: 'Singular test', value: 'singular', },
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
  - name: my_model
    columns:
      - name: my_column
        tests:
          - unique:
              config:
                store_failures: true  # always store failures
          - not_null:
              config:
                store_failures: false  # never store failures
```

</File>

</TabItem>

<TabItem value="singular">

Configure a singular (data) test:

<File name='tests/<filename>.sql'>

```sql
{{ config(store_failures = true) }}

select ...
```

</File>

</TabItem>

<TabItem value="generic">

Set the default for all instances of a generic (schema) test, by setting the config inside its test block (definition):

<File name='macros/<filename>.sql'>

```sql
{% test <testname>(model, column_name) %}

{{ config(store_failures = false) }}

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
  +store_failures: true  # all tests
  
  <package_name>:
    +store_failures: false # tests in <package_name>
```

</File>

</TabItem>

</Tabs>
