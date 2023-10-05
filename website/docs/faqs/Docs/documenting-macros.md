---
title: How do I document macros?
description: "You can use a schema file to document macros"
sidebar_label: 'Document macros'
id: documenting-macros
---

To document macros, you can use a [schema file](/reference/macro-properties) and nest the configurations under a `macros:` key

## Example

<File name='macros/schema.yml'>

```yml
version: 2

macros:
  - name: cents_to_dollars
    description: A macro to convert cents to dollars
    arguments:
      - name: column_name
        type: string
        description: The name of the column you want to convert
      - name: precision
        type: integer
        description: Number of decimal places. Defaults to 2.
```

</File>
