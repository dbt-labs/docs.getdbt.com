---
resource_types: [snapshots]
description: "Target_database - Read this in-depth guide to learn about configurations in dbt."
datatype: string
---

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +target_database: string

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
The database that dbt should build a [snapshot](/docs/build/snapshots) <Term id="table" /> into.

Notes:
- The specified database must already exist
- On **BigQuery**, this is analogous to a `project`.
- On **Redshift**, cross-database queries are not possible. If you use this parameter, you will receive the following error. As such, **do not use** this parameter on Redshift:
```
Encountered an error:
Runtime Error
  Cross-db references not allowed in redshift (raw vs analytics)
```


## Default
By default, dbt will use the [target](/reference/dbt-jinja-functions/target) database associated with your profile/connection.

## Examples
### Build all snapshots in a database named `snapshots`

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_database: snapshots

```

</File>

### Use a target-aware database
Use the [`{{ target }}` variable](/reference/dbt-jinja-functions/target) to change which database a snapshot table is built in.

Note: consider whether this use-case is right for you, as downstream `refs` will select from the `dev` version of a snapshot, which can make it hard to validate models that depend on snapshots.

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_database: "{% if target.name == 'dev' %}dev{% else %}{{ target.database }}{% endif %}"

```

</File>

### Use the same database-naming behavior as models

Leverage the [`generate_database_name` macro](/docs/build/custom-databases) to build snapshots in databases that follow the same naming behavior as your models.

Notes:
* This macro is not available when configuring from the `dbt_project.yml` file, so must be configured in a snapshot config block.
* Consider whether this use-case is right for you, as downstream `refs` will select from the `dev` version of a snapshot, which can make it hard to validate models that depend on snapshots.

<File name='snapshots/orders_snaphot.sql'>

```sql
{{
    config(
      target_database=generate_database_name('snapshots')
    )
}}
```

</File>
