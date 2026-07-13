:::info

Only [`text_to_sql`](/docs/dbt-ai/mcp-available-tools) consumes dbt Copilot credits. Other MCP tools do not consume credits.

However, all remote MCP tools are gated by the Copilot credit limit. When your account has no available dbt Copilot credits, the remote MCP server blocks every tool that runs through it, including tools invoked from a local MCP server and [proxied](https://github.com/dbt-labs/dbt-mcp/blob/main/src/dbt_mcp/tools/toolsets.py#L24) to remote MCP, such as SQL and remote Fusion tools.

If you reach your dbt Copilot usage limit, remote MCP tools remain unavailable until the credits reset. If you need help, contact your account manager.

:::
