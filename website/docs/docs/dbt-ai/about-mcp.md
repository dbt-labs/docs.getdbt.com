---
title: "dbt Model Context Protocol"
sidebar_label: "Model Context Protocol"
description: "Learn about the dbt MCP server"
id: "about-mcp"
---

import McpToolsFromReadme from '/snippets/_mcp-tools-from-readme.md';

# About dbt Model Context Protocol (MCP)

As AI becomes more deeply integrated into data workflows, dbt users need a seamless way to access and integrate dbt's structured metadata and execution context effectively. This page provides an overview of dbt's MCP Server, which exposes this context, supporting use cases such as conversational access to data, agent-driven automation of dbt workflows, and AI-assisted development.

The [dbt Model Context Protocol (MCP) server](https://github.com/dbt-labs/dbt-mcp) provides a standardized framework that enables users to seamlessly integrate AI applications with dbt-managed data assets regardless of the underlying data platforms. This ensures consistent, governed access to models, metrics, lineage, and freshness across various AI tools.

The MCP server provides access to the dbt CLI, [API](/docs/dbt-cloud-apis/overview), the [Discovery API](/docs/dbt-cloud-apis/discovery-api), and [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). It provides access to private APIs, text-to-SQL, and SQL execution.

For more information on MCP, have a look at [Get started with the Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction).

## Server access

You can use the dbt MCP server in two ways: locally or remotely. Choose the setup that best fits your workflow:

### Local MCP server

The local MCP server provides the best experience for development workflows, like authoring dbt models, tests, and documentation.

The [local MCP server](/docs/dbt-ai/setup-local-mcp) runs on your machine and requires installing `uvx` (which installs dbt-mcp locally). This option provides:
- Full access to dbt CLI commands (`dbt run`, `dbt build`, `dbt test`, and more)
- Support for <Constant name="core" />, <Constant name="cloud_cli" />, and <Constant name="fusion_engine" />
- Ability to work with local dbt projects without requiring a <Constant name="dbt_platform" /> account
- Optional integration with <Constant name="dbt_platform" /> APIs for metadata discovery and Semantic Layer access

### Remote MCP server

The remote MCP server from dbt offers data consumption use cases without local setup.

The [remote MCP server](/docs/dbt-ai/setup-remote-mcp) connects to the <Constant name="dbt_platform" /> via HTTP and requires no local installation. This option is useful when:
- You either don’t want to install, or are restricted from installing, additional software on your system.
- Your use case is primarily consumption-based (for example, querying metrics, exploring metadata, viewing lineage).

import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';

<MCPCreditUsage />

## Available tools

The following tool list is available for your MCP server and is auto-fetched from the [dbt MCP server README on GitHub](https://github.com/dbt-labs/dbt-mcp#tools) when the docs are built, so it stays in sync with each release.

<McpToolsFromReadme />

### Supported tools by MCP server type
The dbt MCP server has access to many parts of the dbt experience related to development, deployment, and discovery. Here are the categories of tools supported based on what form of the MCP server you connect to as well as detailed information on exact commands or queries available to the LLM.

Note that access to the [dbt APIs](/docs/dbt-cloud-apis/overview) is limited depending on your [plan type](https://www.getdbt.com/pricing).

| Tools | Local | Remote |
| --- | --- | --- |
| dbt CLI  | ✅ | ❌ |
| Semantic Layer | ✅ | ✅ |
| SQL  | ✅ | ✅ |
| Metadata Discovery| ✅ | ✅ |
| Administrative API | ✅ | ❌ |
| Codegen Tools | ✅ | ❌ |
| Fusion Tools | ✅ | ✅ |

## MCP integrations

The dbt MCP server integrates with any [MCP client](https://modelcontextprotocol.io/clients) that supports token authentication and tool use capabilities.

We have also created integration guides for the following clients:
- [Claude](/docs/dbt-ai/integrate-mcp-claude)
- [Cursor](/docs/dbt-ai/integrate-mcp-cursor)
- [VS Code](/docs/dbt-ai/integrate-mcp-vscode)

## Resources
- For more information, refer to our blog on [Introducing the dbt MCP Server](/blog/introducing-dbt-mcp-server#getting-started).
