---
title: "Package overrides for built-in materializations"
id: "require_explicit_package_overrides_for_builtin_materializations"
sidebar_label: "require explicit package overrides for builtin materializations"
---

:::caution Removed in <Constant name="core_v2" />

This flag was removed in <Constant name="core_v2" /> and in <Constant name="fusion" />. The new behavior is always enabled. If you're upgrading, remove this flag from your `dbt_project.yml`.

:::

| require_explicit_package_overrides_for_builtin_materializations | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2024.04 | 1.6.14, 1.7.14 |
| Matured (default → `true`) | 2024.06 | 1.8.0 |
| Removed | — | v2.0 |

Installed packages can no longer override built-in materializations without your explicit opt-in. A materialization defined in a package that matches the name of a built-in materialization is no longer included in the search and resolution order. Unlike macros, materializations don't use the `search_order` defined in the project `dispatch` config.

The built-in materializations are `'view'`, `'table'`, `'incremental'`, `'materialized_view'` for models, as well as `'test'`, `'unit'`, `'snapshot'`, `'seed'`, and `'clone'`.

You can still explicitly override built-in materializations by reimplementing the built-in materialization in your root project and wrapping the package implementation:

<File name='macros/materialization_view.sql'>

```sql
{% materialization view, snowflake %}
  {{ return(my_installed_package_name.materialization_view_snowflake()) }}
{% endmaterialization %}
```

</File>

In the future, we may extend the project-level [`dispatch` configuration](/reference/project-configs/dispatch-config) to support a list of authorized packages for overriding built-in materializations.
