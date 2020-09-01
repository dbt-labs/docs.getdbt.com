---
title: Analysis properties
---

Analysis properties can be declared in `.yml` files in:
- your `analyses/` directory (as defined by the [`analysis-paths` config](analysis-paths))
- your `models/` directory (as defined by the [`source-paths` config](source-paths))

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `analyses/` or `models/` directory.

<File name='analyses/<filename>.yml'>

```yml
version: 2

analyses:
  - name: <analysis_name> # required
    [description](description): <markdown_string>
    [docs](resource-properties/docs):
      show: true | false
    columns:
      - name: <column_name>
        [description](description): <markdown_string>
      - name: ... # declare properties of additional columns

  - name: ... # declare properties of additional analyses

```

</File>


<Changelog>

* `v0.16.0`: The ability to declare analysis properties was introduced.

</Changelog>
