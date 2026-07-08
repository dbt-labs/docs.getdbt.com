---
title: "About run_query_as macro"
sidebar_label: "run_query_as"
id: "run_query_as"
description: "Use `run_query_as` to run queries with an explicit `fetch_result` setting."
---

The `run_query_as` macro provides a convenient wrapper around the [statement block](/reference/dbt-jinja-functions/statement-blocks). Use it when you need to name the statement and control whether dbt fetches results.

:::info Fusion only

The <Constant name="fusion_engine" /> includes `run_query_as`. <Constant name="core" /> does not.

:::


## run_query vs. run_query_as

`run_query` and `run_query_as` are both wrappers around [statement blocks](/reference/dbt-jinja-functions/statement-blocks). The difference is how much control they give you:

| Feature | `run_query` | `run_query_as` |
|---------|-------------|----------------|
| Fetches results | Always | Optional (`fetch_result`, defaults to `True`) |
| Names the result set | No | Yes (`name`) |
| Availability | dbt Core and Fusion | Fusion only |

Use `run_query_as` when you need to skip fetching results. For example, `alter`, <Term id="ddl" />, or <Term id="dml" /> statements where fetching a large result set can hang (a known issue on BigQuery) or fail [Fusion type checking](/reference/dbt-jinja-functions/run_query#fusion-type-checking). Use [`run_query`](/reference/dbt-jinja-functions/run_query) for ordinary `select` queries where you want the results back.

## Args

* `sql`: The SQL query to execute
* `name`: The name for the statement's result set, so you can retrieve it later with [`load_result(name)`](/reference/dbt-jinja-functions/statement-blocks). This is required even if you don't intend to call `load_result`.
* `fetch_result`: Whether to load statement results into the Jinja context. Defaults to `True`.

Returns a [Table](https://agate.readthedocs.io/page/api/table.html) object when `fetch_result=True`. Returns nothing when `fetch_result=False`.

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

The following macro sets a Snowflake query tag without fetching results:

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
