---
resource_types: [snapshots]
description: "Target_schema - Read this in-depth guide to learn about configurations in dbt."
datatype: string
---

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +target_schema: string

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
The schema that dbt should build a [snapshot](/docs/build/snapshots) <Term id="table" /> into. Snapshots build into the same `target_schema`, no matter who is running them.

On **BigQuery**, this is analogous to a `dataset`.

## Default
This is a **required** parameter, no default is provided.

## FAQs
<FAQ path="Snapshots/snapshot-target-schema" />

## Examples
### Build all snapshots in a schema named `snapshots`

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_schema: snapshots

```

</File>

### Use a target-aware schema
Use the [`{{ target }}` variable](/reference/dbt-jinja-functions/target) to change which schema a snapshot <Term id="table" /> is built in.

Note: consider whether this use-case is right for you, as downstream `refs` will select from the `dev` version of a snapshot, which can make it hard to validate models that depend on snapshots (see above [FAQ](#faqs))

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_schema: "{% if target.name == 'prod' %}snapshots{% else %}{{ target.schema }}{% endif %}"

```

</File>

### Use the same schema-naming behavior as models

Leverage the [`generate_schema_name` macro](/docs/build/custom-schemas) to build snapshots in schemas that follow the same naming behavior as your models.

Notes:
* This macro is not available when configuring from the `dbt_project.yml` file, so must be configured in a snapshot config block.
* Consider whether this use-case is right for you, as downstream `refs` will select from the `dev` version of a snapshot, which can make it hard to validate models that depend on snapshots (see above [FAQ](#faqs))


<File name='snapshots/orders_snaphot.sql'>

```sql
{{
    config(
      target_schema=generate_schema_name('snapshots')
    )
}}
```

</File>
