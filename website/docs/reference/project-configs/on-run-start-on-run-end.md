---
title: on-run-start & on-run-end
description: "Read this guide to understand the on-run-start and on-run-end configurations in dbt."
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
* The `on-run-end` hook has additional jinja variables available in the context — check out the [docs](/reference/dbt-jinja-functions/on-run-end-context).

## Examples

<Snippet path="hooks-to-grants" />

### Grant privileges on all schemas that dbt uses at the end of a run
This leverages the [schemas](/reference/dbt-jinja-functions/schemas) variable that is only available in an `on-run-end` hook.

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
We've compiled some more in-depth examples [here](/docs/build/hooks-operations#additional-examples).
