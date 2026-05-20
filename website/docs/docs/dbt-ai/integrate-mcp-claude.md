---
title: "Integrate Claude with dbt MCP"
sidebar_label: "Integrate Claude with MCP"
description: "Guide to set up claude with dbt-mcp"
id: "integrate-mcp-claude"
---

import McpClaudeLocalJsonExpandables from '/snippets/_mcp-claude-local-json-expandables.md';
import StaticSubdomainRequired from '/snippets/_static-subdomain-required.md';
import MCPRemoteOauthBetaCallout from '/snippets/_mcp-remote-oauth-beta-callout.md';
import MCPRemoteServerUrl from '/snippets/_mcp-remote-server-url.md';
import MCPRemoteTokenHeaders from '/snippets/_mcp-remote-token-headers.md';
import MCPOauthPreflight from '/snippets/_mcp-oauth-preflight.md';

Claude is an AI assistant from Anthropic with two primary interfaces:
- [Claude Desktop](#claude-desktop): A GUI with MCP support for file access and commands, plus basic coding features.
- [Claude Code](#claude-code): A terminal/IDE tool for development.

Both interfaces can connect to either:
- Local dbt MCP server (runs on your machine, supports CLI commands like `dbt run`) 
- Remote dbt MCP server (HTTP, no install, consumption-focused). 

## Prerequisites

- You use Claude for AI or agentic work
- For OAuth (local or remote), use your [access URL with a static subdomain](/docs/platform/about-platform/access-regions-ip-addresses).

<StaticSubdomainRequired />

## Claude Desktop

[Claude Desktop](https://claude.ai/download) reads MCP servers from `claude_desktop_config.json`. Open it from **Settings &rarr; Developer &rarr; Edit Config**.

### Set up with local dbt MCP server {#desktop-local}

For a fast first install, you can download the prebuilt `.mcpb` file; for more control, edit the JSON directly.

:::tip
You don't need to clone the dbt-mcp repository &mdash; for local setups, install [uv](https://docs.astral.sh/uv/getting-started/installation/) and run `uvx dbt-mcp` (or use the configs later in this page). Only clone the repository if you want to [contribute to dbt MCP](https://github.com/dbt-labs/dbt-mcp/issues).
:::

#### Quick install with the .mcpb file

1. Go to the [latest dbt MCP release](https://github.com/dbt-labs/dbt-mcp/releases/latest) and download the `dbt-mcp.mcpb` file.
2. Double-click the downloaded file to open it in Claude Desktop.
3. Configure the **<Constant name="dbt_platform"/> Host**. You can find this in your <Constant name="dbt_platform" /> account by navigating to **Account settings** and copying the **Access URL**.
4. Enable the server in Claude Desktop.
5. Ask Claude a data-related question and see dbt MCP in action!

#### Advanced config with Claude Desktop {#advanced-config-with-claude-desktop}

Use advanced configuration when you want to define the dbt MCP server yourself in Claude's configuration file &mdash; the same JSON where Claude stores every MCP server, under `mcpServers`, with fields like `command`, `args`, and `env`. See the [MCP install pattern](https://modelcontextprotocol.io/quickstart/user#installing-the-filesystem-server) for the underlying convention.

To open the configuration file and add or replace the dbt MCP server entry:
1. From Claude, go to **Settings…**
2. In the Settings window, select the **Developer** tab.
3. Click **Edit Config** and open the file in a text editor.
4. Add your server configuration under `mcpServers`. Choose the option that fits your use case:

    <McpClaudeLocalJsonExpandables />

5. Save the file and restart Claude Desktop. You'll see an MCP server indicator in the bottom-right corner of the conversation input box.

For more configuration options (env vars, service tokens, tool-access controls), refer to [Set up local MCP](/docs/dbt-ai/setup-local-mcp).

### Set up with remote dbt MCP server {#desktop-remote}

The remote dbt MCP server runs in <Constant name="dbt_platform" /> &mdash; no `uvx` or local install needed. Claude Desktop connects to it over HTTP.

<MCPRemoteOauthBetaCallout />

1. From Claude Desktop, go to **Settings &rarr; Developer &rarr; Edit Config** to open `claude_desktop_config.json`.
2. Get your MCP URL:

    <MCPRemoteServerUrl />

3. Add a `dbt` entry under `mcpServers`, using the tab that matches your auth method:

    <Tabs>
    <TabItem value="oauth" label="OAuth (remote)">

    _OAuth is in private beta for Enterprise and Enterprise+ accounts._

    <MCPOauthPreflight />

    Add the following to `claude_desktop_config.json`. Claude Desktop opens a browser for sign-in and consent the first time the server connects.

    ```json
    {
      "mcpServers": {
        "dbt": {
          "type": "http",
          "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/"
        }
      }
    }
    ```

    Replace `YOUR_DBT_HOST_URL` with your hostname (for example, `abc123.us1.dbt.com`). You can find the URL in <Constant name="dbt_platform"/> under **Account settings** &rarr; **Access URLs** &rarr; **MCP Endpoint URL**.

    </TabItem>
    <TabItem value="token" label="Token-based">

    Use token-based auth when your client doesn't yet support OAuth for HTTP MCP servers, or when you need a shared/CI setup.

    ```json
    {
      "mcpServers": {
        "dbt": {
          "type": "http",
          "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/",
          "headers": {
            "Authorization": "Token YOUR_DBT_ACCESS_TOKEN",
            "x-dbt-prod-environment-id": "DBT_PROD_ENV_ID",
            "x-dbt-user-id": "DBT_USER_ID",
            "x-dbt-dev-environment-id": "DBT_DEV_ENV_ID"
          }
        }
      }
    }
    ```

    <MCPRemoteTokenHeaders />

    </TabItem>
    </Tabs>

4. Save the file and restart Claude Desktop. Ask Claude a data question to confirm the server is connected.

## Claude Code

[Claude Code](https://www.anthropic.com/claude-code) reads MCP servers from `.mcp.json` at the root of your project (the repository root for your workspace). If you already configured the dbt MCP server for another client, you can reuse the same JSON shape here &mdash; you don't need a second, separate registration.

### Set up with local dbt MCP server {#code-local}

:::tip
You don't need to clone the dbt-mcp repository &mdash; for local setups, install [uv](https://docs.astral.sh/uv/getting-started/installation/) and run `uvx dbt-mcp` (or use the configs later in this page). Only clone the repository if you want to [contribute to dbt MCP](https://github.com/dbt-labs/dbt-mcp/issues).
:::

1. Follow [Set up local MCP](/docs/dbt-ai/setup-local-mcp) to choose your auth pattern:
   - OAuth with the <Constant name="dbt_platform" />
   - [CLI only](/docs/dbt-ai/setup-local-mcp#cli-only)
   - [Environment variables](/docs/dbt-ai/setup-local-mcp#environment-variable-configuration) (including an `.env` file with `--env-file`)
2. Create `.mcp.json` at the project root and add a `dbt` entry under the top-level `mcpServers` key. Pick the option that fits your use case:

    <McpClaudeLocalJsonExpandables />

:::note About `claude mcp add`
The Claude Code CLI can register MCP servers with `claude mcp add`, but it typically writes to the user-level config (`~/.claude.json`) rather than the project's `.mcp.json`. For dbt MCP, we recommend committing `.mcp.json` to your repository so the setup is project-scoped and easier to share.
:::

### Set up with remote dbt MCP server {#code-remote}

Claude Code can connect to the remote dbt MCP server over HTTP &mdash; same JSON shape as Claude Desktop, lives in `.mcp.json` instead of `claude_desktop_config.json`.

<MCPRemoteOauthBetaCallout />

1. Open `.mcp.json` at the root of your project (create it if it doesn't exist).
2. Get your MCP URL:

    <MCPRemoteServerUrl />

3. Add the `dbt` entry to `.mcp.json` using the tab that matches your auth method:

    <Tabs>
    <TabItem value="oauth" label="OAuth (remote)">

    _OAuth is in private beta for Enterprise and Enterprise+ accounts._

    <MCPOauthPreflight />

    Add the following to `.mcp.json` at your project root. On first connect, Claude Code opens a browser for sign-in and consent.

    ```json
    {
      "mcpServers": {
        "dbt": {
          "type": "http",
          "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/"
        }
      }
    }
    ```

    Replace `YOUR_DBT_HOST_URL` with your hostname (for example, `abc123.us1.dbt.com`). You can find the URL in <Constant name="dbt_platform"/> under **Account settings** &rarr; **Access URLs** &rarr; **MCP Endpoint URL**.

    You can also register the same server from the CLI:

    ```bash
    claude mcp add --transport http dbt https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/
    ```

    </TabItem>
    <TabItem value="token" label="Token-based">

    ```json
    {
      "mcpServers": {
        "dbt": {
          "type": "http",
          "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/",
          "headers": {
            "Authorization": "Token YOUR_DBT_ACCESS_TOKEN",
            "x-dbt-prod-environment-id": "DBT_PROD_ENV_ID",
            "x-dbt-user-id": "DBT_USER_ID",
            "x-dbt-dev-environment-id": "DBT_DEV_ENV_ID"
          }
        }
      }
    }
    ```

    <MCPRemoteTokenHeaders />

    </TabItem>
    </Tabs>

4. Save the file. Claude Code picks up `.mcp.json` on startup &mdash; ask it a data question to confirm the connection.

## Troubleshooting
<Expandable alt_header="Claude Desktop errors">

Claude Desktop may return errors such as `Error: spawn uvx ENOENT` or `Could not connect to MCP server dbt-mcp`. For local setups, replace the `command` with the full path to `uvx`: run `which uvx` on Unix systems or `where uvx` on Windows and paste the full path into your JSON (for example, `"command": "/the/full/path/to/uvx"`). For remote setups, double-check that `url` ends in `/api/ai/v1/mcp/` and that your `Authorization` header is `Token YOUR_DBT_ACCESS_TOKEN` or `Bearer YOUR_DBT_ACCESS_TOKEN`.

Logs are at `~/Library/Logs/Claude` (macOS) or `%APPDATA%\Claude\logs` (Windows).
</Expandable>

<Expandable alt_header="Claude Code">

If the dbt MCP server doesn't connect, confirm `.mcp.json` is at the _project root_ and that the `dbt` block matches one of the examples on this page. For local setups, apply the same full-path fix for `uvx` (and for `--env-file` paths). For remote setups, verify the URL and headers, and try the equivalent `claude mcp add --transport http` command to compare.
</Expandable>
