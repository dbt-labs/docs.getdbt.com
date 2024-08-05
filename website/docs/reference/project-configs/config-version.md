---
datatype: integer
description: "Read this guide to understand the config-version configuration in dbt."
---

The `config-version:` tag is optional.

<File name='dbt_project.yml'>

```yml
config-version: 2
```

</File>

## Definition

Specify your `dbt_project.yml` as using the v2 structure.

## Default

Without this configuration, dbt will assume your `dbt_project.yml` uses the version 2 syntax. Version 1 was deprecated in dbt v0.19.0.
