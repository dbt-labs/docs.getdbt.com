import StaticSubdomainRequired from '/snippets/_static-subdomain-required.md';
import MCPFaqOauth from '/snippets/_mcp-faq-oauth.md';
import MCPFaqUvx from '/snippets/_mcp-faq-uvx.md';
import MCPFaqServerNotStarting from '/snippets/_mcp-faq-server-not-starting.md';
import MCPFaqExecuteSql from '/snippets/_mcp-faq-execute-sql.md';
import MCPFaqToolsetDisabled from '/snippets/_mcp-faq-toolset-disabled.md';
import MCPFaqUrlsVsIds from '/snippets/_mcp-faq-urls-vs-ids.md';
import MCPFaqMulticell from '/snippets/_mcp-faq-multicell.md';


This quickstart uses the local MCP server: it runs on your machine using `uvx dbt-mcp`, connects to your <Constant name="dbt_platform"/> for <Constant name="semantic_layer"/>, Discovery, and SQL, and optionally runs local <Constant name="core" /> or <Constant name="fusion" /> CLI. 

For local CLI only (with or without a <Constant name="dbt_platform"/> account), see [Run dbt locally](/docs/dbt-ai/mcp-quickstart-cli) or [Run dbt Wizard locally](/docs/dbt-ai/wizard-quickstart).

 To configure or disable specific tools, see the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables). 

## Prerequisites

