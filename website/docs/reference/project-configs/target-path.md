---
datatype: directorypath
default_value: target
---
<File name='dbt_project.yml'>

```yml
target-path: directorypath
```

</File>

# Definition
Optionally specify a custom directory where compiled files (e.g. compiled models and tests) will be written when you run the `dbt run`, `dbt compile`, or `dbt test` command.



## Default
By default, dbt will write compiled files to the `target` directory, i.e. `target-path: target`

<VersionBlock firstVersion="1.2">

## Configuration

In the manner of a ["global" config](/reference/global-configs/about-global-configs), the target path can be set in three places:
1. `--target-path` CLI flag
2. `DBT_TARGET_PATH` environment variable
3. `target-path` in `dbt_project.yml`

<VersionBlock firstVersion="1.5">

:::warning Feature deprecation

As of dbt version 1.5, setting the `target-path` in the `dbt_project.yml` is deprecated. Backward compatibility is still supported in 1.5 but will be removed in a future update. Migrate to the CLI flag or environment variable methods to avoid potential errors or disruptions.

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
target-path: "compiled_files"
```

</File>

<VersionBlock firstVersion="1.5">

### Specify subdirectory from the command line 

```bash
dbt run --target-path compiled_files
```

</VersionBlock>