## What you get with v2

:::note Feature availability
Feature availability may change as dbt v2 moves toward general availability. 
:::

You can get started right away with many dbt features, free forever! You can also try advanced features by running [`dbt login`](/reference/commands/login?version=2.0) to create a free <Constant name="dbt_platform" /> account for the best experience:

```shell
dbt login
```

Creating an account also unlocks additional free-tier access to dbt services. 

| Feature | Free forever <small>(for real!)</small>  | Requires login <br /> <small>to any <Constant name="dbt_platform" /> account, free or paid</small> |
|---------|:-----------------:|:----------------------:|
| dbt v1 workflows, except dbt docs v1 | ✅ | ✅ |
| Syntax error detection (Jinja, YAML, SQL) | ✅ | ✅ |
| dbt lint | ✅ | ✅ |
| dbt docs v2 (lite) | ✅ | ✅ |
| <Term id="lsp" /> (lite): go-to ref, source, and macro | ✅ | ✅ |
| Full <Term id="lsp" />: CTE, hover to see schema, and more | - | ✅ |
| SQL comprehension, type checking, and impact analysis | - | ✅ |
| Precise column-level lineage | - | ✅ |
| dbt docs v2 (full), including column-level lineage | - | ✅ |

For the best dbt experience, use the dbt VS Code extension. You can get started for free, and a free <Constant name="dbt_platform" /> account connects your editor to your account for <Constant name="dbt_platform" /> capabilities like the **Catalog** tab.

To learn more about VS Code-specific capabilities, refer to [dbt VS Code extension features](/docs/dbt-extension-features).
