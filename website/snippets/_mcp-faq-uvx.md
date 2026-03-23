<Expandable alt_header="Can't find the uvx executable">

**Symptoms:** Error messages like `Could not connect to MCP server dbt-mcp`, `Error: spawn uvx ENOENT`, or `spawn uvx ENOENT` in your MCP client.

**Cause:** Your MCP client (like Claude desktop) can't find `uvx` in its PATH because it starts with a limited environment.

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

</Expandable>
