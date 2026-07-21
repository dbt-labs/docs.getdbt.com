---
title: "Null-safe equality (equals macro)"
id: "enable_truthy_nulls_equals_macro"
sidebar_label: "enable truthy nulls equals macro"
---

| enable_truthy_nulls_equals_macro | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2025.02 | 1.9.0 |
| Matured (default → `true`) | — | — |
| Removed | — | — |

The `enable_truthy_nulls_equals_macro` flag is `false` by default. Setting it to `true` in your `dbt_project.yml` enables null-safe equality in the dbt [equals](/reference/dbt-jinja-functions/cross-database-macros#equals) macro, which is used in incremental and snapshot materializations.

By default, the `equals()` macro follows SQL's [three-valued logic (3VL)](https://modern-sql.com/concept/three-valued-logic), so `NULL = NULL` evaluates to `UNKNOWN` rather than `TRUE`.

When the `enable_truthy_nulls_equals_macro` flag is enabled, the `equals()` macro uses the semantics of the [`IS NOT DISTINCT FROM`](https://modern-sql.com/feature/is-distinct-from) operator with two `NULL` values treated as equal.

To enable the flag, add it under `flags` in `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
flags:
  enable_truthy_nulls_equals_macro: true
```

</File>
