---
title: "About dbt invocation command"
sidebar_label: "invocation"
id: invocation
---

The `dbt invocation` command is available in the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) and allows you to:
- List active invocations to debug long-running or hanging invocations.
- Identify and investigate sessions causing the `Session occupied` error.
- Monitor currently active dbt commands (like `run`, `build`) in real-time.

The `dbt invocation` command only lists _active invocations_. If no sessions are running, the list will be empty. Completed sessions aren't included in the output.

## Usage

This page lists the command and flag you can use with `dbt invocation`. To use them, add a command or option like this: `dbt invocation [command]`.

Available flags in the command line interface (CLI) are [`help`](#dbt-invocation-help) and [`list`](#dbt-invocation-list).

### dbt invocation help

The `help` command provides you with the help output for the `invocation` command in the CLI, including the available flags.

```shell
dbt invocation help
```

or

```shell
dbt help invocation
```

The command returns the following information:

```bash
dbt invocation help
Manage invocations

Usage:
  dbt invocation [command]

Available Commands:
  list        List active invocations

Flags:
  -h, --help   help for invocation

Global Flags:
      --log-format LogFormat   The log format, either json or plain. (default plain)
      --log-level LogLevel     The log level, one of debug, info, warning, error or fatal. (default info)
      --no-color               Disables colorization of the output.
  -q, --quiet                  Suppress all non-error logging to stdout.

Use "dbt invocation [command] --help" for more information about a command.
```

### dbt invocation list

The `list` command provides you with a list of active invocations in your dbt Cloud CLI. When a long-running session is active, you can use this command in a separate terminal window to view the active session to help debug the issue.

```shell
dbt invocation list
```

The command returns the following information, including the `ID`, `status`, `type`, `arguments`, and `started at` time of the active session:

```bash
dbt invocation list

Active Invocations:
  ID                             6dcf4723-e057-48b5-946f-a4d87e1d117a
  Status                         running
  Type                           cli
  Args                           [run --select test.sql]
  Started At                     2025-01-24 11:03:19

➜  jaffle-shop git:(test-cli) ✗ 
```

:::tip

To cancel an active session in the terminal, use the `Ctrl + Z` shortcut.

:::

## Related docs

- [Install dbt Cloud CLI](/docs/cloud/cloud-cli-installation)
- [Troubleshooting dbt Cloud CLI 'Session occupied' error](/faqs/Troubleshooting/long-sessions-cloud-cli)


