---
title: "Integrate VS Code with MCP"
sidebar_label: "Integrate VS Code with MCP"
description: "Guide to set up VS Code with dbt-mcp"
id: "integrate-mcp-vscode"
---

import MCPExample from '/snippets/_mcp-config-files.md';

[Microsoft Visual Studio Code (VS Code)](https://code.visualstudio.com/mcp) is a powerful and popular integrated development environment (IDE).

These instructions are for integrating dbt MCP and VS Code. Before starting, ensure you have:
- Completed the [local MCP setup](/docs/dbt-ai/setup-local-mcp)
- Installed VS Code with the latest updates
- (For local MCP with CLI) Configured your dbt project paths

## Set up with local dbt MCP server

To get started, in VS Code:

1. Open the **Settings** menu and select the correct tab atop the page for your use case:
    - **Workspace**: Configures the server in the context of your workspace
    - **User**: Configures the server in the context of your user
    <br />
   **Note for WSL users**: If you're using VS Code with Windows Subsystem for Linux (WSL), you'll need to configure WSL-specific settings. Run the **Preferences: Open Remote Settings** command from the **Command Palette** (F1) or select the **Remote** tab in the **Settings** editor. Local user settings are reused in WSL but can be overridden with WSL-specific settings. Configuring MCP servers in the local user settings will not work properly in a WSL environment.

2. Select **Features** --> **Chat**

3. Ensure that **MCP** is **Enabled**

  <Lightbox src="/img/mcp/vscode_mcp_enabled_image.png" width="60%" title="mcp-vscode-settings" />

4. Open the command palette `Control/Command + Shift + P`, and select either: 
     - **MCP: Open Workspace Folder MCP Configuration** &mdash; if you want to install the MCP server for this workspace
     - **MCP: Open User Configuration** &mdash; if you want to install the MCP server for the user

5. Add your server configuration (`dbt`) to the provided `mcp.json` file as one of the servers:

    <Expandable alt_header="Local MCP with dbt platform OAuth" >


    Local MCP with OAuth is for users who want to use the <Constant name="dbt_platform" /> features.
    
    Choose your configuration based on your use case:

    <MCPExample />

    </Expandable>

    <Expandable alt_header="Local MCP (CLI only)">

    For users who only want to use dbt CLI commands with <Constant name="core" /> or <Constant name="fusion" />

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

    **Finding your paths:**
    - **DBT_PROJECT_DIR**: Full path to the folder containing your `dbt_project.yml` file
      - macOS/Linux: Run `pwd` from your project folder.
      - Windows: Run `cd` from your project folder in Command Prompt.
    - **DBT_PATH**: Path to dbt executable
      - macOS/Linux: Run `which dbt`.
      - Windows: Run `where dbt`.

    </Expandable>

    <Expandable alt_header="Local MCP with .env">

    For advanced users who need custom environment variables or service token authentication

    Using the `env` field (recommended - single-file configuration):

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
            "DBT_PROJECT_DIR": "/path/to/project",
            "DBT_PATH": "/path/to/dbt"
          }
        }
      }
    }
    ```

    Using an `.env` file (alternative - two-file configuration):

    ```json
    {
      "servers": {
        "dbt": {
          "command": "uvx",
          "args": ["--env-file", "/path/to/.env", "dbt-mcp"]
        }
      }
    }
    ```

    </Expandable>

6. You can start, stop, and configure your MCP servers by:
      - Running the `MCP: List Servers` command from the Command Palette (Control/Command + Shift + P) and selecting the server.
      - Utilizing the keywords inline within the `mcp.json` file.

  <Lightbox src="/img/mcp/vscode_run_server_keywords_inline.png" width="60%" title="VS Code inline management" />

Now, you can access the dbt MCP server in VS Code through interfaces like GitHub Copilot.

## Troubleshooting

This section contains troubleshooting steps for errors you might encounter when integrating VS Code with MCP.

<Expandable alt_header="Cannot find `uvx` executable" >

If you see errors like `Could not connect to MCP server dbt` or `spawn uvx ENOENT`, VS Code may be unable to find the `uvx` executable.

To resolve, use the full path to `uvx` in your configuration:

1. Find the full path:
   - macOS/Linux: Run `which uvx` in Terminal.
   - Windows: Run `where uvx` in Command Prompt or PowerShell.

2. Update your `mcp.json` to use the full path:
   ```json
   {
     "servers": {
       "dbt": {
         "command": "/full/path/to/uvx",
         "args": ["dbt-mcp"],
         "env": { ... }
       }
     }
   }
   ```

   Example on macOS with Homebrew: `"command": "/opt/homebrew/bin/uvx"`

</Expandable>

<Expandable alt_header="Configuration not working in WSL">

If you're using VS Code with Windows Subsystem for Linux (WSL), make sure you've configured the MCP server in the WSL-specific settings, not the local user settings. Use the **Remote** tab in the Settings editor or run **Preferences: Open Remote Settings** from the Command Palette.

</Expandable>

<Expandable alt_header="Server not starting" >

Check the MCP server status:
1. Run `MCP: List Servers` from the Command Palette (Control/Command + Shift + P).
2. Look for any error messages next to the dbt server.
3. Click on the server to see detailed logs.

Common issues:
- Missing or incorrect paths for `DBT_PROJECT_DIR` or `DBT_PATH`
- Invalid authentication tokens
- Missing required environment variables

</Expandable>

## Resources

- [Microsoft VS Code MCP documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
