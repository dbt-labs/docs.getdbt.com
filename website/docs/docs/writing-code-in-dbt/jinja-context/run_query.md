---
title: "run_query"
id: "run_query"
---

The `run_query` macro provides a convenient way to run queries and fetch their results. It is a wrapper around the [statement block](statement-blocks), which is more flexible, but also more complicated to use.

__Args__:
 * `sql`: The SQL query to execute

Returns a [Table](https://agate.readthedocs.io/en/1.3.1/api/table.html) object with the result of the query. If the specified query does not return results (eg. a DDL, DML, or maintenance query), then the return value will be `none`.

**Note:** The `run_query` macro will not begin a transaction automatically - if you wish to run your query inside of a transaction, please use `begin` and `commit ` statements as appropriate.


<Callout type="info" title="Using run_query for the first time?">

Check out the tutorial on [using Jinja](using-jinja#dynamically-retrieve-the-list-of-payment-methods) for an example of working with the results of the `run_query` macro!

</Callout>


**Example Usage:**

<File name='models/my_model.sql'>

```jinja2
{% set results = run_query('select 1 as id') %}
{% do results.print_table() %}

-- do something with `results` here...
```

</File>



<File name='macros/run_grants.sql'>

```jinja2
{% macro run_vacuum(table) %}

  {% set query %}
    vacuum table {{ table }}
  {% endset %}
  
  {% do run_query(query) %}
{% endmacro %}
```

</File>
