---
datatype: [directorypath]
default_value: [tests]
---
## Definition
Optionally specify a custom list of directories where [data tests](testing#custom-data-tests) are located.

* Default: `test-paths: ["tests"]`

## Examples
### Use a subdirectory named `data-tests` instead of `tests`

<File name='dbt_project.yml'>

```yml
test-paths: ["data-tests"]
```

</File>
