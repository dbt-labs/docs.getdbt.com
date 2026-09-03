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
| [Semantic Layer](#semantic-layer) | ✅ | ✅ |
| [SQL](#sql)  | ✅ | ✅ |
| [Metadata Discovery](#discovery) | ✅ | ✅ |
| [Administrative API](#admin-api) | ✅ | ✅ |
| [Codegen Tools](#dbt-codegen) | ✅ | ❌ |
| [Fusion Tools](#dbt-lsp) | ✅ | ✅ |
| [Product Docs Tools](#product-docs) |  ✅ | ✅ |
| [MCP Server Metadata Tools](#mcp-server-metadata) | ✅ | ✅ |

Note that access to the Discovery API and the Semantic Layer API is limited depending on your [plan type](https://www.getdbt.com/pricing).

### Tools that require AI features

`text_to_sql` is the only tool that calls a large language model (LLM), so it's the only one that depends on [AI features](/docs/platform/manage-dbt-ai) being enabled for your account.

If an admin turns AI features off, `text_to_sql` doesn't appear in the tool list for your MCP server. Every other tool keeps working &mdash; turning off AI features doesn't disable the MCP server itself.

## dbt MCP server tool list

The following tool list is available for your MCP server and is auto-fetched from the [dbt MCP server README on GitHub](https://github.com/dbt-labs/dbt-mcp#tools) when the docs are built, so it stays in sync with each release.

<McpToolsFromReadme />
 
