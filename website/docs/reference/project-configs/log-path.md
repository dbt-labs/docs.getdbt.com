---
datatype: directorypath
description: "Read this guide to understand the log-path configuration in dbt."
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

In the manner of a ["global" config](/reference/global-configs/about-global-configs), the log path can be set in three places:
1. `--log-path` CLI flag
2. `DBT_LOG_PATH` environment variable
3. `log-path` in `dbt_project.yml`

<VersionBlock firstVersion="1.5">

:::warning Feature deprecation

As of dbt version 1.5, setting the `log-path` in the `dbt_project.yml` is deprecated. Backward compatibility is still supported in 1.5 but will be removed in a future update. Migrate to the CLI flag or environment variable methods to avoid potential errors or disruptions.

:::

The precedence order is: CLI flag > env var > `dbt_project.yml(deprecated)`

</VersionBlock>

<VersionBlock lastVersion="1.4">

The precedence order is: CLI flag > env var > `dbt_project.yml`

</VersionBlock>

</VersionBlock>

## Examples
### Specify subdirectory using the project config file

<File name='dbt_project.yml'>

```yml
log-path: dbt_logs
```
</File>

<VersionBlock firstVersion="1.5">

### Specify subdirectory from the command line 

```bash
dbt --log-path dbt_logs run
```

</VersionBlock>
