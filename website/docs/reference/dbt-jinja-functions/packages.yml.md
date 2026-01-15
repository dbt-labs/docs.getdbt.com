---
title: "About packages.yml context"
sidebar_label: "packages.yml context"
id: "packages.yml context"
description: "Use these context methods to configure dependencies in the packages.yml file."
---

The following context methods and variables are available when configuring a `packages.yml` file. 

**Available context methods:**
- [env_var](/reference/dbt-jinja-functions/env_var)
    - You can use `env_var()` in any dbt YAML file that supports Jinja, but `packages.yml` treat environment variables as [secrets](/docs/build/dbt-tips#yaml-tips) (using the `DBT_ENV_SECRET_` prefix).
- [var](/reference/dbt-jinja-functions/var) (Note: only variables defined with `--vars` are available. Refer to [YAML tips](/docs/build/dbt-tips#yaml-tips) for more information)

**Available context variables:**
- [builtins](/reference/dbt-jinja-functions/builtins)
- [dbt_version](/reference/dbt-jinja-functions/dbt_version)
- [target](/reference/dbt-jinja-functions/target)

## Related docs

- [Packages](/docs/build/packages)