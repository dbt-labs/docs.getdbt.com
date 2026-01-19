---
title: "About packages.yml context"
sidebar_label: "packages.yml context"
id: "packages.yml context"
description: "Use these context methods to configure dependencies in the packages.yml file."
---

The following context methods and variables are available when configuring a `packages.yml` file. 

**Available context methods:**
- [env_var](/reference/dbt-jinja-functions/env_var)
    - Use `env_var()` in any dbt YAML file that supports Jinja. Only `packages.yml` and `profiles.yml` support environment variables for [secure values](/docs/build/dbt-tips#yaml-tips) (using the `DBT_ENV_SECRET_` prefix).
```
"{{ env_var('MY_ENV_VAR') }}"
```
- [var](/reference/dbt-jinja-functions/var) (Note: only variables defined with `--vars` are available. Refer to [YAML tips](/docs/build/dbt-tips#yaml-tips) for more information)

**Available context variables:**
- [builtins](/reference/dbt-jinja-functions/builtins)

```
packages:
  - package: dbt-labs/dbt_utils
    version: "{% if builtins is defined %}0.14.0{% else %}0.13.1{% endif %}"

```

- [dbt_version](/reference/dbt-jinja-functions/dbt_version)

```
packages:
  - package: dbt-labs/dbt_utils
    version: "{% if dbt_version is defined %}0.14.0{% else %}0.13.1{% endif %}"

```

- [target](/reference/dbt-jinja-functions/target)

```

packages:
  - package: dbt-labs/dbt_utils
    version: "{% if env_var('DBT_ENV_NAME') == 'prod' %}0.14.0{% else %}0.13.1{% endif %}"

```

## Related docs

- [Packages](/docs/build/packages)