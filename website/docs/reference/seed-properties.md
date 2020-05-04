---
title: Seed properties
---

Seeds may be described in the `source-paths` or `data-paths` directories configured in your `dbt_project.yml` file.

```yml
version: 2

seeds:
  - name: <string>
    [description](description): <markdown_string>
    tests:
      - <test>
      - ...
    columns:
      - name: <column name>
        [description](description): <markdown_string>
        quote: <true|false>
        tags: <tags>
        tests: [<test>]
      - ...
```
