---
title: Seed properties
---

Seeds may be described in the `source-paths` or `data-paths` directories configured in your `dbt_project.yml` file.

```yml
version: 2

seeds:
  - name: <string>
    [description](description): <markdown_string>
    [docs](docs):
      show: true | false
    [tests](tests):
      - <test>
    columns:
      - name: <column name>
        [description](description): <markdown_string>
        [meta](meta): {<dictionary>}
        [quote](quote): true | false
        [tags](tags): [<string>]
        [tests](tests): [<test>]
```
