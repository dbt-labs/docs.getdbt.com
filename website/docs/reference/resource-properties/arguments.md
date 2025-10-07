---
title: arguments
sidebar_label: "arguments"
id: arguments
---

import MacroArgsNote from '/snippets/_validate-macro-args.md';

<Tabs
  defaultValue="macros"
  values={[
    { label: 'Macros', value: 'macros', },
    { label: 'Functions', value: 'functions', },
  ]
}>
<TabItem value="macros">

<File name='macros/<filename>.yml'>

```yml

version: 2

macros:
  - name: <macro name>
    arguments:
      - name: <arg name>
        [type](#supported-types): <string>
        description: <markdown_string>

```

</File>

</TabItem>

<TabItem value="functions">

<File name='functions/<filename>.yml'>

```yml

version: 2

functions:
  - name: <function name>
    arguments:
      - name: <arg name>
        data_type: <string> # warehouse-specific
        description: <markdown_string>

```

</File>

</TabItem>
</Tabs>

## Definition

The `arguments` property is used to define the parameters that a macro or function can accept. Each argument can have a `name`, `type` (for macros) or `data_type` (for functions), and `description`.  

For **macros**, you can add `arguments` to a [macro property](/reference/macro-properties), which helps in documenting the macro and understanding what inputs it requires.

For **functions**, you can add `arguments` to a [function property](/reference/function-properties), which defines the parameters for user-defined functions (UDFs) in your warehouse. The `data_type` for function arguments is warehouse-specific (for example, `STRING`, `VARCHAR`, `INTEGER`) and should match the data types supported by your data platform.

## type

<VersionBlock lastVersion="1.9">

The data type of your argument. This is only used for documentation purposes — there are no restrictions on the values you can use here.

</VersionBlock>
<VersionBlock firstVersion="1.10">

The data type of your argument. Setting [`validate_macro_args`](/reference/global-configs/behavior-changes#macro-argument-validation) to `true` ensures that documented macro argument names match those in the macro definition and validates their types against the [supported types](#supported-types). When set to `false`, `type` is only used for documentation purposes and there are no restrictions on the values you can specify.

</VersionBlock>

<MacroArgsNote />

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

### Supported types

From <Constant name="core" /> v1.10, when you use the [`validate_macro_args`](/reference/global-configs/behavior-changes#macro-argument-validation) flag, dbt supports the following types for macro arguments:

- `string` or `str`
- `boolean` or `bool`
- `integer` or `int`
- `float`
- `any`
- `list[<Type>]`, for example, `list[string]`
- `dict[<Type>, <Type>]`, for example, `dict[str, list[int]]`
- `optional[<Type>]`, for example, `optional[integer]`
- [`relation`](/reference/dbt-classes#relation)
- [`column`](/reference/dbt-classes#column)

Note that the types follow a Python-like style but are used for documentation and validation only. They are not Python types.

## Examples


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
        type: column
        description: "The name of a column"
      - name: scale
        type: integer
        description: "The number of decimal places to round to. Default is 2."

```

</File>

## data_type (for functions)

The `data_type` property for function arguments specifies the data type that the warehouse expects for that parameter. This is a required field for function arguments and must match the data types supported by your specific data platform.

:::important Warehouse-specific data types
The `data_type` values are warehouse-specific. Use the data type syntax that your warehouse requires:
- **Snowflake**: `STRING`, `NUMBER`, `BOOLEAN`, `TIMESTAMP_NTZ`, etc.
- **BigQuery**: `STRING`, `INT64`, `BOOL`, `TIMESTAMP`, `ARRAY<STRING>`, etc.
- **Redshift**: `VARCHAR`, `INTEGER`, `BOOLEAN`, `TIMESTAMP`, etc.
- **Postgres**: `TEXT`, `INTEGER`, `BOOLEAN`, `TIMESTAMP`, etc.

Refer to your warehouse documentation for the complete list of supported data types.
:::

<File name='functions/schema.yml'>

```yml
version: 2

functions:
  - name: calculate_discount
    arguments:
      - name: original_price
        data_type: DECIMAL(10,2)
        description: "The original price before discount"
      - name: discount_percent
        data_type: INTEGER
        description: "The discount percentage to apply"
    returns:
      data_type: DECIMAL(10,2)
```

</File>
