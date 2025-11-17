---
title: "Set up remote MCP"
sidebar_label: "Set up remote MCP"
description: "Learn how to set up the remote dbt-mcp server"
id: "setup-remote-mcp"
---

The remote MCP server uses an HTTP connection and makes calls to dbt-mcp hosted on the cloud-based <Constant name="dbt_platform" />. This setup requires no local installation and is ideal for data consumption use cases.

## When to use remote MCP

The remote MCP server is the ideal choice when:
- You don't want to or are restricted from installing additional software (`uvx`, `dbt-mcp`) on your system.
- Your primary use case is _consumption-based_: querying metrics, exploring metadata, viewing lineage.
- You need access to <Constant name="semantic_layer"/> and Discovery APIs without maintaining a local dbt project.
- You don't need to execute CLI commands. Remote MCP does not support dbt CLI commands (`dbt run`, `dbt build`, `dbt test`, and more). If you need to execute dbt CLI commands, use the [local MCP server](/docs/dbt-ai/setup-local-mcp) instead.

import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';

<MCPCreditUsage />

## Setup instructions

1. Ensure that you have [AI features](https://docs.getdbt.com/docs/cloud/enable-dbt-copilot) turned on.
2. Obtain the following information from dbt platform:

  - **dbt Cloud host**: Use this to form the full URL. For example, replace `<host>` here: `https://<host>/api/ai/v1/mcp/`. It may look like: `https://cloud.getdbt.com/api/ai/v1/mcp/`. If you have a multi-cell account, the host URL will be in the `<ACCOUNT_PREFIX>.us1.dbt.com` format. For more information, refer to [Access, Regions, & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses).
  - **Production environment ID**: This can be found on the **Orchestration** page of dbt Cloud. Use this to set an `x-dbt-prod-environment-id` header.
  - **Token**: Generate either a personal access token or a service token. In terms of permissions, to fully utilize remote MCP, it must be configured with Semantic Layer and Developer permissions.

3. For the remote MCP, you will pass on headers through the JSON blob to configure required fields:

  **Configuration for APIs and SQL tools**

  | Header | Required | Description |
  | --- | --- | --- |
  | Token | Required | Your personal access token or service token from the dbt platform. <br/> **Note**: When using the Semantic Layer, it is recommended to use a personal access token. If you're using a service token, make sure that it has at least `Semantic Layer Only`, `Metadata Only`, and `Developer` permissions. |
  | x-dbt-prod-environment-id | Required | Your dbt Cloud production environment ID |

  **Additional configuration for SQL tools**
  | Header | Required | Description |
  | --- | --- | --- |
  | x-dbt-dev-environment-id | Required for `execute_sql` | Your dbt Cloud development environment ID |
  | x-dbt-user-id | Required for `execute_sql` | Your dbt Cloud user ID ([docs](https://docs.getdbt.com/faqs/Accounts/find-user-id)) |

  **Additional configuration for Fusion tools**

Fusion tools, by default, defer to the environment provided via `x-dbt-prod-environment-id` for model and table metadata.

  | Header | Required | Description |
  | --- | --- | --- |
  | x-dbt-dev-environment-id | Required| Your dbt platform development environment ID |
  | x-dbt-user-id | Required | Your dbt platform user ID ([docs](/faqs/Accounts/find-user-id)) |
  | x-dbt-fusion-disable-defer | Optional | Default: `false`. When set to `true`, fusion tools will not defer to the production environment and use the models and table metadata from the development environment (`x-dbt-dev-environment-id`) instead. |


  **Configuration to disable tools**
  | Header | Required  | Description |
  | --- | --- | --- |
  | x-dbt-disable-tools | Optional | A comma-separated list of tools to disable. For instance: `get_all_models,text_to_sql,list_entities` |
  | x-dbt-disable-toolsets | Optional | A comma-separated list of toolsets to disable. For instance: `semantic_layer,sql,discovery` |

4. After establishing which headers you need, you can follow the [examples](https://github.com/dbt-labs/dbt-mcp/tree/main/examples) to create your own agent. 

The MCP protocol is programming language and framework agnostic, so use whatever helps you build agents. Alternatively, you can connect the remote dbt MCP server to MCP clients that support header-based authentication. You can use this example Cursor configuration, replacing `<host>`, `<token>`, `<prod-id>`, `<user-id>`, and `<dev-id>` with your information:

  ```
  {
    "mcpServers": {
      "dbt": {
        "url": "https://<host>/api/ai/v1/mcp/",
        "headers": {
         "Authorization": "token <token>",
          "x-dbt-prod-environment-id": "<prod-id>",
          "x-dbt-user-id": "<user-id>",
          "x-dbt-dev-environment-id": "<dev-id>"
        }
      }
    }
  }
  ```
