---
title: arguments
sidebar_label: "arguments"
id: arguments
pagination_next: "reference/resource-properties/arguments"
pagination_prev: null
---

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

You can use a [behavior flag](/reference/global-configs/behavior-changes#behavior-change-flags) in v1.10. You can define `arguments` in a [`properties.yml`](/reference/resource-properties/arguments#macro-properties) file but they are not enforced by dbt. You can name this file anything and it can placed in the [`macro-paths`](/reference/project-configs/macro-paths) directory (defaults to `["macros"]`).

- If the flag is set to `False` (default), dbt will continue to permit any value for `type` and `name`.
- If flag is set to `True` (opt-in), dbt will raise a warning if the argument names you've added in YAML don't match the argument names you have in your macro.
- If no argument names are documented in YAML, dbt will infer them based on what you have in the macro and include them in the [manifest.json](/reference/artifacts/manifest-json) file. There will be no changes to the manifest and no change to the schema. 

## Macro properties

Macro properties can be declared in any `properties.yml` file. Macro properties are "special properties" in that you can't configure them in the dbt_project.yml file or using config() blocks. Refer to [Configs and properties](/reference/define-properties#which-properties-are-not-also-configs) for more information.

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

The data type of your argument. Note that this is only used for documentation purposes — there are no restrictions on the values you can use here.

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
