---
title: "Integrate Cursor with dbt MCP"
sidebar_label: "Integrate Cursor with MCP"
description: "Guide to set up Cursor with dbt-mcp"
id: "integrate-mcp-cursor"
---

import MCPOauthPreflight from '/snippets/_mcp-oauth-preflight.md';

[Cursor](https://docs.cursor.com/context/model-context-protocol) is an AI-powered code editor, powered by Microsoft Visual Studio Code (VS Code). 

After setting up your MCP server, you connect it to Cursor. Log in to Cursor and follow the steps that align with your use case.

## Set up with local dbt MCP server

Choose your setup based on your workflow:
- OAuth for <Constant name="dbt_platform" /> connections
- CLI only if using <Constant name="core" /> or the <Constant name="fusion_engine" /> locally. 
- Configure environment variables if you're using them in your <Constant name="dbt_platform" /> account.

### OAuth or CLI

Click one of the following application links with Cursor open to automatically configure your MCP server:

<Tabs>

<TabItem value="CLI only (dbt Core and Fusion)">

Local configuration for users who only want to use dbt commands with <Constant name="core" /> or <Constant name="fusion_engine" /> (no <Constant name="dbt_platform" /> features).

[Add dbt Core or Fusion to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX1BST0pFQ1RfRElSIjoiL3BhdGgvdG8veW91ci9kYnQvcHJvamVjdCIsIkRCVF9QQVRIIjoiL3BhdGgvdG8veW91ci9kYnQvZXhlY3V0YWJsZSJ9LCJjb21tYW5kIjoidXZ4IiwiYXJncyI6WyJkYnQtbWNwIl19)

After clicking:
1. Update <VersionBlock lastVersion="1.10">`DBT_PROJECT_DIR`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PROJECT_DIR`</VersionBlock> with the full path to your dbt project (the folder containing `dbt_project.yml`).
2. Update `DBT_PATH` with the full path to your dbt executable:
   - macOS/Linux: Run `which dbt` in Terminal.
   - Windows: Run `where dbt` in Command Prompt or PowerShell.
3. Save the configuration.

</TabItem>

<TabItem value="OAuth with dbt platform">

Configuration settings for users who want OAuth authentication with the <Constant name="dbt_platform" /> <Lifecycle status="managed, managed_plus" />.

Before you begin, make sure your account admin has enabled AI features on your <Constant name="dbt_platform"/> account. Refer to [Enable dbt Copilot](/docs/platform/enable-dbt-copilot) for more info.

- [<Constant name="dbt_platform"/> only](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJodHRwczovLzx5b3VyLWRidC1ob3N0LXdpdGgtY3VzdG9tLXN1YmRvbWFpbj4iLCJESVNBQkxFX0RCVF9DTEkiOiJ0cnVlIn0sImNvbW1hbmQiOiJ1dngiLCJhcmdzIjpbImRidC1tY3AiXX0%3D)
- [<Constant name="dbt_platform"/> + CLI](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJodHRwczovLzx5b3VyLWRidC1ob3N0LXdpdGgtY3VzdG9tLXN1YmRvbWFpbj4iLCJEQlRfUFJPSkVDVF9ESVIiOiIvcGF0aC90by9wcm9qZWN0IiwiREJUX1BBVEgiOiJwYXRoL3RvL2RidC9leGVjdXRhYmxlIn0sImNvbW1hbmQiOiJ1dngiLCJhcmdzIjpbImRidC1tY3AiXX0%3D)

After clicking:
1. Replace `<your-dbt-host-with-custom-subdomain>` with your actual host (for example, `abc123.us1.dbt.com`).
2. (For <Constant name="dbt_platform" /> + CLI) Update <VersionBlock lastVersion="1.10">`DBT_PROJECT_DIR`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PROJECT_DIR`</VersionBlock> and `DBT_PATH` as described above.
3. Save the configuration.

</TabItem>

</Tabs>

### Custom environment variables

Use this method if you need custom environment variables or prefer to use service tokens. Refer to the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables) for the complete list of available environment variables for the local MCP server.

1. Click the following link with Cursor open:

    [Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJjb21tYW5kIjoidXZ4IiwiYXJncyI6WyJkYnQtbWNwIl0sImVudiI6e319)

2. In the template, add your environment variables to the `env` section based on your needs.
3. Save the configuration.

#### Using an `.env` file

If you prefer to manage environment variables in a separate file, put the `.env` file in your _dbt project root_ (same folder as `dbt_project.yml`). Click this link:

[Add to Cursor (with .env file)](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt-mcp&config=eyJjb21tYW5kIjoidXZ4IC0tZW52LWZpbGUgPGVudi1maWxlLXBhdGg%252BIGRidC1tY3AifQ%3D%3D)

Then update `env-file-path` with the absolute path to your `.env` file (for example, `/absolute/path/to/your-dbt-project/.env`).


## Set up with remote dbt MCP server

Remote MCP supports **OAuth** or **token-based** headers.

- _OAuth is in private beta for Enterprise and Enterprise+ accounts._
- For either method, the MCP URL is `https://<Access URL>/api/ai/v1/mcp`. You can find the URL in <Constant name="dbt_platform"/> under **Account settings** &rarr; **Access URLs** &rarr; **MCP Endpoint URL**.

<MCPOauthPreflight />

The deeplink below configures **token-based** authentication (URL and headers). For OAuth setup, follow the [remote MCP quickstart](/docs/dbt-ai/mcp-quickstart-remote#5-configure-your-mcp-client).

1. Click the following application link with Cursor open:

    [Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJ1cmwiOiJodHRwczovLzxob3N0Pi9hcGkvYWkvdjEvbWNwLyIsImhlYWRlcnMiOnsiQXV0aG9yaXphdGlvbiI6InRva2VuIDx0b2tlbj4iLCJ4LWRidC1wcm9kLWVudmlyb25tZW50LWlkIjoiPHByb2QtaWQ%252BIn19)

2. Provide your URL/headers by updating the **host**, **production environment ID**, and **service token** in the template. Use `https://YOUR_DBT_HOST_URL/api/ai/v1/mcp` as the server URL (no trailing slash).
   :::tip IDs are integers, not URLs
   `DBT_PROD_ENV_ID`, `DBT_USER_ID`, and `DBT_DEV_ENV_ID` must be numeric IDs (for example, `54321`), not full URLs. 

   `DBT_HOST` field accepts the `https://` prefix and without the `https://` prefix. The following are valid examples:
   ```bash
   DBT_HOST=https://ab123.us1.dbt.com
   DBT_HOST=ab123.us1.dbt.com
   ```
   :::
3. Save, and now you have access to the dbt MCP server!

