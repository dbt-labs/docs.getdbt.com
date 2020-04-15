---
datatype: [directorypath]
default_value: []
---

<File name='dbt_project.yml'>

```yml
docs-paths: [directorypath]
```

</File>

## Definition
Optionally specify a custom list of directories where [docs blocks](documentation#docs-blocks) are located.


## Default
By default, dbt will search in all resource paths for docs blocks (i.e. the combined list of [source-paths](source-paths), [data-paths](data-paths), [analysis-paths](analysis-paths), [macro-paths](macro-paths) and [snapshot-paths](snapshot-paths)). If this option is configured, dbt will _only_ look in the specified directory for docs blocks.


## Examples
<Alert type='info'>
    We typically omit this configuration as we prefer dbt's default behavior.
</Alert>

### Use a subdirectory named `docs` for docs blocks

<File name='dbt_project.yml'>

```yml
docs-paths: ["docs"]
```

</File>
