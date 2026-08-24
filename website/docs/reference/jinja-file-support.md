---
title: "Jinja support by file type"
id: "jinja-file-support"
sidebar_label: "Jinja support by file type"
description: "Reference for which dbt file types support Jinja expressions, built-in dbt functions, and custom macros."
---

You can use Jinja across many dbt file types, but support is not the same everywhere. Some files accept full Jinja plus custom macros, while others only allow a limited set of built-in functions, and a few files do not support Jinja at all. Knowing which category a file falls into helps you avoid errors and choose the right place for dynamic logic.

This reference maps common file types to three categories of Jinja support:

- **Jinja expressions** (`{{ }}`, `{% %}`, and `{# #}`): Control flow, string output, and comments
- **Built-in dbt functions**: Context methods like [`env_var()`](/reference/dbt-jinja-functions/env_var), [`ref()`](/reference/dbt-jinja-functions/ref), and [`target`](/reference/dbt-jinja-functions/target)
- **Custom macros**: Calling project-defined macros like `{{ my_macro() }}`

For most file types, behavior is the same across versions. For examples and caveats on YAML edge cases, refer to [Examples and caveats](#examples-and-caveats). For guidance on writing Jinja in dbt, refer to [Jinja and macros](/docs/build/jinja-macros). For the full list of built-in functions available in a specific YAML file, refer to the per-file [dbt Jinja context](/reference/dbt-jinja-functions-context-variables) pages.

## Summary table

The table below summarizes Jinja support by file type.

Only `profiles.yml` and `packages.yml` support the `DBT_ENV_SECRET_` prefix for [`env_var()`](/reference/dbt-jinja-functions/env_var). Refer to [YAML tips](/docs/build/dbt-tips#yaml-tips).

<VersionBlock lastVersion="1.12">

| File type | Jinja expressions | Built-in dbt functions | Custom macros | Notes |
| --- | --- | --- | --- | --- |
| `.sql` models, analyses, singular tests | ✅ | ✅ | ✅ | Call macros here; define them in `macros/`. Hooks and operations apply too. |
| `.sql` generic tests (`{% test %}`) | ✅ | ✅ | ✅ | Define `{% test %}` in `tests/generic/` or `macros/`; you can also call other macros from the test. |
| `.sql` snapshots (legacy `{% snapshot %}`) | ✅ | ✅ | ✅ | Prefer [YAML snapshots](/docs/build/snapshots). For the older Jinja block syntax, refer to [Legacy snapshot configurations](/reference/resource-configs/snapshots-jinja-legacy). |
| `.sql` materializations (`{% materialization %}`) | ✅ | ✅ | ✅ | Define `{% materialization %}` in `macros/` |
| `.md` docs blocks (`{% docs %}`) | ✅ | ❌ | ❌ | Pure Jinja only; use [`doc()`](/reference/dbt-jinja-functions/doc) to reference blocks |
| `dbt_project.yml` | ✅ | Limited | ❌ | For available functions and variables, refer to [dbt_project.yml context](/reference/dbt-jinja-functions/dbt-project-yml-context) |
| `profiles.yml` | ✅ | Limited | ❌ | For available functions and variables, refer to [profiles.yml context](/reference/dbt-jinja-functions/profiles-yml-context) |
| `packages.yml` | ✅ | Limited | ❌ | For available functions and variables, refer to [packages.yml context](/reference/dbt-jinja-functions/packages.yml%20context) |
| `properties.yml` / `schema.yml` | ✅ | Limited | ❌ | For available functions and variables, refer to [properties.yml context](/reference/dbt-jinja-functions/dbt-properties-yml-context). `ref()` and `source()` are not available. |
| `selectors.yml` | ✅ | Limited | ❌ | Supports `env_var()`, `target`, `as_bool()`, and related context. Refer to [YAML selectors](/reference/node-selection/yaml-selectors) for selector syntax. |
| `dependencies.yml` | ❌ | ❌ | ❌ | Not Jinja-rendered. Use `packages.yml` for conditional logic. Refer to [Examples and caveats](#examples-and-caveats). |
| `.py` Python models | ❌ | ❌ | ❌ | Use the Python `dbt` class API instead |
| `.csv` seeds | ❌ | ❌ | ❌ | Data files only |
| Unit test SQL fixtures | ❌ | ❌ | ❌ | Unit test fixtures do not support Jinja. For fixture formats, refer to [data formats](/reference/resource-properties/data-formats). |
| `.sql.j2` / `.md.j2` (optional) | Same as `.sql` / `.md` | Same as `.sql` / `.md` | Same as `.sql` / `.md` | Beta in v1.12. Refer to [`allow_jinja_file_extensions`](/reference/global-configs/behavior-flags/allow_jinja_file_extensions) |

</VersionBlock>

<VersionBlock firstVersion="2.0">

| File type | Jinja expressions | Built-in dbt functions | Custom macros | Notes |
| --- | --- | --- | --- | --- |
| `.sql` models, analyses, singular tests | ✅ | ✅ | ✅ | Call macros here; define them in `macros/`. Hooks and operations apply too. |
| `.sql` generic tests (`{% test %}`) | ✅ | ✅ | ✅ | Define `{% test %}` in `tests/generic/` or `macros/`; you can also call other macros from the test. |
| `.sql` snapshots (legacy `{% snapshot %}`) | ✅ | ✅ | ✅ | Prefer [YAML snapshots](/docs/build/snapshots). For the older Jinja block syntax, refer to [Legacy snapshot configurations](/reference/resource-configs/snapshots-jinja-legacy). |
| `.sql` materializations (`{% materialization %}`) | ✅ | ✅ | ✅ | Define `{% materialization %}` in `macros/` |
| `.md` docs blocks (`{% docs %}`) | ✅ | ❌ | ❌ | Pure Jinja only; use [`doc()`](/reference/dbt-jinja-functions/doc) to reference blocks |
| `dbt_project.yml` | ✅ | Limited | ✅ | Custom macros are supported in hooks. For available functions and variables, refer to [dbt_project.yml context](/reference/dbt-jinja-functions/dbt-project-yml-context). Refer to [Examples and caveats](#examples-and-caveats). |
| `profiles.yml` | ✅ | Limited | ❌ | For available functions and variables, refer to [profiles.yml context](/reference/dbt-jinja-functions/profiles-yml-context) |
| `packages.yml` | ✅ | Limited | ❌ | For available functions and variables, refer to [packages.yml context](/reference/dbt-jinja-functions/packages.yml%20context) |
| `properties.yml` / `schema.yml` | ✅ | Limited | ✅ | Custom macros are supported in YAML values. For available functions and variables, refer to [properties.yml context](/reference/dbt-jinja-functions/dbt-properties-yml-context). `ref()` and `source()` are not available. Refer to [Examples and caveats](#examples-and-caveats). |
| `selectors.yml` | ✅ | Limited | ✅ | Custom macros are supported. Also supports `env_var()`, `target`, `as_bool()`, and related context. Refer to [YAML selectors](/reference/node-selection/yaml-selectors) and [Examples and caveats](#examples-and-caveats). |
| `dependencies.yml` | ✅ | Limited | ❌ | Jinja is supported (for example `env_var()` in a git URL). Prefer `packages.yml` if the project must also run on <Constant name="core" />. Refer to [Examples and caveats](#examples-and-caveats). |
| `.py` Python models | ❌ | ❌ | ❌ | Use the Python `dbt` class API instead |
| `.csv` seeds | ❌ | ❌ | ❌ | Data files only |
| Unit test SQL fixtures | ❌ | ❌ | ❌ | Unit test fixtures do not support Jinja. For fixture formats, refer to [data formats](/reference/resource-properties/data-formats). |
| `.sql.j2` / `.md.j2` (optional) | Same as `.sql` / `.md` | Same as `.sql` / `.md` | Same as `.sql` / `.md` | Beta in v1.12. Refer to [`allow_jinja_file_extensions`](/reference/global-configs/behavior-flags/allow_jinja_file_extensions) |

</VersionBlock>

<br />

**Table key**

- **Limited:** Jinja expressions work, but only a subset of built-in dbt functions is available (typically [`env_var()`](/reference/dbt-jinja-functions/env_var), [`var()`](/reference/dbt-jinja-functions/var), and [`target`](/reference/dbt-jinja-functions/target)). The exact list depends on the file type; refer to the linked context page in Notes. YAML files do not support [`ref()`](/reference/dbt-jinja-functions/ref) or [`source()`](/reference/dbt-jinja-functions/source) in `properties.yml` / `schema.yml`. For examples and caveats on YAML edge cases, refer to [Examples and caveats](#examples-and-caveats).
- **Same as `.sql` / `.md`:** Optional `.j2` file extensions use the same Jinja support as the matching non-`.j2` file type. For example, `.sql.j2` matches `.sql`, and `.md.j2` matches `.md`.

## Where to define custom Jinja blocks

You can call a custom macro (for example `{{ my_macro() }}`) from many `.sql` files. To create a new macro, test, materialization, or other custom Jinja block, you must define it in a specific file type and directory. Use the table below to find where each block belongs.

| Block | File type | Location | Notes |
| --- | --- | --- | --- |
| `{% macro %}` | `.sql` | `macros/` | Call from models, tests, hooks, and more |
| `{% test %}` | `.sql` | `tests/generic/` or `macros/` | Define the generic test here; you can also call other macros inside it |
| `{% materialization %}` | `.sql` | `macros/` | Define custom materializations here |
| `{% snapshot %}` | `.sql` | `snapshots/` (legacy) | Prefer [YAML snapshots](/docs/build/snapshots). Refer to [Legacy snapshot configurations](/reference/resource-configs/snapshots-jinja-legacy) for the older syntax. |
| `{% docs %}` | `.md` | Any resource path or `docs/` | Pure Jinja only; no custom macro calls |

## Common exceptions

Some config fields are stricter than the file-level summary table. The following cases are common.

### `vars:` block in `dbt_project.yml`

Values in the top-level `vars:` block in `dbt_project.yml` are interpreted literally, not as Jinja templates. To pass dynamic values at runtime, use `--vars` on the command line or define Jinja in other configuration keys. Refer to [Project variables](/docs/build/project-variables).

### `sql_header` and static SQL configs

Some config fields expect static SQL only and do not support Jinja. Check the relevant [resource config](/reference/resource-configs) page for the field you are configuring.

## Examples and caveats

Use this section for examples, when-to-use guidance, and caveats that don't fit in the [summary table](#summary-table). Support status itself is in the table.

<VersionBlock firstVersion="2.0">

<Expandable alt_header="Custom macros in schema.yml / properties.yml">

**Example:**

```yaml
models:
  - name: customers
    description: "{{ test_macro() }}"
```

**When to use it:** When you want reusable text or logic in resource properties instead of hardcoding the same string in multiple YAML files.

**Caveat:** If this project must also run on <Constant name="core" />, don't rely on custom macros in these YAML files. Prefer static text or built-in context functions for portable projects.

**Learn more:** [properties.yml context](/reference/dbt-jinja-functions/dbt-properties-yml-context)

</Expandable>

<Expandable alt_header="Custom macros in selectors.yml">

**Example:**

```yaml
selectors:
  - name: nightly_models
    description: "{{ test_macro() }}"
    definition:
      union:
        - method: tag
          value: nightly
```

**When to use it:** When selector metadata or values need shared logic from your project's macros.

**Caveat:** If this project must also run on <Constant name="core" />, don't rely on custom macros in `selectors.yml`. Prefer built-in context methods such as `env_var()` or `target` for portable projects.

**Learn more:** [YAML selectors](/reference/node-selection/yaml-selectors)

</Expandable>

<Expandable alt_header="Custom macros in dbt_project.yml hooks">

**Example:**

```yaml
models:
  +pre-hook: "{{ test_macro() }}"
```

**When to use it:** When hook SQL should reuse macro logic instead of duplicating statements in `dbt_project.yml`.

**Caveat:** If this project must also run on <Constant name="core" />, don't rely on custom macros in project hooks. Prefer portable hook patterns for shared projects.

**Learn more:** [dbt_project.yml context](/reference/dbt-jinja-functions/dbt-project-yml-context)

</Expandable>

<Expandable alt_header="Jinja in dependencies.yml">

**Example:**

```yaml
packages:
  - git: "https://github.com/{{ env_var('DBT_GIT_ORG') }}/awesome_repo.git"
```

**When to use it:** When package or project dependency specs need environment-specific values and you want them in `dependencies.yml` rather than a separate `packages.yml`.

**Caveat:** If this project must also run on <Constant name="core" />, put Jinja-based package specs in `packages.yml` instead so the project stays portable.

**Learn more:** [Packages use cases](/docs/build/packages#use-cases)

</Expandable>

</VersionBlock>

<VersionBlock lastVersion="1.12">

<Expandable alt_header="Custom macros in YAML files">

**Example:** This fails with an undefined macro error:

```yaml
models:
  - name: customers
    description: "{{ test_macro() }}"
```

**When it matters:** Move that logic into a `.sql` model, test, or macro call site, or use the built-in functions listed for that file's context page.

**Caveat:** Custom macros in these YAML contexts aren't available on <Constant name="core" />.

**Learn more:** [properties.yml context](/reference/dbt-jinja-functions/dbt-properties-yml-context)

</Expandable>

<Expandable alt_header="Jinja in dependencies.yml">

**Example:** A git URL with `env_var()` in `dependencies.yml` stays as a literal `{{ ... }}` string on <Constant name="core" />. Put Jinja-based package specs in `packages.yml` instead:

```yaml
packages:
  - git: "https://{{ env_var('DBT_ENV_SECRET_GIT_CREDENTIAL') }}@github.com/dbt-labs/awesome_repo.git"
```

**When to use packages.yml instead:** When you need conditional package logic, environment variables in git URLs, or the [Git token method](/docs/build/packages#git-token-method).

**Caveat:** If you put Jinja in `dependencies.yml` on <Constant name="core" />, dbt passes the unrendered string through (for example to git), which typically causes the install to fail.

**Learn more:** [Packages use cases](/docs/build/packages#use-cases)

</Expandable>

</VersionBlock>

## Related docs

- [Jinja and macros](/docs/build/jinja-macros)
- [YAML tips](/docs/build/dbt-tips#yaml-tips)
- [dbt Jinja functions and context variables](/reference/dbt-jinja-functions-context-variables)
- [properties.yml context](/reference/dbt-jinja-functions/dbt-properties-yml-context)
- [dbt_project.yml context](/reference/dbt-jinja-functions/dbt-project-yml-context)
- [profiles.yml context](/reference/dbt-jinja-functions/profiles-yml-context)
- [packages.yml context](/reference/dbt-jinja-functions/packages.yml%20context)
