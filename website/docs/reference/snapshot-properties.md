---
title: Snapshot properties
---

Snapshots may be described in the `source-paths` or `snapshot-paths` directories configured in your `dbt_project.yml` file.

```yml
version: 2

snapshots:
  - name: <snapshot name>
    description: "<description>"
    tests:
      - <test>
      - ...
    columns:
      - name: <column name>
        description: <column description>
        quote: <true|false>
        tags: <tags>
        tests:
          - <test>
          - ...
```
