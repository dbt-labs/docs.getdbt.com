---
title: "Set Up local MCP"
sidebar_label: "Set Up local MCP"
description: "Learn how to set up the local dbt-mcp server"
id: "setup-local-mcp"
---

# Set up local MCP <Lifecycle status="beta" />

[The local dbt MCP server](https://github.com/dbt-labs/dbt-mcp) can be hosted locally on your machine or virtually. To set up the local dbt MCP server, follow these directions.

1. [Install uv](https://docs.astral.sh/uv/getting-started/installation/) to install `dbt-mcp` and [related dependencies](https://github.com/dbt-labs/dbt-mcp/blob/main/pyproject.toml) into an isolated virtual environment. 

2. Create an `.env` file to set your environment variables. 

Here is an example of the file:

```code
DBT_HOST=cloud.getdbt.com
DBT_PROD_ENV_ID=your-production-environment-id
DBT_DEV_ENV_ID=your-development-environment-id
DBT_USER_ID=your-user-id
DBT_ACCOUNT_ID=your-account-id
DBT_TOKEN=your-service-token
DBT_PROJECT_DIR=/path/to/your/dbt/project
DBT_PATH=/path/to/your/dbt/executable
MULTICELL_ACCOUNT_PREFIX=your-account-prefix
```
 You will need this file for integrating with MCP-compatible tools. 
 Here are the environment variables you could supply:

### Setting environment variables

You will need to configure environment variables to access the tools. If you are only using the dbt CLI commands, you do not need to supply the dbt platform-specific environment variables, and vice versa. 

#### Configuration for API and SQL tools

| Environment Variable | Required | Description |
| --- | --- | --- |
| DBT_HOST | Required | Your dbt platform [instance hostname](/docs/cloud/about-cloud/access-regions-ip-addresses). If you're using Multi-cell, exclude the `ACCOUNT_PREFIX` from the hostname. The default is `cloud.getdbt.com`  |
| MULTICELL_ACCOUNT_PREFIX | Only required for Multi-cell instances | Set your Multi-cell  `ACCOUNT_PREFIX`. If you are not using Multi-cell, don't set this value. You can learn more about regions and hosting [here](https://docs.getdbt.com/docs/cloud/about-cloud/access-regions-ip-addresses).  |
| DBT_TOKEN | Required | Your personal access token or service token from the dbt platform. <br/> **Note**: A service token is required when using the Semantic Layer, and this service token should have at least `Semantic Layer Only`, `Metadata Only`, and `Developer` permissions.  |
| DBT_ACCOUNT_ID | Required for Admininstrative API tools | Your [dbt account ID](https://docs.getdbt.com/faqs/Accounts/find-user-id) |
| DBT_PROD_ENV_ID | Required | Your dbt Cloud production environment ID |

#### Additional configuration for SQL tools
| Environment Variable | Required | Description |
| --- | --- | --- |
| DBT_DEV_ENV_ID | Optional | Your dbt Cloud development environment ID |
| DBT_USER_ID | Optional | Your dbt Cloud user ID ([docs](https://docs.getdbt.com/faqs/Accounts/find-user-id)) |

#### Configuration for dbt CLI
The local dbt-mcp supports all flavors of the dbt Engine, including dbt Core and dbt Fusion.

| Environment Variable | Required | Description | Example |
| --- | --- | --- | --- |
| DBT_PROJECT_DIR | Required | The path to where the repository of your dbt project is hosted locally.  | /Users/myname/reponame |
| DBT_PATH | Required | The path to your dbt executable (Core/Fusion/Cloud CLI). You can find your dbt executable by running `which dbt` | /opt/homebrew/bin/dbt |
| DBT_CLI_TIMEOUT | Optional | Configure the number of seconds before your agent will timeout dbt CLI commands.  | Defaults to 10 seconds. |

You can set any environment variable supported by your dbt executable, like [for the ones supported in dbt Core](https://docs.getdbt.com/reference/global-configs/about-global-configs#available-flags).

We automatically set `DBT_WARN_ERROR_OPTIONS='{"error": ["NoNodesForSelectionCriteria"]}'` so that the MCP server knows if no node is selected when running a dbt command.
You can overwrite it if needed, but it provides a better experience when calling dbt from the MCP server, ensuring the tool selects valid nodes.

#### Disabling tools
We support disabling tool access on the local dbt-mcp.  

| Name                     | Default | Description                                                                     |
| ------------------------ | ------- | ------------------------------------------------------------------------------- |
| `DISABLE_DBT_CLI`        | `false` | Set this to `true` to disable dbt Core, dbt Cloud CLI, and dbt Fusion MCP tools |
| `DISABLE_SEMANTIC_LAYER` | `false` | Set this to `true` to disable dbt Semantic Layer MCP tools                    |
| `DISABLE_DISCOVERY`      | `false` | Set this to `true` to disable dbt Discovery API MCP tools                     |
| `DISABLE_ADMIN_API`      | `false` | Set this to `true` to disable dbt Admininistrative API MCP tools                         |
| `DISABLE_SQL`            | `true`  | Set this to `false` to enable SQL MCP tools                                |
| `DISABLE_TOOLS`          | ""      | Set this to a list of tool names delimited by a `,` to disable specific tools    |

3. After creating your .env file, you can move on to our guides on connecting dbt-mcp to tools like Claude Desktop or Cursor or to creating a 
configuration file. This is dependent on what tools you want to integrate with. 


### Example configuration
For some tools,  you may need an additional configuration file to upload to connect to dbt-mcp. 
Here is a sample configuration JSON file that you can use to connect to the MCP tools. Be sure to replace the sections within `<>`:

```json
{
  "mcpServers": {
    "dbt-mcp": {
      "command": "uvx",
      "args": [
        "--env-file",
        "<path-to-.env-file>",
        "dbt-mcp"
      ]
    },
  }
}
```

`<path-to-.env-file>` is where you saved the `.env` file from the Setup step.

