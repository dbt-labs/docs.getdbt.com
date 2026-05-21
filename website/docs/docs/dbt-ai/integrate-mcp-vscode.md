---
title: "Integrate VS Code with MCP"
sidebar_label: "Integrate VS Code with MCP"
description: "Guide to set up VS Code with dbt-mcp"
id: "integrate-mcp-vscode"
---

import MCPExample from '/snippets/_mcp-config-files.md';
import MCPRemoteOauthBetaCallout from '/snippets/_mcp-remote-oauth-beta-callout.md';
import MCPRemoteServerUrl from '/snippets/_mcp-remote-server-url.md';
import MCPRemoteTokenHeaders from '/snippets/_mcp-remote-token-headers.md';
import MCPOauthPreflight from '/snippets/_mcp-oauth-preflight.md';

[Microsoft Visual Studio Code (VS Code)](https://code.visualstudio.com/mcp) is a powerful and popular integrated development environment (IDE).

VS Code can connect to either the **local** dbt MCP server (runs on your machine, supports CLI commands like `dbt run`) or the **remote** dbt MCP server (HTTP, no install, consumption-focused). Before starting, make sure you have:
- VS Code installed with the latest updates.
- For local MCP: completed the [local MCP setup](/docs/dbt-ai/setup-local-mcp) and configured your dbt project paths.
- For remote MCP: your **MCP URL** from **Account settings** &rarr; **Access URLs** &rarr; **MCP Endpoint URL** in <Constant name="dbt_platform" />.

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

    :::tip
    You do not need to clone the dbt-mcp repository. Install [uv](https://docs.astral.sh/uv/getting-started/installation/) and run `uvx dbt-mcp` (or use the config below); cloning is only for contributing.
    :::

    <Expandable alt_header="Local MCP with dbt platform OAuth" >


    Local MCP with OAuth is for users who want to use the <Constant name="dbt_platform" /> features.

    Before you begin, make sure your account admin has enabled AI features on your <Constant name="dbt_platform"/> account. Refer to [Enable dbt Copilot](/docs/platform/enable-dbt-copilot) for more info.
    
    Choose your configuration based on your use case:

    <MCPExample />

    </Expandable>

    <Expandable alt_header="Local MCP (CLI only)">

    For users who only want to use dbt commands with <Constant name="core" /> or <Constant name="fusion" />

    <VersionBlock lastVersion="1.10">

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

    </VersionBlock>

    <VersionBlock firstVersion="1.11">

    ```json
    {
      "servers": {
        "dbt": {
          "command": "uvx",
          "args": ["dbt-mcp"],
          "env": {
            "DBT_ENGINE_PROJECT_DIR": "/path/to/your/dbt/project",
            "DBT_PATH": "/path/to/your/dbt/executable"
          }
        }
      }
    }
    ```

    </VersionBlock>

    **Finding your paths:**
    - <VersionBlock lastVersion="1.10">**DBT_PROJECT_DIR**</VersionBlock><VersionBlock firstVersion="1.11">**DBT_ENGINE_PROJECT_DIR**</VersionBlock>: Full path to the folder containing your `dbt_project.yml` file
      - macOS/Linux: Run `pwd` from your project folder.
      - Windows: Run `cd` from your project folder in Command Prompt.
    - **DBT_PATH**: Path to dbt executable
      - macOS/Linux: Run `which dbt`.
      - Windows: Run `where dbt`.

    </Expandable>

    <Expandable alt_header="Local MCP with .env">

    For advanced users who need custom environment variables or service token authentication. Put your `.env` file in your _dbt project root_ (same folder as `dbt_project.yml`) and use an absolute path with `--env-file`. Refer to the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables) for the complete list of available environment variables for the local MCP server.

    Using the `env` field (single-file configuration):

    :::tip IDs are integers, not URLs
    `DBT_PROD_ENV_ID`, `DBT_DEV_ENV_ID`, and `DBT_USER_ID` must be numeric IDs (for example, `54321`), not full URLs copied from your browser. `DBT_HOST` accepts both `cloud.getdbt.com` and `https://cloud.getdbt.com`.
    :::

    <VersionBlock lastVersion="1.10">

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

    Using an `.env` file (use an absolute path to `.env` in your dbt project root):
    </VersionBlock>

    <VersionBlock firstVersion="1.11">

    ```json
    {
      "servers": {
        "dbt": {
          "command": "uvx",
          "args": ["dbt-mcp"],
          "env": {
            "DBT_ENGINE_HOST": "cloud.getdbt.com",
            "DBT_TOKEN": "your-token-here",
            "DBT_PROD_ENV_ID": "12345",
            "DBT_ENGINE_PROJECT_DIR": "/path/to/project",
            "DBT_PATH": "/path/to/dbt"
          }
        }
      }
    }
    ```

    </VersionBlock>

    Using an `.env` file (alternative - two-file configuration):

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

    </Expandable>

6. You can start, stop, and configure your MCP servers by:
      - Running the `MCP: List Servers` command from the Command Palette (Control/Command + Shift + P) and selecting the server.
      - Utilizing the keywords inline within the `mcp.json` file.

  <Lightbox src="/img/mcp/vscode_run_server_keywords_inline.png" width="60%" title="VS Code inline management" />

Now, you can access the dbt MCP server in VS Code through interfaces like GitHub Copilot.

## Set up with remote dbt MCP server

The remote dbt MCP server runs in <Constant name="dbt_platform" /> &mdash; no `uvx` or local install needed. VS Code connects to it over HTTP from the same `mcp.json` you use for local servers.

<MCPRemoteOauthBetaCallout />

1. Open the command palette (`Control/Command + Shift + P`) and select one of:
    - **MCP: Open Workspace Folder MCP Configuration** &mdash; for this workspace.
    - **MCP: Open User Configuration** &mdash; for your user.
2. Get your MCP URL:

    <MCPRemoteServerUrl />

3. Add a `dbt` entry under the top-level `servers` key. (VS Code uses `servers`, not `mcpServers`.) Pick the tab that matches your auth method:

    <Tabs>
    <TabItem value="oauth" label="OAuth (remote)">

    _OAuth is in private beta for Enterprise and Enterprise+ accounts._

    <MCPOauthPreflight />

    Add the following to `mcp.json`. VS Code opens a browser for sign-in and consent the first time the server connects.

    ```json
    {
      "servers": {
        "dbt": {
          "type": "http",
          "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/"
        }
      }
    }
    ```

    Replace `YOUR_DBT_HOST_URL` with your hostname (for example, `abc123.us1.dbt.com`). You can find the URL in <Constant name="dbt_platform"/> under **Account settings** &rarr; **Access URLs** &rarr; **MCP Endpoint URL**.

    </TabItem>
    <TabItem value="token" label="Token-based">

    Use token-based auth when your client doesn't yet support OAuth for HTTP MCP servers, or when you need a shared/CI setup.

    ```json
    {
      "servers": {
        "dbt": {
          "type": "http",
          "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/",
          "headers": {
            "Authorization": "Token YOUR_DBT_ACCESS_TOKEN",
            "x-dbt-prod-environment-id": "DBT_PROD_ENV_ID",
            "x-dbt-user-id": "DBT_USER_ID",
            "x-dbt-dev-environment-id": "DBT_DEV_ENV_ID"
          }
        }
      }
    }
    ```

    <MCPRemoteTokenHeaders />

    </TabItem>
    </Tabs>

4. Save the file. Use **MCP: List Servers** from the command palette to start the server, then ask Copilot Chat a data-related question to confirm the connection.

## Troubleshooting

This section contains troubleshooting steps for errors you might encounter when integrating VS Code with MCP.

<Expandable alt_header="Cannot find `uvx` executable">

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
- Missing or incorrect paths for <VersionBlock lastVersion="1.10">`DBT_PROJECT_DIR`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PROJECT_DIR`</VersionBlock> or `DBT_PATH`
- Invalid authentication tokens
- Missing required environment variables

</Expandable>

## Resources

- [Microsoft VS Code MCP documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
