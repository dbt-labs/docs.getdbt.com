---
title: "Set up local MCP"
sidebar_label: "Set up local MCP"
description: "Learn how to set up the local dbt-mcp server"
id: "setup-local-mcp"
---

import MCPExample from '/snippets/_mcp-config-files.md';

[The local dbt MCP server](https://github.com/dbt-labs/dbt-mcp) runs locally on your machine and supports <Constant name="core" />, <Constant name="fusion_engine" />, and <Constant name="cloud_cli" />. You can use it with or without a <Constant name="dbt_platform" /> account.

## Prerequisites

- [Install uv](https://docs.astral.sh/uv/getting-started/installation/) to be able to run `dbt-mcp` and [related dependencies](https://github.com/dbt-labs/dbt-mcp/blob/main/pyproject.toml) into an isolated virtual environment.
- Have a local dbt project (if you want to use dbt CLI commands).

## Setup options

Choose the setup method that best fits your workflow:

### OAuth authentication with dbt platform <Lifecycle status="managed, managed_plus" />

This method uses OAuth to authenticate with your <Constant name="dbt_platform" /> account. It's the simplest setup and doesn't require managing tokens or environment variables manually.

:::info Static subdomains required

Only accounts with static subdomains (for example, `abc123.us1.dbt.com`) can use OAuth with MCP servers. All accounts are in the process of being migrated to static subdomains by December 2025. Contact support for more information.

:::

#### Configuration options

<MCPExample />

Once configured, your session connects to the dbt platform account, starts the OAuth authentication workflow, and then opens your account where you can select the project you want to reference.

<Lightbox src="/img/mcp/select-project.png" width="60%" title="Select your dbt platform project"/>

After completing OAuth setup, skip to [Test your configuration](#optional-test-your-configuration).

### CLI only (no dbt platform)

If you're using the <Constant name="core" /> or <Constant name="fusion" /> CLI and don't need access to <Constant name="dbt_platform" /> features (Discovery API, Semantic Layer, Administrative API), you can set up local MCP with just your dbt project information.

Add this configuration to your MCP client (refer to the specific [integration guides](#set-up-your-mcp-client) for exact file locations):

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

#### Locating your paths

Follow the appropriate instructions for your OS to locate your path:

<Expandable alt_header="macOS/Linux" >

- **DBT_PROJECT_DIR**: The full path to your dbt project folder
   - Example: `/Users/yourname/dbt-projects/my_project`
   - This is the folder containing your `dbt_project.yml` file.

- **DBT_PATH**: Find your dbt executable path by running in terminal:
   ```bash
   which dbt
   ```
   - Example output: `/opt/homebrew/bin/dbt`
   - Use this exact path in your configuration.

</Expandable>

<Expandable alt_header="Windows" >

- **DBT_PROJECT_DIR**: The full path to your dbt project folder
   - Example: `C:\Users\yourname\dbt-projects\my_project`
   - This is the folder containing your `dbt_project.yml` file.
   - Use forward slashes or escaped backslashes: `C:/Users/yourname/dbt-projects/my_project`

- **DBT_PATH**: Find your dbt executable path by running in Command Prompt or PowerShell:
   ```bash
   where dbt
   ```
   - Example output: `C:\Python39\Scripts\dbt.exe`
   - Use forward slashes or escaped backslashes: `C:/Python39/Scripts/dbt.exe`

</Expandable>

After completing this setup, skip to [Test your configuration](#optional-test-your-configuration).

### Environment variable configuration

If you need to configure multiple environment variables or prefer to manage them separately, you can use environment variables. If you are only using the dbt CLI commands, you do not need to supply the dbt platform-specific environment variables, and vice versa.

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

## API and SQL tool settings

| Environment Variable | Required | Description |
| --- | --- | --- |
| `DBT_HOST` | Required | Your <Constant name="dbt_platform" /> [instance hostname](/docs/cloud/about-cloud/access-regions-ip-addresses). **Important:** For Multi-cell accounts, exclude the account prefix from the hostname. The default is `cloud.getdbt.com`. |
| MULTICELL_ACCOUNT_PREFIX | Only required for Multi-cell instances | Set your Multi-cell account prefix here (not in DBT_HOST). If you are not using Multi-cell, don't set this value. You can learn more about regions and hosting [here](/docs/cloud/about-cloud/access-regions-ip-addresses). |
| DBT_TOKEN | Required | Your personal access token or service token from the <Constant name="dbt_platform" />. <br/>**Note**: When using the Semantic Layer, it is recommended to use a personal access token. If you're using a service token, make sure that it has at least `Semantic Layer Only`, `Metadata Only`, and `Developer` permissions.  |
| DBT_ACCOUNT_ID | Required for Administrative API tools | Your [dbt account ID](/faqs/Accounts/find-user-id) |
| DBT_PROD_ENV_ID | Required | Your <Constant name="dbt_platform" /> production environment ID |
| DBT_DEV_ENV_ID | Optional | Your <Constant name="dbt_platform" /> development environment ID |
| DBT_USER_ID | Optional | Your <Constant name="dbt_platform" /> user ID ([docs](/faqs/Accounts/find-user-id)) |

**Multi-cell configuration examples:**

✅ **Correct configuration:**
```bash
DBT_HOST=us1.dbt.com
MULTICELL_ACCOUNT_PREFIX=abc123
```

❌ **Incorrect configuration (common mistake):**
```bash
DBT_HOST=abc123.us1.dbt.com  # Don't include prefix in host!
# MULTICELL_ACCOUNT_PREFIX not set
```

If your full URL is `abc123.us1.dbt.com`, separate it as:
- `DBT_HOST=us1.dbt.com`
- `MULTICELL_ACCOUNT_PREFIX=abc123`

## dbt CLI settings

The local dbt-mcp supports all flavors of dbt, including <Constant name="core" /> and <Constant name="fusion_engine" />.

| Environment Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `DBT_PROJECT_DIR` | Required | The full path to where the repository of your dbt project is hosted locally. This is the folder containing your `dbt_project.yml` file. | macOS/Linux: `/Users/myname/reponame`<br/>Windows: `C:/Users/myname/reponame` |
| DBT_PATH | Required | The full path to your dbt executable (<Constant name="core" />/<Constant name="fusion" />/<Constant name="cloud_cli" />). See the next section for how to find this. | macOS/Linux: `/opt/homebrew/bin/dbt`<br/>Windows: `C:/Python39/Scripts/dbt.exe` |
| DBT_CLI_TIMEOUT | Optional | Configure the number of seconds before your agent will timeout dbt CLI commands.  | Defaults to 60 seconds. |

### Locating your `DBT_PATH`

Follow the instructions for your OS to locate your `DBT_PATH`:

<Expandable alt_header="macOS/Linux" >

Run this command in your Terminal:
```bash
which dbt
```
Example output: `/opt/homebrew/bin/dbt`

</Expandable>

<Expandable alt_header="Windows" >

Run this command in Command Prompt or PowerShell:
```bash
where dbt
```
Example output: `C:\Python39\Scripts\dbt.exe`

**Note:** Use forward slashes in your configuration: `C:/Python39/Scripts/dbt.exe`

</Expandable>

**Additional notes:**

- You can set any environment variable supported by your dbt executable, like [the ones supported in <Constant name="core" />](/reference/global-configs/about-global-configs#available-flags). 
- dbt MCP respects the standard environment variables and flags for usage tracking mentioned [here](/reference/global-configs/usage-stats).
- `DBT_WARN_ERROR_OPTIONS='{"error": ["NoNodesForSelectionCriteria"]}'` is automatically set so that the MCP server knows if no node is selected when running a dbt command. You can overwrite it if needed, but it provides a better experience when calling dbt from the MCP server, ensuring the tool selects valid nodes.

## Disabling tools

You can disable the following tool access on the local `dbt-mcp`:

| Name                     | Default | Description                                                                     |
| ------------------------ | ------- | ------------------------------------------------------------------------------- |
| `DISABLE_DBT_CLI`        | `false` | Set this to `true` to disable <Constant name="core" />, <Constant name="cloud_cli" />, and dbt <Constant name="fusion" /> MCP tools. |
| `DISABLE_SEMANTIC_LAYER` | `false` | Set this to `true` to disable dbt Semantic Layer MCP tools.                    |
| `DISABLE_DISCOVERY`      | `false` | Set this to `true` to disable dbt Discovery API MCP tools.                     |
| `DISABLE_ADMIN_API`      | `false` | Set this to `true` to disable dbt Administrative API MCP tools.                         |
| `DISABLE_SQL`            | `true`  | Set this to `false` to enable SQL MCP tools.                                |
| `DISABLE_DBT_CODEGEN`    | `true`  | Set this to `false` to enable [dbt codegen MCP tools](/docs/dbt-ai/about-mcp#codegen-tools) (requires dbt-codegen package). |
| `DISABLE_TOOLS`          | ""      | Set this to a list of tool names delimited by a `,` to disable specific tools.    |

#### Using environment variables in your MCP client configuration

The recommended way to configure your MCP client is to use the `env` field in your JSON configuration file. This keeps all configuration in one file:

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

#### Using an `.env` file

If you prefer to manage environment variables in a separate file, you can create an `.env` file and reference it:

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

However, this approach requires managing two files instead of one.

## (Optional) Test your configuration

In your command line tool, run the following to test your setup:

**If using the `env` field in JSON:**
```bash
export DBT_PROJECT_DIR=/path/to/project
export DBT_PATH=/path/to/dbt
uvx dbt-mcp
```

**If using an `.env` file:**
```bash
uvx --env-file <path-to-.env-file> dbt-mcp
```

If there are no errors, your configuration is correct.

## Set up your MCP client

After completing your configuration, follow the specific integration guide for your chosen tool:
- [Claude](/docs/dbt-ai/integrate-mcp-claude)
- [Cursor](/docs/dbt-ai/integrate-mcp-cursor)
- [VS Code](/docs/dbt-ai/integrate-mcp-vscode)

## Debug configurations
These settings allow you to customize the MCP server’s logging level to help with diagnosing and troubleshooting.

| Name                     | Default | Description                                                                     |
| ------------------------ | ------- | ------------------------------------------------------------------------------- |
| `DBT_MCP_LOG_LEVEL`        | `INFO` |  Environment variable to override the MCP server log level. Options are: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`.  |

To see more detail about what’s happening inside the MCP server and help debug issues, you can temporarily set the log level to `DEBUG`. We recommend setting it temporarily to avoid filling up disk space with logs.

## Troubleshooting

#### Can't find `uvx` executable

Some MCP clients may be unable to find `uvx` from the JSON config. This will result in error messages like `Could not connect to MCP server dbt-mcp`, `Error: spawn uvx ENOENT`, or similar.

**Solution:** Locate the full path to `uvx` and use it in your configuration:

- **macOS/Linux:** Run `which uvx` in your Terminal.
- **Windows:** Run `where uvx` in CMD or PowerShell.

Then update your JSON configuration to use the full path:
```json
{
  "mcpServers": {
    "dbt": {
      "command": "/full/path/to/uvx", # For example, on macOS with Homebrew: "command": "/opt/homebrew/bin/uvx"
      "args": ["dbt-mcp"],
      "env": { ... }
    }
  }
}
```
