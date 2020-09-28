---
datatype: [directorypath]
default_value: [data]
---
<File name='dbt_project.yml'>

```yml
data-paths: [directorypath]
```

</File>

## Definition
Optionally specify a custom list of directories where [seed](docs/building-a-dbt-project/seeds.md) files are located.

## Default

By default, dbt expects analyses to be located in the `data` directory, i.e. `data-paths: ["data"]`

## Examples
### Use a subdirectory named `seeds` instead of `data`

<File name='dbt_project.yml'>

```yml
data-paths: ["seeds"]
```

</File>

### Co-locate your models and seeds in the `models` directory
Note: this works because dbt is looking for different file types for seeds (`.csv` files) and models (`.sql` files).

<File name='dbt_project.yml'>

```yml
data-paths: ["models"]
source-paths: ["models"]
```

</File>

### Split your seeds across two directories
Note: We recommend that you instead use two subdirectories within the `data/` directory to achieve a similar effect.

<File name='dbt_project.yml'>

```yml
data-paths: ["data", "seeds"]
```

</File>
