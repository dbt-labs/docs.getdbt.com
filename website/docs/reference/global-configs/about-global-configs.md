---
title: "About flags (global configs)"
id: "about-global-configs"
sidebar: "About flags (global configs)"
---

In dbt, "flags" (also called "global configs") are configurations for fine-tuning _how_ dbt runs your project. They differ from [resource-specific configs](/reference/configs-and-properties) that tell dbt about _what_ to run.

Flags control things like the visual output of logs, whether to treat specific warning messages as errors, or whether to "fail fast" after encountering the first error. These flags are "global" because they are available for all dbt commands, and because they can be set in multiple places.

There is significant overlap between dbt's flags and dbt's command line options, but they are not the same:
- Certain flags can only be set in `dbt_project.yml`, and cannot be overridden for specific invocations via CLI option.
- If a CLI option is supported by specific commands, rather than supported by all commands ("global"), it is generally not considered to be a "flag".

### Setting flags

There are multiple ways of setting flags, which depend on the use case:
- **[Project-level `flags` (`dbt_project.yml`)](https://docs.getdbt.com/reference/global-configs/project-flags):** Define version-controlled defaults for everyone running this project. Preserve legacy behaviors until their slated deprecation.
- **[Environment variables](https://docs.getdbt.com/reference/global-configs/environment-variable-configs):** Define behavior that should be different in different runtime environments (development vs. production vs. [continuous integration](https://docs.getdbt.com/docs/deploy/continuous-integration), or different for different users in development (based on personal preferences).
- **[CLI options](https://docs.getdbt.com/reference/global-configs/command-line-options):** Define behavior specific to _this invocation_. Supported for all dbt commands.

The precedence order is CLI > Env Var > Project.

Most flags can be set in all three places:
```yaml
# dbt_project.yml
flags:
  # set default for running this project -- anywhere, anytime, by anyone
  fail_fast: true
```
```bash
# set this environment variable to 'True' (bash syntax)
export DBT_FAIL_FAST=1
dbt run
```
```bash
dbt run --fail-fast # set to True for this specific invocation
dbt run --no-fail-fast # set to False
```

However, there are exceptions:
- Flags for impermanent file paths (e.g. `--log-path` or `--state-path`) cannot be set in `dbt_project.yml`. To override defaults, pass CLI options or set environment variables (`DBT_LOG_PATH`, `DBT_STATE_PATH`).
- Flags opting into legacy dbt behaviors can _only_ be defined in `dbt_project.yml`. These are intended to be set in version control, and migrated via pull/merge request. Their values should not diverge indefinitely across invocations, environments, or users.

### Accessing flags

Custom user-defined logic, written in Jinja, can check the values of flags using [the `flags` context variable](https://docs.getdbt.com/reference/dbt-jinja-functions/flags).

```yaml
# dbt_project.yml

on-run-start:
  - '{{ log("I will stop at the first sign of trouble", info = true) if flags.FAIL_FAST }}'
```

Because the values of `flags` can differ across invocations, we strongly advise against using `flags` as an input to configurations or dependencies (`ref` + `source`) that dbt resolves [during parsing](https://docs.getdbt.com/reference/parsing#known-limitations).

