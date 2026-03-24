---
title: "About run_query_as macro"
sidebar_label: "run_query_as"
id: "run_query_as"
description: "Use `run_query_as` to run queries with an explicit `fetch_result` setting."
---

The `run_query_as` macro provides a user-friendly wrapper around the [statement block](/reference/dbt-jinja-functions/statement-blocks). Use it when you need to name the statement and explicitly control whether dbt fetches results.

__Args__:
 * `sql`: The SQL query to execute
 * `name`: The name for the statement result
 * `fetch_result`: If `True`, load the results of the statement into the Jinja context. Defaults to `True`.

Returns an [Agate table](https://agate.readthedocs.io/page/api/table.html) if `fetch_result=True`. If `fetch_result=False`, it does not return a table.

**Note:** The `run_query_as` macro will not begin a transaction automatically. If you want to run your query inside a transaction, use `begin` and `commit` statements as needed.

:::info Fusion-only
`run_query_as` is available in dbt Fusion engine and is not available in dbt Core.
:::

**Example usage:**

<File name='models/my_model.sql'>

```jinja2
{% set results = run_query_as('select 1 as id', 'example_query') %}

{% if results is not none %}
  {{ log(results.print_table(), info=True) }}
{% endif %}
```

</File>

Use `fetch_result=False` for statements where you do not want dbt to fetch results, such as `alter` statements and other <Term id="ddl" /> or <Term id="dml" /> statements.

<File name='macros/set_query_tag.sql'>

```jinja2
{% macro set_query_tag(tag) %}

  {% set query %}
    alter session set query_tag = '{{ tag }}'
  {% endset %}

  {% do run_query_as(query, 'set_query_tag', fetch_result=False) %}
{% endmacro %}
```

</File>
