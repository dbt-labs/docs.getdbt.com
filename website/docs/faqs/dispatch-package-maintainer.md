---
title: I'm an plugin or package maintainer. How can I use dispatch to extend or shim existing packages?
---

dbt prioritizes package specificity over adapter specificity when searching for viable implementations. If I call the `concat` macro while running on Postgres, dbt will look for the following macros in order:

1. `my_project.postgres__concat` (not found)
2. `my_project.default__concat` (not found)
3. `dbt_utils.postgres__concat` (not found)
4. `dbt_utils.default__concat` (found)

This also makes it possible to "shim" existing packages with new third-party packages, so long as the `packages` argument accepts a user-controlled variable. For instance, if the user wishes to use `dbt_utils.concat` on Apache Spark, they can install a compatibility package with the right implementation:

<File name='dbt_project.yml'>

```yml
vars:
  dbt_utils_dispatch_list: ['my_project', 'spark_utils']
```

</File>

Then the search becomes:

1. `my_project.spark__concat` (not found)
2. `my_project.default__concat` (not found)
3. `spark_utils.spark__concat` (found! use this one)
4. `spark_utils.default__concat`
5. `dbt_utils.postgres__concat`
6. `dbt_utils.default__concat`

<Changelog>

    - **v0.20.0:** Parent adapters' macro implementations are included in search order

</Changelog>

If I'm using an adapter that inherits from another adapter (e.g. `dbt-posgres` &rarr; `dbt-redshift`), then dbt will include the "parent" adapter's implementations in its search order. This is convenient for adapters with very similar SQL syntax to their parents, as they do not need to reimplement the same macros over and over again.

In the case of `dbt_utils.concat` on Redshift, the full search order is actually:

1. `my_project.redshift__concat`
2. `my_project.postgres__concat`
3. `my_project.default__concat`
4. `dbt_utils.redshift__concat`
5. `dbt_utils.postgres__concat`
6. `dbt_utils.default__concat`
