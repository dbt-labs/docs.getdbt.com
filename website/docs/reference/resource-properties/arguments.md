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

The `arguments` property is used to define the parameters that a macro can accept. Each argument can have a `name`, `type`, and `description`. This helps in documenting the macro and understanding what inputs it requires.

You can use a [behavior flag](/reference/global-configs/behavior-changes#behavior-change-flags) in v1.10; dbt will validate whether the `name` or `type` matches the marcro arguments in YAML.

`arguments` can be defined in a [`properties.yml`](/reference/resource-properties/arguments) file but they are not enforced by dbt. The file can be named anything and placed in the [`macro-paths`](/reference/project-configs/macro-paths) directory (defaults to `["macros"]`).

## Macro properties

import PropsCallout from '/snippets/_config-prop-callout.md';

Macro properties can be declared in any `properties.yml` file. <PropsCallout title={frontMatter.title}/> 

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
        [type](/reference/resource-properties/argument-type): <string>
        [description](/reference/resource-properties/description): <markdown_string>
      - ... # declare properties of additional arguments

  - name: ... # declare properties of additional macros

```

</File>

## type

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
