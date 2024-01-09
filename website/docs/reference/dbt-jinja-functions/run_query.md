---
title: "About run_query macro"
sidebar_label: "run_query"
id: "run_query"
description: "Use `run_query` macro to run queries and fetch results."
---

The `run_query` macro provides a convenient way to run queries and fetch their results. It is a wrapper around the [statement block](/reference/dbt-jinja-functions/statement-blocks), which is more flexible, but also more complicated to use.

__Args__:
 * `sql`: The SQL query to execute

Returns a [Table](https://agate.readthedocs.io/page/api/table.html) object with the result of the query. If the specified query does not return results (eg. a <Term id="ddl" />, <Term id="dml" />, or maintenance query), then the return value will be `none`.

**Note:** The `run_query` macro will not begin a transaction automatically - if you wish to run your query inside of a transaction, please use `begin` and `commit ` statements as appropriate.

:::info Using run_query for the first time?
Check out the section of the Getting Started guide on [using Jinja](/guides/using-jinja#dynamically-retrieve-the-list-of-payment-methods) for an example of working with the results of the `run_query` macro!
:::

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

Here's an example of using this (though if you're using `run_query` to return the values of a column, check out the [get_column_values](https://github.com/dbt-labs/dbt-utils#get_column_values-source) macro in the dbt-utils package).

<File name='models/my_model.sql'>

```sql

{% set payment_methods_query %}
select distinct payment_method from app_data.payments
order by 1
{% endset %}

{% set results = run_query(payment_methods_query) %}

{% if execute %}
{# Return the first column #}
{% set results_list = results.columns[0].values() %}
{% else %}
{% set results_list = [] %}
{% endif %}

select
order_id,
{% for payment_method in results_list %}
sum(case when payment_method = '{{ payment_method }}' then amount end) as {{ payment_method }}_amount,
{% endfor %}
sum(amount) as total_amount
from {{ ref('raw_payments') }}
group by 1

```
</File>


You can also use `run_query` to perform SQL queries that aren't select statements.

<File name='macros/run_vacuum.sql'>

```sql
{% macro run_vacuum(table) %}

  {% set query %}
    vacuum table {{ table }}
  {% endset %}

  {% do run_query(query) %}
{% endmacro %}
```

</File>


Use the `length` filter to verify whether `run_query` returned any rows or not.  Make sure to wrap the logic in an [if execute](/reference/dbt-jinja-functions/execute) block to avoid unexpected behavior during parsing. 

```sql
{% if execute %}
{% set results = run_query(payment_methods_query) %}
{% if results|length > 0 %}
  	-- do something with `results` here...
{% else %}
    -- do fallback here...
{% endif %}
{% endif %}
```
