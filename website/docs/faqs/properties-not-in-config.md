---
title: Can I add tests and descriptions in a config block?
---

No — properties (including tests and descriptions) must be declared in separate `.yml` files, rather than in `config` blocks.


Configurations:
- tell dbt _how_ to build something in your warehouse (for example, whether a model should be a table or view, or which SQL to use when running a snapshot)
- are defined in your [`dbt_project.yml` file](dbt_project.yml) or a `config` block in a `.sql` file.

Properties:
- are used to declare things _about_ your dbt project or data warehouse.
- are defined in separate `.yml` files

For now, these things are separate to each other, but in the future, we may choose to co-locate them in the same file.
