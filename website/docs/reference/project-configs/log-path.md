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

In the manner of a ["global" config](global-configs), the log path can be set in three places:
1. `--log-path` CLI flag
2. `DBT_LOG_PATH` environment variable
3. `log-path` in `dbt_project.yml`

The precedence order is: CLI flag > env var > `dbt_project.yml`

</VersionBlock>

## Examples
### Write logs to a subdirectory named `dbt_logs` instead of `logs`

<File name='dbt_project.yml'>

```yml
log-path: dbt_logs
```

</File>
