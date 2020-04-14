---
datatype: [directorypath]
default_value: [models]
---
## Definition
Optionally specify a custom list of directories where [models](building-models) and [sources](using-sources) are located.

* Default: `source-paths: ["models"]`

## Examples
### Use a subdirectory named `transformations` instead of `models`

<File name='dbt_project.yml'>

```yml
source-paths: ["transformations"]
```

</File>
