---
datatype: [directorypath]
description: "Read this guide to understand the snapshot-paths configuration in dbt."
default_value: [snapshots]
---
<File name='dbt_project.yml'>

```yml
snapshot-paths: [directorypath]
```

</File>

## Definition

Optionally specify a custom list of directories where [snapshots](/docs/build/snapshots) are located. 

<VersionBlock firstVersion="1.9">
In [Versionless](/docs/dbt-versions/versionless-cloud) and on dbt v1.9 and higher, you can co-locate your snapshots with models if they are [defined using the latest YAML syntax](/docs/build/snapshots). 
</VersionBlock>

<VersionBlock lastVersion="1.8">
Note that you cannot co-locate models and snapshots. However, in [Versionless](/docs/dbt-versions/versionless-cloud) and on dbt v1.9 and higher, you can co-locate your snapshots with models if they are [defined using the latest YAML syntax](/docs/build/snapshots).
</VersionBlock>

## Default
By default, dbt will search for snapshots in the `snapshots` directory, i.e. `snapshot-paths: ["snapshots"]`

## Examples
### Use a subdirectory named `archives` instead of `snapshots`

<File name='dbt_project.yml'>

```yml
snapshot-paths: ["archives"]
```

</File>
