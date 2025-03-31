---
title: type
resource_types: macro_argument
datatype: argument_type
---


<File name='macros/<filename>.yml'>

```yml
version: 2

macros:
  - name: <macro name>
    arguments:
      - name: <arg name>
        type: <string>

```

</File>

## Definition
The data type of your argument. Note that this is only used for documentation purposes — there are no restrictions on the values you can use here.

:::tip
From dbt Core v1.10, you can opt into validating the arguments you define in macro documentation using the `validate_macro_args` behavior change flag. When enabled, dbt will:
- Warn if documented argument names don’t match the macro definition.
- Warn if `type` fields don’t follow supported formats (like `string`, `integer`, `optional[list[str]]`, and so on).

Learn more about [macro argument validation](/reference/global-configs/behavior-changes#macro-argument-validation).
:::

## Examples
### Document a macro

<File name='macros/cents_to_dollars.sql'>

```sql
{% macro cents_to_dollars(column_name, scale=2) %}
    ({{ column_name }} / 100)::numeric(16, {{ scale }})
{% endmacro %}

```

</File>

<File name='macros/cents_to_dollars.yml'>

```yml
version: 2

macros:
  - name: cents_to_dollars
    arguments:
      - name: column_name
        type: column name or expression
        description: "The name of a column, or an expression — anything that can be `select`-ed as a column"

      - name: scale
        type: integer
        description: "The number of decimal places to round to. Default is 2."

```

</File>
