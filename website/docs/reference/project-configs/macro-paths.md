---
datatype: directorypath
description: "Read this guide to understand the macro-paths configuration in dbt."
default_value: [macros]
---

<File name='dbt_project.yml'>

```yml
macro-paths: [directorypath]
```

</File>

## Definition
Optionally specify a custom list of directories where [macros](/docs/build/jinja-macros#macros) are located. Note that you cannot co-locate models and macros.

## Default
By default, dbt will search for macros in a directory named `macros`, i.e. `macro-paths: ["macros"]`

## Examples
### Use a subdirectory named `custom_macros` instead of `macros`

<File name='dbt_project.yml'>

```yml
macro-paths: ["custom_macros"]
```

</File>
