:::info Remote MCP doesn't require AI features

You don't need [AI features](/docs/platform/manage-dbt-ai) enabled to use remote MCP. If an admin turns AI features off, [`text_to_sql`](/docs/dbt-ai/mcp-available-tools#tools-that-require-ai-features) is the only tool hidden and every other tool keeps working.

`text_to_sql` is also the only tool that consumes your dbt Copilot action allotment. Other MCP tools don't.

If your account runs out of dbt Copilot actions, `text_to_sql` will not work until the limit resets. Other remote MCP tools keep working. If you need help, contact your account manager.

:::
