---
datatype: [directorypath]
default_value: [tests]
---
<File name='dbt_project.yml'>

```yml
test-paths: [directorypath]
```

</File>

## Definition
Optionally specify a custom list of directories where [data tests](resource-properties/tests#custom-data-tests) are located.

## Default
By default, dbt will search for data tests in the `tests` directory, i.e. `test-paths: ["tests"]`

## Examples
### Use a subdirectory named `data-tests` instead of `tests`

<File name='dbt_project.yml'>

```yml
test-paths: ["data-tests"]
```

</File>
