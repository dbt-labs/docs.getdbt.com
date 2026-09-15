:::info Remote MCP doesn't require AI features

You don't need [AI features](/docs/platform/manage-dbt-ai) enabled to use remote MCP. If an admin turns AI features off, [`text_to_sql`](/docs/dbt-ai/mcp-available-tools#tools-that-require-ai-features) drops out of the tool list and every other tool keeps working.

`text_to_sql` is also the only tool that consumes your dbt Copilot action allotment. Other MCP tools don't.

Separately, when your account runs out of dbt Copilot actions, the remote MCP server blocks every tool that runs through it, including tools invoked from a self-hosted MCP server and [proxied](https://github.com/dbt-labs/dbt-mcp/blob/main/src/dbt_mcp/tools/toolsets.py#L24) to remote MCP, such as SQL and remote <Constant name="fusion" /> tools. Those tools stay unavailable until the limit resets. If you need help, contact your account manager.

:::
