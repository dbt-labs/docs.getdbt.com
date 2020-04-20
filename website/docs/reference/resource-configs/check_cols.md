---
resource_types: [snapshots]
datatype: "[column_name] | all"
---
<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  strategy="check",
  updated_at=["column_name"]
) }}

```

</File>

<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  strategy="check",
  updated_at="all"
) }}

```

</File>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](resource-path):
    strategy: check
    unique_key: [column_name] | all

```

</File>
