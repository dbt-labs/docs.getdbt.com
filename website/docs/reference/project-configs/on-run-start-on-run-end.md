---
title: on-run-start & on-run-end
datatype: sql-statement | [sql-statement]
---

<File name='dbt_project.yml'>

```yml
on-run-start: sql-statement | [sql-statement]
on-run-end: sql-statement | [sql-statement]
```

</File>


## Definition
A SQL statement (or list of SQL statements) to be run at the start, or end, of the following commands:
- `dbt run`
- `dbt test`
- `dbt seed`
- `dbt snapshot`
- `dbt build`
- `dbt compile`
- `dbt docs generate`

`on-run-start` and `on-run-end` hooks can also call macros that return SQL statements

## Usage notes
* The `on-run-end` hook has additional jinja variables available in the context — check out the [docs](on-run-end-context).

## Examples

<VersionBlock firstVersion="1.2">

In previous versions of dbt, the most common use of hooks was to execute `grant` statements, to apply database permissions to models right after creating them. Starting in v1.2, we encourage you to use the [`grants` config](resource-configs/grants) instead.

</VersionBlock>

<VersionBlock lastVersion="1.1">

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

</VersionBlock>

### Grant privileges on all schemas that dbt uses at the end of a run
This leverages the [schemas](schemas) variable that is only available in an `on-run-end` hook.

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

### Additional examples
We've compiled some more in-depth examples [here](hooks-operations#additional-examples).
