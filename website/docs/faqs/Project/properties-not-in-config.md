---
title: Can I add tests and descriptions in a config block?
description: "Types of properties defined in config blocks"
sidebar_label: 'Types of properties defined in config blocks'
id: properties-not-in-config

---

In v0.21, dbt added the ability to define node configs in `.yml` files, in addition to `config()` blocks and `dbt_project.yml`. But the reverse isn't always true: there are some things in `.yml` files that can _only_ be defined there.

Certain properties are special, because:
- They have a unique Jinja rendering context
- They create new project resources
- They don't make sense as hierarchical configuration
- They're older properties that haven't yet been redefined as configs

These properties are:
- [`description`](resource-properties/description)
- [`tests`](resource-properties/tests)
- [`docs`](/reference/resource-configs/docs)
- `columns`
- [`quote`](resource-properties/quote)
- [`source` properties](source-properties) (e.g. `loaded_at_field`, `freshness`)
- [`exposure` properties](exposure-properties) (e.g. `type`, `maturity`)
- [`macro` properties](macro-properties) (e.g. `arguments`)
