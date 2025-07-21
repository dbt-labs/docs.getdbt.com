---
title: Using the + prefix
description: "The + prefix helps disambiguate between resource paths and configs in dbt_project.yml files."
intro_text: "Use the + prefix to help clarify the difference between resource paths and configs in dbt_project.yml files."
---

The `+` prefix is a dbt syntax feature which helps disambiguate between [resource paths](/reference/resource-configs/resource-path) and configs in [`dbt_project.yml` files](/reference/dbt_project.yml).

- It is not compatible with `dbt_project.yml` files that use [`config-version`](/reference/project-configs/config-version) 1. 
- It doesn't apply to:
  - `config()` Jinja macro within a resource file
  - config property in a `.yml` file.


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

However, the leading `+` is in fact _only required_ when you need to disambiguate between resource paths and configs. For example, when:
- A config accepts a dictionary as its inputs. As an example, the [`persist_docs` config](/reference/resource-configs/persist_docs).
- Or, a config shares a key with part of a resource path. For example, if you had a directory of models named `tags`.

import MissingPrefix from '/snippets/_missing-prefix.md';

<MissingPrefix />

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
    config:
      tags: # whereas this is the tag resource path
        # changed to config in v1.10
        # The below config applies to models in the
        # models/tags/ directory.
        # Note: you don't _need_ a leading + here,
        # but it wouldn't hurt.
        materialized: view


```

</File>

**Note:** The use of the `+` prefix in `dbt_project.yml` is distinct from the use of `+` to control config merge behavior (clobber vs. add) in other config settings (specific resource `.yml` and `.sql` files). Currently, the only config which supports `+` for controlling config merge behavior is [`grants`](/reference/resource-configs/grants#grant-config-inheritance).

