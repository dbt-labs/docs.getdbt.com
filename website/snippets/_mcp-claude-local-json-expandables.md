import MCPExample from '/snippets/_mcp-config-files.md';

<Expandable alt_header="Self-hosted MCP with OAuth" lifecycle="self_service,managed,managed_plus">

Configuration for users who want seamless OAuth authentication with the <Constant name="dbt_platform" />. 

Before you begin, make sure your account admin enables AI features on your <Constant name="dbt_platform"/> account to use OAuth. Refer to [Enable dbt Wizard](/docs/platform/enable-dbt-ai) for more info.

<MCPExample />

</Expandable>

<Expandable alt_header="Self-hosted MCP (CLI only)">

Self-hosted configuration for users who only want to use dbt commands with <Constant name="core" /> or <Constant name="fusion" />

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

<Expandable alt_header="Self-hosted MCP with .env">

Advanced configuration for users who need custom [environment variables](/docs/dbt-ai/mcp-environment-variables). Put your `.env` file in your _dbt project root_ (same folder as `dbt_project.yml`) and use an absolute path with `--env-file`.

Using the `env` field (single-file configuration):

:::tip IDs are integers, not URLs
`DBT_PROD_ENV_ID`, `DBT_DEV_ENV_ID`, and `DBT_USER_ID` must be numeric IDs (for example, `54321`), not full URLs copied from your browser. `DBT_HOST` accepts both `cloud.getdbt.com` and `https://cloud.getdbt.com`.
:::

Using an `.env` file (use an absolute path to `.env` in your dbt project root):

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
