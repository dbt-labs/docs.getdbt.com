---
title: "Integrate VS Code with MCP"
sidebar_label: "Integrate VS Code with MCP"
description: "Guide to set up VS Code with dbt-mcp"
id: "integrate-mcp-vscode"
---

import MCPExample from '/snippets/_mcp-config-files.md';

# Integrate VS Code with MCP <Lifecycle status="beta" />

[Microsoft Visual Studio Code (VS Code)](https://code.visualstudio.com/mcp) is a powerful and popular integrated development environment (IDE). 

These instructions are for integrating dbt MCP and VS Code. To get started, in VS Code:

1. Open the **Settings** menu and select the correct tab atop the page for your use case
    - **Workspace**: Configures the server in the context of your workspace
    - **User**: Configures the server in the context of your user 
    <br />
   **Note for WSL users**: If you're using VS Code with Windows Subsystem for Linux (WSL), you'll need to configure WSL-specific settings. Run the **Preferences: Open Remote Settings** command from the **Command Palette** (F1) or select the **Remote** tab in the **Settings** editor. Local user settings are reused in WSL but can be overridden with WSL-specific settings. Configuring MCP servers in the local user settings will not work properly in a WSL environment.

2. Select **Features** --> **Chat**

3. Ensure that **MCP** is **Enabled**

  <Lightbox src="/img/mcp/vscode_mcp_enabled_image.png" width="60%" title="mcp-vscode-settings" />

4. Open the command palette `Control/Command + Shift + P`, and select either **MCP: Open Workspace Folder MCP Configuration** or **MCP: Open User Configuration**, depending on whether you want to install the MCP server for this workspace or all workspaces for the user.

5. Add your server configuration (`dbt`) to the provided `mcp.json` file as one of the servers:
    <Tabs>

    <TabItem value="Local MCP server">

    ```json
    {
      "servers": {
        "dbt": {
        "command": "uvx",
          "args": [
            "--env-file",
            "<path-to-.env-file>",
            "dbt-mcp"
          ]
        }
      }
    }
    ```

    `<path-to-.env-file>` is where you saved the `.env` file from the Setup step

    </TabItem>

    <TabItem value="Remote MCP server">


    ```json
    {
     "mcpServers": {
       "dbt": {
          "url": "https://<host>/api/ai/v1/mcp/",
        "headers": {
            "Authorization": "token <token>",
            "x-dbt-prod-environment-id": "<prod-id>",
        }
      }
      }
    }
    ```

    </TabItem>

    </Tabs>

    #### Local MCP with dbt platform authentication <Lifecycle status="managed, managed_plus" />

    Additionally, you can configure the local MCP server to authenticate against your dbt platform environment using OAuth. Substitute the previous local MCP JSON with one of the following::

    <MCPExample />

6. You can start, stop, and configure your MCP servers by:
  - Running the `MCP: List Servers` command from the Command Palette (Control/Command + Shift + P) and selecting the server. 
  - Utilizing the keywords inline within the `mcp.json` file.

  <Lightbox src="/img/mcp/vscode_run_server_keywords_inline.png" width="60%" title="VS Code inline management" />

Now you will be able to access the local dbt MCP server on VS Code through interfaces like GitHub Copilot.

## Resources

- Microsoft VS Code MCP [docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers).
