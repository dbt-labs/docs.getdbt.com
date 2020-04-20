---
resource_types: [snapshots]
datatype: string
---

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](resource-path):
    target_schema: string

```

</File>

<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  target_schema="string"
) }}

```

</File>

## Description
The schema that dbt should build a [snapshot](snapshots) table into.

On BigQuery, this is analogous to a `dataset`.

## Default
This is a **required** parameter, no default is provided.

## to-do
Some notes about dev vs. prod
