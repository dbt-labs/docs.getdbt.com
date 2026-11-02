---
title: "dbt MCP FAQs and troubleshooting"
sidebar_label: "FAQs and troubleshooting"
description: "Answers to common questions about the dbt MCP server, plus solutions for common setup and usage issues."
id: "mcp-troubleshooting"
availability: all_users
---

Find answers to common questions about the dbt Model Context Protocol (MCP) server and fixes for common setup issues. For client-specific steps, see the troubleshooting sections in the [Get started](/docs/dbt-ai/mcp-quickstart-oauth) and [Setup and config](/docs/dbt-ai/setup-local-mcp) pages.

## FAQs


The `execute_sql` tool in the dbt MCP server lets your AI assistant run SQL in your warehouse. These FAQs cover how it works and what its limits are.

<Expandable alt_header="What does execute_sql do?">

`execute_sql` lets your AI assistant run a SQL query against your data warehouse and read the results. It's part of the SQL toolset and runs on <Constant name="dbt_platform" />, so you don't need dbt installed locally.

Here's what happens when your assistant calls it:

1. The assistant writes a SQL query and calls `execute_sql`.
2. The dbt MCP server forwards the request to <Constant name="dbt_platform" />, along with your token, development environment ID, and user ID.
3. <Constant name="dbt_platform" /> compiles the SQL (including any Jinja, such as `ref()`) and runs it in your warehouse using your development credentials.
4. The results come back to your assistant as a table.

<Lightbox src="/img/docs/dbt-ai/mcp-execute-sql-flow.svg" title="The AI assistant calls execute_sql. The dbt MCP server forwards the request to dbt platform, which compiles the SQL, runs it in the warehouse with your development credentials, and returns the results to the assistant." />

</Expandable>

<Expandable alt_header="Is execute_sql the same as dbt show?">

No. `dbt show` runs through the <Constant name="dbt_platform" /> CLI tools and previews a model's output while you develop. `execute_sql` sends SQL to <Constant name="dbt_platform" />, which runs it in your warehouse.

</Expandable>

<Expandable alt_header="Whose warehouse credentials does execute_sql use?">

Your personal development credentials for the project's development environment. These are the same credentials you use in <Constant name="studio_ide" />. It doesn't use your production deployment credentials.

If you don't have development credentials, the query fails with a message that no warehouse credentials are configured. Ask a project admin to set them up.

</Expandable>

<Expandable alt_header="Is execute_sql read-only?">

No. `execute_sql` doesn't block write statements. What a query can do depends on the permissions of the warehouse credentials it runs with. If those credentials can create or drop tables, so can your assistant.

To keep things safe:

- **Use least-privilege warehouse roles.** Give each user's development credentials read-only access to production-like data and write access only to their own development schema.
- **Keep tool approval prompts on.** Your assistant then asks before running SQL, so you can review it first.
- **Don't count on disabling the tool as a security control.** You can turn off `execute_sql` with the `x-dbt-disable-tools` header, but whoever configures the MCP client sets it, so admins can't enforce it. Warehouse permissions are the control that holds.

</Expandable>

<Expandable alt_header="Who can use execute_sql?">

Anyone with a developer seat or a read-only seat, as long as they connect with OAuth or a [personal access token (PAT)](/docs/dbt-apis/user-tokens). Service tokens don't work because development credentials belong to a person.

Read-only seats can run plain SQL. SQL that contains Jinja, like `ref()` or `source()`, needs a developer seat.

For setup details, see [Set up remote MCP](/docs/dbt-ai/setup-remote-mcp).

</Expandable>

<Expandable alt_header="Why doesn't ref() point to my development tables?">

Even though the query runs with your development credentials, `ref('model')` resolves to the production relation. It can't point to a table you built in your own development schema.

To query a development table, use its full name instead, for example `my_dev_schema.my_model`. Avoid `source()` too, and use full table names or `ref()` instead.

</Expandable>

<Expandable alt_header="Are there limits on query size or run time?">

Yes. Long-running queries time out, and dbt caps large result sets. Add filters and `limit` clauses to keep queries small and fast.

</Expandable>

<Expandable alt_header="Can I see results as a chart or table?">

Yes you can! Your AI tool can ask for results to show as a chart or table in the UI. Otherwise, only your assistant sees the results.

</Expandable>

<Expandable alt_header="When should I use something other than execute_sql?">


<SimpleTable>
  
| If you want to... | Use |
| --- | --- |
| Ask governed business questions with defined metrics | The [Semantic Layer tools](/docs/dbt-ai/mcp-available-tools#semantic-layer), like `query_metrics` |
| Preview a model's output while you develop | <Constant name="dbt_platform" /> CLI tools, like `show`, `build`, and `run` |
| Turn a question into SQL without running it | `text_to_sql` |

</SimpleTable>
</Expandable>

## Troubleshooting

<FAQ path="dbt-mcp/troubleshooting/uvx" />

<FAQ path="dbt-mcp/troubleshooting/oauth" />

<FAQ path="dbt-mcp/troubleshooting/server-not-starting" />

<FAQ path="dbt-mcp/troubleshooting/wsl" />

<FAQ path="dbt-mcp/troubleshooting/execute-sql" />

<FAQ path="dbt-mcp/troubleshooting/toolset-disabled" />

<FAQ path="dbt-mcp/troubleshooting/urls-vs-ids" />

<FAQ path="dbt-mcp/troubleshooting/multicell" />

<FAQ path="dbt-mcp/troubleshooting/claude-desktop-errors" />

<FAQ path="dbt-mcp/troubleshooting/claude-code" />

<FAQ path="dbt-mcp/troubleshooting/snowflake-oauth-fails" />

<FAQ path="dbt-mcp/troubleshooting/snowflake-empty-results" />

<FAQ path="dbt-mcp/troubleshooting/snowflake-permission-errors" />
