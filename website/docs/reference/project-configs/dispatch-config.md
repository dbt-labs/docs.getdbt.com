---
title: dispatch (config)
description: "Read this guide to understand the dispatch configuration in dbt."
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

Optionally override the [dispatch](/reference/dbt-jinja-functions/dispatch) search locations for macros in certain namespaces. If not specified, `dispatch` will look in your root project _first_, by default, and then look for implementations in the package named by `macro_namespace`.

## Examples


I want to "shim" the `dbt_utils` package with the `spark_utils` compatibility package.

<File name='dbt_project.yml'>

```yml
dispatch:
  - macro_namespace: dbt_utils
    search_order: ['spark_utils', 'dbt_utils']
```

</File>

I've reimplemented certain macros from the `dbt_utils` package in my root project (`'my_root_project'`), and I want my versions to take precedence. Otherwise, fall back to the versions in `dbt_utils`.

_Note: This is the default behavior. You may optionally choose to express that search order explicitly as:_

<File name='dbt_project.yml'>

```yml
dispatch:
  - macro_namespace: dbt_utils
    search_order: ['my_root_project', 'dbt_utils']
```

</File>
