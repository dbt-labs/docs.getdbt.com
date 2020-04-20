---
resource_types: [snapshots]
datatype: string
---

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](resource-path):
    target_database: string

```

</File>

<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  target_database="string"
) }}

```

</File>

## Description
The database that dbt should build a [snapshot](snapshots) table into.

On BigQuery, this is analogous to a `project`.

## Default
By default, dbt will use the [target](target) database associated with your profile/connection.

## To-do:
- Will dbt create this database for you? I think not

## Examples
- Can you configure this to be env-aware?
