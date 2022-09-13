---
resource_types: [tests]
datatype: string
---

<Changelog>

* `v0.20.0`: Introduced `where` config
* `v0.21.0`: Introduced `config` property for tests. Reimplemented `where` config with `get_where_subquery` macro

</Changelog>

### Definition

Filter the resource being tested (model, source, seed, or snapshot).

The `where` condition is templated into the test query by replacing the resource reference with a <Term id="subquery" />. For instance, a `not_null` test may look like:
```sql
select *
from my_model
where my_column is null
```
If the `where` config is set to `where date_column = current_date`, then the test query will be updated to:
```sql
select *
from (select * from my_model where date_column = current_date) dbt_subquery
where my_column is null
```

### Examples

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
      - name: my_column
        tests:
          - accepted_values:
              values: ["a", "b", "c"]
              config:
                where: "date_column = current_date"
```

</File>

</TabItem>

<TabItem value="one_off">

Configure a one-off (data) test:

<File name='tests/<filename>.sql'>

```sql
{{ config(where = "date_column = current_date") }}

select ...
```

</File>

</TabItem>

<TabItem value="generic">

Set the default for all instances of a generic (schema) test, by setting the config inside its test block (definition):

<File name='macros/<filename>.sql'>

```sql
{% test <testname>(model, column_name) %}

{{ config(where = "date_column = current_date") }}

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
  +where: "date_column = current_date"
  
  <package_name>:
    +where: >
        date_column = current_date
        and another_column is not null
```

</File>

</TabItem>

</Tabs>

### Custom logic

As of v0.21, dbt defines a [`get_where_subquery` macro](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/include/global_project/macros/materializations/tests/where_subquery.sql).

dbt replaces `{{ model }}` in generic test definitions with `{{ get_where_subquery(relation) }}`, where `relation` is a `ref()` or `source()` for the resource being tested. The default implementation of this macro returns:
- `{{ relation }}` when the `where` config is not defined (`ref()` or `source()`)
- `(select * from {{ relation }} where {{ where }}) dbt_subquery` when the `where` config is defined

You can override this behavior by:
- Defining a custom `get_where_subquery` in your root project
- Defining a custom `<adapter>__get_where_subquery` [dispatch candidate](dispatch) in your package or adapter plugin
