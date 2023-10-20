---
title: "About profiles.yml context"
sidebar_label: "profiles.yml context"
id: "profiles-yml-context"
description: "Use these context methods to configure resources in `profiles.yml` file."
---

The following context methods are available when configuring
resources in the `profiles.yml` file.

**Available context methods:**
- [env_var](/reference/dbt-jinja-functions/env_var)
- [var](/reference/dbt-jinja-functions/var) (_Note: only variables defined with `--vars` are available_)

### Example usage

<File name="~/.dbt/profiles.yml">

```yml
jaffle_shop:
  target: dev
  outputs:
    dev:
      type: redshift
      host: "{{ env_var('DBT_HOST') }}"
      user: "{{ env_var('DBT_USER') }}"
      password: "{{ env_var('DBT_PASS') }}"
      port: 5439
      dbname: analytics
      schema: dbt_dbanin
      threads: 4
```

</File>
