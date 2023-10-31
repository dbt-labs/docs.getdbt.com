---
resource_types: [tests]
datatype: integer
---

Limit the number of failures that will be returned by a test query. We recommend using this config when working with large datasets and [storing failures in the database](/reference/resource-configs/store_failures).

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
      - name: very_unreliable_column
        tests:
          - accepted_values:
              values: ["a", "b", "c"]
              config:
                limit: 1000  # will only include the first 1000 failures
```

</File>

</TabItem>

<TabItem value="one_off">

Configure a one-off (data) test:

<File name='tests/<filename>.sql'>

```sql
{{ config(limit = 1000) }}

select ...
```

</File>

</TabItem>

<TabItem value="generic">

Set the default for all instances of a generic (schema) test, by setting the config inside its test block (definition):

<File name='macros/<filename>.sql'>

```sql
{% test <testname>(model, column_name) %}

{{ config(limit = 500) }}

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
  +limit: 1000  # all tests
  
  <package_name>:
    +limit: 50 # tests in <package_name>
```

</File>

</TabItem>

</Tabs>
