---
resource_types: [tests]
datatype: string
---

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
      - name: other_column
        tests:
          - not_null:
              where: "date_column < current_date"
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

The rendering context for the `where` config is the same as for all configurations defined in `.yml` files. You have access to `{{ var() }}` and `{{ env_var() }}`, but you **do not** have access to custom macros for setting this config. If you do want to use custom macros to template out the `where` filter for certain tests, there is a workaround.

As of v0.21, dbt defines a [`get_where_subquery` macro](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/include/global_project/macros/materializations/tests/where_subquery.sql).

dbt replaces `{{ model }}` in generic test definitions with `{{ get_where_subquery(relation) }}`, where `relation` is a `ref()` or `source()` for the resource being tested. The default implementation of this macro returns:
- `{{ relation }}` when the `where` config is not defined (`ref()` or `source()`)
- `(select * from {{ relation }} where {{ where }}) dbt_subquery` when the `where` config is defined

You can override this behavior by:
- Defining a custom `get_where_subquery` in your root project
- Defining a custom `<adapter>__get_where_subquery` [dispatch candidate](/reference/dbt-jinja-functions/dispatch) in your package or adapter plugin

Within this macro definition, you can reference whatever custom macros you want, based on static inputs from the configuration. At simplest, this enables you to DRY up code that you'd otherwise need to repeat across many different `.yml` files. Because the `get_where_subquery` macro is resolved at runtime, your custom macros can also include [fetching the results of introspective database queries](https://docs.getdbt.com/reference/dbt-jinja-functions/run_query).

**Example:** Filter your test to the past three days of data, using dbt's cross-platform [`dateadd()`](https://docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros#dateadd) utility macro.

<File name='models/config.yml'>

```yml
version: 2
models:
  - name: my_model
    columns:
      - name: id
        tests:
          - unique:
              config:
                where: "date_column > __three_days_ago__"  # placeholder string for static config
```

</File>

<File name='macros/custom_get_where_subquery.sql'>

```sql
{% macro get_where_subquery(relation) -%}
    {% set where = config.get('where') %}
    {% if where %}
        {% if "__three_days_ago__" in where %}
            {# replace placeholder string with result of custom macro #}
            {% set three_days_ago = dbt.dateadd('day', -3, current_timestamp()) %}
            {% set where = where | replace("__three_days_ago__", three_days_ago) %}
        {% endif %}
        {%- set filtered -%}
            (select * from {{ relation }} where {{ where }}) dbt_subquery
        {%- endset -%}
        {% do return(filtered) %}
    {%- else -%}
        {% do return(relation) %}
    {%- endif -%}
{%- endmacro %}
```

</File>
