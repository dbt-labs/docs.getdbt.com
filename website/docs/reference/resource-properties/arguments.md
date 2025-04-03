---
title: arguments
sidebar_label: "arguments"
id: arguments
---

import MacroArgsNote from '/snippets/_validate-macro-args.md';

<File name='macros/<filename>.yml'>

```yml

version: 2

macros:
  - name: <macro name>
    arguments:
      - name: <arg name>
        type: <string>
        description: <markdown_string>

```

</File>

## Definition

The `arguments` property is used to define the parameters that a macro can accept. Each argument can have a `name`, `type`, and `description`. This helps in documenting the macro and understanding what inputs it requires.

You can define `arguments` in a [`properties.yml`](/reference/resource-properties/arguments#macro-properties) file. You can name this file anything and it can placed in the [`macro-paths`](/reference/project-configs/macro-paths) directory (defaults to `["macros"]`). 

You can validate your macro `arguments` using the [`validate_macro_args`](/reference/global-configs/behavior-changes#macro-argument-validation) flag. 

- If the flag is set to `False` (default), dbt will continue to permit any value for `type` and `name`.
- If flag is set to `True` (opt-in), dbt will raise a warning if the argument names you've added in YAML don't match the argument names you have in your macro or if the argument types aren't valid according to the [supported types](/reference/global-configs/behavior-changes#supported-types).

If no argument names are documented in YAML, dbt will infer them based on what you have in the macro and include them in the [manifest.json](/reference/artifacts/manifest-json) file.

## Macro properties

Macro properties can be declared in any `properties.yml` file. Macro properties are "special properties" in that you can't configure them in the dbt_project.yml file or using `config()` blocks. Refer to [Configs and properties](/reference/define-properties#which-properties-are-not-also-configs) for more information.

You can name these files `whatever_you_want.yml` and nest them arbitrarily deep in sub-folders.

<File name='macros/<filename>.yml'>

```yml
version: 2

macros:
  - name: <macro name>
    [description](/reference/resource-properties/description): <markdown_string>
    [docs](/reference/resource-configs/docs):
      show: true | false
    [meta](/reference/resource-configs/meta): {<dictionary>}
    arguments:
      - name: <arg name>
        [type](/reference/resource-properties/arguments): <string>
        [description](/reference/resource-properties/description): <markdown_string>
      - ... # declare properties of additional arguments

  - name: ... # declare properties of additional macros

```

</File>

## type

<VersionBlock lastVersion="1.9">

The data type of your argument. This is only used for documentation purposes — there are no restrictions on the values you can use here.

</VersionBlock>
<VersionBlock firstVersion="1.10">

The data type of your argument. Unless you use the [`validate_macro_args`](/reference/global-configs/behavior-changes#macro-argument-validation) flag, `type` is only used for documentation purposes — there are no restrictions on the values you can use here.

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

## Supported types for macro argument validation

From dbt Core v1.10, when you use the [`validate_macro_args`](/reference/global-configs/behavior-changes#macro-argument-validation) flag, dbt supports the following types for macro arguments:

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
        type: column
        description: "The name of a column"
      - name: scale
        type: integer
        description: "The number of decimal places to round to. Default is 2."

```

</File>
