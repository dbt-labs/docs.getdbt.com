---
datatype: [directorypath]
default_value: [data]
---

<File name='dbt_project.yml'>

```yml
seed-paths: [directorypath]
```

</File>

## Definition
Optionally specify a custom list of directories where [seed](/docs/build/seeds) files are located.

## Default

By default, dbt expects seeds to be located in the `seeds` directory, i.e. `seed-paths: ["seeds"]`

## Examples
### Use a subdirectory named `custom_seeds` instead of `seeds`

<File name='dbt_project.yml'>

```yml
seed-paths: ["custom_seeds"]
```

</File>

### Co-locate your models and seeds in the `models` directory
Note: this works because dbt is looking for different file types for seeds (`.csv` files) and models (`.sql` files).

<File name='dbt_project.yml'>

```yml
seed-paths: ["models"]
model-paths: ["models"]
```

</File>

### Split your seeds across two directories
Note: We recommend that you instead use two subdirectories within the `seeds/` directory to achieve a similar effect.

<File name='dbt_project.yml'>

```yml
seed-paths: ["seeds", "custom_seeds"]
```

</File>
