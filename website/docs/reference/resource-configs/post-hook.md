---
resource_types: [models, seeds]
datatype: sql-statement | [sql-statement]
---

<Alert type='warning'>
<h4>Heads up!</h4>

This is a work in progress document. While this configuration applies to multiple resource types, the documentation has only been written for seeds.

</Alert>


## Definition
A SQL statement (or list of SQL statements) to be run after a model is built / a seed is built.

Post-hooks can also call macros that return SQL statements.

## Examples
### Grant select privileges on a seed

<File name='dbt_project.yml'>

```yml

seeds:
  post-hook: "grant select on {{ this }} to group reporter"

```

</File>

### Grant multiple select privileges on a seed

<File name='dbt_project.yml'>

```yml

seeds:
  post-hook:
    - "grant select on {{ this }} to group reporter"
    - "grant select on {{ this }} to group transformer"

```

</File>

### Call a macro to grant select privileges on a seed

<File name='dbt_project.yml'>

```yml

seeds:
  post-hook: "{{ grant_select(this) }}"

```

</File>
