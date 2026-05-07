---
title: "Use the remote dbt MCP server"
sidebar_label: "Use the remote dbt MCP server"
description: "Connect to the remote dbt MCP server using HTTP with no local installation."
id: "mcp-quickstart-remote"
---

import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';
import MCPRemoteServerUrl from '/snippets/_mcp-remote-server-url.md';
import MCPRemoteOauthBetaCallout from '/snippets/_mcp-remote-oauth-beta-callout.md';

The remote MCP server connects to <Constant name="dbt_platform"/> using HTTP. You don't need local installation &mdash; just configure your MCP client with a URL and either OAuth or token-based headers instead of running `uvx dbt-mcp`.

## When to use remote MCP

Remote MCP is a good fit when:

- You don't want to or can't install software (`uvx`, dbt-mcp) on your machine.
- Your use case is _consumption-based_: querying metrics, exploring metadata, viewing lineage, or running SQL via the platform.
- You need <Constant name="semantic_layer"/>, Administrative, and Discovery APIs access without a local dbt project.

:::info Local development requires local MCP
Local development and agentic workflows (for example, running dbt commands like `dbt run` or `dbt build` from your AI assistant) require the **local** MCP server. Remote MCP does not support the dbt CLI or local project access. Use [Connect to <Constant name="dbt_platform"/>](/docs/dbt-ai/mcp-quickstart-oauth) or [Run dbt locally](/docs/dbt-ai/mcp-quickstart-cli) for those workflows.
:::

## Set up remote MCP

Follow these steps to set up the remote MCP server.

### 1. Enable AI features

In <Constant name="dbt_platform"/>, ensure that you have [AI features](https://docs.getdbt.com/docs/platform/enable-dbt-copilot) turned on.

### 2. Get your credentials
Obtain the following information from <Constant name="dbt_platform"/>:

- **<Constant name="dbt_platform"/> host**: Form the URL as `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/` (for example, `https://cloud.getdbt.com/api/ai/v1/mcp/`). For multi-cell accounts, the host is in the format `ACCOUNT_PREFIX.us1.dbt.com`. See [Access, Regions, & IP addresses](/docs/platform/about-platform/access-regions-ip-addresses).
- **Production environment ID**: From **Orchestration** in <Constant name="dbt_platform"/>. You will use it as the `x-dbt-prod-environment-id` header.
- **Token** &mdash; PAT or service token with Semantic Layer and Developer permissions.
- **If you use `execute_sql`:** You must use a PAT, plus your development environment ID and user ID. See [Finding your IDs](/docs/dbt-ai/mcp-find-ids).

### 3. Choose authentication: OAuth or tokens

**OAuth (remote)** &mdash; No API tokens in your client config when your MCP client supports OAuth for remote servers. See [OAuth (remote MCP)](/docs/dbt-ai/setup-remote-mcp#oauth-remote-mcp) for the full flow, requirements, and limitations.

<MCPRemoteOauthBetaCallout />

**Token-based** &mdash; Use a personal access token (PAT) or service token in the `Authorization` header. Required for some clients, automation, shared setups, and tools that need explicit tokens (for example `execute_sql` with a PAT).

### 4. Get your MCP URL and IDs

<MCPRemoteServerUrl />

Depending on your auth method, you may also need:

- **Production environment ID**: From **Orchestration** in <Constant name="dbt_platform"/>. Used as the `x-dbt-prod-environment-id` header for token-based setup.
- **Token** &mdash; PAT or service token with Semantic Layer and Developer permissions (token-based setup only).
- **If you use `execute_sql`:** You must use a PAT, plus your development environment ID and user ID. See [Finding your IDs](/docs/dbt-ai/mcp-find-ids).

<MCPCreditUsage />

### 5. Configure your MCP client

**OAuth:** Configure your client with the MCP URL from the previous step and follow your client’s OAuth flow (browser sign-in). Your MCP client must support OAuth for HTTP-based MCP servers. See [Set up remote MCP](/docs/dbt-ai/setup-remote-mcp#oauth-remote-mcp).

**Token-based:** In your MCP client config, set the server `url` to `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp` and add headers:

- **Required:** `Authorization` (value `Token YOUR_TOKEN` or `Bearer YOUR_TOKEN`), `x-dbt-prod-environment-id`
- **For `execute_sql` or <Constant name="fusion" /> tools:** Also add `x-dbt-dev-environment-id` and `x-dbt-user-id`
- Use numeric IDs in headers, not full URLs copied from your browser.

For the complete list of headers, Cursor and other client examples, and optional headers, see [Set up remote MCP](/docs/dbt-ai/setup-remote-mcp). For local MCP, configuration uses environment variables; see the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables).

Once you have configured your MCP client, you can test your setup by asking your AI assistant a data-related question (for example, _"What models are in my dbt project?"_ or _"What metrics are defined in my Semantic Layer?"_). If dbt MCP is working, the response will use your dbt metadata.
