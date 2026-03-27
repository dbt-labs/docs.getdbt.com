---
title: Macro properties
id: macro-properties
---

import PropsCallout from '/snippets/_config-prop-callout.md';

You can declare macro properties and configs in `.yml` files in your project. <PropsCallout title={frontMatter.title}/> 

Macros support a `config` block. You can define `meta` and `docs` within `config`. 

You can name these files `whatever_you_want.yml` and nest them arbitrarily deep in sub-folders.

<File name='macros/<filename>.yml'>

```yml

macros:
  - name: <macro name>
    [description](/reference/resource-properties/description): <markdown_string>
    config:
      [docs](/reference/resource-configs/docs):
        show: true | false
      [meta](/reference/resource-configs/meta): {<dictionary>}
    [arguments](/reference/resource-properties/arguments):
      - name: <arg name>
        [type](/reference/resource-properties/arguments#type): <string>
        [description](/reference/resource-properties/description): <markdown_string>
      - ... # declare properties of additional arguments

  - name: ... # declare properties of additional macros

```

</File>

## Example

<File name='macros/schema.yml'>

```yaml
macros:
  - name: cents_to_dollars
    description: Converts a numeric column from cents to dollars.
    config:
      docs:
        show: true
      meta:
        owner: analytics
    arguments:
      - name: column_name
        type: column
        description: The column to convert
      - name: precision
        type: integer
        description: Number of decimal places. Defaults to 2.
```

</File>