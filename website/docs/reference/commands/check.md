---
title: "About dbt check command"
sidebar_label: "check"
id: "check"
availability:
  engine: v2
---

`dbt check` parses your project, runs [checks](/docs/build/checks), and reports results.

## Usage

```shell
dbt check [<check-name> …] [flags]
```

Run all enabled checks:

```shell
dbt check
```

Run one or more checks:

```shell
dbt check all_models_have_descriptions
dbt check all_models_have_descriptions public_models_have_owners
```

Passing an unknown check name fails the command. Passing a disabled check name is accepted and the check is skipped.

## Flags

`--select`, `--exclude`, and `--selector` select which project resources the checks evaluate &mdash; not which checks run. For example, `dbt check --select tag:finance` runs all enabled checks, but each check only evaluates resources tagged `finance`. If the selector matches nothing a check can report on, the check is `Skipped`. For more information, refer to [Using selectors with checks](/docs/build/checks#using-selectors-with-checks).


## Related docs

- [Checks](/docs/build/checks)
- [`dbt build`](/reference/commands/build)
- [check-paths project config](/reference/project-configs/check-paths)
