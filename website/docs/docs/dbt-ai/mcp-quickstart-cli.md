---
title: "Local CLI setup"
sidebar_label: "Local CLI setup"
description: "Set up dbt MCP with local dbt CLI commands — no dbt platform account required."
id: "mcp-quickstart-cli"
---

This quick start walks you through connecting dbt MCP to your local dbt project. This setup gives you dbt CLI tools (run, build, test, compile, and more) inside your AI assistant without needing a dbt platform account.

**Time to complete:** ~5 minutes

## Prerequisites

- [Install uv](https://docs.astral.sh/uv/getting-started/installation/)
- A local dbt project (the folder containing your `dbt_project.yml` file)
- dbt installed locally (dbt Core, dbt Fusion, or dbt Cloud CLI)

## Step 1: Find your paths

You need two values:

**`DBT_PROJECT_DIR`** — the full path to your dbt project folder (where `dbt_project.yml` lives).

**`DBT_PATH`** — the full path to your dbt executable.

<Expandable alt_header="macOS/Linux">

Run these commands in your Terminal:

```bash
# Find DBT_PATH
which dbt
# Example output: /opt/homebrew/bin/dbt

# Find DBT_PROJECT_DIR — run from inside your project folder
pwd
# Example output: /Users/yourname/projects/my_dbt_project
```

</Expandable>

<Expandable alt_header="Windows">

Run these commands in Command Prompt or PowerShell:

```bash
# Find DBT_PATH
where dbt
# Example output: C:\Python39\Scripts\dbt.exe

# Find DBT_PROJECT_DIR — run from inside your project folder
cd
# Example output: C:\Users\yourname\projects\my_dbt_project
```

**Note:** Use forward slashes in your configuration: `C:/Python39/Scripts/dbt.exe`

</Expandable>

## Step 2: Configure dbt MCP

Use this minimal configuration, replacing the paths with your values from Step 1:

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_PROJECT_DIR": "/path/to/your/dbt/project",
        "DBT_PATH": "/path/to/your/dbt/executable"
      }
    }
  }
}
```

:::tip No clone required
You don't need to clone the dbt-mcp repository. Install [uv](https://docs.astral.sh/uv/getting-started/installation/) and run `uvx dbt-mcp` — it fetches and runs dbt-mcp for you.
:::

## Step 3: Add the config to your MCP client

<Tabs>

<TabItem value="claude-desktop" label="Claude Desktop">

1. In Claude Desktop, go to **Settings** → **Developer** tab → **Edit Config**.
2. Paste the configuration from Step 2, replacing the paths with your actual values.
3. Save and restart Claude Desktop.

Config file location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

</TabItem>

<TabItem value="claude-code" label="Claude Code">

Run this command, replacing the paths with your actual values:

```shell
claude mcp add dbt \
-e DBT_PROJECT_DIR=/path/to/your/dbt/project \
-e DBT_PATH=/path/to/your/dbt/executable \
-- uvx dbt-mcp
```

</TabItem>

<TabItem value="cursor" label="Cursor">

Click the link below with Cursor open to auto-configure:

[Add dbt Core or Fusion to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX1BST0pFQ1RfRElSIjoiL3BhdGgvdG8veW91ci9kYnQvcHJvamVjdCIsIkRCVF9QQVRIIjoiL3BhdGgvdG8veW91ci9kYnQvZXhlY3V0YWJsZSJ9LCJjb21tYW5kIjoidXZ4IiwiYXJncyI6WyJkYnQtbWNwIl19)

After clicking:
1. Update `DBT_PROJECT_DIR` with the full path to your dbt project.
2. Update `DBT_PATH` with the full path to your dbt executable (from Step 1).
3. Save the configuration.

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
        "DBT_PROJECT_DIR": "/path/to/your/dbt/project",
        "DBT_PATH": "/path/to/your/dbt/executable"
      }
    }
  }
}
```

Replace the paths with your actual values and save.

</TabItem>

</Tabs>

## Step 4: Test your setup

Ask your AI assistant to run a dbt command (for example, _"Run `dbt compile` on my project"_ or _"List all models in my project"_).

To verify from the command line:

```bash
uvx dbt-mcp
```

No errors means your setup is working.

## What's available

With CLI-only setup, your AI assistant can use:
- `dbt run`, `dbt build`, `dbt test`, `dbt compile`, `dbt list`, `dbt parse`, `dbt show`
- Model lineage and node details from your local project
- Codegen tools (when enabled — see [Environment variables reference](/docs/dbt-ai/mcp-environment-variables))

Platform features like Semantic Layer, Discovery API, and metadata queries require a dbt platform account. To add them, see the [Full setup quick start](/docs/dbt-ai/mcp-quickstart-full).

## Next steps

- Add dbt platform features: see the [Full setup quick start](/docs/dbt-ai/mcp-quickstart-full)
- Use OAuth instead of path-based config: see the [OAuth quick start](/docs/dbt-ai/mcp-quickstart-oauth)
- Configure toolsets or disable specific tools: see the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables)
- Something not working? See [MCP troubleshooting](/docs/dbt-ai/mcp-troubleshooting)
