---
datatype: [directorypath]
default_value: [models]
---

<File name='dbt_project.yml'>

```yml
model-paths: [directorypath]
```

</File>

## Definition
Optionally specify a custom list of directories where [models](/docs/build/models) and [sources](/docs/build/sources) are located.

## Default
By default, dbt will search for models and sources in the `models` directory, i.e. `model-paths: ["models"]`

## Examples
### Use a subdirectory named `transformations` instead of `models`

<File name='dbt_project.yml'>

```yml
model-paths: ["transformations"]
```

</File>
