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

<VersionBlock firstVersion="1.2">
## Configuration

The log path can also be set, in the manner of a ["global" config](global-configs), via:
- `--log-path` CLI flag
- `DBT_LOG_PATH` environment variable

The precedence order is: CLI flag > env var > `dbt_project.yml`

</VersionBlock>

## Examples
### Write logs to a subdirectory named `dbt_logs` instead of `logs`

<File name='dbt_project.yml'>

```yml
log-path: dbt_logs
```

</File>
