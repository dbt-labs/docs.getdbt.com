---
title: "About run_query macro"
sidebar_label: "run_query"
id: "run_query"
description: "Use the `run_query` macro to run queries and fetch results; learn when it runs against the warehouse during compilation and `dbt docs generate`, and how to scope side-effecting SQL with `flags.WHICH`."
---

The `run_query` macro provides a convenient way to run queries and fetch their results. It is a wrapper around the [statement block](/reference/dbt-jinja-functions/statement-blocks), which is more flexible, but also more complicated to use. If you are new to `run_query`, refer to the [using Jinja guide](/guides/using-jinja?step=8) for an example of working with the results of the `run_query` macro (step 8).

:::warning
[`run_query`](/reference/dbt-jinja-functions/run_query) runs SQL against the warehouse whenever dbt *compiles* your project with a live connection, including during [`dbt compile`](/reference/commands/compile) and [`dbt docs generate`](/reference/commands/cmd-docs) (by default). This is expected because compilation resolves your Jinja and macros. If you put <Term id="dml" /> or other side-effecting statements inside `run_query`, they run in those workflows too unless you scope them, for example using [`flags.WHICH`](/reference/dbt-jinja-functions/flags#flagswhich). Refer to [How `run_query` runs during compilation and `dbt docs generate`](#run-query-compilation-and-docs).
:::

## Args

 * `sql`: The SQL query to execute

Returns a [Table](https://agate.readthedocs.io/page/api/table.html) object with the result of the query. If the specified query does not return results (for example, a <Term id="ddl" />, <Term id="dml" />, or maintenance query), then the return value will be `none`.

<VersionBlock firstVersion="2.0">

## Fusion type checking

The <Constant name="fusion_engine" /> processes result sets with more strict null checking. This can cause failures when using `run_query` for <Term id="ddl" /> or maintenance operations (like `OPTIMIZE`, `VACUUM`). When a given result set returns null values in columns declared as non-nullable, fusion will fail - whereas dbt Core would silently ignore it.

For "fire and forget" operations where you don't need the result set, use a [statement block](/reference/dbt-jinja-functions/statement-blocks) with `fetch_result=False` instead, as highlighted in this Databricks example:

```jinja
{% macro run_optimize(table, zorder_fields) %}
  {% set zorder_str = zorder_fields | join(', ') %}

  {% set query %}
    OPTIMIZE {{ table }}
    {% if zorder_str | length > 0 %}
      ZORDER BY ({{ zorder_str }})
    {% endif %}
  {% endset %}

  {% call statement('optimize', fetch_result=False) %}
    {{ query }}
  {% endcall %}
{% endmacro %}
```



</VersionBlock>

:::info Using run_query for the first time?
Check out the section of the Getting Started guide on [using Jinja](/guides/using-jinja#dynamically-retrieve-the-list-of-payment-methods) for an example of working with the results of the `run_query` macro!
:::
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


Use the `length` filter to verify whether `run_query` returned any rows or not. Wrap the logic in an [if execute](/reference/dbt-jinja-functions/execute) block so `run_query` does not run during parsing, when [`execute`](/reference/dbt-jinja-functions/execute) is `False`.

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

## How `run_query` runs during compilation and `dbt docs generate` {#run-query-compilation-and-docs}

When dbt *compiles* models and other resources with a live warehouse connection, it evaluates your Jinja and runs any `run_query()` calls that your project reaches. That is normal: introspective macros need the warehouse the same way other compilation steps do. Compilation happens during `dbt run` and `dbt build`, and also during `dbt compile`, `dbt docs generate` (when compilation runs), and other commands that compile the project—not only during steps where you might picture dbt "building" tables.

[`dbt docs generate`](/reference/commands/cmd-docs) **compiles your project by default** (unless you pass [`--no-compile`](/reference/commands/cmd-docs)). So `run_query()` runs during documentation generation under the same rules as other compile workflows, including for resources that are not part of a particular `dbt run` selection.

### `execute` is `True` during compilation

The [`execute`](/reference/dbt-jinja-functions/execute) context variable is `True` whenever dbt compiles with a connection, not only while materializing models during `dbt run`. A guard like `{% if execute %}` still allows `run_query()` to run during [`dbt docs generate`](/reference/commands/cmd-docs) and [`dbt compile`](/reference/commands/compile), because those commands compile your project. Patterns such as `{% if execute and is_incremental() %}` change when incremental model SQL runs, but they do not turn off compilation itself—so they do not, on their own, skip `run_query()` during docs or compile unless your Jinja never calls it in those paths.

If you want <Term id="dml" /> or other side-effecting SQL to run only for certain dbt commands, add another condition, for example [`flags.WHICH`](/reference/dbt-jinja-functions/flags#flagswhich).

### Scope side-effecting SQL with `flags.WHICH`

Combine [`execute`](/reference/dbt-jinja-functions/execute) with [`flags.WHICH`](/reference/dbt-jinja-functions/flags#flagswhich) so <Term id="dml" /> runs only when the active command is one you want (`run`, `build`, and so on), and not when dbt is compiling for `docs`, `compile`, or other commands where side effects would be surprising. Refer to the `flags.WHICH` table for the full list of command values.

```sql
{% if execute and flags.WHICH in ['run', 'build'] %}
  {% do run_query('delete from my_scratch_table where session_id = ...') %}
{% endif %}
```

Adjust the list of commands to match where your macro should run.
