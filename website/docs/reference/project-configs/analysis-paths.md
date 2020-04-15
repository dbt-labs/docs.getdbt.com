---
datatype: [directorypath]
default_value: [analysis]
---
## Definition
Optionally specify a custom list of directories where [analyses](analyses) are located.

* Default: `analysispaths: ["analysis"]`

## Examples
### Use a subdirectory named `analyses` instead of `analysis`

<File name='dbt_project.yml'>

```yml
analysis-paths: ["analyses"]
```

</File>
