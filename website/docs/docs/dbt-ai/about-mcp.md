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
| Connect to my <Constant name="dbt_platform" /> account (<Constant name="semantic_layer" />, Discovery API, Admin API, SQL) | [Connect to dbt platform](/docs/dbt-ai/mcp-quickstart-oauth) |
| Use dbt CLI commands locally (no platform account needed) | [Run dbt locally](/docs/dbt-ai/mcp-quickstart-cli) |
</SimpleTable>

Not sure which to pick? Start with [Connect to dbt platform](/docs/dbt-ai/mcp-quickstart-oauth) — it covers both OAuth and token-based auth, with an option to add CLI commands.

Looking for a zero-install option? The [remote MCP server](/docs/dbt-ai/setup-remote-mcp) connects via HTTP with no local installation required.

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

<MCPCreditUsage />

## Available tools

The dbt MCP server exposes tools across the following categories. Check out the following table for a sample list of the tools available and which server type supports them.

For the complete list of tools and commands, see [Available tools](/docs/dbt-ai/mcp-available-tools) or the [dbt-mcp repository](https://github.com/dbt-labs/dbt-mcp).


| Tools | Local | Remote | Info |
| --- | --- | --- | --- |
| dbt CLI | ✅ | ❌ | Run commands like `dbt build`, `dbt run`, `dbt test`, and `dbt compile` directly from your AI assistant. |
| [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) | ✅ | ✅ | Query metrics, dimensions, and saved queries defined in your project. |
| SQL | ✅ | ✅ | Generate SQL from natural language and execute queries against your warehouse. |
| [Metadata Discovery](/docs/dbt-cloud-apis/discovery-api) | ✅ | ✅ | Explore model lineage, test results, source freshness, and other project metadata. |
| [Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) | ✅ | ❌ | Trigger jobs, list runs, retrieve artifacts, and manage deployments. |
| Codegen | ✅ | ❌ | Auto-generate source definitions, model YAML, and staging models (requires [dbt-codegen](https://hub.getdbt.com/dbt-labs/codegen/latest/)). |
| [Fusion](/docs/fusion) | ✅ | ✅ | Compile SQL and get column-level lineage using the <Constant name="fusion" /> engine. |

Note that access to the Discovery API and the Semantic Layer API is limited depending on your [plan type](https://www.getdbt.com/pricing).


## MCP integrations

The dbt MCP server integrates with any [MCP client](https://modelcontextprotocol.io/clients) that supports token authentication and tool use capabilities.

We have also created integration guides for the following clients:
- [Claude](/docs/dbt-ai/integrate-mcp-claude)
- [Cursor](/docs/dbt-ai/integrate-mcp-cursor)
- [VS Code](/docs/dbt-ai/integrate-mcp-vscode)

## Resources
- For more information, refer to our blog on [Introducing the dbt MCP Server](/blog/introducing-dbt-mcp-server#getting-started).
