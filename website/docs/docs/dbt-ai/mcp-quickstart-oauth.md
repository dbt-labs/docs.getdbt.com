---
title: "dbt platform account setup"
sidebar_label: "dbt platform setup"
description: "Set up dbt MCP with the dbt platform account using OAuth authentication — no tokens required."
id: "mcp-quickstart-oauth"
---

import StaticSubdomainRequired from '/snippets/_static-subdomain-required.md';
import MCPExample from '/snippets/_mcp-config-files.md';

This quickstart walks you through connecting dbt MCP to your dbt platform account using OAuth. OAuth is the fastest first-time setup — no tokens to copy or manage.

**Time to complete:** ~5 minutes

## Prerequisites

- A dbt platform account

<StaticSubdomainRequired />

:::note Installing uv
Installing [uv](https://docs.astral.sh/uv/getting-started/installation/) is **not** required for Claude Desktop. For Cursor, VS Code, and Claude Code, you need uv to run `uvx dbt-mcp`; install it when you set up those clients.
:::

## Step 1: Find your Access URL

1. Log in to your dbt platform account.
2. Go to **Account settings** and copy your **Access URL** (for example, `abc123.us1.dbt.com`).

## Step 2: Add the config to your MCP client

Use the configuration below for manual setup. Replace `<your-dbt-host-with-custom-subdomain>` with your Access URL from Step 1.

<MCPExample />

:::tip No clone required
You don't need to clone the dbt-mcp repository. For clients that use the local server (Cursor, VS Code, Claude Code), [install uv](https://docs.astral.sh/uv/getting-started/installation/) and run `uvx dbt-mcp` — it fetches and runs dbt-mcp for you.
:::

<Tabs>

<TabItem value="claude-desktop" label="Claude Desktop">

**Option A: Quick install (recommended)**

1. Go to the [latest dbt MCP release](https://github.com/dbt-labs/dbt-mcp/releases/latest) and download `dbt-mcp.mcpb`.
2. Double-click the file to open it in Claude Desktop.
3. Enter your **Access URL** as the dbt Platform Host.
4. Enable the server.

**Option B: Manual config**

1. In Claude Desktop, go to **Settings** → **Developer** tab → **Edit Config**.
2. Paste the configuration above into the config file.
3. Save and restart Claude Desktop. A server indicator appears in the bottom-right corner of the input box.

Config file location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

</TabItem>

<TabItem value="claude-code" label="Claude Code">

Run this command, replacing `your-host-with-subdomain` with your Access URL:

```shell
claude mcp add dbt \
-e DBT_HOST=your-host-with-subdomain \
-- uvx dbt-mcp
```

For example, if your Access URL is `abc123.us1.dbt.com`:

```shell
claude mcp add dbt \
-e DBT_HOST=abc123.us1.dbt.com \
-- uvx dbt-mcp
```

</TabItem>

<TabItem value="cursor" label="Cursor">

Click a link below with Cursor open to auto-configure, then replace the placeholder with your Access URL:

- [dbt platform only (OAuth)](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJodHRwczovLzx5b3VyLWRidC1ob3N0LXdpdGgtY3VzdG9tLXN1YmRvbWFpbj4iLCJESVNBQkxFX0RCVF9DTEkiOiJ0cnVlIn0sImNvbW1hbmQiOiJ1dngiLCJhcmdzIjpbImRidC1tY3AiXX0%3D) — platform features only, no CLI
- [dbt platform + CLI (OAuth)](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJodHRwczovLzx5b3VyLWRidC1ob3N0LXdpdGgtY3VzdG9tLXN1YmRvbWFpbj4iLCJEQlRfUFJPSkVDVF9ESVIiOiIvcGF0aC90by9wcm9qZWN0IiwiREJUX1BBVEgiOiJwYXRoL3RvL2RidC9leGVjdXRhYmxlIn0sImNvbW1hbmQiOiJ1dngiLCJhcmdzIjpbImRidC1tY3AiXX0%3D) — platform features + local CLI commands

After clicking, replace `<your-dbt-host-with-custom-subdomain>` with your actual Access URL (for example, `abc123.us1.dbt.com`) and save.

</TabItem>

<TabItem value="vscode" label="VS Code">

1. Open **Settings** → **Features** → **Chat** and ensure **MCP** is enabled.
2. Open the Command Palette (`Ctrl/Cmd + Shift + P`) and select **MCP: Open User Configuration**.
3. Add the configuration to `mcp.json`.

:::note VS Code uses `"servers"`, not `"mcpServers"`
:::

```json
{
  "servers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_HOST": "https://<your-dbt-host-with-custom-subdomain>"
      }
    }
  }
}
```

Replace `<your-dbt-host-with-custom-subdomain>` with your Access URL (for example, `abc123.us1.dbt.com`) and save.

</TabItem>

</Tabs>

## Step 3: Authenticate

The first time you connect, dbt MCP opens a browser window to complete OAuth. After signing in, your session is saved and future connections are automatic.

If authentication doesn't start, close your client and run:
- macOS/Linux: `rm -f ~/.dbt/mcp.yml ~/.dbt/mcp.lock`
- Windows: `Remove-Item -Force $env:USERPROFILE\.dbt\mcp.yml, $env:USERPROFILE\.dbt\mcp.lock`

Then restart your client.

## Step 4: Test your setup

Test the setup by asking a data-related question in your client (for example, _"What models are in my dbt project?"_ or _"Which metrics are available?"_). If dbt MCP is working, the response will use your dbt metadata and you'll see the MCP server in use (for example, a server indicator in Claude Desktop).

## Next steps

- Add local dbt CLI commands: see the [CLI-only quick start](/docs/dbt-ai/mcp-quickstart-cli)
- Add all platform features with tokens: see the [Full setup quick start](/docs/dbt-ai/mcp-quickstart-full)
- Configure specific toolsets: see the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables)
- Something not working? See [MCP troubleshooting](/docs/dbt-ai/mcp-troubleshooting)
