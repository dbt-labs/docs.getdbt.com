---
title: "Set Up remote MCP"
sidebar_label: "Set Up remote MCP"
description: "Learn how to set up the remote dbt-mcp server"
id: "setup-remote-mcp"
---

# Set up remote MCP <Lifecycle status="beta" />

The remote server uses an HTTP connection and makes calls to dbt-mcp hosted on the cloud-based dbt platform. 

1. Ensure that you have [AI Features](https://docs.getdbt.com/docs/cloud/enable-dbt-copilot) turned on.
2. Obtain the following information:

  - **dbt Cloud host**: Use this to form the full URL. For example, replace `<host>` here: `https://<host>/api/ai/v1/mcp/`. It may look like: `https://cloud.getdbt.com/api/ai/v1/mcp/`.
  - **Production environment ID**: This can be found on the `Orchestration` page of dbt Cloud. Use this to set an `x-dbt-prod-environment-id` header.
  - **Token**: Please generate either a personal access token or a service token. In terms of permissions, to fully utilize remote MCP, it must be configured with Semantic Layer and Developer permissions. 

3. With that information, you will be able to integrate with MCP-compatible tools with either an env file with the necessary information or via Streamable HTTP MCP transport.


  - Env File: Depending on the MCP client, you will either need to provide the file or provide the below information in their UI. 
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
