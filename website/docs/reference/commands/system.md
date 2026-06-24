---
title: "About dbt system command"
sidebar_label: "system"
id: "system"
description: "Use dbt system to update, uninstall, or pre-install ADBC adapter drivers for the dbt CLI."
---

# About dbt system command

`dbt system` provides commands for managing the <Constant name="fusion" /> CLI and <Constant name="platform_cli" /> installations. <Constant name="core" /> has no equivalent.

:::important

`dbt system update` and `dbt system uninstall` are only supported for [CDN installations](/docs/local/install-dbt) of <Constant name="fusion" />. If you installed <Constant name="fusion" /> via Pip, Homebrew, or Winget, you'll need to update or uninstall dbt from those tools.

:::

## Usage

```shell
dbt system <subcommand> [flags]
```

## Subcommands

| Subcommand | Description |
|---|---|
| `dbt system update` | Update CLI to the latest (or a specified) version |
| `dbt system uninstall` | Remove CLI from your system |
| `dbt system install-drivers` | Pre-install all supported ADBC adapter drivers |

## dbt system update

`dbt system update` updates the CLI binary in place. By default, it updates to the latest stable release. You can also target a named channel or a specific version number.

```shell
dbt system update [flags]
```

### Options

| Flag | Description |
|---|---|
| `--version VERSION` | Update to a specific version (for example, `1.2.3`) or a named channel (`canary`, `dev`). Defaults to the latest stable release. |
| `--package PACKAGE` | Which package to update. Accepts `dbt`, `dbt-lsp`, or `all`. Defaults to `dbt`. |

### Version channels

| Channel | Description |
|---|---|
| _(none)_ | Latest stable release |
| `canary` | Most recent preview build |
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

Update both `dbt` and `dbt-lsp` to the latest version:

```shell
dbt system update --package all
```

:::info dbt-lsp deprecation note
`dbt-lsp` is a compatibility binary. The `dbt` binary now includes language server functionality via `dbt lsp`. Prefer updating the `dbt` package directly.
:::

## dbt system uninstall

`dbt system uninstall` removes the CLI binary from your system. On macOS and Linux, it downloads and runs the official `uninstall.sh` script. On Windows, a PowerShell script handles removal after the current process exits (to release the file lock on the running executable). There are no flags for this command.

```shell
dbt system uninstall
```

## dbt system install-drivers

`dbt system install-drivers` downloads and caches all supported ADBC adapter driver libraries (`.dylib`, `.so`, `.dll`) for every supported data platform at once. Normally, dbt downloads drivers on first use when you run a command against a new data platform. Use `dbt system install-drivers` to pre-populate the cache (for example, before going offline or switching between projects that target different warehouses). There are no flags for this command.

```shell
dbt system install-drivers
```

:::tip Networking note
`dbt system install-drivers` downloads files from `https://public.cdn.getdbt.com`. If your environment restricts outbound network access, make sure this endpoint is allowlisted. See [Fusion networking requirements](/docs/fusion/fusion-networking) for the full list of endpoints.
:::

