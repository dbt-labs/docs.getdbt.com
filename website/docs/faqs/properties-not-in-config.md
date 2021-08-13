---
title: Can I add tests and descriptions in a config block?
---

In v0.21, dbt added the ability to define node configs in `.yml` files, in addition to `config()` blocks and `dbt_project.yml`. But the reverse isn't always true: there are some things in `.yml` files that can _only_ be defined there.

Certain properties are special, because:
- They have a unique Jinja rendering context
- They create new project resources
- They don't make sense as hierarchical configuration
- They're older properties that haven't yet been redefined as configs

These properties are:
- [`description`](https://docs.getdbt.com/reference/resource-properties/description)
- [`tests`](https://docs.getdbt.com/reference/resource-properties/tests)
- [`docs`](https://docs.getdbt.com/reference/resource-properties/docs)
- `columns`
- `source` properties (e.g. `loaded_at_field`, `freshness`)
- `exposure` properties (e.g. `type`, `maturity`)
- `macro` properties (`arguments`)
