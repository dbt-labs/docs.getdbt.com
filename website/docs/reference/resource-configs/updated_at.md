---
resource_types: [snapshots]
datatype: column_name_or_expression
---
<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  strategy="timestamp",
  updated_at="column_name"
) }}

```

</File>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](resource-path):
    strategy: timestamp
    unique_key: column_name

```

</File>
