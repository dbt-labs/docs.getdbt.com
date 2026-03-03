---
title: "MCP troubleshooting"
sidebar_label: "Troubleshooting"
description: "Solutions for common issues when setting up and using dbt MCP."
id: "mcp-troubleshooting"
---

This page consolidates troubleshooting steps for all dbt MCP setups.

## Can't find the `uvx` executable

**Symptoms:** Error messages like `Could not connect to MCP server dbt-mcp`, `Error: spawn uvx ENOENT`, or `spawn uvx ENOENT` in your MCP client.

**Cause:** Your MCP client can't find `uvx` in its PATH because it starts with a limited environment.

**Solution:** Use the full path to `uvx` in your configuration.

1. Find the full path:
   - macOS/Linux: Run `which uvx` in Terminal.
   - Windows: Run `where uvx` in Command Prompt or PowerShell.

2. Replace `"command": "uvx"` with the full path:

```json
{
  "mcpServers": {
    "dbt": {
      "command": "/full/path/to/uvx",
      "args": ["dbt-mcp"],
      "env": { }
    }
  }
}
```

Example on macOS with Homebrew: `"command": "/opt/homebrew/bin/uvx"`

For VS Code (`mcp.json`), the same fix applies — replace `uvx` with its full path in the `command` field.

## OAuth login not initiating

**Symptoms:** The OAuth browser window never opens, or authentication appears to hang.

**Cause:** dbt MCP uses a lock file to avoid repeated authentication. If a previous session left the lock file in place, it can block new authentication attempts.

**Solution:**

1. Close your MCP client (Claude Desktop, Cursor, VS Code, etc.).
2. Delete the local dbt MCP config files:
   - macOS/Linux: `rm -f ~/.dbt/mcp.yml ~/.dbt/mcp.lock`
   - Windows: `Remove-Item -Force $env:USERPROFILE\.dbt\mcp.yml, $env:USERPROFILE\.dbt\mcp.lock`
3. Restart your client and try connecting again.

## Server not starting

**Symptoms:** The MCP server shows as disconnected or unavailable in your client.

**Diagnosis:** Check the server logs:

- **VS Code:** Open the Command Palette (`Ctrl/Cmd + Shift + P`) → `MCP: List Servers` → click the dbt server to see detailed logs.
- **Claude Desktop:** Check `~/Library/Logs/Claude` (macOS) or `%APPDATA%\Claude\logs` (Windows).
- **All clients:** Set `DBT_MCP_LOG_LEVEL=DEBUG` in your environment variables to get more verbose output.

**Common causes:**

- Missing or incorrect `DBT_PROJECT_DIR` or `DBT_PATH` — verify the paths exist and are absolute paths.
- Invalid or expired authentication tokens — generate a new token and update your config.
- Missing required environment variables for the toolset you're trying to use — see [Tool requirements](/docs/dbt-ai/setup-local-mcp#tool-requirements-at-a-glance).

## Configuration not working in WSL (VS Code)

**Symptoms:** VS Code MCP config works on other machines or native Windows but not in WSL.

**Cause:** Local user settings are not applied in WSL environments.

**Solution:**

Configure MCP in the WSL-specific settings instead of local user settings:
1. Open the Command Palette → **Preferences: Open Remote Settings**.
2. Or select the **Remote** tab in the Settings editor.
3. Add your MCP server configuration there.

## `execute_sql` tool not working

**Symptoms:** The `execute_sql` tool returns an authentication error or is unavailable.

**Cause:** `execute_sql` requires a Personal Access Token (PAT). Service tokens do not work for this tool.

**Solution:**

1. Generate a [Personal Access Token (PAT)](/docs/dbt-cloud-apis/user-tokens) in **Account settings** → **API tokens** → **Personal tokens**.
2. Use the PAT as your `DBT_TOKEN` value.
3. Also ensure `DBT_DEV_ENV_ID` and `DBT_USER_ID` are set — these are required for `execute_sql`.

## Toolset unavailable or showing as disabled

**Symptoms:** A toolset (Semantic Layer, Discovery, Admin API) is not available in your AI client even though you've configured credentials.

**Cause:** Either the required variables are missing, or the toolset has been explicitly disabled.

**Solution:**

1. Check that all required variables for the toolset are set — see [Tool requirements](/docs/dbt-ai/setup-local-mcp#tool-requirements-at-a-glance).
2. Check whether you have any `DISABLE_*` variables set to `true` that might be turning off the toolset.
3. If you're using enable mode (`DBT_MCP_ENABLE_*`), make sure the toolset you need is listed.
4. Set `DBT_MCP_LOG_LEVEL=DEBUG` to see which toolsets are active at startup.

## Pasting full URLs instead of IDs

**Symptoms:** Authentication errors, unexpected behavior, or the server failing to connect to the right environment.

**Cause:** Environment variables like `DBT_PROD_ENV_ID`, `DBT_USER_ID`, and `DBT_ACCOUNT_ID` expect numeric integers, not full browser URLs.

**Solution:**

```bash
# ✅ Correct
DBT_HOST=cloud.getdbt.com
DBT_PROD_ENV_ID=54321
DBT_USER_ID=123

# ❌ Wrong
DBT_HOST=https://cloud.getdbt.com
DBT_PROD_ENV_ID=https://cloud.getdbt.com/deploy/12345/projects/67890/environments/54321
DBT_USER_ID=https://cloud.getdbt.com/settings/profile
```

See [Finding your IDs](/docs/dbt-ai/mcp-find-ids) for step-by-step instructions.

## Multi-cell account connection issues

**Symptoms:** Connection errors when your account URL includes a prefix (for example, `abc123.us1.dbt.com`).

**Cause:** For multi-cell accounts, the account prefix must be set separately from the host.

**Solution:**

```bash
# ✅ Correct
DBT_HOST=us1.dbt.com
MULTICELL_ACCOUNT_PREFIX=abc123

# ❌ Wrong — don't include the prefix in DBT_HOST
DBT_HOST=abc123.us1.dbt.com
```

If your full URL is `abc123.us1.dbt.com`, split it as:
- `DBT_HOST=us1.dbt.com`
- `MULTICELL_ACCOUNT_PREFIX=abc123`
