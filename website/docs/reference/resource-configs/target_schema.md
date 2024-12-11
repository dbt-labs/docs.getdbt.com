---
resource_types: [snapshots]
description: "Target_schema - Read this in-depth guide to learn about configurations in dbt."
datatype: string
---

:::info

Starting in dbt Core v1.9+, this functionality is no longer utilized. Use the [database](/reference/resource-configs/database) config as an alternative to define a custom database while still respecting the `generate_database_name` macro. 

Try it now in the [dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks).

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

<VersionBlock lastVersion="1.8" >This is a required parameter, no default is provided. </VersionBlock>
<VersionBlock firstVersion="1.9.1">In dbt Core v1.9+ and dbt Cloud "Latest" release track, this is not a required parameter. </VersionBlock>

## Examples
### Build all snapshots in a schema named `snapshots`

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_schema: snapshots

```

</File>

<VersionBlock lastVersion="1.8" >

### Use the same schema-naming behavior as models

For native support of environment-aware snapshots, upgrade to dbt Core version 1.9+ and remove any existing `target_schema` configuration. 

</VersionBlock>