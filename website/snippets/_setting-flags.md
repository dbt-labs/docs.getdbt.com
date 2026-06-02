There are multiple ways of setting flags, which depend on the use case:
- **[CLI options](/reference/global-configs/command-line-options):** Define behavior specific to _this invocation_. Supported for all dbt commands.
- **[Environment variables](/reference/global-configs/environment-variable-configs):** Define different behavior in different runtime environments (development vs. production vs. [continuous integration](/docs/deploy/continuous-integration)), or different behavior for different users in development (based on personal preferences).
- **[Project-level `flags` in `dbt_project.yml`](/reference/global-configs/project-flags):** Define version-controlled defaults for everyone running this project. Also, opt in or out of [behavior changes](/reference/global-configs/behavior-changes) to manage your migration off legacy functionality.
- **[User settings (`~/.dbt/user_settings.yml`)](/reference/global-configs/user-settings):** Define personal preferences that apply across all projects on your machine. Written automatically by `dbt login`.

The most specific setting "wins." CLI options take the highest precedence, followed by environment variables, then `dbt_project.yml`, and finally `user_settings.yml`. If you set the flag in none of those places, it will use the default value defined within dbt.

Most flags can be set in all three places:
```yaml
# dbt_project.yml
flags:
  # set default for running this project -- anywhere, anytime, by anyone
  fail_fast: true
```
<VersionBlock lastVersion="1.10">

```bash
# set this environment variable to 'True' (bash syntax)
export DBT_FAIL_FAST=1
dbt run
```

</VersionBlock>

<VersionBlock firstVersion="1.11">

```bash
# set this environment variable to 'True' (bash syntax)
export DBT_ENGINE_FAIL_FAST=1
dbt run
```

</VersionBlock>
```bash
dbt run --fail-fast # set to True for this specific invocation
dbt run --no-fail-fast # set to False
```

There are two categories of exceptions:
1. **Flags setting file paths:** Flags for file paths that are relevant to runtime execution (for example, `--log-path` or `--state`) cannot be set in `dbt_project.yml`. To override defaults, pass CLI options or set environment variables (<VersionBlock lastVersion="1.10">`DBT_LOG_PATH` and `DBT_STATE`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_LOG_PATH` and `DBT_ENGINE_STATE`</VersionBlock>). Flags that tell dbt where to find project resources (for example, `model-paths`) are set in `dbt_project.yml`, but as a top-level key, outside the `flags` dictionary; these configs are expected to be fully static and never vary based on the command or execution environment.
2. **Opt-in flags:** Flags opting in or out of [behavior changes](/reference/global-configs/behavior-changes) can _only_ be defined in `dbt_project.yml`. These are intended to be set in version control and migrated via pull/merge request. Their values should not diverge indefinitely across invocations, environments, or users.