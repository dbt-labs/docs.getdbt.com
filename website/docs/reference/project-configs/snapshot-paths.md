---
datatype: [directorypath]
default_value: [snapshots]
---
## Definition
Optionally specify a custom list of directories where [snapshots](snapshots) are located. Note that you cannot co-locate models and snapshots.

* Default: `snapshot-paths: ["snapshots"]`

## Examples
### Use a subdirectory named `archives` instead of `snapshots`

<File name='dbt_project.yml'>

```yml
snapshot-paths: ["archives"]
```

</File>
