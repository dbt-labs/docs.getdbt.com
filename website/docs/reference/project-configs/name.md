---
datatype: string
required: True
---

<File name='dbt_project.yml'>

```yml
name: string
```

</File>

## Definition
**Required configuration**

The name of a dbt project. Must be letters, digits and underscores only, and cannot start with a digit.

## Recommendation
Often an organization has one dbt project, so it is sensible to name a project with your organization's name, in `kebab_case`. For example:
* `name: acme`
* `name: jaffle_shop`
* `name: evilcorp`
