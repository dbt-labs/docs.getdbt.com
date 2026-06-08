---
datatype: [directorypath]
default_value: [OSI]
---

<VersionCallout version="1.12" />

<File name='dbt_project.yml'>

```yml
osi-paths: [directorypath]
```

</File>

## Definition

Optionally specify a custom list of directories where [Open Semantic Interchange (OSI) semantic layer documents](/docs/build/osi-semantic-models) are located.

## Default

By default, dbt will search for OSI documents in the `OSI` directory, for example, `osi-paths: ["OSI"]`.

## Examples

Use a subdirectory named `semantic_interchange` instead of `OSI`:

<File name='dbt_project.yml'>

```yml
osi-paths: ["semantic_interchange"]
```

</File>

Use multiple directories to organize your OSI documents:

<File name='dbt_project.yml'>

```yml
osi-paths: ["OSI", "external_osi"]
```

</File>
