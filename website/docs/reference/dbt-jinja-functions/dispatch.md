---
title: "Macro dispatch"
---

<Changelog>

    - **v0.18.0:** Introduced `dispatch` as a replacement for deprecated `adapter_macro`
    - **v0.19.2:** Limited rendering context for `dispatch` arguments. Includes backwards compatibility for widely used packages.
    - **v0.20.0:** Parent adapters' macro implementations are included in search order. Formalized supported arguments.
    
</Changelog>

__Args__:

  * `macro_name`: Name of macro to dynamically implement. Must be a string literal.
  * `packages`: Optional list (`[]`) of packages to search for implementations (defaults to root project). The list may include string literals or [`vars`](var); note that it _may not_ include other macros or be set to a macro result.
  
dbt can extend functionality across [its many supported adapters](available-adapters) through a system of [multiple dispatch](https://en.wikipedia.org/wiki/Multiple_dispatch). Because SQL syntax, data types, and DDL/DML support vary across adapters, dbt can define and call generic functional macros, and then "dispatch" that macro to the appropriate implementation for the current adapter.

Adapter-specific macros are prefixed with the lowercase adapter name and two
underscores. E.g., given a macro named `my_macro`, dbt would look for:
* Postgres: `postgres__my_macro`
* Redshift: `redshift__my_macro`
* Snowflake: `snowflake__my_macro`
* BigQuery: `bigquery__my_macro`
* OtherAdapter: `otheradapter__my_macro`
* _default:_ `default__my_macro`

By default, dbt will search for implementations in the root project, internal projects (e.g. `dbt`, `dbt_postgres`), and the package where the macro is defined. If the `packages` argument is provided, it searches the specified list of packages in order until it finds a working implementation.

### A simple example

Let's say I want to define a macro, `concat`, that compiles to the SQL function `concat()` as its
default behavior. On Redshift and Snowflake, however, I want to use the `||` operator instead.

<File name='macros/concat.sql'>

```sql
{% macro concat(fields) -%}
  {{ return(adapter.dispatch('concat')(fields)) }}
{%- endmacro %}


{% macro default__concat(fields) -%}
    concat({{ fields|join(', ') }})
{%- endmacro %}


{% macro redshift__concat(fields) %}
    {{ fields|join(' || ') }}
{% endmacro %}


{% macro snowflake__concat(fields) %}
    {{ fields|join(' || ') }}
{% endmacro %}
```

</File>

The top `concat` macro follows a special, rigid formula: It is named with the macro's "primary name," `concat`, which is how the macro will be called elsewhere. It accepts one argument, named `fields`. This macro's _only_ function is to dispatch—that is, look for and return—using the primary macro name (`concat`) as its search term. It also wants to pass through, to its eventual implementation, all the keyword arguments that were passed into it—in this case, `fields`.

Below that, I've defined three possible implementations of the `concat` macro: one for Redshift, one for Snowflake, and one for use by default on all other adapters. Depending on the adapter I'm running against, one of these macros will be chosen to take the arguments, operate on them, and pass the result back through the dispatched macro.

### A more complex example

I found an existing implementation of the `concat` macro in the dbt-utils package. However, I want to override its implementation of the `concat` macro on Redshift in particular. In all other cases—including the default implementation—I'm perfectly happy falling back to the implementations defined in [`dbt_utils.concat`](https://github.com/fishtown-analytics/dbt-utils/blob/master/macros/cross_db_utils/concat.sql). In this case, I can use the `packages` argument to define the search area and order:

<File name='macros/concat.sql'>

```sql
{% macro concat(fields) -%}
  {{ return(adapter.dispatch('concat', packages = ['my_project', 'dbt_utils']))(fields) }}
{%- endmacro %}


{% macro redshift__concat(fields) %}
    {% for field in fields %}
        nullif({{ field }},'') {{ ' || ' if not loop.last }}
    {% endfor %}
{% endmacro %}
```

</File>

In the example above, dbt prioritizes package specificity over adapter specificity when searching for viable implementations. If I call the `concat` macro while running on Postgres, in the example above, dbt will look for the following macros in order:

1. `my_project.postgres__concat` (not found)
2. `my_project.default__concat` (not found)
3. `dbt_utils.postgres__concat` (not found)
4. `dbt_utils.default__concat` (found)

### For package maintainers

The macros in dbt-utils, and in many other packages, offer an additional lever of configuration by including a variable in the `packages` argument of their dispatched macros:

```sql
{% macro concat(fields) -%}
  {{ return(adapter.dispatch('concat', packages = (var('dbt_utils_dispatch_list', []) + ['dbt_utils']))(fields)) }}
{%- endmacro %}
```

The conventional name of this variable is `<package_name>_dispatch_list`, but you could name it whatever you'd like. If the variable is defined, it will be prioritized; if it isn't defined, `dbt_utils` is always the final place searched.

Following the same example above: Whenever I call my `concat` macro in my own project, it will use my special null-handling version on Redshift. But the version of the `concat` macro _within_ the dbt-utils package will not use my version. Why does this matter? Other macros in dbt-utils, e.g. `surrogate_key`, call the `dbt_utils.concat` macro directly. What if I wanted `dbt_utils.surrogate_key` to use _my_ version of `redshift__concat` instead?

I can accomplish this by adding `my_project` to the variable dispatch list, which `dbt_utils.concat` will look to when searching for viable implementations of `redshift__concat`:

```yml
vars:
  dbt_utils_dispatch_list: ['my_project']
```

As an end use, this functionality makes it possible for me to change the behavior of another, more complex macro (`dbt_utils.surrogate_key`) by reimplementing and overriding one of its modular components.

As a package maintainer, this functionality enables users of my package to extend, reimplement, or override default behavior, without needing to fork the package's source code.

### For plugin maintainers

Most packages were initially designed to work on the four original dbt adapters. By using `dispatch` and the "dispatch list" variable pattern described above, it is possible to "shim" existing packages with new third-party packages. For instance, if the user wishes to use `dbt_utils.concat` on Apache Spark, they can install a compatibility package, spark-utils, alongside dbt-utils:

<File name='dbt_project.yml'>

```yml
packages:
  - package: fishtown-analytics/dbt_utils
    version: ...
  - package: fishtown-analytics/spark_utils
    version: ...
```

</File>

<File name='dbt_project.yml'>

```yml
vars:
  dbt_utils_dispatch_list: ['my_project', 'spark_utils']
```

</File>

Then the search order becomes:

1. `my_project.spark__concat` (not found)
2. `my_project.default__concat` (not found)
3. `spark_utils.spark__concat` (found! use this one)
4. `spark_utils.default__concat`
5. `dbt_utils.postgres__concat`
6. `dbt_utils.default__concat`

As a compatibility package maintainer, I only have to reimplement the foundational building-block macros which encapsulate low-level syntactical differences. For instance, by reimplementing low-level macros (e.g. `dateadd` and `datediff`), users get more complex macros (`dbt_utils.date_spine`) "for free."

**Note:** Some adapters "inherit" from other adapters (e.g. `dbt-postgres` &rarr; `dbt-redshift`). If using a child adapter, dbt will include the "parent" adapter's implementations in its search order. Child adapters tend to have very similar SQL syntax to their parents, so this allows them to skip reimplementing a macro if already reimplemented by the parent adapter.

So, in the case of `dbt_utils.concat` on Redshift, the full search order is actually:

1. `my_project.redshift__concat`
2. `my_project.postgres__concat`
3. `my_project.default__concat`
4. `dbt_utils.redshift__concat`
5. `dbt_utils.postgres__concat`
6. `dbt_utils.default__concat`
