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

### `--limit`

:::info 
Currently available on the **v2 Nightly** release track.
:::

By default, `dbt check` shows up to 10 violation rows per check. If a check finds more violations than the limit, dbt shows the total count and suggests rerunning with a higher `--limit`. Use `-1` to see all violations at once.

```shell
dbt check --limit 50     # show up to 50 violations per check
dbt check --limit -1     # show all violations
```

## Related docs

- [Checks](/docs/build/checks)
- [`dbt build`](/reference/commands/build)
- [check-paths project config](/reference/project-configs/check-paths)
