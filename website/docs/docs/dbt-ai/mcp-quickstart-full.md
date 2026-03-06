---
title: "dbt platform and CLI setup"
sidebar_label: "dbt platform and CLI setup"
description: "Set up dbt MCP with local CLI commands and all dbt platform features."
id: "mcp-quickstart-full"
---

This quick start sets up dbt MCP with both local dbt CLI commands and full dbt platform features: <Constant name="semantic_layer" />, Discovery API, Admin API, and SQL execution. This is the most common production setup.

**Time to complete:** ~10 minutes

## Prerequisites

- [Install uv](https://docs.astral.sh/uv/getting-started/installation/)
- A local dbt project
- A dbt platform account with a [service token](/docs/dbt-cloud-apis/service-tokens) or [Personal Access Token (PAT)](/docs/dbt-cloud-apis/user-tokens)

:::tip Which token should I use?
- **PAT (Personal Access Token):** Required if you want to use `execute_sql`. Tied to your user account.
- **Service token:** Works for all other platform toolsets. Better for shared or team setups.

See [Choosing an auth method](/docs/dbt-ai/setup-local-mcp#choose-your-auth-method) for full guidance.
:::

## Step 1: Find your paths and IDs

You need the following values. See [Finding your IDs](/docs/dbt-ai/mcp-find-ids) for step-by-step instructions on locating each one.

| Variable | Where to find it |
| --- | --- |
| `DBT_PROJECT_DIR` | Full path to your dbt project folder (contains `dbt_project.yml`) |
| `DBT_PATH` | Full path to your dbt executable — run `which dbt` (macOS/Linux) or `where dbt` (Windows) |
| `DBT_HOST` | Your dbt platform hostname, found in **Account settings** → **Access URL** |
| `DBT_TOKEN` | A service token or PAT from **Account settings** → **API tokens** |
| `DBT_PROD_ENV_ID` | Your production environment ID, found in **Deploy** → **Environments** |
| `DBT_DEV_ENV_ID` | Your development environment ID (required for `execute_sql`) |
| `DBT_USER_ID` | Your numeric user ID (required for `execute_sql`) |
| `DBT_ACCOUNT_ID` | Your account ID (required for Admin API tools) |

:::warning Use values only, not full URLs
These variables expect hostnames or numeric IDs — not full URLs:

```bash
# ✅ Correct
DBT_HOST=cloud.getdbt.com
DBT_PROD_ENV_ID=54321
DBT_USER_ID=123

# ❌ Wrong — don't include https:// or paste URLs
DBT_HOST=https://cloud.getdbt.com
DBT_PROD_ENV_ID=https://cloud.getdbt.com/deploy/12345/projects/67890/environments/54321
DBT_USER_ID=https://cloud.getdbt.com/settings/profile
```
:::

## Step 2: Configure dbt MCP

Use the configuration below. Replace the placeholder values with your paths and IDs from Step 1. Include only the variables you need for your setup:

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_PROJECT_DIR": "/path/to/your/dbt/project",
        "DBT_PATH": "/path/to/your/dbt/executable",
        "DBT_HOST": "cloud.getdbt.com",
        "DBT_TOKEN": "your-token-here",
        "DBT_PROD_ENV_ID": "12345",
        "DBT_DEV_ENV_ID": "67890",
        "DBT_USER_ID": "123",
        "DBT_ACCOUNT_ID": "99999"
      }
    }
  }
}
```

:::tip Multi-cell accounts
If your Access URL is `abc123.us1.dbt.com`, add to `env`:
- `DBT_HOST=us1.dbt.com`
- `MULTICELL_ACCOUNT_PREFIX=abc123`

Don't include the account prefix in `DBT_HOST`.
:::

:::tip Optional: use a .env file
You can keep variables in a separate `.env` file and use uv's `--env-file` option in `args` instead of the `env` block. That approach is optional and is a feature of uv rather than dbt MCP. For most users, inline `env` (above) is simpler. See [Set up local MCP](/docs/dbt-ai/setup-local-mcp) for `.env` examples.
:::

## Step 3: Add the config to your MCP client

<Tabs>

<TabItem value="claude-desktop" label="Claude Desktop">

1. In Claude Desktop, go to **Settings** → **Developer** tab → **Edit Config**.
2. Paste the configuration from Step 2, replacing the placeholder values with your actual paths and IDs.
3. Save and restart Claude Desktop.

Config file location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

</TabItem>

<TabItem value="claude-code" label="Claude Code">

Run this command, replacing the placeholders with your actual values:

```bash
claude mcp add dbt \
-e DBT_PROJECT_DIR=/path/to/your/dbt/project \
-e DBT_PATH=/path/to/your/dbt/executable \
-e DBT_HOST=cloud.getdbt.com \
-e DBT_TOKEN=your-token-here \
-e DBT_PROD_ENV_ID=12345 \
-- uvx dbt-mcp
```

Add `-e DBT_DEV_ENV_ID=...` and `-e DBT_USER_ID=...` if you use `execute_sql`; add `-e DBT_ACCOUNT_ID=...` for Admin API.

</TabItem>

<TabItem value="cursor" label="Cursor">

1. In Cursor, open **Settings** → **MCP** → **Edit config** (or your config file).
2. Paste the configuration from Step 2, replacing the placeholder values with your actual paths and IDs.
3. Save the configuration.

</TabItem>

<TabItem value="vscode" label="VS Code">

1. Open **Settings** → **Features** → **Chat** and ensure **MCP** is enabled.
2. Open the Command Palette (`Ctrl/Cmd + Shift + P`) and select **MCP: Open User Configuration**.
3. Add the configuration to `mcp.json`, replacing the placeholder values with your actual paths and IDs.

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
        "DBT_PATH": "/path/to/your/dbt/executable",
        "DBT_HOST": "cloud.getdbt.com",
        "DBT_TOKEN": "your-token-here",
        "DBT_PROD_ENV_ID": "12345",
        "DBT_DEV_ENV_ID": "67890",
        "DBT_USER_ID": "123",
        "DBT_ACCOUNT_ID": "99999"
      }
    }
  }
}
```

</TabItem>

</Tabs>

## Step 4: Test your setup

Ask your AI assistant something that requires platform data (for example, _"What metrics are defined in my Semantic Layer?"_ or _"List all models and their last run status"_). If dbt MCP is working, the response will use your dbt metadata.

## What's available

With the full setup, your AI assistant can use:
- All dbt CLI commands (`dbt run`, `dbt build`, `dbt test`, and more)
- Semantic Layer queries
- Metadata Discovery (model lineage, test results, source freshness)
- Admin API (trigger jobs, list runs, get artifacts)
- SQL execution with `execute_sql` (PAT required)

For the complete tool list, see [Available tools](/docs/dbt-ai/about-mcp#available-tools).

## Next steps

- Control which tools are available: see the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables#tool-configuration)
- Understand toolset requirements: see [Set up local MCP](/docs/dbt-ai/setup-local-mcp#tool-requirements-at-a-glance)
- Something not working? See [MCP troubleshooting](/docs/dbt-ai/mcp-troubleshooting)
