---
title: "Integrate Gemini Enterprise with dbt MCP"
sidebar_label: "Integrate Gemini Enterprise with MCP"
description: "Connect Gemini Enterprise to the remote dbt MCP server so you can ask questions about your dbt projects in plain English."
id: "integrate-mcp-gemini-enterprise"
availability: platform_login
---

import MCPRemoteOauthBetaCallout from '/snippets/_mcp-remote-oauth-beta-callout.md';

Gemini Enterprise can call external MCP servers as tools. This guide walks you through connecting it to the remote dbt MCP server, so you can explore your projects, jobs, lineage, and metrics in plain English from a Gemini Enterprise web app.

The connection uses OAuth. You register an app integration in the <Constant name="dbt_platform" />, then add it to Gemini Enterprise as a custom MCP server. Each person authorizes with their own <Constant name="dbt_platform" /> account, so Gemini’s scope is limited to the data each user already has access to.

<MCPRemoteOauthBetaCallout />

## Prerequisites

- A <Constant name="dbt_platform" /> account with an active deployed production environment. Remote MCP reads your production metadata, so with no models or jobs, you get very little back. Refer to [Set up the remote MCP server](/docs/dbt-ai/setup-remote-mcp).
- A <Constant name="dbt_platform" /> plan that includes the tools you need. The remote MCP server works on all [plans](https://www.getdbt.com/pricing), but its tools rely on [dbt APIs](/docs/dbt-apis/overview) (like the Discovery API and Semantic Layer APIs) that vary by plan. An Enterprise or Enterprise+ plan gives you every tool.
- Permission to manage app integrations. You have it with the Account Admin, Security Admin, or Project creator permission set, or an IT license. Refer to [Enterprise permissions](/docs/platform/manage-access/enterprise-permissions) and [Connect apps with OAuth](/docs/platform/manage-access/connect-apps-oauth).
- A Google Cloud account with access to Gemini Enterprise, where you can create data stores and apps. You can get started by contacting Google Cloud sales, or try [Gemini Enterprise Plus edition at no cost for 30 days](https://console.cloud.google.com/freetrial?redirectPath=gemini-enterprise) without sales assistance.

## Register the app in dbt platform
Add your Gemini app integration in <Constant name="dbt_platform"/> by following these steps:

1. In <Constant name="dbt_platform" />, go to **Account settings** → **Integrations** → **App integrations**.
2. Copy your **MCP Endpoint URL** and note your host, for example `abc123.us1.dbt.com`. You use both in the next section.
3. Select **+ Add integration**.
   <Lightbox src="/img/mcp/gemini-enterprise/dbt-mcp-endpoint-and-add-integration.png" width="90%" title="The App integrations page with the MCP Endpoint URL and the Add integration button" />
4. Enter an integration name, such as `Gemini Enterprise connector`.
5. Set the **Redirect URI** to `https://vertexaisearch.cloud.google.com/oauth-redirect`, then select **Create integration**.
6. Copy the **Client ID**. The integration uses PKCE, so there's no client secret.

<Lightbox src="/img/mcp/gemini-enterprise/dbt-integration-client-id.png" width="80%" title="The registered integration with its Client ID and the PKCE only note" />

## Add dbt MCP as a data store

In Gemini Enterprise, the MCP server lives in a data store.

1. In the Google Cloud console, go to **Gemini Enterprise** → **Data stores**, then select **Create data store**.
2. Under **MCP servers**, find **Custom MCP Server** and select **Add MCP server**.

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-add-custom-mcp-server.png" width="90%" title="The Custom MCP Server card on the 'Create data store' page" />

3. Select **OAuth 2.0**, then fill in the fields. Replace `YOUR_DBT_HOST_URL` with your host, for example `abc123.us1.dbt.com`. The table already adds `https://`.

   <SimpleTable>
   | Field | Value |
   | --- | --- |
   | MCP Server URL | Your **MCP Endpoint URL** from the previous section |
   | Authorization URL | `https://YOUR_DBT_HOST_URL/oauth/authorize` |
   | Token URL | `https://YOUR_DBT_HOST_URL/oauth/token` |
   | Client ID | The **Client ID** you copied |
   | Client Secret | Leave empty |
   | Scopes | `user_access` |
   | Enable PKCE Support | Select the checkbox |
   | Use HTTP Basic Authentication | Leave the checkbox cleared |
   </SimpleTable>

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-mcp-server-config.png" width="90%" title="The MCP Server Configuration form filled in for dbt" />

4. Once you click **Authorize**, it will open a separate window for you to allow Gemini access to <Constant name="dbt_platform" /> to perform the tasks and skills needed when communicating to the MCP. Select **Allow access**.
   <Lightbox src="/img/mcp/gemini-enterprise/gemini-authorize-dbt-window.png" width="90%" title="The dbt platform window asking you to authorize the Gemini Enterprise connector" />
5. When you see **Successfully logged in**, select **Continue**.
6. Click **Allow access** then **Continue**. 

7. Under **Advanced options**, add a description for the server. Gemini Enterprise uses it to decide when to call the server. Select **Continue**.
7. On the next page, choose a `region` and `name` the connector, then select **Create**.

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-configure-data-connector.png" width="90%" title="The data connector configuration with the region and connector name" />

Once the connector is created, **Connector state** shows **Active**.

## Enable the dbt actions
Your Gemini connectors actions remain disabled until you manually enable them:
1. In Gemini Enterprise, go to the connector and then the **Actions** tab.
2. Select **Reload custom actions**, which will prompt an authorization request.
   <Lightbox src="/img/mcp/gemini-enterprise/gemini-reload-custom-actions.png" width="90%" title="The Actions tab with the Reload custom actions button" />
3. A <Constant name="dbt_platform" /> window will open. Select **Allow access**. The dbt MCP tools will then load with the status set as **Disabled**.
4. Select the actions you want, then select **Enable actions**. Once enabled, your MCP connector is ready to be used within a Gemini App.

<Lightbox src="/img/mcp/gemini-enterprise/gemini-enable-actions.png" width="80%" title="Selecting dbt MCP actions and enabling them" />

Gemini Enterprise calls MCP tools *actions*. Refer to [Google's docs on enabling actions](https://docs.cloud.google.com/gemini/enterprise/docs/connectors/custom-mcp-server/set-up-custom-mcp-server#enable-actions). For what each tool does, refer to [Available MCP tools](/docs/dbt-ai/mcp-available-tools).

## Create a Gemini Enterprise app

Create Gemini Enterprise app by following these steps:
1. In Gemini Enterprise, go to **Apps** and select **Create app**.
2. Enter an app name, choose a location (**global** works if you have no preference), and enter your company's external name (optional). Select **Create**.

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-create-app.png" width="90%" title="The 'Create app' form with the app name, location, and company name" />

3. On the **Overview** page, bookmark or save the web app URL. You use it each time you chat with Gemini.

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-app-overview.png" width="90%" title="The app Overview page with the web app URL" />

4. Go to **Connected data stores** and select **Add existing data stores**.

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-add-existing-data-stores.png" width="90%" title="The 'Connected data stores' page with the Add existing data stores button" />

5. Select the dbt MCP connector, then select **Connect**.

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-connect-existing-data-store.png" width="90%" title="Selecting the dbt MCP connector in the 'Connect an existing data store' dialog" />

## Use dbt MCP from Gemini

Connect the dbt MCP server in your Gemini app by following these steps:

1. Open your web app URL.
2. Select the connectors icon, then select **Authorize** next to the dbt connector and **Allow access** in the <Constant name="dbt_platform" /> window. Each user needs to do this only once.
3. Ask a question, such as _"List all of the dbt projects"_.

<Lightbox src="/img/mcp/gemini-enterprise/gemini-authorize-connector.png" width="90%" title="Authorizing the dbt connector from the connectors menu in Gemini Enterprise" />

Gemini calls the dbt MCP tools and returns your projects and environments, with follow-up questions to try next.

<Lightbox src="/img/mcp/gemini-enterprise/gemini-list-projects-result.png" width="90%" title="Gemini Enterprise listing dbt projects and environments through the dbt MCP connector" />

You can now use [42+ different tools](/docs/dbt-ai/about-mcp#supported-tools-by-mcp-server-type) supported by dbt through this Gemini app, depending on your plan.

## Related docs

- [Set up the remote MCP server](/docs/dbt-ai/setup-remote-mcp)
- [Available MCP tools](/docs/dbt-ai/mcp-available-tools)
- [Connect apps with OAuth](/docs/platform/manage-access/connect-apps-oauth)
