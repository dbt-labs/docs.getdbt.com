---
title: Advanced configuration usage
sidebar_label: Advanced usage
---
## Alternative config block syntax

Some configurations may contain characters (e.g. dashes) that cannot be parsed as a jinja argument. For example, the following would return an error:

```sql
{{ config(
    post-hook="grant select on {{ this }} to role reporter",
    materialized='table'
) }}

select ...
```

While dbt provides an alias for any core configurations (e.g. you should use `pre_hook` instead of `pre-hook` in a config block), your dbt project may contain custom configurations without aliases.

If you want to specify these configurations in side of a model, use the altenative config block syntax:


<File name='models/events/base/base_events.sql'>

```sql
{{
  config({
    "post-hook": "grant select on {{ this }} to role reporter",
    "materialized": "table"
  })
}}


select ...
```

</File>

<!---
## Hierarchies / overriding configs / precedence
For Drew to do
--->

## Using the `+` prefix

Throughout this documentation, we've tried to be consistent in using the `+` prefix to differentiate between a configuration, and part of a [resource path](resource-path) in `dbt_project.yml` files. This was introduced in dbt v0.17.0. For example:

<File name='dbt_project.yml'>

```yml

models:
  +materialized: view
  jaffle_shop:
    marts:
      +materialized: table
```

</File>

The leading `+` is in fact _only required_ when you need to disambiguate between resource paths and configs, for example when:
- A config accepts a dictionary as its inputs, for example, the [`persist_docs` config](persist_docs).
- Or, a config shares a key with part of a resource path, for example, if you had a directory of models named `tags`.

<File name='dbt_project.yml'>

```yml
name: jaffle_shop
config-version: 2

...

models:
  +persist_docs: # this config is a dictionary, so needs a + prefix
    relation: true
    columns: true

  jaffle_shop:
    +tags: # this is the tag config
      - "hello"
    tags: # whereas this is the tag resource path
      # The below config applies to models in the
      # models/tags/ directory.
      # Note: you don't _need_ a leading + here,
      # but it wouldn't hurt.
      materialized: view

```

</File>

However it doesn't hurt to use the `+` prefix, so we recommend you use it whenever adding configs to your `dbt_project.yml` file.
