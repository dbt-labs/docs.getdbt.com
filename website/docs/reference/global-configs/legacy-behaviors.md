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
1. **Introduction:** The flag is introduced, and the logic added within dbt to support both 'old' + 'new' behaviours.
2. **Maturity:** The default value of the flag is switched, from 'old' to 'new.'
3. **Deprecation:** The flag, having been marked for deprecation (with user warnings), is removed. The logic to support the ‘old’ behaviour is removed from dbt codebases.

These flags can _only_ be set in `dbt_project.yml`. They configure behaviors closely tied to project code. They should be defined in version control, and changed via pull/merge request, with the same testing and peer review.

## Behaviors

### `source_freshness_run_project_hooks`

If you have specific project [`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end) hooks that should not run before/after `source freshness` command, you can add a conditional check to those hooks:

<File name='dbt_project.yml'>

```yaml
on-run-start:
  - '{{ ... if flags.WHICH != 'freshness' }}'
```
</File>

You can configure the `dbt source freshness` command to include on-run-start / on-run-end hooks in v1.8 with a planned removal in v1.9. The default value is `True`.

In the meantime, you can set `source_freshness_run_project_hooks: False` to preserve the legacy behavior.
