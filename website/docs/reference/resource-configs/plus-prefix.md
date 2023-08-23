---
title: Using the + prefix

---

The `+` prefix is a dbt syntax feature, introduced in dbt v0.17.0, which helps disambiguate between [resource paths](/reference/resource-configs/resource-path) and configs in `dbt_project.yml` files.

It is only compatible with `dbt_project.yml` files that use [`config-version`](/reference/project-configs/config-version) 2.

For example:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop
config-version: 2

...

models:
  +materialized: view
  jaffle_shop:
    marts:
      +materialized: table
```

</File>

Throughout this documentation, we've tried to be consistent in using the `+` prefix in `dbt_project.yml` files.

However, the leading `+` is in fact _only required_ when you need to disambiguate between resource paths and configs, for example when:
- A config accepts a dictionary as its inputs, for example, the [`persist_docs` config](/reference/resource-configs/persist_docs).
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
    schema: my_schema # a plus prefix is optional here
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

When adding configs in `dbt_project.yml`, it doesn't hurt to use the `+` prefix, so we recommend you use it always.

<VersionBlock firstVersion="1.2">

**Note:** This use of the `+` prefix, in `dbt_project.yml`, is distinct from the use of `+` to control config merge behavior (clobber vs. add) in other config settings (specific resource `.yml` and `.sql` files). Currently, the only config which supports `+` for controlling config merge behavior is [`grants`](/reference/resource-configs/grants#grant-config-inheritance).

</VersionBlock>
