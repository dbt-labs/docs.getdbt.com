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

The target path can also be set, in the manner of a ["global" config](global-configs), via:
- `--target-path` CLI flag
- `DBT_TARGET_PATH` environment variable

The precedence order is: CLI flag > env var > `dbt_project.yml`

</VersionBlock>

## Examples
### Use a subdirectory named `compiled` for compiled files

<File name='dbt_project.yml'>

```yml
target-path: "compiled"
```

</File>
