---
title: "Connect to the remote dbt MCP server"
sidebar_label: "Connect to the remote dbt MCP server"
description: "Connect to the remote dbt MCP server via HTTP with no local installation."
id: "mcp-quickstart-remote"
---

import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';
import MCPRemoteServerUrl from '/snippets/_mcp-remote-server-url.md';
import MCPRemoteOauthBetaCallout from '/snippets/_mcp-remote-oauth-beta-callout.md';
import MCPOauthPreflight from '/snippets/_mcp-oauth-preflight.md';

# Connect to the remote dbt MCP server <Lifecycle status="self_service,managed,managed_plus"/>

The remote MCP server connects to <Constant name="dbt_platform"/> using HTTP. No local installation is required &mdash; you configure your MCP client with a URL and headers instead of running `uvx dbt-mcp`.

<Lightbox src="/img/mcp/remote-dbt-mcp.jpg" title="Remote dbt MCP server architecture" />

## When to use remote MCP

Remote MCP is a good fit when:

- You don't want to or can't install software (`uvx`, dbt-mcp) on your machine.
- Your use case is _consumption-based_: querying metrics, exploring metadata, viewing lineage, or running SQL via the platform.
- You need <Constant name="semantic_layer"/>, Administrative, and Discovery APIs access without a local dbt project.

:::info Local development requires local MCP
Local development and agentic workflows (for example, running dbt commands like `dbt run` or `dbt build` from your AI assistant) require the **local** MCP server. Remote MCP does not support the local <Constant name="core" /> or <Constant name="fusion" /> CLI or local project access. Use [Connect to <Constant name="dbt_platform"/>](/docs/dbt-ai/mcp-quickstart-oauth) or [Run dbt locally](/docs/dbt-ai/mcp-quickstart-cli) for those workflows.
:::

## Set up remote MCP

Follow these steps to set up the remote MCP server.

### 1. Enable AI features

