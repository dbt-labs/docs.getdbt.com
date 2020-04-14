---
datatype: sql-statement | [sql-statement]
---
<Alert type='warning'>
<h4>Heads up!</h4>
This is a work in progress document.

</Alert>

## Definition
A SQL statement (or list of SQL statements) to be run at the end of the following commands:
- `dbt run`
- `dbt seed`

`on-run-end` hooks can also call macros that return SQL statements.


## Examples
### Grant privileges at the end of a run

<File name='dbt_project.yml'>

```yml

on-run-end: "grant select on all tables in schema {{ target.schema }} group transformer"

```

</File>

### Grant multiple privileges at the end of a run

<File name='dbt_project.yml'>

```yml

on-run-end:
  - "grant usage on schema {{ target.schema }} to group reporter"
  - "grant select on all tables in schema {{ target.schema }} group reporter"

```

</File>

### Grant privileges on all schemas that dbt uses at the end of a run
This leverages the [schemas](schemas) variable.

<File name='dbt_project.yml'>

```yml

on-run-end:
  - "{% for schema in schemas %}grant usage on schema {{ schema }} to group reporter; {% endfor %}"

```

</File>

### Call a macro to grant privileges

<File name='dbt_project.yml'>

```yml

on-run-end: "{{ grant_select(schemas) }}"

```

</File>

<!--
## Available context

-->
