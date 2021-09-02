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

I've reimplemented certain macros from `dbt_utils` in my own project `my_proj` (after the `name` property in `dbt_project.yaml`), and I want my versions to take precedence: otherwise, fall back to the versions in the `dbt_utils` package.

<File name='dbt_project.yml'>

```yml
dispatch:
- macro_namespace: dbt_utils
    search_order: [my_proj, dbt_utils]
```

</File>

Since this is Jinja-oriented, you'll find more docs over at the [Jinja pages][jinja-pages].

 [jinja-pages]: https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch#overriding-package-macros
