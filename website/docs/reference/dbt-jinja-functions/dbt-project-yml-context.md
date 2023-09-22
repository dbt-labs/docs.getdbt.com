---
title: " About dbt_project.yml context"
sidebar_label: "dbt_project.yml context"
id: "dbt-project-yml-context"
description: "The context variables and methods are available when configuring resources in the dbt_project.yml file."
---

The following context variables and methods are available when configuring
resources in the `dbt_project.yml` file. This applies to the `models:`, `seeds:`,
and `snapshots:` keys in the `dbt_project.yml` file.

**Available context variables:**
- [target](/reference/dbt-jinja-functions/target)
- [builtins](/reference/dbt-jinja-functions/builtins)
- [dbt_version](/reference/dbt-jinja-functions/dbt_version)

**Available context methods:**
- [env_var](/reference/dbt-jinja-functions/env_var)
- [var](/reference/dbt-jinja-functions/var) (_Note: only variables defined with `--vars` are available_)


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
