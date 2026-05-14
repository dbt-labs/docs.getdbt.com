---
title: "dbt Model Context Protocol server"
sidebar_label: "dbt MCP server"
description: "Learn about the dbt MCP server"
id: "about-mcp"
---

import McpToolsFromReadme from '/snippets/_mcp-tools-from-readme.md';

# About dbt Model Context Protocol (MCP) server

<IntroText>

The [dbt MCP server](https://github.com/dbt-labs/dbt-mcp) provides a standardized framework that lets you integrate AI applications with dbt‑managed data assets across different data platforms. This ensures consistent, governed access to models, metrics, lineage, and freshness across your AI tools.

</IntroText>

To help with dbt, assistants need your project metadata and, when you allow it, supported actions such as CLI runs, platform APIs, and <Constant name="semantic_layer" /> queries. The dbt MCP server exposes those to MCP clients and supports use cases such as conversational access to data, agentic automation for dbt workflows, and AI-assisted development. This page covers local and remote setups, available tools, and how to get started.

The MCP server provides access to the <Constant name="platform_cli"/>, [API](/docs/dbt-apis/overview), the [Discovery API](/docs/dbt-apis/discovery-api), and [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). It provides access to private APIs, text-to-SQL, and SQL execution.

For more information on MCP, have a look at [Get started with the Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction).

The dbt MCP server comes in two flavors: local and remote.

- [Local MCP server](#local-mcp-server): runs locally on your machine and requires installing `uvx` (which installs dbt-mcp locally).
- [Remote MCP server](#remote-mcp-server): uses an HTTP connection and makes calls to dbt-mcp hosted on the managed <Constant name="dbt_platform" />. This setup requires no local installation and is ideal for data consumption use cases.

For more details on the server types, refer to [Server access](#server-access).

## Get started

To get started, choose the quickstart that matches your setup:

<SimpleTable>
| I want to... | Quickstart | Tool access |
| --- | --- | --- |
| Query data and run <Constant name="platform_cli"/> commands locally while connected to my <Constant name="dbt_platform" /> account (<Constant name="semantic_layer" />, Discovery API, Admin API, SQL, Codegen).  | [Connect to <Constant name="dbt_platform"/>](/docs/dbt-ai/mcp-quickstart-oauth) |  Uses [local MCP server](#local-mcp-server). |
| Run <Constant name="platform_cli"/> commands locally, with or without a <Constant name="dbt_platform" /> account; with an account, also query data and explore metadata through the same server. | [Run dbt locally](/docs/dbt-ai/mcp-quickstart-cli) |  Uses [local MCP server](#local-mcp-server). |
| Use MCP with zero local install (query data only through hosted tools; no <Constant name="platform_cli"/> commands).  | [Connect to the remote dbt MCP server](/docs/dbt-ai/mcp-quickstart-remote) |  Uses [remote MCP server](#remote-mcp-server). |
</SimpleTable>

To configure or disable specific tools (local MCP), see the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables).

## Server access

You can use the dbt MCP server in the following ways:

- [Local MCP server](#local-mcp-server) &mdash; runs locally on your machine and requires installing `uvx` (which installs dbt-mcp locally) and then running `uvx dbt-mcp` to start the server. No need to clone the repo unless you want to contribute to [dbt MCP server](https://github.com/dbt-labs/dbt-mcp).
- [Remote MCP server](#remote-mcp-server) &mdash; uses an HTTP connection and makes calls to dbt-mcp hosted on the managed <Constant name="dbt_platform" />. This setup requires no local installation and is ideal for data consumption use cases.

### Local MCP server

The local MCP server provides the best experience for development workflows, like authoring dbt models, tests, and documentation.

The [local MCP server](/docs/dbt-ai/setup-local-mcp) runs on your machine and requires installing `uvx` (which installs dbt-mcp locally) and then running `uvx dbt-mcp` to start the server. You don't need to clone the repository unless you want to contribute to dbt MCP. The local MCP server provides:
- Full access to dbt commands (`dbt run`, `dbt build`, `dbt test`, and more)
- Support for <Constant name="core" />, <Constant name="platform_cli" />, and <Constant name="fusion_engine" />
- Ability to work with local dbt projects with or without a <Constant name="dbt_platform" /> account
- Optional integration with <Constant name="dbt_platform" /> APIs for metadata discovery and Semantic Layer access

### Remote MCP server

The remote MCP server from dbt offers data consumption use cases without local setup. It doesn't support local development or <Constant name="platform_cli"/> commands; use the [local MCP server](/docs/dbt-ai/setup-local-mcp) for those workflows.

The [remote MCP server](/docs/dbt-ai/setup-remote-mcp) connects to the <Constant name="dbt_platform" /> via HTTP and requires no local installation. This option is useful when:
- You either don’t want to install, or are restricted from installing, additional software on your system.
- Your use case is primarily consumption-based (for example, querying metrics, exploring metadata, viewing lineage).

import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';

<MCPCreditUsage />

### Supported tools by MCP server type
The dbt MCP server has access to many parts of the dbt experience related to development, deployment, and discovery. Here are the categories of tools supported based on what form of the MCP server you connect to as well as detailed information on exact commands or queries available to the LLM.

Local MCP is required for <Constant name="platform_cli"/> commands, Codegen, and Administrative API; remote MCP supports <Constant name="semantic_layer" />, SQL, Discovery, Administrative API, and <Constant name="fusion" /> tools only.

Note that access to the [dbt APIs](/docs/dbt-apis/overview) is limited depending on your [plan type](https://www.getdbt.com/pricing).

| Tools | Local | Remote |
| --- | --- | --- |
| <Constant name="platform_cli"/> commands  | ✅ | ❌ |
| <Constant name="semantic_layer" /> | ✅ | ✅ |
| SQL  | ✅ | ✅ |
| Metadata Discovery| ✅ | ✅ |
| Administrative API | ✅ | ✅ |
| Codegen Tools | ✅ | ❌ |
| <Constant name="fusion" /> Tools | ✅ | ✅ |

## Available tools

The dbt MCP server has access to many tools related to development, deployment, and discovery &mdash; like CLI 

A full list of tools is available for your MCP server and is auto-fetched from the [dbt MCP server README on GitHub](https://github.com/dbt-labs/dbt-mcp#tools) when the docs are built, so it stays in sync with each release. 

To view the full list of tools, see [Available tools](/docs/dbt-ai/mcp-available-tools).

## MCP integrations

The dbt MCP server integrates with any [MCP client](https://modelcontextprotocol.io/clients) that supports token authentication and tool use capabilities. We have created integration guides for the following clients:
- [Claude](/docs/dbt-ai/integrate-mcp-claude)
- [Cursor](/docs/dbt-ai/integrate-mcp-cursor)
- [VS Code](/docs/dbt-ai/integrate-mcp-vscode).

## Resources
- [Environment variables reference](/docs/dbt-ai/mcp-environment-variables) &mdash; full list of variables and tool configuration for local MCP
- For more information, refer to our blog on [Introducing the dbt MCP Server](/blog/introducing-dbt-mcp-server#getting-started).
