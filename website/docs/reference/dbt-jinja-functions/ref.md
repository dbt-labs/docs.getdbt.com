---
title: "About ref function"
sidebar_label: "ref"
id: "ref"
description: "Read this guide to understand the builtins Jinja function in dbt."
---

The most important function in dbt is `ref()`; it's impossible to build even moderately complex models without it. `ref()` is how you reference one model within another. This is a very common behavior, as typically models are built to be "stacked" on top of one another. Here is how this looks in practice:

<File name='model_a.sql'>

```sql
select *
from public.raw_data
```

</File>



<File name='model_b.sql'>

```sql
select *
from {{ref('model_a')}}
```

</File>

`ref()` is, under the hood, actually doing two important things. First, it is interpolating the schema into your model file to allow you to change your deployment schema via configuration. Second, it is using these references between models to automatically build the dependency graph. This will enable dbt to deploy models in the correct order when using `dbt run`.

The `{{ ref }}` function returns a `Relation` object that has the same `table`, `schema`, and `name` attributes as the [{{ this }} variable](/reference/dbt-jinja-functions/this).

## Advanced ref usage

### Versioned ref

The `ref` function supports an optional keyword argument - `version` (or `v`).
When a version argument is provided to the `ref` function, dbt returns to the `Relation` object corresponding to the specified version of the referenced model.

This functionality is useful when referencing versioned models that make breaking changes by creating new versions, but guarantees no breaking changes to existing versions of the model.

If the `version` argument is not supplied to a `ref` of a versioned model, the latest version is. This has the benefit of automatically incorporating the latest changes of a referenced model, but there is a risk of incorporating breaking changes.

#### Example:
<File name='models/<schema>.yml'>

```yml

models:
  - name: model_name
    latest_version: 2
    versions:
      - v: 2
      - v: 1
```

</File>

```sql
 -- returns the `Relation` object corresponding to version 1 of model_name
select * from {{ ref('model_name', version=1) }}
```

```sql
 -- returns the `Relation` object corresponding to version 2 (the latest version) of model_name
select * from {{ ref('model_name') }}
```

### Two-argument variant

You can also use a two-argument variant of the `ref` function. With this variant, you can pass both a namespace (project or package) and model name to `ref` to avoid ambiguity. When using two arguments with projects (not packages), you need to also set [cross project dependencies](/docs/collaborate/govern/project-dependencies).

```sql
select * from {{ ref('project_or_package', 'model_name') }}
```

We recommend using two-argument `ref` any time you are referencing a model defined in a different package or project. While not required in all cases, it's more explicit for you, for dbt, and for future readers of your code.

<VersionBlock firstVersion="1.6">

We especially recommend using two-argument `ref` to avoid ambiguity, in cases where a model name is duplicated across multiple projects or installed packages. If you use one-argument `ref` (just the `model_name`), dbt will look for a model by that name in the same namespace (package or project); if it finds none, it will raise an error.

</VersionBlock>

**Note:** The `project_or_package` should match the `name` of the project/package, as defined in its `dbt_project.yml`. This might be different from the name of the repository. It never includes the repository's organization name. For example, if you use the [`fivetran/stripe`](https://hub.getdbt.com/fivetran/stripe/latest/) package, the package name is `stripe`, not `fivetran/stripe`.

### Forcing Dependencies

In normal usage, dbt knows the proper order to run all models based on the usage of the `ref` function. There are cases though where dbt doesn't know when a model should be run. An example of this is when a model only references a macro. In that case, dbt thinks the model can run first because no explicit references are made at compilation time. To address this, you can use a SQL comment along with the `ref` function — dbt will understand the dependency, and the compiled query will still be valid:

```sql
 -- depends_on: {{ ref('upstream_parent_model') }}

 {{ your_macro('variable') }}
```

dbt will see the `ref` and build this model after the specified reference.
