---
datatype: [directorypath]
default_value: [test]
---
<File name='dbt_project.yml'>

```yml
test-paths: [directorypath]
```

</File>

## Definition
Optionally specify a custom list of directories where [data tests](docs/building-a-dbt-project/tests#data-tests) are located.

## Default
Without specifying this config, dbt will search for data tests in the `tests` directory, i.e. `test-paths: ["tests"]`.

## Examples
### Use a subdirectory named `custom_tests` instead of `tests` for data tests

<File name='dbt_project.yml'>

```yml
test-paths: ["custom_tests"]
```

</File>
