---
title: "Use dbt MCP with zero local install"
sidebar_label: "Use MCP with zero install"
description: "Connect to the remote dbt MCP server via HTTP with no local installation."
id: "mcp-quickstart-remote"
---

import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';

# Use dbt MCP with no local install <Lifecycle status="self_service,managed,managed_plus"/>

The remote MCP server connects to <Constant name="dbt_platform"/> using HTTP. No local installation is required &mdash; you configure your MCP client with a URL and headers instead of running `uvx dbt-mcp`.

## When to use remote MCP

Remote MCP is a good fit when:

- You don't want to or can't install software (`uvx`, dbt-mcp) on your machine.
- Your use case is _consumption-based_: querying metrics, exploring metadata, viewing lineage, or running SQL via the platform.
- You need <Constant name="semantic_layer"/>, Administrative, and Discovery APIs access without a local dbt project.

:::info Local development requires local MCP
Local development and agentic workflows (for example, running dbt commands like `dbt run` or `dbt build` from your AI assistant) require the **local** MCP server. Remote MCP does not support the dbt CLI or local project access. Use [Connect to <Constant name="dbt_platform"/>](/docs/dbt-ai/mcp-quickstart-oauth) or [Run dbt locally](/docs/dbt-ai/mcp-quickstart-cli) for those workflows.
:::

## Set up remote MCP
Follow these steps to set up the remote MCP server:

### 1. Enable AI features
In <Constant name="dbt_platform"/>, ensure that you have [AI features](https://docs.getdbt.com/docs/platform/enable-dbt-copilot) turned on.

### 2. Get your credentials
Obtain the following information from <Constant name="dbt_platform"/>:

- **<Constant name="dbt_platform"/> host**: Form the URL as `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/` (for example, `https://cloud.getdbt.com/api/ai/v1/mcp/`). For multi-cell accounts, the host is in the format `ACCOUNT_PREFIX.us1.dbt.com`. See [Access, Regions, & IP addresses](/docs/platform/about-platform/access-regions-ip-addresses).
- **Production environment ID**: From **Orchestration** in <Constant name="dbt_platform"/>. You will use it as the `x-dbt-prod-environment-id` header.
- **Token** &mdash; PAT or service token with Semantic Layer and Developer permissions.
- **If you use `execute_sql`:** You must use a PAT, plus your development environment ID and user ID. See [Finding your IDs](/docs/dbt-ai/mcp-find-ids).

    <MCPCreditUsage />

### 3. Configure your MCP client
In your MCP client config, set the server `url` to `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/` and add headers:

- **Required:** `Authorization` (value `Token YOUR_TOKEN` or `Bearer YOUR_TOKEN`), `x-dbt-prod-environment-id`
- **For `execute_sql` or <Constant name="fusion" /> tools:** Also add `x-dbt-dev-environment-id` and `x-dbt-user-id`
- Use numeric IDs in headers, not full URLs copied from your browser.

For the complete list of headers, Cursor and other client examples, and optional headers, see [Set up remote MCP](/docs/dbt-ai/setup-remote-mcp). For local MCP, configuration uses environment variables; see the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables).

Once you have configured your MCP client, you can test your setup by asking your AI assistant a data-related question (for example, _"What models are in my dbt project?"_ or _"What metrics are defined in my Semantic Layer?"_). If dbt MCP is working, the response will use your dbt metadata.
