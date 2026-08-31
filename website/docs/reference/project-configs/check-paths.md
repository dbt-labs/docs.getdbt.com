---
datatype: [directorypath]
default_value: [checks]
availability:
  engine: v2
---

<File name='dbt_project.yml'>

```yml
check-paths: [directorypath]
```

</File>

## Definition

Specify custom directories where dbt looks for [project quality checks](/docs/build/project-checks).

## Default

By default, dbt looks for checks in the `checks` directory.

<File name='dbt_project.yml'>

```yml
check-paths: ["checks"]
```

</File>

## Examples

Use a subdirectory named `project_rules` instead of `checks`:

<File name='dbt_project.yml'>

```yml
check-paths: ["project_rules"]
```

</File>

Use multiple directories:

<File name='dbt_project.yml'>

```yml
check-paths: ["checks", "shared_checks"]
```

</File>
