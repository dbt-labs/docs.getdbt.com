---
title: "Integrate Claude with dbt MCP"
sidebar_label: "Integrate Claude with MCP"
description: "Guide to set up claude with dbt-mcp"
id: "integrate-mcp-claude"
---

import McpClaudeLocalJsonExpandables from '/snippets/_mcp-claude-local-json-expandables.md';
import StaticSubdomainRequired from '/snippets/_static-subdomain-required.md';

Claude is an AI assistant from Anthropic with two primary interfaces:
- [Claude Desktop](https://claude.ai/download): A GUI with MCP support for file access and commands as well as basic coding features
- [Claude Code](https://www.anthropic.com/claude-code): A terminal/IDE tool for development

You don't need to clone the dbt-mcp repository &mdash; install [uv](https://docs.astral.sh/uv/getting-started/installation/) and run `uvx dbt-mcp` (or use the configs later in this page). Only clone the repository if you want to [contribute to dbt MCP](https://github.com/dbt-labs/dbt-mcp/issues).


## Claude Desktop

<StaticSubdomainRequired />

OAuth and advanced JSON configurations use your [access URL with a static subdomain](/docs/platform/about-platform/access-regions-ip-addresses).

To configure Claude Desktop to use the dbt MCP server:
1. Go to the [latest dbt MCP release](https://github.com/dbt-labs/dbt-mcp/releases/latest) and download the `dbt-mcp.mcpb` file.
2. Double-click the downloaded file to open it in Claude Desktop.
3. Configure the **<Constant name="dbt_platform"/> Host**. You can find this in your <Constant name="dbt_platform" /> account by navigating to **Account settings** and copying the **Access URL**.
4. Enable the server in Claude Desktop.
5. Ask Claude a data-related question and see dbt MCP in action!

### Advanced config with Claude Desktop {#advanced-config-with-claude-desktop}

Use advanced configuration when you want to define the dbt MCP server yourself in Claude’s configuration file: the same JSON where Claude stores every MCP server, under `mcpServers`, with fields such as `command`, `args`, and `env`.

See the [MCP install pattern](https://modelcontextprotocol.io/quickstart/user#installing-the-filesystem-server) for more info on how to configure the dbt MCP server in Claude's configuration file.

To open the configuration file and add or replace the dbt MCP server entry:
1. Go to the Claude settings and select **Settings…**.
2. In the Settings window, navigate to the **Developer** tab in the left sidebar. This section contains options for configuring MCP servers and other developer features.
3. Click the **Edit Config** button and open the configuration file with a text editor.
4. Add your server configuration based on your use case. Choose the [correct JSON structure](https://modelcontextprotocol.io/quickstart/user#installing-the-filesystem-server) from the following options and paste the `dbt` entry under `mcpServers` in this file:

    <McpClaudeLocalJsonExpandables />

Save the file. Upon a successful restart of Claude Desktop, you'll see an MCP server indicator in the bottom-right corner of the conversation input box.

For debugging, you can find the Claude desktop logs at `~/Library/Logs/Claude` for Mac or `%APPDATA%\Claude\logs` for Windows.

## Claude Code

If you use OAuth in the JSON patterns mentioned in the next section, you need a [static subdomain](/docs/platform/about-platform/access-regions-ip-addresses) for your access URL (see the callout under [Claude Desktop](#claude-desktop) on this page).

You can set up Claude Code with both the local and remote `dbt-mcp` server. We recommend using the local `dbt-mcp` for more developer-focused workloads. See the [About MCP](/docs/dbt-ai/about-mcp#server-access) page for more information about local and remote server features.

### Set up with local dbt MCP server

1. Follow [Set up local MCP](/docs/dbt-ai/setup-local-mcp) and choose the configuration that matches your use case: 
   - OAuth with the <Constant name="dbt_platform" />
   - [CLI only](/docs/dbt-ai/setup-local-mcp#cli-only)
   - [environment variables](/docs/dbt-ai/setup-local-mcp#environment-variable-configuration) (including an `.env` file with `--env-file` for `dbt-mcp`, if you use that pattern).
2. Add the same `dbt` server definition to `.mcp.json` at your project root (the repository root for your workspace). Claude Code loads MCP servers from this file. 
3. Use the same `mcpServers` JSON shape as in [Set up local MCP](/docs/dbt-ai/setup-local-mcp) (`command`, `args`, and `env`, or `args` with `--env-file`), matching the patterns in next [Example config in `.mcp.json`](#example-config-in-mcpjson) section.

If you already completed local MCP setup for another client, reuse that `dbt` entry in `.mcp.json` &mdash; you don't need a second, separate registration step for Claude Code.

### Example config in `.mcp.json` {#example-config-in-mcp-json}

Put your `dbt` server under the top-level `mcpServers` key. The following expandable options use the same JSON as [Set up local MCP](/docs/dbt-ai/setup-local-mcp) and [Advanced config with Claude Desktop](#advanced-config-with-claude-desktop) on this page.

<McpClaudeLocalJsonExpandables />

:::note About `claude mcp add`
The Claude Code CLI can register MCP servers with `claude mcp add`, which typically writes local-level configuration. This is still on a per-project basis, but the config is written in the users root directory config (`~/.claude.json`). This is not obvious and hard to keep track of. For dbt MCP, we recommend `.mcp.json` in your repository so the setup is project-scoped and easier to share and troubleshoot.
:::

## Troubleshooting
<Expandable alt_header="Claude Desktop errors">

Claude Desktop may return errors such as `Error: spawn uvx ENOENT` or `Could not connect to MCP server dbt-mcp`. Try replacing the command and environment variables file path with the full path. For `uvx`, find the full path to `uvx` by running `which uvx` on Unix systems and placing this full path in the JSON. For instance: `"command": "/the/full/path/to/uvx"`.
</Expandable>

<Expandable alt_header="Claude Code">

If the dbt MCP server doesn't connect, confirm `.mcp.json` is at the _project root_ and that the `dbt` block matches [Example configuration in `.mcp.json`](#example-config-in-mcpjson) and [Set up local MCP](/docs/dbt-ai/setup-local-mcp). Use the same full-path fixes for `uvx` (and for `--env-file` paths) as for Claude Desktop.
</Expandable>
