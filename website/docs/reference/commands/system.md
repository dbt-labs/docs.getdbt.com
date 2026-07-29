---
title: "About dbt system command"
sidebar_label: "system"
id: "system"
description: "Use dbt system to update or uninstall the Fusion engine using the CLI, or pre-install supported ADBC adapter drivers."
---

# About dbt system command

`dbt system` provides commands for managing your dbt installation. v2 is a single compiled binary with no dependencies on other libraries. Once installed, `dbt system` lets you update, uninstall, and manage drivers directly without pip, brew, or a Python environment. 

`dbt system update` and `dbt system uninstall` are only supported for [CDN installations](/docs/local/install-dbt) of <Constant name="fusion" />. If you installed <Constant name="fusion" /> via Pip, Homebrew, or Winget, you'll need to update or uninstall dbt from those tools.

<Constant name="core" /> has no equivalent.

## Usage

```shell
dbt system <subcommand> [flags]
```

## Subcommands

| Subcommand | Description |
|---|---|
| `dbt system update` | Update dbt to the latest (or a specified) version |
| `dbt system uninstall` | Remove <Constant name="fusion" />  from your system |
| `dbt system install-drivers` | Pre-install all supported ADBC adapter drivers |

## dbt system update

`dbt system update` updates the CLI binary in place. By default, it updates to the latest stable release. You can also target a named channel or a specific version number.

```shell
dbt system update [flags]
```

### Options

| Flag | Description |
|---|---|
| `--version VERSION` | Update to a specific version (for example, `2.0.0-preview.190`) or a named channel (`canary`, `dev`). Defaults to the latest stable release. |
| `--package PACKAGE` | Which package to update. Accepts `dbt` or `all`. Defaults to `dbt`. |

### Version channels

| Channel | Description |
|---|---|
| _(none)_ | Latest stable release |
| `canary` | Most recent preview build (under active testing and may be pulled back) |
| `dev` | Development build (may be unstable) |

### Examples

Update to the latest stable release:

```shell
dbt system update
```

Update to a specific version:

```shell
dbt system update --version 2.0.0-preview.188
```

Update to the canary channel:

```shell
dbt system update --version canary
```

## dbt system uninstall

`dbt system uninstall` removes the CLI binary from your system. On macOS and Linux, it downloads and runs the official `uninstall.sh` script. On Windows, a PowerShell script handles removal after the current process exits (to release the file lock on the running executable).

```shell
dbt system uninstall
```

This command takes no additional flags.

## dbt system install-drivers

`dbt system install-drivers` downloads and caches all supported ADBC adapter driver libraries (`.dylib`, `.so`, `.dll`) for every supported data platform at once. Normally, dbt downloads drivers on first use when you run a command against a new data platform. Use `dbt system install-drivers` to pre-populate the cache (for example, before going offline or switching between projects that target different warehouses).

```shell
dbt system install-drivers
```

This command takes no additional flags.

:::tip Networking note
`dbt system install-drivers` downloads files from `https://public.cdn.getdbt.com`. If your environment restricts outbound network access, make sure this endpoint is allowlisted. See [Fusion networking requirements](/docs/local/fusion-networking-requirements) for the full list of endpoints.
:::

## Related commands

- [`dbt debug`](/reference/commands/debug) &mdash; Test your dbt project and connection configuration.
- [Fusion networking requirements](/docs/local/fusion-networking-requirements) &mdash; Review outbound endpoints required by the <Constant name="fusion_engine" />.
