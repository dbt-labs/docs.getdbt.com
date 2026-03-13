---
title: Macro properties
id: macro-properties
---

import PropsCallout from '/snippets/_config-prop-callout.md';

You can declare macro properties in any `properties.yml` file. <PropsCallout title={frontMatter.title}/> 

Macros support a `config` block. You can define `meta` and `docs` at the top level or within `config`. When both are provided, dbt merges the values, with those defined in `config` taking precedence for overlapping keys. This aligns macro properties with other resources and allows config-level overrides in patches.

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

## Examples

<File name='macros/schema.yml'>

```yaml
macros: # top-level docs and meta
  - name: format_date
    description: Formats a date column for reporting.
    docs:
      show: false
    meta:
      team: marketing
    arguments:
      - name: column_name
        type: column
        description: The date column to format
```

</File>


<File name='macros/schema.yml'>

```yaml
macros: # config-level docs and meta
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