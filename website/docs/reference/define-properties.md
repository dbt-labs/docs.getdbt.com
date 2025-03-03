---
title: Define properties
sidebar_label: Define properties
intro_text: "Learn how to define properties for your resources in a properties.yml file"
description: "Learn how to define properties for your resources in a properties.yml file"
pagination_previous: "reference/define-configs"
---

In dbt, you can use `properties.yml` files to define properties for resources. You can declare properties in `.yml` files, in the same directory as your resources. You can name these files `whatever_you_want.yml` and nest them arbitrarily in sub-folders within each directory. 

We highly recommend that you define properties in dedicated paths alongside the resources they're describing.

:::info

#### schema.yml files

Previous versions of the docs referred to these as `schema.yml` files — we've moved away from that terminology since the word `schema` is used to mean other things when talking about databases, and people often thought that you _had_ to name these files `schema.yml`.

Instead, we now refer to these files as `properties.yml` files. (Of course, you're still free to name your files `schema.yml`)
git pull
:::

### Which properties are _not_ also configs?

In dbt, you can define node configs in `properties.yml` files, in addition to `config()` blocks and `dbt_project.yml`. However, some special properties can only be defined in the `.yml` file and you cannot configure them using `config()` blocks or the `dbt_project.yml` file:

Certain properties are special, because:

- They have a unique Jinja rendering context
- They create new project resources
- They don't make sense as hierarchical configuration
- They're older properties that haven't yet been redefined as configs

These properties are:

- [`description`](/reference/resource-properties/description)
- [`tests`](/reference/resource-properties/data-tests)
- [`docs`](/reference/resource-configs/docs)
- [`columns`](/reference/resource-properties/columns)
- [`quote`](/reference/resource-properties/quote)
- [`source` properties](/reference/source-properties) (for example, `loaded_at_field`, `freshness`)
- [`exposure` properties](/reference/exposure-properties) (for example, `type`, `maturity`)
- [`macro` properties](/reference/macro-properties) (for example, `arguments`)

import Example from '/snippets/_configs-properties.md'  ;

<Example />