In <Constant name="dbt_platform"/>, ensure that you have [AI features](https://docs.getdbt.com/docs/platform/enable-dbt-copilot) turned on.

### 2. Get your credentials
Obtain the following information from <Constant name="dbt_platform"/>:

- **<Constant name="dbt_platform"/> host**: Form the URL as `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/` (for example, `https://cloud.getdbt.com/api/ai/v1/mcp/`). For multi-cell accounts, the host is in the format `ACCOUNT_PREFIX.us1.dbt.com`. Refer to [Access, Regions, & IP addresses](/docs/platform/about-platform/access-regions-ip-addresses).
- **Production environment ID**: From **Orchestration** in <Constant name="dbt_platform"/>. You will use it as the `x-dbt-prod-environment-id` header.
- **Token** &mdash; PAT or service token with Semantic Layer and Developer permissions.
- **If you use `execute_sql`:** You must use a PAT, plus your development environment ID and user ID. Refer to [Finding your IDs](/docs/dbt-ai/mcp-find-ids).

### 3. Choose authentication: OAuth or tokens

- **OAuth (remote)** &mdash; No API tokens in your client config. Requires an OAuth-capable MCP client. Available in private beta for Enterprise and Enterprise+ accounts.
- **Token-based** &mdash; PAT or service token in the `Authorization` header. Works with any client and is required for shared/CI setups and for `execute_sql` (which needs a PAT).

<MCPRemoteOauthBetaCallout />

### 4. Get your MCP URL and IDs

<MCPRemoteServerUrl />

Depending on your auth method, you may also need:

- **Production environment ID**: From **Orchestration** in <Constant name="dbt_platform"/>. Used as the `x-dbt-prod-environment-id` header for token-based setup.
- **Token** &mdash; PAT or service token with Semantic Layer and Developer permissions (token-based setup only).
- **If you use `execute_sql`:** You must use a PAT, plus your development environment ID and user ID. Refer to [Finding your IDs](/docs/dbt-ai/mcp-find-ids).

<MCPCreditUsage />

### 5. Configure your MCP client

Configure your MCP client with the MCP URL and headers from the previous step.

<Tabs groupId="auth-method">
<TabItem value="oauth" label="OAuth">

<MCPOauthPreflight />

Configure your client with the MCP URL from the previous step. On first connect, your client opens a browser for sign-in and consent.

<Tabs groupId="client">
<TabItem value="claude" label="Claude Code">

Add this to `.mcp.json` at your project root:

```json
{
  "mcpServers": {
    "dbt": {
      "type": "http",
      "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/"
    }
  }
}
```

</TabItem>
<TabItem value="cursor" label="Cursor">

Add this to `.cursor/mcp.json` (or use the Cursor deeplink in [Integrate Cursor with MCP](/docs/dbt-ai/integrate-mcp-cursor#set-up-with-remote-dbt-mcp-server)):

```json
{
  "mcpServers": {
    "dbt": {
      "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/"
    }
  }
}
```

</TabItem>
<TabItem value="vscode" label="VS Code">

Add this to `mcp.json` (run **MCP: Open Workspace Folder MCP Configuration** from the command palette). VS Code uses the `servers` key, not `mcpServers`:

```json
{
  "servers": {
    "dbt": {
      "type": "http",
      "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/"
    }
  }
}
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="token" label="Token-based">

Set the server `url` to `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/` and add the required headers:

- **Required:** `Authorization` (value `Token YOUR_TOKEN` or `Bearer YOUR_TOKEN`), `x-dbt-prod-environment-id`
- **For `execute_sql` or <Constant name="fusion" /> tools:** Also add `x-dbt-dev-environment-id` and `x-dbt-user-id`
- Use numeric IDs in headers, not full URLs copied from your browser.

<Tabs groupId="client">
<TabItem value="claude" label="Claude Code">

```json
{
  "mcpServers": {
    "dbt": {
      "type": "http",
      "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/",
      "headers": {
        "Authorization": "Token YOUR_DBT_ACCESS_TOKEN",
        "x-dbt-prod-environment-id": "DBT_PROD_ENV_ID",
        "x-dbt-user-id": "DBT_USER_ID",
        "x-dbt-dev-environment-id": "DBT_DEV_ENV_ID"
      }
    }
  }
}
```

</TabItem>
<TabItem value="cursor" label="Cursor">

```json
{
  "mcpServers": {
    "dbt": {
      "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/",
      "headers": {
        "Authorization": "Token YOUR_DBT_ACCESS_TOKEN",
        "x-dbt-prod-environment-id": "DBT_PROD_ENV_ID",
        "x-dbt-user-id": "DBT_USER_ID",
        "x-dbt-dev-environment-id": "DBT_DEV_ENV_ID"
      }
    }
  }
}
```

</TabItem>
<TabItem value="vscode" label="VS Code">

VS Code uses the `servers` key, not `mcpServers`:

```json
{
  "servers": {
    "dbt": {
      "type": "http",
      "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/",
      "headers": {
        "Authorization": "Token YOUR_DBT_ACCESS_TOKEN",
        "x-dbt-prod-environment-id": "DBT_PROD_ENV_ID",
        "x-dbt-user-id": "DBT_USER_ID",
        "x-dbt-dev-environment-id": "DBT_DEV_ENV_ID"
      }
    }
  }
}
```

</TabItem>
<TabItem value="gemini" label="Gemini">

Gemini uses the `httpUrl` key instead of `url`:

```json
{
  "mcpServers": {
    "dbt": {
      "httpUrl": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/",
      "headers": {
        "Authorization": "Token YOUR_DBT_ACCESS_TOKEN",
        "x-dbt-prod-environment-id": "DBT_PROD_ENV_ID",
        "x-dbt-user-id": "DBT_USER_ID",
        "x-dbt-dev-environment-id": "DBT_DEV_ENV_ID"
      }
    }
  }
}
```

</TabItem>
</Tabs>

</TabItem>
</Tabs>

- For the complete list of headers, Cursor and other client examples, and optional headers, refer to [Set up remote MCP](/docs/dbt-ai/setup-remote-mcp).
- For local MCP, configuration uses environment variables; check out the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables) for more information.

Once you have configured your MCP client, you can test your setup by asking your AI assistant a data-related question (for example, _"What models are in my dbt project?"_ or _"What metrics are defined in my Semantic Layer?"_). If dbt MCP is working, the response will use your dbt metadata.
