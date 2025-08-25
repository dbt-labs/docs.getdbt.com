---
title: "Set Up remote MCP"
sidebar_label: "Set Up remote MCP"
description: "Learn how to set up the remote dbt-mcp server"
id: "setup-remote-mcp"
---

# Set up remote MCP <Lifecycle status="beta" />

The remote server uses an HTTP connection and makes calls to dbt-mcp hosted on the cloud-based dbt platform. 

1. Ensure that you have [AI Features](https://docs.getdbt.com/docs/cloud/enable-dbt-copilot) turned on.
2. Obtain the following information from dbt Platform:

  - **dbt Cloud host**: Use this to form the full URL. For example, replace `<host>` here: `https://<host>/api/ai/v1/mcp/`. It may look like: `https://cloud.getdbt.com/api/ai/v1/mcp/`. If you have a multi-cell account, the host URL will be in the `<ACCOUNT_PREFIX>.us1.dbt.com` format. For more information, [check out our docs.](/docs/cloud/about-cloud/access-regions-ip-addresses)
  - **Production environment ID**: This can be found on the `Orchestration` page of dbt Cloud. Use this to set an `x-dbt-prod-environment-id` header.
  - **Token**: Please generate either a personal access token or a service token. In terms of permissions, to fully utilize remote MCP, it must be configured with Semantic Layer and Developer permissions. 

3. For the remote MCP, you will pass on headers through the JSON blob to configure required fields:

  **Configuration for APIs and SQL tools**

  | Header | Required | Description |
  | --- | --- | --- |
  | Token | Required | Your personal access token or service token from the dbt platform. <br/> **Note**: A service token is required when using the Semantic Layer, and this service token should have at least `Semantic Layer Only`, `Metadata Only`, and `Developer` permissions.  |
  | x-dbt-prod-environment-id | Required | Your dbt Cloud production environment ID |

  **Additional configuration for SQL tools**
  | Header | Required | Description |
  | --- | --- | --- |
  | x-dbt-dev-environment-id | Required | Your dbt Cloud development environment ID |
  | x-dbt-user-id | Required for `execute_sql` | Your dbt Cloud user ID ([docs](https://docs.getdbt.com/faqs/Accounts/find-user-id)) |

4. After establishing what headers you need, you can move on to our guides on connecting dbt-mcp to tools like Claude Desktop or Cursor or to creating a configuration file. This is dependent on what tools you want to integrate with. 

  Example configuration: 

  Be sure to replace `<host>`, `<token>`, and `<prod-id>` with your information:

  ```
  {
    "mcpServers": {
      "dbt": {
        "url": "https://<host>/api/ai/v1/mcp/",
        "headers": {
         "Authorization": "token <token>",
          "x-dbt-prod-environment-id": "<prod-id>",
        }
      }
    }
  }
  ```

  - Streamable HTTP MCP transport: Use the example [here](https://github.com/dbt-labs/dbt-mcp/blob/76992ac51a905e9e0d2194774e7246ee288094b9/examples/remote_mcp/main.py) as a reference in Python. A similar implementation is possible with SDKs for many other languages.
