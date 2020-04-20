---
resource_types: [snapshots]
datatype: column_name
---

<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  unique_key="column_name"
) }}

```

</File>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](resource-path):
    unique_key: column_name

```

</File>

## Description
The column that is unique — dbt uses this to do checks on

## Default
This is a **required parameter**. No default is provided.
