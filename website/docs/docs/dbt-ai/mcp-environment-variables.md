---
title: "MCP environment variables reference"
sidebar_label: "Environment variables"
description: "Condensed reference for all dbt MCP environment variables."
id: "mcp-environment-variables"
---

This page is a condensed reference for all environment variables used by the local dbt MCP server. For full detail on each variable (including examples), see [Set up local MCP](/docs/dbt-ai/setup-local-mcp).

## Local CLI

These variables are required to use dbt CLI commands through MCP.

<SimpleTable>
| Variable | Required | Description |
| --- | --- | --- |
| `DBT_PROJECT_DIR` | Required | Full path to your dbt project folder (the folder containing `dbt_project.yml`). |
| `DBT_PATH` | Required | Full path to your dbt executable. Find it by running `which dbt` (macOS/Linux) or `where dbt` (Windows). |
| `DBT_PROFILES_DIR` | Optional | Path to a custom `profiles.yml` directory. Defaults to `~/.dbt/`. |
| `DBT_CLI_TIMEOUT` | Optional | Seconds before dbt CLI commands time out. Defaults to `60`. Compile runs the whole project, so large projects may need a higher limit to avoid timeouts. |
</SimpleTable>

## dbt platform

These variables are required for <Constant name="dbt_platform"/> features (Semantic Layer, Discovery API, Admin API, SQL execution).

<SimpleTable>
| Variable | Required | Description |
| --- | --- | --- |
| `DBT_HOST` | Required | Your <Constant name="dbt_platform"/> [hostname](/docs/platform/about-platform/access-regions-ip-addresses). Accepts both `cloud.getdbt.com` (default) and `https://cloud.getdbt.com`. <br /> <br />Include the full hostname with subdomain — for example, `DBT_HOST=abc123.us1.dbt.com`. You no longer need to separate the prefix using `MULTICELL_ACCOUNT_PREFIX` or `DBT_HOST_PREFIX`. |
| `DBT_TOKEN` | Required | A service token or Personal Access Token (PAT). <br /> <br />The `execute_sql` tool requires a PAT — service tokens _do not_ work for that tool. |
| `DBT_PROD_ENV_ID` | Required | Your production environment ID (numeric integer). |
| `DBT_DEV_ENV_ID` | Required for `execute_sql` | Your development environment ID (numeric integer). |
| `DBT_USER_ID` | Required for `execute_sql` | Your numeric user ID. |
| `DBT_ACCOUNT_ID` | Required for Admin API and PAT-based auth | Your numeric account ID. Required when using a Personal Access Token (PAT) as your `DBT_TOKEN`. |
</SimpleTable>

:::note Legacy prefix variables
`MULTICELL_ACCOUNT_PREFIX` and `DBT_HOST_PREFIX` are legacy environment variables. They are backwards compatible &mdash; if you already have them set, they will continue to work. However, the recommended approach is to set the full hostname directly in `DBT_HOST` (for example, `DBT_HOST=abc123.us1.dbt.com`).
:::

See [Finding your IDs](/docs/dbt-ai/mcp-find-ids) for step-by-step instructions on locating each value.

## Tool configuration

dbt MCP has two modes for controlling which tools are available: disable mode (default) and enable mode (allowlist). 

Toolsets may grow over time as new capabilities are added. The naming pattern generalizes to `DISABLE_{TOOLSET}=` and `DBT_MCP_ENABLE_{TOOLSET}=`, so new toolsets follow the same convention. For the latest list of toolset names, refer to the tables below or the [dbt-mcp README](https://github.com/dbt-labs/dbt-mcp).

:::tip Which mode should I use?
- **Disable mode:** Use when you want most tools available and only need to turn a few off.
- **Enable mode:** Use when you want only a specific set of tools available.

Do not mix both modes for the same toolset. For example avoid this pattern:

```bash
# ❌ Mixing modes leads to unpredictable behavior
DISABLE_SEMANTIC_LAYER=false
DBT_MCP_ENABLE_SEMANTIC_LAYER=true
```
Also avoid empty `DBT_MCP_ENABLE_*=` lines as they activate enable mode and will silently disable all other toolsets.
:::

### Disable mode (default)

All tools are available by default. To disable a toolset, set any of the following variables to `true` in your MCP client configuration:

<SimpleTable>
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
</SimpleTable>

### Enable mode (allowlist)

If any `DBT_MCP_ENABLE_*` variable is set, only the explicitly enabled toolsets are active:

<SimpleTable>
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
</SimpleTable>

### Precedence

When multiple variables are set, they're evaluated in this order (highest priority first):

1. `DBT_MCP_ENABLE_TOOLS` (enable specific tools by name)
2. `DISABLE_TOOLS` (disable specific tools by name)
3. Toolset enable (`DBT_MCP_ENABLE_*=true`)
4. Toolset disable (`DISABLE_*=true`)
5. Default behavior

## Semantic Layer

These variables control the behavior of Semantic Layer tools.

<SimpleTable>
| Variable | Default | Description |
| --- | --- | --- |
| `DBT_MCP_SL_METRICS_RELATED_MAX` | `10` | Maximum number of metrics for which `list_metrics` also returns dimension and entity names inline, reducing the number of tool calls needed to answer data questions. When the metric count is at or below this value, dimensions and entities are embedded directly in the `list_metrics` response. When above this value, only metric names are returned and the LLM calls `get_dimensions`/`get_entities` separately. Set to `0` to always return metrics only and never inline dimension or entity data. |
</SimpleTable>

## Logging and debugging

<SimpleTable>
| Variable | Default | Description |
| --- | --- | --- |
| `DBT_MCP_LOG_LEVEL` | `INFO` | Log level for the MCP server. Options: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`. Set to `DEBUG` temporarily to diagnose issues. |
| `MCP_TRANSPORT` | `stdio` | Transport protocol. Set to `streamable-http` for local debugging only (for example, attaching a Python debugger). See the [dbt-mcp CONTRIBUTING guide](https://github.com/dbt-labs/dbt-mcp/blob/main/CONTRIBUTING.md). |
</SimpleTable>
