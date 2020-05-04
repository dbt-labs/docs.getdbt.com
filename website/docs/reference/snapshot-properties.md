---
title: Snapshot properties
---

Snapshots may be described in the `source-paths` or `snapshot-paths` directories configured in your `dbt_project.yml` file.

```yml
version: 2

snapshots:
  - name: <snapshot name>
    [description](description): <markdown_string>
    [docs](docs):
      show: true | false
    tests:
      - <test>
      - ...
    columns:
      - name: <column name>
        [description](description): <markdown_string>
        quote: <true|false>
        tags: <tags>
        tests:
          - <test>
          - ...
```
