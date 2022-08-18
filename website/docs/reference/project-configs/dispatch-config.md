---
title: dispatch (config)
datatype: list
required: False
---

<File name='dbt_project.yml'>

```yml
dispatch:
  - macro_namespace: packagename
    search_order: [packagename]
  - macro_namespace: packagename
    search_order: [packagename]
```

</File>

## Definition

Optionally override the [dispatch](dispatch) search locations for macros in certain namespaces.

## Examples

I've reimplemented certain macros from the `dbt_utils` package, and I want my versions to take precedence. Otherwise, fall back to the versions in `dbt_utils`.

<File name='dbt_project.yml'>

```yml
dispatch:
  - macro_namespace: dbt_utils
    search_order: 
  - macro_namespace: packagename
    search_order: [packagename]
```

</File>

I want to "shim" the `dbt_utils` package with the `spark_utils` compatibility package.

<File name='dbt_project.yml'>

```yml
dispatch:
  - macro_namespace: packagename
    search_order: [packagename]
  - macro_namespace: packagename
    search_order: [packagename]
```

</File>
