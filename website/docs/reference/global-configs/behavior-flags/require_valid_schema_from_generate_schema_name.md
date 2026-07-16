---
title: "Valid schema from generate_schema_name"
id: "require_valid_schema_from_generate_schema_name"
sidebar_label: "require valid schema from generate schema name"
---

| require_valid_schema_from_generate_schema_name | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2026.1 | 1.12.0a1 |
| Matured (default → `true`) | — | — |
| Removed | — | — |

The `generate_schema_name` macro determines the schema where dbt creates models and other resources. Returning a `null` value from this macro can result in invalid schema names and lead to unpredictable behavior during dbt runs.

The `require_valid_schema_from_generate_schema_name` behavior flag is set to `false` by default. When `false`, dbt raises the [`GenerateSchemaNameNullValueDeprecation`](/reference/deprecations#generateschemanamenullvaluedeprecation) warning when a custom `generate_schema_name` macro returns a `null` value.

When `require_valid_schema_from_generate_schema_name` is set to `true`, dbt enforces stricter validation and raises a parsing error.

For example, if your project has a custom `generate_schema_name` macro that returns `null`:

<File name='macros/get_custom_schema.sql'>

```sql
{% macro generate_schema_name(custom_schema_name, node) -%}
    {%- if custom_schema_name is none -%}
        {{ return(none) }}
    {%- else -%}
        {{ custom_schema_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

</File>

With the default behavior, dbt raises a deprecation warning. When `require_valid_schema_from_generate_schema_name` is set to `true`, dbt raises an error.

To resolve this, update your macro to return a valid schema name (`target.schema` in this example):

<File name='macros/get_custom_schema.sql'>

```sql
{% macro generate_schema_name(custom_schema_name, node) -%}
    {%- if custom_schema_name is none -%}
        {{ return(target.schema) }}
    {%- else -%}
        {{ custom_schema_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

</File>
