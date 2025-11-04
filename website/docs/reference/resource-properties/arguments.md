---
title: arguments (for macros)
sidebar_label: "arguments"
id: arguments
---

import MacroArgsNote from '/snippets/_validate-macro-args.md';
import ArgumentsShared from '/snippets/_arguments-shared.md';

<File name='macros/<filename>.yml'>

```yml


macros:
  - name: <macro name>
    arguments:
      - name: <arg name>
        [type](#supported-types): <string>
        description: <markdown_string>

```

</File>

## Definition

<ArgumentsShared />

For **macros**, you can add `arguments` to a [macro property](/reference/macro-properties), which helps in documenting the macro and understanding what inputs it requires.

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

## Related documentation

- [Macro properties](/reference/macro-properties)
- [Arguments (for functions)](/reference/resource-properties/function-arguments)
