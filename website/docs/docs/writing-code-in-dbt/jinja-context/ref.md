---
title: "ref"
id: "ref"
---

## Overview

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

<Callout type="info" title="New in 0.9.0">

The `{{ ref }}` function returns a `Relation` object that has the same `table`, `schema`, and `name` attributes at the [{{ this }}](this) variable.

</Callout>

## Advanced ref usage
There is also a two-argument variant of the `ref` function. With this variant, you can pass both a package name and model name to `ref` to avoid ambiguity. This functionality is not commonly required for typical dbt usage.

```sql
select * from {{ ref('package_name', 'model_name') }}
```
