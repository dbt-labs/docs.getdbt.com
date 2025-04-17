---
title: How do I document macros?
description: "You can use a schema file to document macros"
sidebar_label: 'Document macros'
id: documenting-macros
---

import MacroArgsNote from '/snippets/_validate-macro-args.md';

To document macros, use a [schema file](/reference/macro-properties) and nest the configurations under a `macros:` key

## Example

<File name='macros/schema.yml'>

```yml
version: 2

macros:
  - name: cents_to_dollars
    description: A macro to convert cents to dollars
    arguments:
      - name: column_name
        type: column
        description: The name of the column you want to convert
      - name: precision
        type: integer
        description: Number of decimal places. Defaults to 2.
```

</File>

<MacroArgsNote />

## Document a custom materialization

When you create a [custom materialization](/guides/create-new-materializations), dbt creates an associated macro with the following format:

```
materialization_{materialization_name}_{adapter}
```

To document a custom materialization, use the previously mentioned format to determine the associated macro name(s) to document.

<File name='macros/properties.yml'>

```yaml
version: 2

macros:
  - name: materialization_my_materialization_name_default
    description: A custom materialization to insert records into an append-only table and track when they were added.
  - name: materialization_my_materialization_name_xyz
    description: A custom materialization to insert records into an append-only table and track when they were added.
```

</File>
