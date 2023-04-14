---
title: "Upgrading to v1.5 (prerelease!)"
description: New features and changes in dbt Core v1.5
---

:::info
v1.5 is currently available as a **release candidate**. Try it out, and let us know if you encounter any bugs!

Planned release date: April 27, 2023
:::

dbt Core v1.5 is a feature release, with two significant additions:
1. [**Model governance**](/docs/collaborate/govern/about-model-governance) — access, contracts, versions — the first phase of [multi-project deployments](https://github.com/dbt-labs/dbt-core/discussions/6725)
2. A Python entry point for [**programmatic invocations**](programmatic-invocations), at parity with the CLI

## Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.5.latest/CHANGELOG.md)
- [CLI Installation guide](/docs/core/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)
- [Release schedule](https://github.com/dbt-labs/dbt-core/issues/6715)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x, with the exception of any changes explicitly mentioned below. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### Behavior changes

:::info Why changes to previous behavior?

This release includes a significant rework to `dbt-core`'s CLI and initialization flow. As part of refactoring its internals, we made a handful of changes to runtime configuration. The net result of these changes is more consistent & practical configuration options, and a more legible codebase.

**_Wherever possible, we will provide backward compatibility and deprecation warnings for at least one minor version before actually removing the old functionality._** In those cases, we still reserve the right to fully remove backwards compatibility for deprecated functionality in a future v1.x minor version of `dbt-core`.

:::

Setting `log-path` and `target-path` in `dbt_project.yml` has been deprecated for consistency with other global configs ([dbt-core#6882](https://github.com/dbt-labs/dbt-core/issues/6882)). We recommend setting via env var or CLI flag instead.

The `dbt list` command will now include `INFO` level logs by default. Previously, the `list` command (and _only_ the `list` command) had `WARN`-level stdout logging, to support piping its results to [`jq`](https://stedolan.github.io/jq/manual/), a file, or another process. To achieve that goal, you can use either of the following parameters:
- `dbt --log-level warn list` (recommended; equivalent to previous default)
- `dbt --quiet list` (suppresses all logging less than ERROR level, except for "printed" messages and `list` output)

The following env vars have been renamed, for consistency with the convention followed by all other parameters:
- `DBT_DEFER_TO_STATE` → `DBT_DEFER`
- `DBT_FAVOR_STATE_MODE` → `DBT_FAVOR_STATE`
- `DBT_NO_PRINT` → `DBT_PRINT`
- `DBT_ARTIFACT_STATE_PATH` → `DBT_STATE`

As described in [dbt-core#7169](https://github.com/dbt-labs/dbt-core/pull/7169), command-line parameters that could be silent before will no longer be silent. See [dbt-labs/dbt-core#7158](https://github.com/dbt-labs/dbt-core/issues/7158) and [dbt-labs/dbt-core#6800](https://github.com/dbt-labs/dbt-core/issues/6800) for more examples of the behavior we are fixing.

### For consumers of dbt artifacts (metadata)

The [manifest](manifest-json) schema version will be updated to `v9`. Specific changes:
- Addition of `groups` as a top-level key
- Addition of `access`, `constraints`, `version`, `latest_version` as a top-level node attributes for models
- Addition of `constraints` as a column-level attribute
- Addition of `group` and `contract` as node configs

### For maintainers of adapter plugins

For more detailed information and to ask questions, please read and comment on the GH discussion: [dbt-labs/dbt-core#7213](https://github.com/dbt-labs/dbt-core/discussions/7213).

## New and changed documentation

### Model governance
- [Model access](model-access)
- [Model contracts](model-contracts)
- [Model versions](model-versions)

### Interactive commands

Compile and preview dbt models and `--inline` dbt-SQL queries on the CLI!
- [`dbt compile`](commands/compile)
- [`dbt show`](commands/show)

### Entry point for programmatic invocations
- [Programmatic invocations](programmatic-invocations)

### Quick hits
- [Events and logging](events-logging): Added `node_relation` (`database`, `schema`, `identifier`) to the `node_info` dictionary, available on node-specific events
- TODO list everything else!
