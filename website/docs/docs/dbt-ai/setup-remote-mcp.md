---
title: "Set up remote MCP"
sidebar_label: "Set up remote MCP"
description: "Learn how to set up the remote dbt-mcp server"
id: "setup-remote-mcp"
---

# Set up the remote MCP server <Lifecycle status="self_service,managed,managed_plus"/>

The remote MCP server uses an HTTP connection and makes calls to dbt-mcp hosted on the cloud-based <Constant name="dbt_platform" />. This setup requires no local installation and is ideal for data consumption use cases.

<Lightbox src="/img/mcp/remote-dbt-mcp.jpg" title="Remote dbt MCP server architecture" />

## When to use remote MCP

The remote MCP server is the ideal choice when:
- You don't want to or are restricted from installing additional software (`uvx`, `dbt-mcp`) on your system.
- Your primary use case is _consumption-based_: querying metrics, exploring metadata, viewing lineage.
- You need access to <Constant name="semantic_layer"/>, Administrative, and Discovery APIs without maintaining a local dbt project.
- You don't need to execute CLI commands. Remote MCP does not support local CLI commands (`dbt run`, `dbt build`, `dbt test`, and more). If you need to execute dbt commands, use the [local MCP server](/docs/dbt-ai/setup-local-mcp) instead.

import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';

<MCPCreditUsage />

## Choose your auth method

Use this table to choose the right token type before you start:

| If you need... | Use... |
| --- | --- |
| Fastest first-time setup | **OAuth** (if supported by your client) |
| `execute_sql` tool | **Personal Access Token (PAT)**. Service tokens _do not_ work for `execute_sql` |
| Shared or team setup | **Service token** |
| CI or automation | **Service token** |

:::warning `execute_sql` requires a PAT
The `execute_sql` tool does **not** work with service tokens. You must use a [Personal Access Token (PAT)](/docs/dbt-apis/user-tokens) in the `Authorization` header when using this tool.
:::

## Setup instructions

1. Ensure that you have [AI features](https://docs.getdbt.com/docs/platform/enable-dbt-copilot) turned on.
2. Obtain the following information from <Constant name="dbt_platform"/>:

  - **<Constant name="dbt_platform"/> host**: Use this to form the full URL. For example, replace `YOUR_DBT_HOST_URL` here: `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/`. It may look like: `https://cloud.getdbt.com/api/ai/v1/mcp/`. If you have a multi-cell account, the host URL will be in the `ACCOUNT_PREFIX.us1.dbt.com` format. For more information, refer to [Access, Regions, & IP addresses](/docs/platform/about-platform/access-regions-ip-addresses).
  - **Production environment ID**: You can find this on the **Orchestration** page in the <Constant name="dbt_platform"/>. Use this to set an `x-dbt-prod-environment-id` header.
  - **Token**: Generate either a personal access token or a service token. To fully utilize remote MCP, the token must have Semantic Layer and Developer permissions. 
  - If you plan to use `execute_sql`, you must use a [Personal Access Token (PAT)](/docs/dbt-apis/user-tokens). Service tokens _do not_ work for this tool. For other tools that require `x-dbt-user-id`, a PAT is also required.

3. For the remote MCP, you will pass on headers through the JSON blob to configure required fields:

  **Configuration for APIs and SQL tools**

  | Header | Required | Description |
  | --- | --- | --- |
  | Authorization | Required | Your [personal access token (PAT)](/docs/dbt-apis/user-tokens) or [service token](/docs/dbt-apis/service-tokens) from the <Constant name="dbt_platform"/>. <br/> **Note**: When using the Semantic Layer, we recommended to use a PAT. If you're using a service token, make sure that it has at least `Semantic Layer Only`, `Metadata Only`, and `Developer` permissions. <br /><br /> The value must be in the format `Token YOUR_DBT_ACCESS_TOKEN` or `Bearer YOUR_DBT_ACCESS_TOKEN`, replacing `YOUR_DBT_ACCESS_TOKEN` with your actual token.  |
  | x-dbt-prod-environment-id | Required | Your <Constant name="dbt_platform"/> production environment ID |

  **Additional configuration for SQL tools**
  | Header | Required | Description |
  | --- | --- | --- |
  | x-dbt-dev-environment-id | Required for `execute_sql` | Your <Constant name="dbt_platform"/> development environment ID |
  | x-dbt-user-id | Required for `execute_sql` | Your <Constant name="dbt_platform"/> user ID ([see docs](/faqs/Accounts/find-user-id)) |

  **Additional configuration for Fusion tools**

Fusion tools, by default, defer to the environment provided via `x-dbt-prod-environment-id` for model and table metadata.

  | Header | Required | Description |
  | --- | --- | --- |
  | x-dbt-dev-environment-id | Required| Your <Constant name="dbt_platform"/> development environment ID |
  | x-dbt-user-id | Required | Your <Constant name="dbt_platform"/> user ID ([see docs](/faqs/Accounts/find-user-id)) |
  | x-dbt-fusion-disable-defer | Optional | Default: `false`. When set to `true`, <Constant name="fusion"/> tools will not defer to the production environment and use the models and table metadata from the development environment (`x-dbt-dev-environment-id`) instead. |


  **Configuration to disable tools**
  | Header | Required  | Description |
  | --- | --- | --- |
  | x-dbt-disable-tools | Optional | A comma-separated list of tools to disable. For instance: `get_all_models,text_to_sql,list_entities` |
  | x-dbt-disable-toolsets | Optional | A comma-separated list of toolsets to disable. For instance: `semantic_layer,sql,discovery` |

4. After establishing which headers you need, you can follow the [examples](https://github.com/dbt-labs/dbt-mcp/tree/main/examples) to create your own agent. 

The MCP protocol is programming language and framework agnostic, so use whatever helps you build agents. Alternatively, you can connect the remote dbt MCP server to MCP clients that support header-based authentication. Configuration varies by client — select your tool below and replace the placeholder values with your own:

:::warning Use numeric IDs, not full URLs
Header values like `x-dbt-prod-environment-id` and `x-dbt-user-id` expect numeric IDs, not full URLs. The host in the `url` field should include `https://`, but ID headers must be integers only:

```bash
# ✅ Correct
"url": "https://cloud.getdbt.com/api/ai/v1/mcp/"
"x-dbt-prod-environment-id": "54321"
"x-dbt-user-id": "123"

# ❌ Wrong — don't paste full URLs into ID headers
"x-dbt-prod-environment-id": "https://cloud.getdbt.com/deploy/12345/projects/67890/environments/54321"
"x-dbt-user-id": "https://cloud.getdbt.com/settings/profile"
```
:::

<Tabs>
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
<TabItem value="gemini" label="Gemini">

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

:::note Other clients
For other MCP clients (Codex, Windsurf, and so on.), refer to your client's MCP configuration docs for the correct key format.
:::

For local MCP, configuration is done via environment variables; see the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables).
