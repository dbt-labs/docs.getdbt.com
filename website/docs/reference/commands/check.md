---
title: "About dbt check command"
sidebar_label: "check"
id: "check"
availability:
  engine: v2
---

`dbt check` parses your project, runs enabled [project quality checks](/docs/build/project-checks), and reports results. It does not compile or materialize models.

## Usage

```shell
dbt check [<check-name> …] [flags]
```

Run all enabled checks:

```shell
dbt check
```

Run a named check:

```shell
dbt check all_models_have_descriptions
```

Passing an unknown check name fails the command. Passing a disabled check name is accepted and the check is skipped.

## Flags

`--select`, `--exclude`, and `--selector` filter which result rows are reported, not which checks execute. If the selector matches nothing a check can report on, the check is `skipped`.

`dbt check` does not support `--skip-checks`. Use `dbt build --skip-checks` to skip checks on a build.

## Results

For the full list of result statuses, when they occur, and their error codes, refer to [Results](/docs/build/project-checks#results) in the project quality checks guide.

## Retry

`dbt retry` after a failing `dbt check` re-runs only the checks that failed. For more information about retry behavior, refer to [Project quality checks](/docs/build/project-checks#retry).

## Related docs

- [Project quality checks](/docs/build/project-checks)
- [`dbt build --skip-checks`](/reference/commands/build)
- [check-paths project config](/reference/project-configs/check-paths)
