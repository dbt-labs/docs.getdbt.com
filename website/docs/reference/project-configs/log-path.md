---
datatype: directorypath
default_value: logs
---
# Definition
Optionally specify a custom directory where logs are located.

* Default: `log-path: logs`

## Examples
### Use a subdirectory named `dbt_logs` instead of `logs`

<File name='dbt_project.yml'>

```yml
log-path: dbt_logs
```

</File>
