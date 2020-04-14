---
datatype: directorypath
default_value: target
---
# Definition
Optionally specify a custom directory where compiled files (e.g. compiled models and tests) will be created when you run the `dbt run`, `dbt compile`, or `dbt test` command.


* Default: `target-path: target`

## Examples
### Use a subdirectory named `compiled` for compiled files

<File name='dbt_project.yml'>

```yml
target-path: "compiled"
```

</File>
