---
title: "dbt_project.yml Context"
id: "dbt-project-yml-context"
---

<Changelog>

The compilation context of the `dbt_project.yml` file is well-defined as
of dbt v0.16.0

</Changelog>

The following context variables and methods are available when configuring
resources in the `dbt_project.yml` file. This applies to the `models:`, `seeds:`,
and `snapshots:` keys in the `dbt_project.yml` file.

**Available context variables:**
- [target](target)
- [env_var](env_var)
- [vars](var) (_Note: only variables defined with `--vars` are available_)
- [builtins](builtins)
- [dbt_version](dbt_version)


### Example configuration

<File name='dbt_project.yml'>

```yml
name: my_project
version: 1.0.0

# Configure the models in models/facts/ to be materialized as views
# in development and tables in production/CI contexts

models:
  my_project:
    facts:
      +materialized: "{{ 'view' if target.name == 'dev' else 'table' }}"
```

</File>
