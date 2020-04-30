---
title: Analysis properties
---

Analyses may be described in the `source-paths` or `analysis-paths` directories configured in your `dbt_project.yml` file.

```yml
version: 2

analyses:
  - name: <analysis_name> # required
    description: <string>
    columns:
      - name: <column_name>
        description: <string>

```
