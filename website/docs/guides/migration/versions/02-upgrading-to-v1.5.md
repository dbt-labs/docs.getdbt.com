---
title: "Trying v1.5 (prerelease)"
description: New features and changes in dbt Core v1.5
---

:::info
v1.5 is currently available as a **beta prerelease**
:::

### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/main/CHANGELOG.md)
- [CLI Installation guide](/docs/core/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)
- [Release schedule](https://github.com/dbt-labs/dbt-core/issues/6715)

:::info

Planned release date: April 27, 2023

:::

dbt Core v1.5 is a feature release, with two significant additions planned:
1. Models as APIs &mdash; the first phase of [multi-project deployments](https://github.com/dbt-labs/dbt-core/discussions/6725)
2. An initial Python API for dbt-core supporting programmatic invocations at parity with the CLI.

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x, with the exception of any changes explicitly mentioned below. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### Breaking changes

As part of our refactor of `dbt-core` internals, we must make precise changes to runtime configuration. The net result of these changes is more practical configuration options, clearer documentation, cleaner APIs, and a more legible codebase.

Wherever possible, we will provide backward compatibility and deprecation warnings for at least one minor version before actually removing the old functionality. In those cases, we still reserve the right to fully remove the backward-compatible functionality in a future v1.x minor version of `dbt-core`.

Changes planned for v1.5:
- Renaming ["global configs"](global-configs) for consistency ([dbt-core#6903](https://github.com/dbt-labs/dbt-core/issues/6903))
- Moving `log-path` and `target-path` out of `dbt_project.yml` for consistency with other global configs ([dbt-core#6882](https://github.com/dbt-labs/dbt-core/issues/6882))
- As described in [dbt-core#7169](https://github.com/dbt-labs/dbt-core/pull/7169), command-line parameters that could be silent before will no longer be silent. See [dbt-labs/dbt-core#7158](https://github.com/dbt-labs/dbt-core/issues/7158) and [dbt-labs/dbt-core#6800](https://github.com/dbt-labs/dbt-core/issues/6800) for more examples of the behavior we are fixing.
- `dbt list` command will now include `INFO` level logs by default; previously, they were suppressed. To pipe the results of `dbt list` to a file or another process and exclude unrelated log messages from the output, you can use either of the following commands:
    - `dbt --log-level warn ls` &mdash; equivalent to previous default behavior.
    - `dbt --quiet ls` &mdash; suppresses anything less than ERROR level, except for "printed" messages.

### For consumers of dbt artifacts (metadata)

The manifest schema version will be updated to `v9`. Specific changes:
- Addition of `groups` as a top-level key
- Addition of `access` as a top-level node config for models
- Addition of `group` and `contract` as node configs

### For users of env vars

The following env vars have been renamed:

- `DBT_DEFER_TO_STATE` → `DBT_DEFER`
- `DBT_FAVOR_STATE_MODE` → `DBT_FAVOR_STATE`
- `DBT_NO_PRINT` → `DBT_PRINT`
- `DBT_ARTIFACT_STATE_PATH` → `DBT_STATE`

Backward compatibility with the old syntax is still supported but will be removed in an as-of-yet-undetermined future released. 

### For maintainers of adapter plugins

For more detailed information and to ask any questions, please visit [dbt-core/discussions/6624](https://github.com/dbt-labs/dbt-core/discussions/7213).

## New and changed documentation

:::caution Under construction 🚧
More to come!
:::

### Publishing models as APIs
- [Model contracts](model-contracts)
- [Model access](model-access)
- [Model versions](model-versions)

### dbt-core Python API
- Auto-generated documentation ([#2674](https://github.com/dbt-labs/docs.getdbt.com/issues/2674)) for dbt-core CLI & Python API for programmatic invocations

### Quick hits
- [Events and logging](events-logging): Added `node_relation` (`database`, `schema`, `identifier`) to the `node_info` dictionary, available on node-specific events
