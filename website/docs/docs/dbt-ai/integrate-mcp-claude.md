---
title: "Integrate Claude with dbt MCP"
sidebar_label: "Integrate Claude with MCP"
description: "Guide to set up claude with dbt-mcp"
id: "integrate-mcp-claude"
---

# Integrate Claude with dbt MCP <Lifecycle status="beta" />

Claude is an AI assistant from Anthropic with two primary interfaces: 
- [Claude Code](https://www.anthropic.com/claude-code): a terminal/IDE tool for development
- [Claude for desktop](https://claude.ai/download): a GUI with MCP support for file access and commands as well as basic coding features 

## Claude Code

You can set up Claude Code with both the local and remote `dbt-mcp` server. We recommend using the local `dbt-mcp` for more developer-focused workloads. 

### Setup with local dbt MCP server

Prerequisites:
- Have an .env file with your environment variables 
- Local dbt-mcp setup

1. Run the following command to add the MCP server to Claude Code:

```bash
claude mcp add dbt -- uvx --env-file <path-to-.env-file> dbt-mcp
```
Remember to update the file path. 

### Claude Code scopes

By default, the MCP server is installed in the "local" scope, meaning that it will be active for Claude Code sessions in the current directory for the user who installed it.

It is also possible to install the MCP server:
- In the "user" scope, to have it installed for all Claude Code sessions, independently of the directory used
- In the "project" scope, to create a config file that can be version controlled so that all developers of the same project can have the MCP server already installed

To install it in the project scope, run the following and commit the `.mcp.json` file. Be sure to use an env var file path that is the same for all users.
```bash
claude mcp add dbt -s project -- uvx --env-file <path-to-.env-file> dbt-mcp
```

More info on scopes [here](https://docs.anthropic.com/en/docs/claude-code/mcp#understanding-mcp-server-scopes)


## Claude for desktop

1. Go to the Claude settings. Click on the Claude menu in your system’s menu bar (not the settings within the Claude window itself) and select **Settings…**
2. In the Settings window, navigate to the **Developer** tab in the left sidebar. This section contains options for configuring MCP servers and other developer features.
3. Click the **Edit Config** button and open the configuration file with a text editor.
4. Replace the contents of the configuration file with [your correct JSON structure](https://modelcontextprotocol.io/quickstart/user#installing-the-filesystem-server):

For local MCP:
```json 
{
  "mcpServers": {
    "dbt-mcp": {
      "command": "uvx",
      "args": [
        "--env-file",
        "<environment_variable_file.env",
        "dbt-mcp"
      ]
    }
  }
}
```

5. Save the file. Upon a successful restart, you’ll see an MCP server indicator in the bottom-right corner of the conversation input box

For debugging, you can find the Claude desktop logs at `~/Library/Logs/Claude` for Mac or `%APPDATA%\Claude\logs` for Windows.


## Troubleshooting

- Claude desktop may return errors such as `Error: spawn uvx ENOENT` or `Could not connect to MCP server dbt-mcp`. Try replacing the command
and environment variables file path with the full path. For `ux`, find the full path to `uvx` by running `which uvx` on Unix systems and placing this full path in the JSON. For instance: `"command": "/the/full/path/to/uvx"`.