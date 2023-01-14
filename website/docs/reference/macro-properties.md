---
title: Macro properties
---

Macro properties can be declared in `.yml` files.

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders.

<File name='macros/<filename>.yml'>

```yml
version: 2

macros:
  - name: <macro name>
    [description](description): <markdown_string>
    [docs](/reference/resource-configs/docs):
      show: true | false
    arguments:
      - name: <arg name>
        [type](argument-type): <string>
        [description](description): <markdown_string>
      - ... # declare properties of additional arguments

  - name: ... # declare properties of additional macros

```

</File>

<Changelog>

* `v0.16.0`: The ability to declare macro properties was introduced.

</Changelog>
