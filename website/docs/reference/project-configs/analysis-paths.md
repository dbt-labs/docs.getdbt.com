---
datatype: [directorypath]
default_value: [analysis]
---

<File name='dbt_project.yml'>

```yml
analysis-paths: [directorypath]
```

</File>

## Definition
Optionally specify a custom list of directories where [analyses](analyses) are located.

## Default
By default, dbt expects analyses to be located in the `analysis` directory, i.e. `analysis-paths: ["analysis"]`

## Examples
### Use a subdirectory named `analyses` instead of `analysis`

<File name='dbt_project.yml'>

```yml
analysis-paths: ["analyses"]
```

</File>
