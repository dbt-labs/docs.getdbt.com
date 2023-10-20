---
resource_types: [tests]
datatype: string
---

Test queries are written to return a set of failing records, ones not matching the expectation or assertion declared by that test: duplicate records, null values, etc.

Most often, this is the count of rows returned by the test query: the default value of `fail_calc` is `count(*)`. But it can also be a custom calculation, whether an aggregate calculation or simply the name of a column to be selected from the test query.

Most tests do not use the `fail_calc` config, preferring to return a count of failing rows. For the tests that do, the most common place to set the `fail_calc` config is right within a generic test block, alongside its query definition. All the same, `fail_calc` can be set in all the same places as other configs.

For instance, you can configure a `unique` test to return `sum(n_records)` instead of `count(*)` as the failure calculation: that is, the number of rows in the model containing a duplicated column value, rather than the number of distinct column values that are duplicated.

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
  - name: my_model
    columns:
      - name: my_columns
        tests:
          - unique:
              config:
                fail_calc: "sum(n_records)"
```

</File>

</TabItem>

<TabItem value="one_off">

Configure a one-off (data) test:

<File name='tests/<filename>.sql'>

```sql
{{ config(fail_calc = "sum(total_revenue) - sum(revenue_accounted_for)") }}

select ...
```

</File>

</TabItem>

<TabItem value="generic">

Set the default for all instances of a generic (schema) test, by setting the config inside its test block (definition):

<File name='macros/<filename>.sql'>

```sql
{% test <testname>(model, column_name) %}

{{ config(fail_calc = "missing_in_a + missing_in_b") }}

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
  +fail_calc: count(*)  # all tests
  
  <package_name>:
    +fail_calc: count(distinct id) # tests in <package_name>
```

</File>

</TabItem>

</Tabs>
