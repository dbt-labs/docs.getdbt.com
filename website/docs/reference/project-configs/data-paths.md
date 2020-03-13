---
datatype: [directorypath]
default_value: [data]
---
## Definition
Optionally specify a custom list of directories where [seed](docs/building-a-dbt-project.md) files are located.

* Default: `data-paths: ["data"]`

## Examples
### Use a subdirectory named `seeds` instead of `data`

<File name='dbt_project.yml'>

```yml
data-paths: ["seeds"]
```

</File>

### Co-locate your models and seeds in the `models` directory

<File name='dbt_project.yml'>

```yml
data-paths: ["models"]
model-paths: ["models"]
```

</File>

### Split your seeds across two directories
<File name='dbt_project.yml'>

```yml
data-paths: ["data", "seeds"]
```

</File>
