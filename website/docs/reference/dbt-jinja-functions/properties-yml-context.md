---
title: " About properties.yml context"
sidebar_label: "properties.yml context"
id: "dbt-properties-yml-context"
description: "The context methods and variables available when configuring resources in a properties.yml file."
---

The following context methods and variables are available when configuring
resources in a `properties.yml` file.

**Available context methods:**
- [env_var](/reference/dbt-jinja-functions/env_var)
- [var](/reference/dbt-jinja-functions/var)

**Available context variables:**
- [target](/reference/dbt-jinja-functions/target)
- [builtins](/reference/dbt-jinja-functions/builtins)
- [dbt_version](/reference/dbt-jinja-functions/dbt_version)

### Example configuration

<File name='properties.yml'>

```yml
# Configure this model to be materialized as a view
# in development and a table in production/CI contexts

models:
  - name: dim_customers
    config:
      materialized: "{{ 'view' if target.name == 'dev' else 'table' }}"
```

</File>
