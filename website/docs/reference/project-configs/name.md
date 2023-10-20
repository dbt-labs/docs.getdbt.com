---
datatype: string
description: "Read this guide to understand the name configuration in dbt."
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
Often an organization has one dbt project, so it is sensible to name a project with your organization's name, in `snake_case`. For example:
* `name: acme`
* `name: jaffle_shop`
* `name: evilcorp`


## Troubleshooting
### Invalid project name

```
Encountered an error while reading the project:
  ERROR: Runtime Error
  at path ['name']: 'jaffle-shop' does not match '^[^\\d\\W]\\w*$'
Runtime Error
  Could not run dbt
```

This project has:

<File name='dbt_project.yml'>

```yml
name: jaffle-shop
```

</File>

In this case, change your project name to be `snake_case` instead:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop
```

</File>
