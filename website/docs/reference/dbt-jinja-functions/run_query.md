---
title: "About run_query macro"
sidebar_label: "run_query"
id: "run_query"
description: "Use the `run_query` macro to run queries and fetch results; learn when it runs against the warehouse (including during `dbt docs generate`) and how to guard DML with `flags.WHICH`."
---

The `run_query` macro provides a convenient way to run queries and fetch their results. It is a wrapper around the [statement block](/reference/dbt-jinja-functions/statement-blocks), which is more flexible, but also more complicated to use. If you are new to `run_query`, refer to the Getting Started guide section on [using Jinja](/guides/using-jinja#dynamically-retrieve-the-list-of-payment-methods) for an example of working with the results of the `run_query` macro.

:::warning
`run_query` can run during `dbt compile` and `dbt docs generate`, including when you don't expect it. Any DML inside `run_query` can execute unintentionally. Refer to [Preventing unintended DML execution](#preventing-unintended-dml-execution) for details.
:::

## Args

 * `sql`: The SQL query to execute

Returns a [Table](https://agate.readthedocs.io/page/api/table.html) object with the result of the query. If the specified query does not return results (for example, a <Term id="ddl" />, <Term id="dml" />, or maintenance query), then the return value will be `none`.

**Note:** The `run_query` macro will not begin a transaction automatically - if you wish to run your query inside of a transaction, please use `begin` and `commit` statements as appropriate.

### Examples

<File name='models/my_model.sql'>

```jinja2
{% if execute %}
{% set results = run_query('select 1 as id') %}
{% else %}
{% set results = none %}
{% endif %}

{% if results is not none %}
  {{ log(results.print_table(), info=True) }}
{% endif %}

{# do something with `results` here... #}
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


Use the `length` filter to verify whether `run_query` returned any rows or not. Make sure to wrap the logic in an [if execute](/reference/dbt-jinja-functions/execute) block to avoid unexpected behavior during parsing.

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

## Preventing unintended DML execution {#preventing-unintended-dml-execution}

`run_query()` executes SQL against your warehouse whenever dbt compiles with a live connection — not just during `dbt run` or `dbt build`. This means DML statements inside `run_query()` can run unintentionally during `dbt docs generate` or `dbt compile`.

[`dbt docs generate`](/reference/commands/cmd-docs) compiles your project by default (unless you pass [`--no-compile`](/reference/commands/cmd-docs)). That means `run_query()` inside models or macros can run during documentation generation, even when the resource is not part of a `dbt run` selection or another build step you expected.

### Why `{% if execute %}` isn't enough

The [`execute`](/reference/dbt-jinja-functions/execute) variable is `True` during compilation, so guards like `{% if execute %}` or `{% if execute and is_incremental() %}` won't prevent `run_query()` from firing during [`dbt docs generate`](/reference/commands/cmd-docs) or [`dbt compile`](/reference/commands/compile). Because `execute` is still `True` in those contexts, **DML** statements (`DELETE`, `INSERT`, `UPDATE`, and similar) can run unintentionally from jobs that only run `dbt docs generate` or other commands that compile with a connection.

### Use `flags.WHICH` to restrict execution

Combine [`execute`](/reference/dbt-jinja-functions/execute) with [`flags.WHICH`](/reference/dbt-jinja-functions/flags#flagswhich) to limit DML to the commands where you actually intend it to run. For example, allow DML only during `run` or `build`, and exclude `docs`, `compile`, and any other commands where you don't want that behavior. Refer to the `flags.WHICH` table for the full list of command values.
```sql
{% if execute and flags.WHICH in ['run', 'build'] %}
  {% do run_query('delete from my_scratch_table where session_id = ...') %}
{% endif %}
```

Adjust the allowlist to match the commands where your macro is intended to run.
