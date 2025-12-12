---
title: "Integrate Claude with dbt MCP"
sidebar_label: "Integrate Claude with MCP"
description: "Guide to set up claude with dbt-mcp"
id: "integrate-mcp-claude"
---

import MCPExample from '/snippets/_mcp-config-files.md';

Claude is an AI assistant from Anthropic with two primary interfaces: 
- [Claude Code](https://www.anthropic.com/claude-code): A terminal/IDE tool for development
- [Claude for desktop](https://claude.ai/download): A GUI with MCP support for file access and commands as well as basic coding features 

## Claude Code

You can set up Claude Code with both the local and remote `dbt-mcp` server. We recommend using the local `dbt-mcp` for more developer-focused workloads. See the [About MCP](/docs/dbt-ai/about-mcp#server-access) page for more more information about local and remote server features.

### Set up with local dbt MCP server

Prerequisites:
- Complete the [local MCP setup](/docs/dbt-ai/setup-local-mcp).
- Know your configuration method (OAuth <Constant name="dbt_core"/> or <Constant name="fusion"/>, or environment variables)


### Claude Code scopes

By default, the MCP server is installed in the "local" scope, meaning that it will be active for Claude Code sessions in the current directory for the user who installed it.

It is also possible to install the MCP server:
- In the "user" scope, to have it installed for all Claude Code sessions, independently of the directory used
- In the "project" scope, to create a config file that can be version controlled so that all developers of the same project can have the MCP server already installed

To install it in the project scope, run the following and commit the `.mcp.json` file. Be sure to use an env var file path that is the same for all users.
```bash
claude mcp add dbt -s project -- uvx --env-file <path-to-.env-file> dbt-mcp
```

For more information on scopes, refer to [Understanding MCP server scopes](https://docs.anthropic.com/en/docs/claude-code/mcp#understanding-mcp-server-scopes).


### Claude for desktop

1. Go to the Claude settings. Click on the Claude menu in your system's menu bar (not the settings within the Claude window itself) and select **Settings…**.
2. In the Settings window, navigate to the **Developer** tab in the left sidebar. This section contains options for configuring MCP servers and other developer features.
3. Click the **Edit Config** button and open the configuration file with a text editor.
4. Add your server configuration based on your use case. Choose the [correct JSON structure](https://modelcontextprotocol.io/quickstart/user#installing-the-filesystem-server) from the following options:


    <Expandable alt_header="Local MCP with OAuth">

    #### Local MCP with dbt platform authentication <Lifecycle status="managed, managed_plus" />

    Configuration for users who want seamless OAuth authentication with the <Constant name="dbt_platform" />

    <MCPExample />

    </Expandable>

    <Expandable alt_header="Local MCP (CLI only)">

    Local configuration for users who only want to use dbt CLI commands with <Constant name="core" /> or <Constant name="fusion" />

    ```json 
    {
      "mcpServers": {
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

    Finding your paths:
    - **DBT_PROJECT_DIR**: Full path to the folder containing your `dbt_project.yml` file
    - **DBT_PATH**: Find by running `which dbt` in Terminal (macOS/Linux) or `where dbt` (Windows) in Powershell

    </Expandable>

    <Expandable alt_header="Local MCP with .env">

    Advanced configuration for users who need custom environment variables

    Using the `env` field (recommended):
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
            "DBT_PROJECT_DIR": "/path/to/project",
            "DBT_PATH": "/path/to/dbt"
          }
        }
      }
    }
    ```

    Using an .env file (alternative):
    ```json 
    {
      "mcpServers": {
        "dbt": {
          "command": "uvx",
          "args": ["--env-file", "/path/to/.env", "dbt-mcp"]
        }
      }
    }
    ```

    </Expandable>


5. Save the file. Upon a successful restart of Claude Desktop, you'll see an MCP server indicator in the bottom-right corner of the conversation input box.

For debugging, you can find the Claude desktop logs at `~/Library/Logs/Claude` for Mac or `%APPDATA%\Claude\logs` for Windows.

#### Using OAuth or environment variables directly

The recommended method is to configure environment variables directly in Claude Code's configuration file without needing a separate `.env` file:

1. Add the MCP server:

  ```bash
  claude mcp add dbt -- uvx dbt-mcp
  ```
2. Open the configuration editor:

  ```bash
  claude mcp edit dbt
  ```

3. In the configuration editor, add your environment variables based on your use case:

<Tabs>
<TabItem value="CLI only">

For <Constant name="core" /> or <Constant name="fusion" /> only (no <Constant name="dbt_platform" />):
```json
{
  "command": "uvx",
  "args": ["dbt-mcp"],
  "env": {
    "DBT_PROJECT_DIR": "/path/to/your/dbt/project",
    "DBT_PATH": "/path/to/your/dbt/executable"
  }
}
```

</TabItem>
<TabItem value="OAuth with dbt platform">

For OAuth authentication (requires static subdomain):
```json
{
  "command": "uvx",
  "args": ["dbt-mcp"],
  "env": {
    "DBT_HOST": "https://your-subdomain.us1.dbt.com",
    "DBT_PROJECT_DIR": "/path/to/your/dbt/project",
    "DBT_PATH": "/path/to/your/dbt/executable"
  }
}
```

</TabItem>
</Tabs>

#### Using an `.env` file

If you prefer to manage environment variables in a separate file:

```bash
claude mcp add dbt -- uvx --env-file <path-to-.env-file> dbt-mcp
```
Replace `<path-to-.env-file>` with the full path to your `.env` file. 


## Troubleshooting

- Claude desktop may return errors such as `Error: spawn uvx ENOENT` or `Could not connect to MCP server dbt-mcp`. Try replacing the command
and environment variables file path with the full path. For `ux`, find the full path to `uvx` by running `which uvx` on Unix systems and placing this full path in the JSON. For instance: `"command": "/the/full/path/to/uvx"`.

