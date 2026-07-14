<Expandable alt_header="OAuth login not initiating">

**Symptoms:** The OAuth browser window never opens, or authentication appears to hang.

**Cause:** dbt MCP uses a lock file to avoid repeated authentication. If a previous session left the lock file in place, it can block new authentication attempts.

**Solution:**

1. Close your MCP client (Claude Desktop, Cursor, VS Code, etc.).
2. Delete the local dbt MCP config files:
   - macOS/Linux: `rm -f ~/.dbt/mcp.yml ~/.dbt/mcp.lock`
   - Windows: `Remove-Item -Force $env:USERPROFILE\.dbt\mcp.yml, $env:USERPROFILE\.dbt\mcp.lock`
3. Restart your client and try connecting again.

If these steps don't resolve the issue, confirm that AI features are enabled on your account. An account admin can enable them in **Account settings** → **Edit** → toggle on **Enable account access to dbt Wizard features**. Refer to [Enable dbt Wizard](/docs/platform/enable-dbt-ai).
</Expandable>
