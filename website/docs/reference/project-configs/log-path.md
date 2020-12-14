---
datatype: directorypath
default_value: logs
---
<File name='dbt_project.yml'>

```yml
log-path: directorypath
```

</File>

## Definition
Optionally specify a custom directory where dbt will write logs.

## Default
By default, dbt will write to the `logs` directory, i.e. `log-path: logs`

## Examples
### Write logs to a subdirectory named `dbt_logs` instead of `logs`

<File name='dbt_project.yml'>

```yml
log-path: dbt_logs
```

</File>
