---
title: "project_name"
id: "project_name"
---

<Changelog>New in 0.16.0</Changelog>

The `project_name` context variable returns the `name` for the root-level project
which is being run by dbt. This variable can be used to defer execution to a
root-level project macro if one exists.

### Example Usage

<File name="redshift/macros/helper.sql">

```sql
/*
  This macro vacuums tables in a Redshift database. If a macro exists in the
  root-level project called `get_tables_to_vacuum`, this macro will call _that_
  macro to find the tables to vacuum. If the macro is not defined in the root
  project, this macro will use a default implementation instead.
*/

{% macro vacuum_tables() %}

  {% set root_project = context['project_name'] %}
  {% if root_project.get_tables_to_vacuum %}
    {% set tables = root_project.get_tables_to_vacuum() %}
  {% else %}
    {% set tables = redshift.get_tables_to_vacuum() %}
  {% endif %}

  {% for table in tables %}
    {% do redshift.vacuum_table(table) %}
  {% endfor %}

{% endmacro %}
```


</File>
