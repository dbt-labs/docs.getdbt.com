---
title: "About dbt format command"
sidebar_label: "format"
description: "Use dbt format (or dbt fmt) to format your SQL files in place according to the layout rules in your .sqlfluff config."
id: "format"
availability:
  engine: v2
---

`dbt format` (also available as `dbt fmt`) requires v2 or later. If you're on an earlier version, [upgrade or install dbt](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2?version=2).

`dbt format` automatically formats your SQL files according to the layout (`LT*`) rules in your `.sqlfluff` file. Unlike [`dbt lint`](/reference/commands/lint), it doesn't issue diagnostics. It applies fixes silently and in place when you run the command.

## Usage

```shell
dbt format [FILE] [flags]
dbt fmt [FILE] [flags]
```

`[FILE]` is optional. When omitted, `dbt format` formats all SQL files in your project. You can also pass a single file or a directory to scope the run.

## Flags

| Flag | Description |
|------|-------------|
| `--check` | Checks whether files are formatted without writing changes. Exits with a non-zero code if any file isn't formatted. Never modifies a file. |
| `--layout KEY=VALUE`, `-l KEY=VALUE` | Overrides SQLFluff-style layout rules for this run. Repeat the flag to set multiple options. Refer to [Layout options](#layout-options). |
| `--jinja-render-mode MODE` | Sets how `dbt format` renders Jinja before formatting. Accepts `symbolic` (default), `rendered`, or `turbo`. Refer to [Jinja render modes](/reference/commands/lint#jinja-render-modes). |

## Configuration

`dbt format` reads the same `.sqlfluff` file as `dbt lint`, auto-discovering the nearest one in your project directory tree.

`dbt format` logs a warning and continues when `.sqlfluff` does not set `templater = dbt`. Refer to [Templater requirement](/reference/commands/lint#templater-requirement).

### Layout options

The `--layout` flag takes `KEY=VALUE` pairs and overrides the matching layout rules in your `.sqlfluff` file for a single run. It overrides only the keys you pass, and `dbt format` still reads all other layout rules from your `.sqlfluff` file. The supported keys are:

| Key | Description |
|-----|-------------|
| `indent=NUMBER` | Sets the number of spaces to indent. |
| `commas=leading\|trailing` | Sets comma placement. |
| `line-length=NUMBER` | Sets the maximum line length. |

For example, to format with leading commas and a two-space indent:

```shell
dbt format -l commas=leading -l indent=2
```

## Check formatting in CI

Use `--check` as a dry run to gate pull requests on formatting. If every file is formatted, the command exits with code `0`. If a file isn't formatted, the command exits with code `1`, leaves the file untouched, and returns an error like this:

```text
[error] [Generic (dbt1000)]: Formatting check failed for models/staging/stg_orders.sql. Run `dbt fmt` to format it.
```

```shell
dbt format --check                                # check all SQL files
dbt format --check models/staging                 # check a directory
dbt format --check models/staging/stg_orders.sql  # check a single file
```

To fix failures, run `dbt format` without `--check`.

## Feedback

If you encounter unexpected behavior or have suggestions, open an issue in the [dbt-labs/dbt GitHub repository](https://github.com/dbt-labs/dbt/issues) and apply the `Linter` label.
