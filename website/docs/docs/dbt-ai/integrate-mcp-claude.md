---
title: "Integrate Claude with dbt MCP"
sidebar_label: "Integrate Claude with MCP"
description: "Guide to set up claude with dbt-mcp"
id: "integrate-mcp-claude"
---

import MCPExample from '/snippets/_mcp-config-files.md';
import StaticSubdomainRequired from '/snippets/_static-subdomain-required.md';

Claude is an AI assistant from Anthropic with two primary interfaces:
- [Claude for desktop](https://claude.ai/download): A GUI with MCP support for file access and commands as well as basic coding features
- [Claude Code](https://www.anthropic.com/claude-code): A terminal/IDE tool for development

## Claude Desktop

<StaticSubdomainRequired />

To configure Claude Desktop to use the dbt MCP server:
1. Go to the [latest dbt MCP release](https://github.com/dbt-labs/dbt-mcp/releases/latest) and download the `dbt-mcp.mcpb` file.
2. Double-click the downloaded file to open it in Claude Desktop.
3. Configure the **dbt Platform Host**. You can find this in your <Constant name="dbt_platform" /> account by navigating to **Account settings** and copying the **Access URL**. 
4. Enable the server in Claude Desktop.
5. Ask Claude a data-related question and see dbt MCP in action!

### Advanced configuration with Claude Desktop

To add advanced configurations:
1. Go to the Claude settings and select **Settings…**.
2. In the Settings window, navigate to the **Developer** tab in the left sidebar. This section contains options for configuring MCP servers and other developer features.
3. Click the **Edit Config** button and open the configuration file with a text editor.
4. Add your server configuration based on your use case. Choose the [correct JSON structure](https://modelcontextprotocol.io/quickstart/user#installing-the-filesystem-server) from the following options:

    :::tip
    You do not need to clone the dbt-mcp repository. Install [uv](https://docs.astral.sh/uv/getting-started/installation/) and run `uvx dbt-mcp` (or use the config below); cloning is only for contributing.
    :::

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

    Advanced configuration for users who need custom environment variables. Put your `.env` file in your _dbt project root_ (same folder as `dbt_project.yml`) and use an absolute path with `--env-file`.

    Using the `env` field (single-file configuration):
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

    Using an `.env` file (use an absolute path to `.env` in your dbt project root):
    ```json
    {
      "mcpServers": {
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


5. Save the file. Upon a successful restart of Claude Desktop, you'll see an MCP server indicator in the bottom-right corner of the conversation input box.

For debugging, you can find the Claude desktop logs at `~/Library/Logs/Claude` for Mac or `%APPDATA%\Claude\logs` for Windows.

## Claude Code

You can set up Claude Code with both the local and remote `dbt-mcp` server. We recommend using the local `dbt-mcp` for more developer-focused workloads. See the [About MCP](/docs/dbt-ai/about-mcp#server-access) page for more more information about local and remote server features.

### Set up with local dbt MCP server

Prerequisites:
- Complete the [local MCP setup](/docs/dbt-ai/setup-local-mcp).
- Know your configuration method (OAuth <Constant name="dbt_core"/> or environment variables)

In your Claude Code set up, run one of these commands based on your use case. Be sure to update the commands for your specific needs:

<Tabs>
<TabItem value="cli" label="CLI only">

For <Constant name="core" /> or <Constant name="fusion" /> only (no <Constant name="dbt_platform" /> account):

```shell
claude mcp add dbt \
-e DBT_PROJECT_DIR=/path/to/your/dbt/project \
-e DBT_PATH=/path/to/your/dbt/executable \
-- uvx dbt-mcp
```

</TabItem>
<TabItem value="oauth" label="OAuth with dbt platform">

For OAuth authentication (requires static subdomain). Find your static subdomain [here](/docs/cloud/about-cloud/access-regions-ip-addresses):

```shell
claude mcp add dbt \
-e DBT_HOST=your-host-with-subdomain \
-e DBT_PROJECT_DIR=/path/to/your/dbt/project \
-e DBT_PATH=/path/to/your/dbt/executable \
-- uvx dbt-mcp
```

Replacing `your-host-with-subdomain`, `path/to/your/dbt/project`, and `path/to/your/dbt/executable` with your actual static subdomain, project path, and dbt executable path.

For example, if your static subdomain is `abc123.us1.dbt.com`, your command would look like this:
```shell
claude mcp add dbt \
-e DBT_HOST=abc123.us1.dbt.com \ ## this is the static subdomain
-e DBT_PROJECT_DIR=/path/to/your/dbt/project \
-e DBT_PATH=/path/to/your/dbt/executable \
-- uvx dbt-mcp
```
</TabItem>
</Tabs>

#### Using an `.env` file

If you prefer to manage environment variables in a separate file, put the `.env` file in your **dbt project root** (same folder as `dbt_project.yml`) and use the `--env-file` parameter with an **absolute path**:

```bash
claude mcp add dbt -- uvx --env-file /absolute/path/to/your-dbt-project/.env dbt-mcp
```
Replace `/absolute/path/to/your-dbt-project` with the full path to your dbt project.

## Troubleshooting

- Claude desktop may return errors such as `Error: spawn uvx ENOENT` or `Could not connect to MCP server dbt-mcp`. Try replacing the command and environment variables file path with the full path. For `uvx`, find the full path to `uvx` by running `which uvx` on Unix systems and placing this full path in the JSON. For instance: `"command": "/the/full/path/to/uvx"`.
