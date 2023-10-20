---
datatype: integer
description: "Read this guide to understand the config-version configuration in dbt."
---

<VersionBlock firstVersion="1.5">

Starting in dbt v1.5, the `config-version:` tag is optional.

</VersionBlock>

<File name='dbt_project.yml'>

```yml
config-version: 2
```

</File>

## Definition
Specify your `dbt_project.yml` as using the v2 structure.

<VersionBlock firstVersion="1.5"> This configuration is optional. </VersionBlock>

## Default
Without this configuration, dbt will assume your `dbt_project.yml` uses the version 1 syntax, which was deprecated in dbt v0.19.0.
