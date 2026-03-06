---
title: "dbt Model Context Protocol"
sidebar_label: "Model Context Protocol"
description: "Learn about the dbt MCP server"
id: "about-mcp"
---

# About dbt Model Context Protocol (MCP)

<IntroText>

The [dbt Model Context Protocol (MCP) server](https://github.com/dbt-labs/dbt-mcp) provides a standardized framework that enables users to seamlessly integrate AI applications with dbt-managed data assets regardless of the underlying data platforms. This ensures consistent, governed access to models, metrics, lineage, and freshness across various AI tools.

</IntroText>

As AI becomes more deeply integrated into data workflows, dbt users need a seamless way to access and integrate dbt's structured metadata and execution context effectively. This page provides an overview of dbt's MCP Server, which exposes this context, supporting use cases such as conversational access to data, agent-driven automation of dbt workflows, and AI-assisted development.

The MCP server provides access to the dbt CLI, [API](/docs/dbt-cloud-apis/overview), the [Discovery API](/docs/dbt-cloud-apis/discovery-api), and [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). It provides access to private APIs, text-to-SQL, and SQL execution.

For more information on MCP, have a look at [Get started with the Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction).

## Get started

To get started, choose the quick start that matches your setup:

<SimpleTable>
| I want to... | Quickstart |
| --- | --- |
| Connect to my dbt platform account without managing tokens | [<Constant name="dbt_platform" /> setup](/docs/dbt-ai/mcp-quickstart-oauth) |
| Use dbt CLI commands locally | [Local CLI setup](/docs/dbt-ai/mcp-quickstart-cli) |
| Use dbt CLI + all <Constant name="dbt_platform" /> features (<Constant name="semantic_layer" />, Discovery API, Admin API, SQL) | [Full setup](/docs/dbt-ai/mcp-quickstart-full) |
</SimpleTable>
Not sure which to pick? Start with the [OAuth quick start](/docs/dbt-ai/mcp-quickstart-oauth) — it's the fastest path.

## Server access

You can use the dbt MCP server in the following ways: 
- [Local MCP server](#local-mcp-server) &mdash; runs locally on your machine and requires installing `uvx` (which installs dbt-mcp locally) and then running `uvx dbt-mcp` to start the server. You don't need to clone the repository unless you want to contribute to dbt MCP.
- [Remote MCP server](#remote-mcp-server) &mdash; uses an HTTP connection and makes calls to dbt-mcp hosted on the managed <Constant name="dbt_platform" />. This setup requires no local installation and is ideal for data consumption use cases.

### Local MCP server

The local MCP server provides the best experience for development workflows, like authoring dbt models, tests, and documentation.

The [local MCP server](/docs/dbt-ai/setup-local-mcp) runs on your machine and requires installing `uvx` (which installs dbt-mcp locally) and then running `uvx dbt-mcp` to start the server. You don't need to clone the repository unless you want to contribute to dbt MCP. The local MCP server provides:
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
import McpToolsFromReadme from '/snippets/_mcp-tools-from-readme.md';

<MCPCreditUsage />

## Available tools

The tool list below is **auto-fetched** from the [dbt MCP server README on GitHub](https://github.com/dbt-labs/dbt-mcp#tools) when the docs are built, so it stays in sync with each release.

<McpToolsFromReadme />

### Which tools are available (Local vs Remote)

| Tool category | Local server | Remote server |
| --- | --- | --- |
| dbt CLI | ✅ | ❌ |
| Semantic Layer | ✅ | ✅ |
| SQL | ✅ | ✅ |
| Metadata Discovery | ✅ | ✅ |
| Administrative API | ✅ | ❌ |
| Codegen tools | ✅ | ❌ |
| Fusion tools | ✅ | ✅ |

Note that access to the Discovery API and the Semantic Layer API is limited depending on your [plan type](https://www.getdbt.com/pricing).

:::important `execute_sql` requires a PAT
The `execute_sql` tool does **not** work with service tokens. You must use a [Personal Access Token (PAT)](/docs/dbt-cloud-apis/user-tokens) for platform SQL execution. This is documented in the [Full setup](/docs/dbt-ai/mcp-quickstart-full) and [Environment variables](/docs/dbt-ai/mcp-environment-variables) pages.
:::

Allowing your client to use dbt CLI tools through MCP can modify your data models, sources, and warehouse. Proceed only if you trust the client and understand the impact.

## MCP integrations

The dbt MCP server integrates with any [MCP client](https://modelcontextprotocol.io/clients) that supports token authentication and tool use capabilities.

We have also created integration guides for the following clients:
- [Claude](/docs/dbt-ai/integrate-mcp-claude)
- [Cursor](/docs/dbt-ai/integrate-mcp-cursor)
- [VS Code](/docs/dbt-ai/integrate-mcp-vscode)

## Resources
- For more information, refer to our blog on [Introducing the dbt MCP Server](/blog/introducing-dbt-mcp-server#getting-started).
