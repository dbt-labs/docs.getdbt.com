---
datatype: [directorypath]
default_value: []
---

<File name='dbt_project.yml'>

```yml
analysis-paths: [directorypath]
```

</File>

## Definition
Specify a custom list of directories where [analyses](analyses) are located.

## Default
Without specifying this config, dbt will not compile any `.sql` files as analyses.

However, the [`dbt init` command](init) populates this value as `analysis` ([source](https://github.com/fishtown-analytics/dbt-starter-project/blob/master/dbt_project.yml#L15))

## Examples
### Use a subdirectory named `analysis`
This is the value populated by the [`dbt init` command](init).

<File name='dbt_project.yml'>

```yml
analysis-paths: ["analysis"]
```

</File>

### Use a subdirectory named `analyses`
A good idea if you want to be consistent in your use of plural directory names.

<File name='dbt_project.yml'>

```yml
analysis-paths: ["analyses"]
```

</File>
