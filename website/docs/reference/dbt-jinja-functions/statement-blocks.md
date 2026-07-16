---
title: "About statement blocks"
sidebar_label: "statement blocks"
id: "statement-blocks"
description: "SQL queries that hit database and return results to your Jinja context."
---

<VersionBlock lastVersion="1.99">

:::tip Recommendation

We recommend using the [`run_query` macro](/reference/dbt-jinja-functions/run_query) instead of `statement` blocks. The `run_query` macro provides a more convenient way to run queries and fetch their results by wrapping `statement` blocks. You can use this macro to write more concise code that is easier to maintain.

:::

</VersionBlock>

<VersionBlock firstVersion="2.0">

:::tip When to use statement blocks in Fusion

For queries where you need to fetch results (for example, when your macro or Jinja code needs to use data returned from the database), you can use either `statement` blocks with `fetch_result=True` or the [`run_query` macro](/reference/dbt-jinja-functions/run_query).

For <Term id="ddl" /> or utility operations (like `OPTIMIZE`, `VACUUM`, or maintenance queries), use `statement` blocks with `fetch_result=False` when you don't need to access the results in Jinja. This avoids issues with <Constant name="fusion" />'s strict type checking, which can fail when processing result sets that contain `NULL` values in columns declared as non-nullable.

:::

</VersionBlock>

`statement`s are SQL queries that hit the database and return results to your Jinja context. Here’s an example of a `statement` which gets all of the states from a users <Term id="table" />.

<File name='get_states_statement.sql'>

```sql
-- depends_on: {{ ref('users') }}

{%- call statement('states', fetch_result=True) -%}

    select distinct state from {{ ref('users') }}

{%- endcall -%}
```

</File>

The signature of the `statement` block looks like this:

```
statement(name=None, fetch_result=False, auto_begin=True)
```

When executing a `statement`, dbt needs to understand how to resolve references to other dbt models or resources. If you are already `ref`ing the model outside of the statement block, the dependency will be automatically inferred, but otherwise you will need to [force the dependency](/reference/dbt-jinja-functions/ref#forcing-dependencies) with `-- depends_on`.

<Expandable alt_header="Example using -- depends_on">

```sql
-- depends_on: {{ ref('users') }}

{% call statement('states', fetch_result=True) -%}

    select distinct state from {{ ref('users') }}

    /*
    The unique states are: {{ load_result('states')['data'] }}
    */
{%- endcall %}
```
</Expandable>

<Expandable alt_header="Example using ref() function">

```sql

{% call statement('states', fetch_result=True) -%}

    select distinct state from {{ ref('users') }}

    /*
    The unique states are: {{ load_result('states')['data'] }}
    */

{%- endcall %}

select id * 2 from {{ ref('users') }}
```
</Expandable>

__Args__:
 - `name` (string): The name for the result set returned by this statement
 - `fetch_result` (bool): If True, load the results of the statement into the Jinja context
 - `auto_begin` (bool): If True, open a transaction if one does not exist. If false, do not open a transaction.

Once the statement block has executed, the result set is accessible via the `load_result` function. The result object includes three keys:
- `response`: Structured object containing metadata returned from the database, which varies by adapter. E.g. success `code`, number of `rows_affected`, total `bytes_processed`, etc. Comparable to `adapter_response` in the [Result object](/reference/dbt-classes#result-objects).
- `data`: Pythonic representation of data returned by query (arrays, tuples, dictionaries).
- `table`: [Agate](https://agate.readthedocs.io/page/api/table.html) table representation of data returned by query.

For the above statement, that could look like:

<File name='load_states.sql'>

```sql
{%- set states = load_result('states') -%}
{%- set states_data = states['data'] -%}
{%- set states_status = states['response'] -%}
```

</File>

The contents of the returned `data` field is a matrix. It contains a list rows, with each row being a list of values returned by the database. For the above example, this data structure might look like:

<File name='states.sql'>

```python
>>> log(states_data)

[
  ['PA'],
  ['NY'],
  ['CA'],
	...
]
```

</File>

<VersionBlock firstVersion="2.0">

## Fire and forget operations

For <Term id="ddl" /> or utility operations where you don't need the results (because you don't use the returned rows in Jinja), set `fetch_result=False`. This is the recommended pattern for operations like `OPTIMIZE` or `VACUUM` on Databricks, which return result sets that may contain null values in non-nullable columns.

<File name='macros/optimize_table.sql'>

```jinja
{% macro optimize_table(table, zorder_fields=[]) %}
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

</File>

You can use this macro in a post-hook:

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    +post-hook:
      - "{{ optimize_table(this, ['customer_id', 'order_date']) }}"
```

</File>

</VersionBlock>
