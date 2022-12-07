---
datatype: [directorypath]
default_value: [snapshots]
---
<File name='dbt_project.yml'>

```yml
snapshot-paths: [directorypath]
```

</File>

## Definition
Optionally specify a custom list of directories where [snapshots](snapshots) are located. Note that you cannot co-locate models and snapshots.

<Changelog>

* `v0.14.0`: Snapshots were introduced

</Changelog>

## Default
By default, dbt will search for snapshots in the `snapshots` directory, i.e. `snapshot-paths: ["snapshots"]`

## Examples
### Use a subdirectory named `archives` instead of `snapshots`

<File name='dbt_project.yml'>

```yml
snapshot-paths: ["archives"]
```

</File>
