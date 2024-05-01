---
title: "Legacy behaviors"
id: "legacy-behaviors"
sidebar: "Legacy behaviors"
---

Most flags exist to configure runtime behaviors with multiple valid choices. The right choice may vary based on the environment, user preference, or the specific invocation.

Another category of flags provides existing projects with a migration window for runtime behaviors that are changing in newer releases of dbt. These flags help us achieve a balance between these goals, which can otherwise be in tension, by:
- Providing a better, more sensible, and more consistent default behavior for new users/projects.
- Providing a migration window for existing users/projects &mdash; nothing changes overnight without warning.
- Providing maintainability of dbt software. Every fork in behavior requires additional testing & cognitive overhead that slows future development. These flags exist to facilitate migration from "current" to "better," not to stick around forever.

These flags go through three phases of development:
1. **Introduction (disabled by default):** dbt adds logic to support both 'old' + 'new' behaviors. The 'new' behavior is gated behind a flag, disabled by default, preserving the old behavior.
2. **Maturity (enabled by default):** The default value of the flag is switched, from `false` to `true`, enabling the new behavior by default. Users can preserve the 'old' behavior and opt out of the 'new' behavior by setting the flag to `false` in their projects. They may see deprecation warnings when they do so.
3. **Removal (generally enabled):** After marking the flag for deprecation, we remove it along with the 'old' behavior it supported from the dbt codebases. We aim to support most flags indefinitely, but we're not committed to supporting them forever. If we choose to remove a flag, we'll offer significant advance notice.

## Behavior change flags

These flags _must_ be set in the `flags` dictionary in `dbt_project.yml`. They configure behaviors closely tied to project code, which means they should be defined in version control and modified through pull or merge requests, with the same testing and peer review.

The following example displays the current flags and their current default values in the latest dbt Cloud and dbt Core versions. To opt out of a specific behavior change, set the values of the flag to `False` in `dbt_project.yml`. You'll continue to see warnings for legacy behaviors that you have opted out of explicitly until you either resolve them (switch the flag to `True`) or choose to silence the warnings.

<File name='dbt_project.yml'>

```yml
flags:
  require_explicit_package_overrides_for_builtin_materializations: False
  require_model_names_without_spaces: False
  source_freshness_run_project_hooks: False
```

</File>

| Flag                                                            | dbt Cloud: Intro | dbt Cloud: Maturity | dbt Core: Intro | dbt Core: Maturity | 
|-----------------------------------------------------------------|------------------|---------------------|-----------------|--------------------|
| require_explicit_package_overrides_for_builtin_materializations | 2024.04.141      | 2024.05.xxx         | 1.6.14, 1.7.14    | 1.8.0             |
| require_resource_names_without_spaces                           | 2024.05.xxx      | 2024.06.xxx         | 1.8.0           | 1.9.0             |
| source_freshness_run_project_hooks                              | 2024.03.61       | 2024.06.xxx         | 1.8.0           | 1.9.0             |

<sup>1</sup>dbt Cloud - "Keep on latest version"

### `require_explicit_package_overrides_for_builtin_materializations`

We have deprecated the behavior whereby installed packages could override built-in materializations without explicit opt-in from the end user. When this flag is set to `True`, a materialization defined in a package that matches the name of a built-in materialization will no longer be included in the search and resolution order. Unlike for macros, materializations do not use the `search_order` defined in the project `dispatch` config.

The built-in materializations are `'view'`, `'table'`, `'incremental'`, `'materialized_view'` for models as well as `'test'`, `'unit'`, `'snapshot'`, `'seed'`, and `'clone'`.

You can still explicitly override built-in materializations, in favor of a materialization defined in a package, by reimplementing the built-in materialization in your root project and wrapping the package implementation.

<File name='macros/materialization_view.sql'>

```sql
{% materialization view, snowflake %}
  {{ return(my_installed_package_name.materialization_view_snowflake()) }}
{% endmaterialization %}
```

</File>

In the future, we may extend the project-level `dispatch` configuration [TODO: link] to support a list of authorized packages for overriding built-in materialization.

<VersionBlock lastVersion="1.7">

The flags below have been introduced in a future version of dbt Core. If you're still using an older version, then you have the legacy behavior (when each flag is `False`).

</VersionBlock>

### `require_resource_names_without_spaces`

The names of dbt resources (models, sources, etc) should contain letters, numbers, and underscores. We highly discourage the use of other characters, especially spaces. To that end, we have deprecated support for spaces in resource names. When this flag is set to the `True`, dbt will raise an exception (instead of a deprecation warning) if it detects a space in a resource name.

<File name='models/model name with spaces.sql'>

```sql
-- This model file should be renamed to model_name_with_underscores.sql
```

</File>

### `source_freshness_run_project_hooks`

This configures the `dbt source freshness` command to include "project hooks" (`on-run-start` / `on-run-end`, TODO add link) as part of their execution.

If you have specific project [`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end) hooks that should not run before/after `source freshness` command, you can add a conditional check to those hooks:

<File name='dbt_project.yml'>

```yaml
on-run-start:
  - '{{ ... if flags.WHICH != 'freshness' }}'
```
</File>
