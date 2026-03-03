---
title: "MCP environment variables reference"
sidebar_label: "Environment variables"
description: "Condensed reference for all dbt MCP environment variables."
id: "mcp-environment-variables"
---

This page is a condensed reference for all environment variables used by the local dbt MCP server. For full detail on each variable (including examples and multi-cell configuration), see [Set up local MCP](/docs/dbt-ai/setup-local-mcp).

## Local CLI

These variables are required to use dbt CLI commands through MCP.

| Variable | Required | Description |
| --- | --- | --- |
| `DBT_PROJECT_DIR` | Required | Full path to your dbt project folder (the folder containing `dbt_project.yml`). |
| `DBT_PATH` | Required | Full path to your dbt executable. Find it by running `which dbt` (macOS/Linux) or `where dbt` (Windows). |
| `DBT_PROFILES_DIR` | Optional | Path to a custom `profiles.yml` directory. Defaults to `~/.dbt/`. |
| `DBT_CLI_TIMEOUT` | Optional | Seconds before dbt CLI commands time out. Defaults to `60`. |

## dbt Platform

These variables are required for dbt platform features (Semantic Layer, Discovery API, Admin API, SQL execution).

| Variable | Required | Description |
| --- | --- | --- |
| `DBT_HOST` | Required | Your dbt platform hostname — no `https://`. Default: `cloud.getdbt.com`. For multi-cell accounts, use the base hostname and set `MULTICELL_ACCOUNT_PREFIX` separately. |
| `MULTICELL_ACCOUNT_PREFIX` | Required for multi-cell | Your account prefix (for example, `abc123` from `abc123.us1.dbt.com`). Do not include this in `DBT_HOST`. |
| `DBT_TOKEN` | Required | A service token or Personal Access Token (PAT). **`execute_sql` requires a PAT** — service tokens do not work for that tool. |
| `DBT_PROD_ENV_ID` | Required | Your production environment ID (numeric integer). |
| `DBT_DEV_ENV_ID` | Required for `execute_sql` | Your development environment ID (numeric integer). |
| `DBT_USER_ID` | Required for `execute_sql` | Your numeric user ID. |
| `DBT_ACCOUNT_ID` | Required for Admin API | Your numeric account ID. |

See [Finding your IDs](/docs/dbt-ai/mcp-find-ids) for step-by-step instructions on locating each value.

## Tool configuration

dbt MCP has two modes for controlling which tools are available: disable mode (default) and enable mode (allowlist).

:::tip Which mode should I use?
- **Disable mode:** Use when you want most tools available and only need to turn a few off.
- **Enable mode:** Use when you want only a specific set of tools available.

Do not mix both modes for the same toolset.
:::

### Disable mode (default)

All tools are available by default. Set any of these to `true` to turn off a toolset:

| Variable | Default | Description |
| --- | --- | --- |
| `DISABLE_DBT_CLI` | `false` | Disable dbt CLI tools. |
| `DISABLE_SEMANTIC_LAYER` | `false` | Disable Semantic Layer tools. |
| `DISABLE_DISCOVERY` | `false` | Disable Discovery API tools. |
| `DISABLE_ADMIN_API` | `false` | Disable Admin API tools. |
| `DISABLE_SQL` | `true` | SQL tools are disabled by default. Set to `false` to enable. |
| `DISABLE_DBT_CODEGEN` | `true` | Codegen tools are disabled by default. Set to `false` to enable (requires dbt-codegen package). |
| `DISABLE_LSP` | `false` | Disable LSP/Fusion tools. |
| `DISABLE_MCP_SERVER_METADATA` | `true` | Server metadata tools are disabled by default. Set to `false` to enable. |
| `DISABLE_TOOLS` | `""` | Comma-separated list of specific tool names to disable. |

### Enable mode (allowlist)

If any `DBT_MCP_ENABLE_*` variable is set, only the explicitly enabled toolsets are active:

| Variable | Description |
| --- | --- |
| `DBT_MCP_ENABLE_DBT_CLI` | Set to `true` to enable dbt CLI tools. |
| `DBT_MCP_ENABLE_SEMANTIC_LAYER` | Set to `true` to enable Semantic Layer tools. |
| `DBT_MCP_ENABLE_DISCOVERY` | Set to `true` to enable Discovery API tools. |
| `DBT_MCP_ENABLE_ADMIN_API` | Set to `true` to enable Admin API tools. |
| `DBT_MCP_ENABLE_SQL` | Set to `true` to enable SQL tools. |
| `DBT_MCP_ENABLE_DBT_CODEGEN` | Set to `true` to enable codegen tools. |
| `DBT_MCP_ENABLE_LSP` | Set to `true` to enable LSP/Fusion tools. |
| `DBT_MCP_ENABLE_TOOLS` | Comma-separated list of specific tool names to enable. |

### Precedence

When multiple variables are set, they're evaluated in this order (highest priority first):

1. `DBT_MCP_ENABLE_TOOLS` (enable specific tools by name)
2. `DISABLE_TOOLS` (disable specific tools by name)
3. Toolset enable (`DBT_MCP_ENABLE_*=true`)
4. Toolset disable (`DISABLE_*=true`)
5. Default behavior

## Logging

| Variable | Default | Description |
| --- | --- | --- |
| `DBT_MCP_LOG_LEVEL` | `INFO` | Log level for the MCP server. Options: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`. Set to `DEBUG` temporarily to diagnose issues. |
