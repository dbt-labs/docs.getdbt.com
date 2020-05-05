---
title: Model properties
---

Models may be described in the `source-paths` directories configured in your `dbt_project.yml` file.

```yml
version: 2

models:
  - [name](model_name): <model name>
    [description](description): <markdown_string>
    [docs](docs):
      show: true | false
    [meta](meta): {<dictionary>}
    [tests](tests): [<test>]
    columns:
      - name: <column_name> # required
        [description](description): <markdown_string>
        [meta](meta): {<dictionary>}
        [quote](quote): true | false
        [tests](tests):
          - <test>
        [tags](tags): [<string>]

```