- [Install uv](https://docs.astral.sh/uv/getting-started/installation/)
- A [<Constant name="dbt_platform"/> account](https://www.getdbt.com/signup)
- For OAuth connections:
  - MCP OAuth is available for Starter, Enterprise, and Enterprise+ plans.
  - An account admin has to enable AI features on your <Constant name="dbt_platform"/> account. Refer to [Enable AI features](/docs/platform/enable-dbt-ai) for more info.

## Step 1: Choose your auth method and configure

<Tabs groupId="auth">

<TabItem value="oauth" label="OAuth">

_MCP OAuth is available in public beta for Starter, Enterprise, and Enterprise+ accounts._

OAuth is the fastest setup for <Constant name="dbt_platform"/> accounts, no tokens to copy or manage. A browser window opens to authenticate the first time you connect. 

For OAuth _without_ a local install, use the [remote MCP server](/docs/dbt-ai/mcp-quickstart-remote). If your client does not support OAuth or you need token-based access, use [token-based authentication](/docs/dbt-ai/setup-remote-mcp#token-based-authentication).

<StaticSubdomainRequired />

#### Find your Access URL

1. Log in to your <Constant name="dbt_platform"/> account.
2. Go to **Account settings** and copy your **Access URL** (for example, `abc123.us1.dbt.com`). 

:::tip Multi-cell and DBT_HOST format
- The `DBT_HOST` field accepts both `abc123.us1.dbt.com` and `https://abc123.us1.dbt.com`.

- If your Access URL is `abc123.us1.dbt.com`, split it into two variables:
  - `DBT_HOST=us1.dbt.com`
  - `MULTICELL_ACCOUNT_PREFIX=abc123`
  Don't include the account prefix in `DBT_HOST`. For more details, see [multi-cell configuration examples](/docs/dbt-ai/setup-local-mcp#api-and-sql-tool-settings).
:::

#### Add the config to your MCP client

<Tabs>

<TabItem value="claude-desktop" label="Claude Desktop">

**Option A: Quick install (recommended)**

1. Go to the [latest dbt MCP release](https://github.com/dbt-labs/dbt-mcp/releases/latest) and download `dbt-mcp.mcpb`.
2. Double-click the file to open it in Claude Desktop.
3. Enter your **Access URL** as the <Constant name="dbt_platform"/> Host.
4. Enable the server.

**Option B: Manual config**

1. In Claude Desktop, go to **Settings** → **Developer** tab → **Edit Config**.
2. Paste the following configuration, replacing `YOUR-ACCESS-URL` with your Access URL:

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_HOST": "YOUR-ACCESS-URL"
      }
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

Run this command, replacing `YOUR-ACCESS-URL` with your Access URL:

```shell
claude mcp add dbt \
-e DBT_HOST=YOUR-ACCESS-URL \
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

- [<Constant name="dbt_platform"/> only (OAuth)](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJZT1VSLUFDQ0VTUy1VUkwiLCJESVNBQkxFX0RCVF9DTEkiOiJ0cnVlIn0sImNvbW1hbmQiOiJ1dngiLCJhcmdzIjpbImRidC1tY3AiXX0%3D) — platform features only, no CLI
- [<Constant name="dbt_platform"/> + CLI (OAuth)](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJZT1VSLUFDQ0VTUy1VUkwiLCJEQlRfUFJPSkVDVF9ESVIiOiIvcGF0aC90by9wcm9qZWN0IiwiREJUX1BBVEgiOiJwYXRoL3RvL2RidC9leGVjdXRhYmxlIn0sImNvbW1hbmQiOiJ1dngiLCJhcmdzIjpbImRidC1tY3AiXX0%3D) — platform features + local CLI commands

After clicking, replace `YOUR-ACCESS-URL` with your actual Access URL (for example, `abc123.us1.dbt.com`) and save.

</TabItem>

<TabItem value="vscode" label="VS Code">

1. Open **Settings** → **Features** → **Chat** and ensure **MCP** is enabled.
2. Open the Command Palette (`Ctrl/Cmd + Shift + P`) and select **MCP: Open User Configuration**.
3. Add the following configuration to `mcp.json`:

:::note VS Code uses `"servers"`, not `"mcpServers"`
:::

```json
{
  "servers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_HOST": "YOUR-ACCESS-URL"
      }
    }
  }
}
```

Replace `YOUR-ACCESS-URL` with your Access URL (for example, `abc123.us1.dbt.com`) and save.

</TabItem>

</Tabs>

#### Optional: Add local CLI commands

To also run <Constant name="platform_cli"/> commands (`dbt run`, `dbt build`, `dbt test`, and more), add these two variables to your `env` block:

```json
"DBT_PROJECT_DIR": "/path/to/your/dbt/project",
"DBT_PATH": "/path/to/your/dbt/executable"
```

Find `DBT_PATH` by running `which dbt` (macOS/Linux) or `where dbt` (Windows). `DBT_PROJECT_DIR` is the folder containing your `dbt_project.yml`.


</TabItem>

<TabItem value="tokens" label="Tokens">

Token-based auth gives you more control and is better for shared or team setups. You'll need a service token or Personal Access Token (PAT).

:::tip Which token should I use?
- **PAT (Personal Access Token):** Required if you want to use `execute_sql`. Tied to your user account.
- **Service token:** Works for all other platform toolsets. Better for shared or team setups.

See [Choosing an auth method](/docs/dbt-ai/setup-local-mcp#choose-your-auth-method) for full guidance.
:::

### Find your paths and IDs

You need the following values. See [Finding your IDs](/docs/dbt-ai/mcp-find-ids) for step-by-step instructions.

| Variable | Where to find it |
| --- | --- |
| `DBT_HOST` | Your <Constant name="dbt_platform"/> hostname, found in **Account settings** → **Access URL** |
| `DBT_TOKEN` | A service token or PAT from **Account settings** → **API tokens** |
| `DBT_PROD_ENV_ID` | Your production environment ID, found in **Deploy** → **Environments** |
| `DBT_DEV_ENV_ID` | Your development environment ID (required for `execute_sql`) |
| `DBT_USER_ID` | Your numeric user ID (required for `execute_sql`) |
| `DBT_ACCOUNT_ID` | Your account ID (required for Admin API tools) |

:::warning Use values only, not full URLs
These variables expect hostnames or numeric IDs — not full URLs:

```bash
# ✅ Correct
DBT_HOST=cloud.getdbt.com            # https://cloud.getdbt.com also works
DBT_PROD_ENV_ID=54321
DBT_USER_ID=123

