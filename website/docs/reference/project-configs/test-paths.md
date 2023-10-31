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

Optionally specify a custom list of directories where [singular tests](/docs/build/tests) are located.


## Default
Without specifying this config, dbt will search for tests in the `tests` directory, i.e. `test-paths: ["tests"]`. Specifically, it will look for `.sql` files containing:
- Generic test definitions in the `tests/generic` subdirectory
- Singular tests (all other files)

## Examples
### Use a subdirectory named `custom_tests` instead of `tests` for data tests

<File name='dbt_project.yml'>

```yml
test-paths: ["custom_tests"]
```

</File>
