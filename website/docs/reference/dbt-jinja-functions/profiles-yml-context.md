---
title: "profiles.yml Context"
id: "profiles-yml-context"
description: "Use these context variables to configure resources in `profiles.yml` file."
---

The following context variables and methods are available when configuring
resources in the `profiles.yml` file.

**Available context variables:**
- [env_var](env_var)
- [vars](var) (_Note: only variables defined with `--vars` are available_)

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
