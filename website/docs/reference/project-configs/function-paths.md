---
datatype: [directorypath]
default_value: [functions]
---

<File name='dbt_project.yml'>

```yml
function-paths: [directorypath]
```

</File>

## Definition

Optionally specify a custom list of directories where [user-defined functions (UDFs)](/docs/build/udfs) are located.

## Default

By default, dbt will search for functions in the `functions` directory, for example, `function-paths: ["functions"]`

## Examples

Use a subdirectory named `udfs` instead of `functions`:

<File name='dbt_project.yml'>

```yml
function-paths: ["udfs"]
```

</File>

Use multiple directories to organize your functions:

<File name='dbt_project.yml'>

```yml
function-paths: ["functions", "custom_udfs"]
```

</File>

