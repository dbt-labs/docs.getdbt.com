---
title: Can I use environment variables in my profile?
description: "Use env_var in your profile to avoid storing credentials in version control."
sidebar_label: 'Use env_var in your profile'
id: profile-env-vars
---

Yes! Any field in `profiles.yml` can reference an environment variable using the [`env_var()` Jinja function](/reference/dbt-jinja-functions/env_var):

```yaml
my_project:
  target: dev
  outputs:
    dev:
      type: postgres
      host: localhost
      user: "{{ env_var('DBT_DEV_USER') }}"
      password: "{{ env_var('DBT_DEV_PASSWORD') }}"
      schema: "dbt_{{ env_var('DBT_USERNAME') }}"
      port: 5432
      threads: 4
```

This keeps sensitive credentials out of version control. Set the variables in your shell before running dbt:

```bash
export DBT_DEV_USER=alice
export DBT_DEV_PASSWORD=my_password
export DBT_USERNAME=alice
```

You can supply a default value as the second argument to avoid compilation errors when a variable isn't set:

```yaml
schema: "dbt_{{ env_var('DBT_USERNAME', 'default') }}"
```

For a full walkthrough of how to configure separate dev, CI, and prod environments using env vars, see [dbt Core environments](/docs/local/dbt-core-environments).
