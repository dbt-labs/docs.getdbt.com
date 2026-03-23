<Expandable alt_header="Configuration not working in WSL (VS Code)">

**Symptoms:** VS Code MCP config works on other machines or native Windows but not in WSL.

**Cause:** Local user settings are not applied in WSL environments.

**Solution:**

Configure MCP in the WSL-specific settings instead of local user settings:
1. Open the Command Palette → **Preferences: Open Remote Settings**.
2. Or select the **Remote** tab in the Settings editor.
3. Add your MCP server configuration there.
</Expandable>
