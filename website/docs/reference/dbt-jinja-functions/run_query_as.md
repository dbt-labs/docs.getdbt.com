---
title: "About run_query_as macro"
sidebar_label: "run_query_as"
id: "run_query_as"
description: "Use `run_query_as` to run queries with an explicit `fetch_result` setting."
---

The `run_query_as` macro provides a convenient wrapper around the [statement block](/reference/dbt-jinja-functions/statement-blocks). Use it when you need to name the statement and control whether dbt fetches results.

:::info Fusion only
The dbt Fusion engine includes `run_query_as`. dbt Core does not.
:::

## Args

* `sql`: The SQL query to execute
* `name`: The name for the statement result
* `fetch_result`: Whether to load statement results into the Jinja context. Defaults to `True`.

Returns an [Agate table](https://agate.readthedocs.io/page/api/table.html) when `fetch_result=True`. Returns nothing when `fetch_result=False`.

:::note
The `run_query_as` macro does not begin a transaction automatically. If you want to run your query inside a transaction, use `begin` and `commit` statements as needed.
:::

### Examples

<File name='models/my_model.sql'>

```jinja2
{% set results = run_query_as('select 1 as id', 'example_query') %}

{% if results is not none %}
  {{ log(results.print_table(), info=True) }}
{% endif %}
```

</File>

Use `fetch_result=False` for statements where you do not want dbt to fetch results, such as `alter` statements and other <Term id="ddl" /> or <Term id="dml" /> statements. This is particularly useful on BigQuery, where `ALTER TABLE` statements on large tables can hang when results are fetched.

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
