---
title: Analysis properties
---

We recommend you define analysis properties in your `analyses/` directory, which is illustrated in the [`analysis-paths`](analysis-paths) configuration.

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `analyses/` or `models/` directory.

<File name='analyses/<filename>.yml'>

```yml
version: 2

analyses:
  - name: <analysis_name> # required
    [description](description): <markdown_string>
    [docs](/reference/resource-configs/docs):
      show: true | false
    config:
      [tags](resource-configs/tags): <string> | [<string>]
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
