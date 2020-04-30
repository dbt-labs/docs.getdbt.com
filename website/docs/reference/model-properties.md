---
title: Model properties
---

Models may be described in the `source-paths` directories configured in your `dbt_project.yml` file.

```yml
version: 2

models:
  - name: <model name>
    description: <markdown_string>
    docs:
      show: true | false
    meta: {<dictionary>}
    tests: [<test>]
    columns:
      - name: <column_name> # required
        description: <markdown_string>
        quote: true | false
        tests: [<test>]
        tags: [<string>]

```
