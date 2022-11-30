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

<VersionBlock firstVersion="1.2">
## Configuration

In the manner of a ["global" config](global-configs), the target path can be set in three places:
1. `--target-path` CLI flag
2. `DBT_TARGET_PATH` environment variable
3. `target-path` in `dbt_project.yml`

The precedence order is: CLI flag > env var > `dbt_project.yml`

</VersionBlock>

## Examples
### Use a subdirectory named `compiled` for compiled files

<File name='dbt_project.yml'>

```yml
target-path: "compiled"
```

</File>
