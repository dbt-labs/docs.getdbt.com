---
title: "Jinja support by file type"
id: "jinja-file-support"
sidebar_label: "Jinja support by file type"
description: "Reference for which dbt file types support Jinja expressions, built-in dbt functions, and custom macros."
---

Use this page to determine whether you can use Jinja in a given file type. dbt supports Jinja in many file types, but the available features differ by file. This page maps common file types to three categories of Jinja support:

- **Jinja expressions** (`{{ }}`, `{% %}`, and `{# #}`): Control flow, string output, and comments
- **Built-in dbt functions**: Context methods like [`env_var()`](/reference/dbt-jinja-functions/env_var), [`ref()`](/reference/dbt-jinja-functions/ref), and [`target`](/reference/dbt-jinja-functions/target)
- **Custom macros**: Calling project-defined macros like `{{ my_macro() }}`

For guidance on writing Jinja in dbt, refer to [Jinja and macros](/docs/build/jinja-macros). For the full list of built-in functions available in a specific YAML file, refer to the per-file [dbt Jinja context](/reference/dbt-jinja-functions-context-variables) pages.

## Summary table

The table below describes Jinja support in dbt. For most file types, behavior is the same across engines. For YAML edge cases that differ by engine, refer to [Engine-specific notes](#engine-specific-notes).

How to read the table:

- **Yes**: Supported for that category
- **No**: Not supported for that category
- **Limited**: Jinja expressions work, but only a subset of built-in dbt functions is available (typically [`env_var()`](/reference/dbt-jinja-functions/env_var), [`var()`](/reference/dbt-jinja-functions/var), and [`target`](/reference/dbt-jinja-functions/target)). The exact list depends on the file type; refer to the linked context page in Notes. YAML files do not support [`ref()`](/reference/dbt-jinja-functions/ref) or [`source()`](/reference/dbt-jinja-functions/source) in `properties.yml` / `schema.yml`. Custom macro support in YAML can differ by engine; refer to [Engine-specific notes](#engine-specific-notes).
- **Same as `.sql` or `.md`**: Optional Jinja file extensions use the same support as the underlying file type

Only `profiles.yml` and `packages.yml` support the `DBT_ENV_SECRET_` prefix for [`env_var()`](/reference/dbt-jinja-functions/env_var). Refer to [YAML tips](/docs/build/dbt-tips#yaml-tips).

| File type | Jinja expressions | Built-in dbt functions | Custom macros | Notes |
| --- | --- | --- | --- | --- |
| `.sql` models, analyses, singular tests | Yes | Yes | Yes | Call macros here; define them in `macros/`. Hooks and operations apply too. |
| `.sql` generic tests (`{% test %}`) | Yes | Yes | Yes | Define `{% test %}` in `tests/generic/` or `macros/`; you can also call other macros from the test. |
| `.sql` snapshots (legacy `{% snapshot %}`) | Yes | Yes | Yes | Prefer [YAML snapshots](/docs/build/snapshots). For the older Jinja block syntax, refer to [Legacy snapshot configurations](/reference/resource-configs/snapshots-jinja-legacy). |
| `.sql` materializations (`{% materialization %}`) | Yes | Yes | Yes | Define `{% materialization %}` in `macros/` |
| `.md` docs blocks (`{% docs %}`) | Yes | No | No | Pure Jinja only; use [`doc()`](/reference/dbt-jinja-functions/doc) to reference blocks |
| `dbt_project.yml` | Yes | Limited | No | For available functions and variables, refer to [dbt_project.yml context](/reference/dbt-jinja-functions/dbt-project-yml-context) |
| `profiles.yml` | Yes | Limited | No | For available functions and variables, refer to [profiles.yml context](/reference/dbt-jinja-functions/profiles-yml-context) |
| `packages.yml` | Yes | Limited | No | For available functions and variables, refer to [packages.yml context](/reference/dbt-jinja-functions/packages.yml) |
| `properties.yml` / `schema.yml` | Yes | Limited | No | For available functions and variables, refer to [properties.yml context](/reference/dbt-jinja-functions/properties-yml-context). `ref()` and `source()` are not available. |
| `selectors.yml` | Yes | Limited | No | Supports `env_var()`, `target`, `as_bool()`, and related context. Refer to [YAML selectors](/reference/node-selection/yaml-selectors) for selector syntax. |
| `dependencies.yml` | No* | No* | No | *Differs by engine — refer to [Engine-specific notes](#engine-specific-notes). Use `packages.yml` for conditional logic. |
| `.py` Python models | No | No | No | Use the Python `dbt` class API instead |
| `.csv` seeds | No | No | No | Data files only |
| Unit test SQL fixtures | No | No | No | Unit test fixtures do not support Jinja. For fixture formats, refer to [data formats](/reference/resource-properties/data-formats). |
| `.sql.j2` / `.md.j2` (optional) | Same as `.sql` or `.md` | Same as `.sql` or `.md` | Same as `.sql` or `.md` | Beta in v1.12; Jinja support matches the file type without the Jinja suffix. Refer to [`allow_jinja_file_extensions`](/reference/global-configs/behavior-flags/allow_jinja_file_extensions) |

## Where to define custom Jinja blocks

You can _call_ custom macros from many `.sql` files. You _define_ custom Jinja blocks only in specific file types and directories:

| Block | File type | Location | Notes |
| --- | --- | --- | --- |
| `{% macro %}` | `.sql` | `macros/` | Call from models, tests, hooks, and more |
| `{% test %}` | `.sql` | `tests/generic/` or `macros/` | Define the generic test here; you can also call other macros inside it |
| `{% materialization %}` | `.sql` | `macros/` | Define custom materializations here |
| `{% snapshot %}` | `.sql` | `snapshots/` (legacy) | Prefer [YAML snapshots](/docs/build/snapshots). Refer to [Legacy snapshot configurations](/reference/resource-configs/snapshots-jinja-legacy) for the older syntax. |
| `{% docs %}` | `.md` | Any resource path or `docs/` | Pure Jinja only; no custom macro calls |

## Common exceptions

Some file types and config fields have more limited Jinja support than the summary table suggests. The following sections call out the most common cases.

### `dependencies.yml`

<VersionBlock lastVersion="1.12">

The `dependencies.yml` file is not Jinja-rendered. If you need conditional package logic, use `packages.yml` instead. Refer to [Packages use cases](/docs/build/packages#use-cases) for when to use each file.

</VersionBlock>

<VersionBlock firstVersion="2.0">

You can use Jinja in `dependencies.yml` with the <Constant name="fusion_engine" />. If you share a project with <Constant name="core" />, prefer `packages.yml` for package specs that need Jinja so the project stays portable. Refer to [Packages use cases](/docs/build/packages#use-cases) and [Engine-specific notes](#engine-specific-notes).

</VersionBlock>

### `vars:` block in `dbt_project.yml`

Values in the top-level `vars:` block in `dbt_project.yml` are interpreted literally, not as Jinja templates. To pass dynamic values at runtime, use `--vars` on the command line or define Jinja in other configuration keys. Refer to [Project variables](/docs/build/project-variables).

### Docs blocks

[Docs blocks](/docs/build/documentation#using-docs-blocks) support pure Jinja (for example, `{% set %}`), but not built-in dbt functions or custom macros.

### `sql_header` and static SQL configs

Some config fields expect static SQL only and do not support Jinja. Check the relevant [resource config](/reference/resource-configs) page for the field you are configuring.

### Python models

[Python models](/docs/build/python-models) use the Python `dbt` class API instead of Jinja templating.

## Engine-specific notes

<VersionBlock firstVersion="2.0">

In addition to the [summary table](#summary-table), the <Constant name="fusion_engine" /> also supports:

- Custom macros in `schema.yml` / `properties.yml`
- Custom macros in `selectors.yml`
- Custom macros in `dbt_project.yml` hooks
- Jinja in `dependencies.yml`

Test these patterns in your project before using them in production. If you share a project with <Constant name="core" />, prefer patterns from the summary table so the project stays portable.

</VersionBlock>

<VersionBlock lastVersion="1.12">

The [summary table](#summary-table) matches <Constant name="core" /> behavior. In particular:

- Custom macros are not supported in YAML files (`schema.yml` / `properties.yml`, `selectors.yml`, `profiles.yml`, or `dbt_project.yml` hooks)
- `dependencies.yml` is not Jinja-rendered; use `packages.yml` for conditional package logic

Refer to [Packages use cases](/docs/build/packages#use-cases) for when to use `packages.yml` or `dependencies.yml`.

</VersionBlock>

## Related docs

- [Jinja and macros](/docs/build/jinja-macros)
- [YAML tips](/docs/build/dbt-tips#yaml-tips)
- [dbt Jinja functions and context variables](/reference/dbt-jinja-functions-context-variables)
- [properties.yml context](/reference/dbt-jinja-functions/properties-yml-context)
- [dbt_project.yml context](/reference/dbt-jinja-functions/dbt-project-yml-context)
- [profiles.yml context](/reference/dbt-jinja-functions/profiles-yml-context)
- [packages.yml context](/reference/dbt-jinja-functions/packages.yml)
