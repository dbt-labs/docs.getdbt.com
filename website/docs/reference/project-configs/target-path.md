---
datatype: directorypath
default_value: target
---
<File name='dbt_project.yml'>

```yml
target-path: [directorypath]
```

</File>

# Definition
Optionally specify a custom directory where compiled files (e.g. compiled models and tests) will be written when you run the `dbt run`, `dbt compile`, or `dbt test` command.


## Default
By default, dbt will write compiled files to the `target` directory, i.e. `target-path: target`

## Examples
### Use a subdirectory named `compiled` for compiled files

<File name='dbt_project.yml'>

```yml
target-path: "compiled"
```

</File>
