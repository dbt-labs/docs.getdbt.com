```sql
{%- call statement('states', fetch_result=True) -%}

    select distinct state from {{ ref('users') }}

{%- endcall -%}

{%- set states = load_result('states') -%}

```

## Description
The `load_result` function returns a [SQL Result](dbt-classes#sql-results).

## Args
- `name` (required): The name of a statement, as defined in a [statement block])(statement-block)

Note: since there is only one argument for this macro, often the argument name is omitted.
