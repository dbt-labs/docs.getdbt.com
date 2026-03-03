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

## Step 2: Create your `.env` file

Create a file named `.env` in your dbt project root (same folder as `dbt_project.yml`). Add only the variables you need:

```bash
# Required for dbt CLI
DBT_PROJECT_DIR=/path/to/your/dbt/project
DBT_PATH=/path/to/your/dbt/executable

# Required for platform features
DBT_HOST=cloud.getdbt.com
DBT_TOKEN=your-token-here
DBT_PROD_ENV_ID=12345

# Required for execute_sql (PAT only)
DBT_DEV_ENV_ID=67890
DBT_USER_ID=123

# Required for Admin API
DBT_ACCOUNT_ID=99999
```

:::tip Multi-cell accounts
If your Access URL is `abc123.us1.dbt.com`, set:
- `DBT_HOST=us1.dbt.com`
- `MULTICELL_ACCOUNT_PREFIX=abc123`

Don't include the account prefix in `DBT_HOST`.
:::

## Step 3: Add the config to your MCP client

<Tabs>

<TabItem value="claude-desktop" label="Claude Desktop">

1. In Claude Desktop, go to **Settings** → **Developer** tab → **Edit Config**.
2. Add this configuration, replacing the `.env` path with your absolute path:

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": [
        "--env-file",
        "/absolute/path/to/your-dbt-project/.env",
        "dbt-mcp"
      ]
    }
  }
}
```

3. Save and restart Claude Desktop.

Config file location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

</TabItem>

<TabItem value="claude-code" label="Claude Code">

Run this command, replacing the path with the absolute path to your `.env` file:

```bash
claude mcp add dbt -- uvx --env-file /absolute/path/to/your-dbt-project/.env dbt-mcp
```

</TabItem>

<TabItem value="cursor" label="Cursor">

1. Click the link below with Cursor open:

   [Add to Cursor (with .env file)](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt-mcp&config=eyJjb21tYW5kIjoidXZ4IC0tZW52LWZpbGUgPGVudi1maWxlLXBhdGg%252BIGRidC1tY3AifQ%3D%3D)

2. Replace `<env-file-path>` with the absolute path to your `.env` file (for example, `/absolute/path/to/your-dbt-project/.env`).
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
      "args": [
        "--env-file",
        "/absolute/path/to/your-dbt-project/.env",
        "dbt-mcp"
      ]
    }
  }
}
```

Replace the path with the absolute path to your `.env` file and save.

</TabItem>

</Tabs>

## Step 4: Test your setup

Verify from the command line:

```bash
uvx --env-file /absolute/path/to/your-dbt-project/.env dbt-mcp
```

No errors means your configuration is correct.

Then ask your AI assistant something that requires platform data (for example, _"What metrics are defined in my Semantic Layer?"_ or _"List all models and their last run status"_).

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
