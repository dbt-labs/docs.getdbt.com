---
title: "Model Context Protocol"
sidebar_label: "Model Context Protocol"
description: "Learn about the MCP server in dbt"
id: "mcp"
pagination_prev: "docs/dbt-cloud-apis/overview"
pagination_next: "docs/dbt-cloud-apis/authentication"
---

dbt can now function as a [Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) (MCP) server, providing a standardized framework that enables users to seamlessly integrate AI applications with their data warehouses. This ensures a consistent and efficient way to connect, access, and utilize data across various AI tools.

The MCP server runs in dbt using a [personal access token](/docs/dbt-cloud-apis/user-tokens) and is available to all users across [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation), [API](/docs/dbt-cloud-apis/overview), the [Discovery API](/docs/dbt-cloud-apis/discovery-api), and [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). It provides access to private APIs, text-to-sql, and SQL execution.

Note that access to the Discovery and the Semantic Layer API is limited depending on your [plan type](https://www.getdbt.com/pricing).

For more information on MCP, have a look at [Get started with the Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction).

## Prerequisites

Before using MCP, read the instructions for the [dbt-mcp repository](https://github.com/dbt-labs/dbt-mcp).

## Further reading

- Refer to our blog on [Introducing the dbt MCP Server](/blog/introducing-dbt-mcp-server#getting-started) for more information.
