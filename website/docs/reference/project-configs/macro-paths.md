---
datatype: directorypath
default_value: [macros]
---
## Definition
Optionally specify a custom list of directories where [macros](macros) are located. Note that you cannot co-locate models and macros.

* Default: `macro-paths: ["macros"]`

## Examples
### Use a subdirectory named `custom_macros` instead of `macros`

<File name='dbt_project.yml'>

```yml
macro-paths: ["custom_macros"]
```

</File>
