---
title: Snapshot properties
---

Snapshots may be described in the `source-paths` or `snapshot-paths` directories configured in your `dbt_project.yml` file.

```yml
version: 2

snapshots:
  - name: <snapshot name>
    [description](description): <markdown_string>
    [meta](meta): {<dictionary>}
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
        [tests](tests):
          - <test>

```
