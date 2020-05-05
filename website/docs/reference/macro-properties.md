---
title: Macro properties
---

Macro properties can be declared in `.yml` files in:
- your `macros/` directory (as defined by the [`macro-paths` config](macro-paths))
- your `models/` directory (as defined by the [`source-paths` config](source-paths))

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `macros/` or `models/` directory.

<File name='macros/<filename>.yml'>

```yml
version: 2

macros:
  - name: <macro name>
    [description](description): <markdown_string>
    [docs](resource-properties/docs):
      show: true | false
    arguments:
      - name: <arg name>
        type: <arg type>
        [description](description): <markdown_string>
      - ... # declare properties of additional arguments

  - name: ... # declare properties of additional macros

```

</File>

<Changelog>

* `v0.16.0`: The ability to declare macro properties was introduced.

</Changelog>
