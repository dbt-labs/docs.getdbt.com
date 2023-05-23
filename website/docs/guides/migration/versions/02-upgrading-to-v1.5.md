---
title: "Upgrading to v1.5 (latest)"
description: New features and changes in dbt Core v1.5
---

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

This release includes significant new features, and rework to `dbt-core`'s CLI and initialization flow. As part of refactoring its internals, we made a handful of changes to runtime configuration. The net result of these changes is more consistent & practical configuration options, and a more legible codebase.

**_Wherever possible, we will provide backward compatibility and deprecation warnings for at least one minor version before actually removing the old functionality._** In those cases, we still reserve the right to fully remove backwards compatibility for deprecated functionality in a future v1.x minor version of `dbt-core`.

:::

Setting `log-path` and `target-path` in `dbt_project.yml` has been deprecated for consistency with other invocation-specific runtime configs ([dbt-core#6882](https://github.com/dbt-labs/dbt-core/issues/6882)). We recommend setting via env var or CLI flag instead.

The `dbt list` command will now include `INFO` level logs by default. Previously, the `list` command (and _only_ the `list` command) had `WARN`-level stdout logging, to support piping its results to [`jq`](https://stedolan.github.io/jq/manual/), a file, or another process. To achieve that goal, you can use either of the following parameters:
- `dbt --log-level warn list` (recommended; equivalent to previous default)
- `dbt --quiet list` (suppresses all logging less than ERROR level, except for "printed" messages and `list` output)

The following env vars have been renamed, for consistency with the convention followed by all other parameters:
- `DBT_DEFER_TO_STATE` → `DBT_DEFER`
- `DBT_FAVOR_STATE_MODE` → `DBT_FAVOR_STATE`
- `DBT_NO_PRINT` → `DBT_PRINT`
- `DBT_ARTIFACT_STATE_PATH` → `DBT_STATE`

As described in [dbt-core#7169](https://github.com/dbt-labs/dbt-core/pull/7169), command-line parameters that could be silent before will no longer be silent. See [dbt-labs/dbt-core#7158](https://github.com/dbt-labs/dbt-core/issues/7158) and [dbt-labs/dbt-core#6800](https://github.com/dbt-labs/dbt-core/issues/6800) for more examples of the behavior we are fixing.

An empty `tests:` key in a yaml file will now raise a validation error, instead of being silently skipped. You can resolve this by removing the empty `tests:` key, or by setting it to an empty list explicitly:
```yml
#  ❌ this will raise an error
models:
  - name: my_model
    tests:
    config: ...

# this is fine
models:
  - name: my_model
    tests: [] # todo! add tests later
    config: ...
```

Finally: The [built-in `generate_alias_name` macro](https://github.com/dbt-labs/dbt-core/blob/1.5.latest/core/dbt/include/global_project/macros/get_custom_name/get_custom_alias.sql) now includes logic to handle versioned models. If your project has reimplemented the `generate_alias_name` macro with custom logic, and you want to start using [model versions](model-versions), you will need to update the logic in your macro. Note that, while this is **note** a prerequisite for upgrading to v1.5—only for using the new feature—we recommmend that you do this during your upgrade, whether you're planning to use model versions tomorrow or far in the future.

### For consumers of dbt artifacts (metadata)

The [manifest](manifest-json) schema version will be updated to `v9`. Specific changes:
- Addition of `groups` as a top-level key
- Addition of `access`, `constraints`, `version`, `latest_version` as a top-level node attributes for models
- Addition of `constraints` as a column-level attribute
- Addition of `group` and `contract` as node configs
- To support model versions, the type of `refs` has changed from `List[List[str]]` to `List[RefArgs]`, with nested keys `name: str`, `package: Optional[str] = None`, and `version: Union[str, float, NoneType] = None)`.

### For maintainers of adapter plugins

For more detailed information and to ask questions, please read and comment on the GH discussion: [dbt-labs/dbt-core#7213](https://github.com/dbt-labs/dbt-core/discussions/7213).

## New and changed documentation

### Model governance

The first phase of supporting dbt deployments at scale, across multiple projects with clearly defined ownership and interface boundaries. [Read about model governance](govern/about-model-governance), all of which is new in v1.5.

### Revamped CLI

Compile and preview dbt models and `--inline` dbt-SQL queries on the CLI using:
- [`dbt compile`](commands/compile)
- [`dbt show`](commands/show) (new!)

[Node selection methods](node-selection/methods) can use Unix-style wildcards to glob nodes matching a pattern:
```
dbt ls --select "tag:team_*"
```

And (!): a first-ever entry point for [programmatic invocations](programmatic-invocations), at parity with CLI commands.

Run `dbt --help` to see new & improved help documentation :)

### Quick hits
- The [`version: 2` top-level key](project-configs/version) is now **optional** in all yaml files. Also, the [`config-version: 2`](config-version) and `version:` top-level keys are now optional in `dbt_project.yml` files.
- [Events and logging](events-logging): Added `node_relation` (`database`, `schema`, `identifier`) to the `node_info` dictionary, available on node-specific events
- Support setting `--project-dir` via environment variable: [`DBT_PROJECT_DIR`](dbt_project.yml)
- More granular [configurations](/reference/global-configs) for logging (to set log format, log levels, and colorization) and cache population
