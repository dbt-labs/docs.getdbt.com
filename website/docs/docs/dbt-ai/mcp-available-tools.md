---
title: "Available tools"
sidebar_label: "Available tools"
description: "Complete list of tools available in the dbt MCP server."
id: "mcp-available-tools"
availability: all_users
---
import McpToolsFromReadme from '/snippets/_mcp-tools-from-readme.md';

The dbt MCP server has access to many parts of the dbt experience related to development, deployment, and discovery. This page lists the tools available in the dbt MCP server and how to configure them.

## Supported tools by MCP server type

The following sections list every tool by category, along with which server type (local or remote) supports it.

| Tools | Local | Remote |
| --- | --- | --- |
| [dbt commands](#dbt-commands)  | ✅ | ❌ |
| [Semantic Layer (Semantic Layer API)](#semantic-layer) | ✅ | ✅ |
| [SQL](#sql)  | ✅ | ✅ |
| [Metadata Discovery (Discovery API)](#discovery) | ✅ | ✅ |
| [Administrative API (Admin API)](#admin-api) | ✅ | ✅ |
| [Codegen Tools](#dbt-codegen) | ✅ | ❌ |
| [dbt v2 Tools](#dbt-lsp) | ✅ | ✅ |
| [Product Docs Tools](#product-docs) |  ✅ | ✅ |
| [MCP Server Metadata Tools](#mcp-server-metadata) | ✅ | ✅ |

Note that access to the Discovery API and the Semantic Layer API is limited depending on your [plan type](https://www.getdbt.com/pricing).

### Tools that require AI features

`text_to_sql` is the only tool that depends on [AI features](/docs/platform/manage-dbt-ai) being enabled for your account.

If an admin turns AI features off, `text_to_sql` doesn't appear in the tool list for the remote MCP server. Every other tool keeps working. Turning off AI features doesn't disable remote MCP.

## dbt MCP server tool list

The following tool list is available for your MCP server and is auto-fetched from the [dbt MCP server README on GitHub](https://github.com/dbt-labs/dbt-mcp#tools) when the docs are built, so it stays in sync with each release.

<McpToolsFromReadme />

### Find jobs across project environments

Use the `list_jobs` [tool](#admin-api) with a `project_id` to list jobs across every environment in a dbt project. This is useful when you need to inspect jobs outside the configured production environment. Without `project_id`, `list_jobs` continues to use the configured production environment, or lists jobs across the account when no production environment is configured.

## FAQs

<Expandable alt_header="What does execute_sql do?">

`execute_sql` lets your AI assistant run a SQL query against your data warehouse and read the results. It's part of the SQL toolset and runs on <Constant name="dbt_platform" />, so you don't need dbt installed locally.

Here's what happens when your assistant calls it:

1. The assistant writes a SQL query and calls `execute_sql`.
2. The dbt MCP server forwards the request to <Constant name="dbt_platform" />, along with your token, development environment ID, and user ID.
3. <Constant name="dbt_platform" /> compiles the SQL (including any Jinja, such as `ref()`) and runs it in your warehouse using your development credentials.
4. The results come back to your assistant as a table.

<Lightbox src="/img/docs/dbt-ai/mcp-execute-sql-flow.svg" title=" In this diagram, the AI assistant calls execute_sql, the dbt MCP server forwards it to dbt platform, dbt platform compiles the SQL and runs it in the warehouse with your development credentials, and the results return to the assistant" />

</Expandable>

<Expandable alt_header="Is execute_sql read-only?">

No. `execute_sql` doesn't block write statements. What a query can do depends on the permissions of the warehouse credentials it runs with. Use least-privilege warehouse roles for each user's development credentials.

</Expandable>

<Expandable alt_header="Whose warehouse credentials does execute_sql use?">

Your personal development credentials for the project's development environment, not your production deployment credentials.

</Expandable>

For more answers about `execute_sql` or troubleshooting help, refer to [dbt MCP FAQs and troubleshooting](/docs/dbt-ai/mcp-troubleshooting).