# ❌ Wrong — IDs must be numeric, not full URLs
DBT_PROD_ENV_ID=https://cloud.getdbt.com/deploy/12345/projects/67890/environments/54321
DBT_USER_ID=https://cloud.getdbt.com/settings/profile
```

:::

:::tip Multi-cell accounts
If your Access URL is `abc123.us1.dbt.com`, split it into two variables:
- `DBT_HOST=us1.dbt.com`
- `MULTICELL_ACCOUNT_PREFIX=abc123`

Don't include the account prefix in `DBT_HOST`. For more details, see [multi-cell configuration examples](/docs/dbt-ai/setup-local-mcp#api-and-sql-tool-settings).
:::

### Add the config to your MCP client

Use the configuration below, replacing the placeholder values with your IDs from above. Include only the variables you need:

<Tabs>

<TabItem value="claude-desktop-token" label="Claude Desktop">

1. In Claude Desktop, go to **Settings** → **Developer** tab → **Edit Config**.
2. Paste the following configuration, replacing the placeholder values:

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
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

3. Save and restart Claude Desktop.

Config file location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

</TabItem>

<TabItem value="claude-code-token" label="Claude Code">

Run this command, replacing the placeholders with your actual values:

```bash
claude mcp add dbt \
-e DBT_HOST=cloud.getdbt.com \
-e DBT_TOKEN=your-token-here \
-e DBT_PROD_ENV_ID=12345 \
-- uvx dbt-mcp
```

Add `-e DBT_DEV_ENV_ID=...` and `-e DBT_USER_ID=...` if you use `execute_sql`; add `-e DBT_ACCOUNT_ID=...` for Admin API.

</TabItem>

<TabItem value="cursor-token" label="Cursor">

1. In Cursor, open **Settings** → **MCP** → **Edit config** (or your config file).
2. Paste the following configuration, replacing the placeholder values:

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
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

3. Save the configuration.

</TabItem>

<TabItem value="vscode-token" label="VS Code">

1. Open **Settings** → **Features** → **Chat** and ensure **MCP** is enabled.
2. Open the Command Palette (`Ctrl/Cmd + Shift + P`) and select **MCP: Open User Configuration**.
3. Add the following configuration to `mcp.json`:

:::note VS Code uses `"servers"`, not `"mcpServers"`
:::

```json
{
  "servers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
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

4. Save `mcp.json` and restart VS Code.  

</TabItem>

</Tabs>

<Expandable alt_header="Optional: add local CLI commands">

To also run dbt commands (`dbt run`, `dbt build`, `dbt test`, and more), add these two variables to your `env` block:

```json
"DBT_PROJECT_DIR": "/path/to/your/dbt/project",
"DBT_PATH": "/path/to/your/dbt/executable"
```

Find `DBT_PATH` by running `which dbt` (macOS/Linux) or `where dbt` (Windows). `DBT_PROJECT_DIR` is the folder containing your `dbt_project.yml`.

</Expandable>

</TabItem>

</Tabs>

## Step 2: Authenticate

<Tabs groupId="auth">

<TabItem value="oauth" label="OAuth">

The first time you connect, dbt MCP opens a browser window to complete OAuth. After signing in, your session is saved and future connections are automatic.

If authentication doesn't start, close your client and run:
- macOS/Linux: `rm -f ~/.dbt/mcp.yml ~/.dbt/mcp.lock`
- Windows: `Remove-Item -Force $env:USERPROFILE\.dbt\mcp.yml, $env:USERPROFILE\.dbt\mcp.lock`

Then restart your client.

</TabItem>

<TabItem value="tokens" label="Tokens">

No additional authentication step is needed — your token is already in the configuration. The server connects automatically when your MCP client starts.

</TabItem>

</Tabs>

## Step 3: Test your setup

Ask your AI assistant a data-related question (for example, _"What models are in my dbt project?"_ or _"What metrics are defined in my Semantic Layer?"_). If dbt MCP is working, the response will use your dbt metadata.

## What's available

With the platform setup, your AI assistant can use:
- Semantic Layer queries
- Metadata Discovery (model lineage, test results, source freshness)
- Admin API (trigger jobs, list runs, get artifacts)
- SQL execution and text-to-SQL (requires a [PAT](/docs/dbt-apis/user-tokens))
- All dbt commands if you added `DBT_PROJECT_DIR` and `DBT_PATH`

For the complete tool list, see [Available tools](/docs/dbt-ai/mcp-available-tools).

:::tip Looking for local CLI only?
If you only need to run dbt commands locally (with or without a <Constant name="dbt_platform"/> account), see [Run dbt locally](/docs/dbt-ai/mcp-quickstart-cli).
:::

## Troubleshooting

<Expandable alt_header="Can't find the uvx executable">

<MCPFaqUvx />

</Expandable>

<Expandable alt_header="OAuth login not initiating">

<MCPFaqOauth />

</Expandable>

<Expandable alt_header="Server not starting">

<MCPFaqServerNotStarting />

</Expandable>

<Expandable alt_header="execute_sql tool not working">

<MCPFaqExecuteSql />

</Expandable>

<Expandable alt_header="Toolset unavailable or showing as disabled">

<MCPFaqToolsetDisabled />

</Expandable>

<Expandable alt_header="Pasting full URLs instead of IDs">

<MCPFaqUrlsVsIds />

</Expandable>

<Expandable alt_header="Multi-cell account connection issues">

<MCPFaqMulticell />

</Expandable>

For all troubleshooting topics, see [MCP troubleshooting](/docs/dbt-ai/mcp-troubleshooting).

## Next steps

- Run dbt commands locally: see [Run dbt locally](/docs/dbt-ai/mcp-quickstart-cli)
- Configure specific toolsets: see the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables)
- Understand toolset requirements: see [Set up local MCP](/docs/dbt-ai/setup-local-mcp#tool-requirements-at-a-glance)
