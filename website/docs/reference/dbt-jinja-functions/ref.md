---
title: "ref"
id: "ref"
description: "`ref()` references a model within another and creates a dependency graph."
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

:::info New in 0.9.0

The `{{ ref }}` function returns a `Relation` object that has the same `table`, `schema`, and `name` attributes at the [{{ this }}](this) variable.

:::

## Advanced ref usage

### Versioned ref

The `ref` function supports an optional keyword argument - `version` (or `v`).
When a version argument is provided to the `ref` function, dbt returns to the `Relation` object corresponding to the specified version of the referenced model.

This functionality is useful when referencing versioned models that make breaking changes by creating new versions, but guaruntee no breaking changes to existing versions of the model.

If the `version` argument is not supplied to a `ref` to a versioned model, the latest version. This has the benefit of automatically incorporating the latest changes of a referenced model, but is at risk to incorporating breaking changes.

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

There is also a two-argument variant of the `ref` function. With this variant, you can pass both a package name and model name to `ref` to avoid ambiguity. This functionality is not commonly required for typical dbt usage.

```sql
select * from {{ ref('package_name', 'model_name') }}
```

**Note:** The `package_name` should only include the name of the package, not the maintainer. For example, if you use the [`fivetran/stripe`](https://hub.getdbt.com/fivetran/stripe/latest/) package, type `stripe` in that argument, and not `fivetran/stripe`.

### Forcing Dependencies

In normal usage, dbt knows the proper order to run all models based on the usage of the `ref` function. There are cases though where dbt doesn't know when a model should be run. An example of this is when a model only references a macro. In that case, dbt thinks the model can run first because no explicit references are made at compilation time. To address this, you can use a SQL comment along with the `ref` function — dbt will understand the dependency, and the compiled query will still be valid:

```sql
 -- depends_on: {{ ref('upstream_parent_model') }}

 {{ your_macro('variable') }}
```

dbt will see the `ref` and build this model after the specified reference.
