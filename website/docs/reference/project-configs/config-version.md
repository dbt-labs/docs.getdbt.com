---
datatype: integer
---

<File name='dbt_project.yml'>

```yml
config-version: 2
```

</File>

## Definition
Specify your `dbt_project.yml` as using the v2 structure.

<Changelog>

* `v0.17.0`: This configuration was introduced — see the [migration guide for 0.17.0](upgrading-to-0-17-0) for more details.

</Changelog>

## Default
Without this configuration, dbt will assume your `dbt_project.yml` uses the version 1 syntax, which will be deprecated in a future release.
