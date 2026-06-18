:::info

Only [`text_to_sql`](/docs/dbt-ai/mcp-available-tools) consumes dbt <Constant name="wizard" /> credits. Other MCP tools do not.

When your account runs out of <Constant name="wizard" /> credits, the remote MCP server blocks all tools that run through it, even tools invoked from a local MCP server and [proxied](https://github.com/dbt-labs/dbt-mcp/blob/main/src/dbt_mcp/tools/toolsets.py#L24) to remote MCP (like SQL and remote Fusion tools).

If you reach your dbt <Constant name="wizard" /> usage limit, all tools will be blocked until your <Constant name="wizard" /> credits reset. If you need help, please reach out to your account manager.

:::
