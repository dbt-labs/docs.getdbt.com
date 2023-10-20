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
Optionally specify a custom list of directories where [snapshots](/docs/build/snapshots) are located. Note that you cannot co-locate models and snapshots.

## Default
By default, dbt will search for snapshots in the `snapshots` directory, i.e. `snapshot-paths: ["snapshots"]`

## Examples
### Use a subdirectory named `archives` instead of `snapshots`

<File name='dbt_project.yml'>

```yml
snapshot-paths: ["archives"]
```

</File>
