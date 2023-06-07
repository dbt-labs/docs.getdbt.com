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

<Changelog>

* `v0.17.0`: This configuration was introduced — see the [migration guide](/guides/migration/versions) for more details.
* `v1.5.0`: This configuration was made optional.

</Changelog>

## Default
Without this configuration, dbt will assume your `dbt_project.yml` uses the version 1 syntax, which was deprecated in dbt v0.19.0.
