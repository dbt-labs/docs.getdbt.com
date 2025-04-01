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

The `arguments` property is used to define the parameters that a macro can accept. Each argument can have a name, type, and description. This helps in documenting the macro and understanding what inputs it requires.

`arguments` can be defined in a [`properties.yml`](/reference/resource-properties/arguments#macro-properties) file but they are not enforced by dbt. The file can be named anything and placed in the [`macro-paths`](/reference/project-configs/macro-paths) directory (defaults to `["macros"]`).

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


