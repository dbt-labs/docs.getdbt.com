---
resource_types: [snapshots]
description: "Target_schema - Read this in-depth guide to learn about configurations in dbt."
datatype: string
---

:::note

Starting in dbt Core v1.9+, this functionality is no longer utilized. Use the [schema](/reference/resource-configs/schema) config as an alternative to define a custom schema while still respecting the `generate_schema_name` macro. 

Try it now in the [<Constant name="cloud" /> "Latest" release track](/docs/dbt-versions/cloud-release-tracks).

:::

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
The schema that dbt should build a [snapshot](/docs/build/snapshots) <Term id="table" /> into. When `target_schema` is provided, snapshots build into the same `target_schema`, no matter who is running them.

On **BigQuery**, this is analogous to a `dataset`.

## Default

<VersionBlock firstVersion="1.9">In dbt Core v1.9+ and <Constant name="cloud" /> "Latest" release track, this is not a required parameter. </VersionBlock>

## Examples
### Build all snapshots in a schema named `snapshots`

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_schema: snapshots

```

</File>

