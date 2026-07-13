:::info

Only [`text_to_sql`](/docs/dbt-ai/mcp-available-tools) consumes your dbt Copilot action allotment. Other MCP tools do not.

When your account runs out of dbt Copilot actions, the remote MCP server blocks every tool that runs through it, including tools invoked from a local MCP server and [proxied](https://github.com/dbt-labs/dbt-mcp/blob/main/src/dbt_mcp/tools/toolsets.py#L24) to remote MCP, such as SQL and remote <Constant name="fusion" /> tools.

If you reach your dbt Copilot actions limit, remote MCP tools remain unavailable until the limit resets. If you need help, contact your account manager.

:::
