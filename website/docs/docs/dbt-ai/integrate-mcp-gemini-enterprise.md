---
title: "Integrate Gemini Enterprise with dbt MCP"
sidebar_label: "Integrate Gemini Enterprise with MCP"
description: "Connect Gemini Enterprise to the remote dbt MCP server so you can ask questions about your dbt projects in plain English."
id: "integrate-mcp-gemini-enterprise"
availability: platform_login
---

import MCPRemoteOauthBetaCallout from '/snippets/_mcp-remote-oauth-beta-callout.md';

Gemini Enterprise can call external MCP servers as tools. This guide walks you through connecting it to the remote dbt MCP server, so you can explore your projects, jobs, lineage, and metrics in plain English from a Gemini Enterprise web app.

The connection uses OAuth. You register an app integration in <Constant name="dbt_platform" />, then add it to Gemini Enterprise as a custom MCP server. Each person authorizes with their own <Constant name="dbt_platform" /> account, so Gemini only sees what they can see.

<MCPRemoteOauthBetaCallout />

## Prerequisites

- A <Constant name="dbt_platform" /> account with a deployed production environment. Remote MCP reads your production metadata, so with no models or jobs, you get very little back. Refer to [Set up the remote MCP server](/docs/dbt-ai/setup-remote-mcp).
- Admin access to **App integrations** in <Constant name="dbt_platform" />. Refer to [Connect apps with OAuth](/docs/platform/manage-access/connect-apps-oauth).
- A Google Cloud account with access to Gemini Enterprise, where you can create data stores and apps. You can get started by contacting Google Cloud sales, or try [Gemini Enterprise Plus edition at no cost for 30 days](https://console.cloud.google.com/freetrial?redirectPath=gemini-enterprise) without sales assistance.

## Register the app in dbt platform

1. In <Constant name="dbt_platform" />, go to **Account settings** → **Integrations** → **App integrations**.
2. Copy your **MCP Endpoint URL** and note your host, for example `abc123.us1.dbt.com`. You use both in the next section.
3. Select **+ Add integration**.
   <Lightbox src="/img/mcp/gemini-enterprise/dbt-mcp-endpoint-and-add-integration.png" width="80%" title="The App integrations page, with the MCP Endpoint URL and the Add integration button" />
4. Enter an integration name, such as `Gemini Enterprise connector`.
5. Set the **Redirect URI** to `https://vertexaisearch.cloud.google.com/oauth-redirect`, then select **Create integration**.
6. Copy the **Client ID**. The integration uses PKCE, so there's no client secret.

<Lightbox src="/img/mcp/gemini-enterprise/dbt-integration-client-id.png" width="80%" title="The registered integration, with its Client ID and the PKCE only note" />

## Add dbt MCP as a data store

In Gemini Enterprise, the MCP server lives in a data store.

1. In the Google Cloud console, go to **Gemini Enterprise** → **Data stores**, then select **Create data store**.
2. Under **MCP servers**, find **Custom MCP Server** and select **Add MCP server**.

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-add-custom-mcp-server.png" width="70%" title="The Custom MCP Server card on the Create data store page" />

3. Select **OAuth 2.0**, then fill in the fields. Replace `YOUR_DBT_HOST_URL` with your host, without the `https://`. For example, if your host url is `abc123.us1.dbt.com`, you'd enter `https://abc123.us1.dbt.com/oauth/authorize` for Authorization URL.

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

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-mcp-server-config.png" width="70%" title="The MCP Server Configuration form filled in for dbt" />

4. Once you click **Authorize**, it will open a separate window for you to allow Gemini access to <Constant name="dbt_platform" /> to perform the tasks and skills needed when communicating to the MCP. Select **Allow access**.
   <Lightbox src="/img/mcp/gemini-enterprise/gemini-authorize-dbt-window.png" width="70%" title="The dbt platform window asking you to authorize the Gemini Enterprise connector" />
5. When you see **Successfully logged in**, select **Continue**.
6. Once you allow access, click the first **Continue** button. Under **Advanced options**, add a description for the server. Gemini Enterprise uses it to decide when to call the server. Select **Continue**.
7. On the next page, choose a `region` and `name` the connector, then select **Create**.

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-configure-data-connector.png" width="70%" title="The data connector configuration with the region and connector name" />

Once the connector is created, **Connector state** shows **Active**. Its actions stay disabled until you manually turn them on.

## Enable the dbt actions

1. In Gemini Enterprise, go to the connector and then the **Actions** tab.
2. Select **Reload custom actions**, which will prompt a authorization request.
   <Lightbox src="/img/mcp/gemini-enterprise/gemini-reload-custom-actions.png" width="80%" title="The Actions tab with the Reload custom actions button" />
3. In the <Constant name="dbt_platform" /> window, select **Allow access**. The dbt MCP tools will then load as **Disabled**.
4. Select the actions you want, then select **Enable actions**. Once enabled, your MCP connector is ready to be used within a Gemini App.

<Lightbox src="/img/mcp/gemini-enterprise/gemini-enable-actions.png" width="80%" title="Selecting dbt MCP actions and enabling them" />

For what each tool does, refer to [Available MCP tools](/docs/dbt-ai/mcp-available-tools).

## Create a Gemini Enterprise app

1. In Gemini Enterprise, go to **Apps** and select **Create app**.
2. Enter an app name, choose a location (**global** works if you have no preference), and enter your company name. Select **Create**.

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-create-app.png" width="70%" title="The Create app form with the app name, location, and company name" />

3. On the **Overview** page, copy the web app URL. You use it to chat with Gemini.

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-app-overview.png" width="70%" title="The app Overview page with the web app URL" />

4. Go to **Connected data stores** and select **Add existing data stores**.

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-add-existing-data-stores.png" width="70%" title="The Connected data stores page with the Add existing data stores button" />

5. Select the dbt MCP connector, then select **Connect**.

   <Lightbox src="/img/mcp/gemini-enterprise/gemini-connect-existing-data-store.png" width="70%" title="Selecting the dbt MCP connector in the Connect an existing data store dialog" />

## Use dbt MCP from Gemini

1. Open your web app URL.
2. Select the connectors icon, then select **Authorize** next to the dbt connector and **Allow access** in the <Constant name="dbt_platform" /> window. Each person does this once.
3. Ask a question, such as _"List all of the dbt projects"_.

<Lightbox src="/img/mcp/gemini-enterprise/gemini-authorize-connector.png" width="80%" title="Authorizing the dbt connector from the connectors menu in Gemini Enterprise" />

Gemini calls the dbt MCP tools and returns your projects and environments, with follow-up questions to try next.

<Lightbox src="/img/mcp/gemini-enterprise/gemini-list-projects-result.png" width="80%" title="Gemini Enterprise listing dbt projects and environments through the dbt MCP connector" />

## Related docs

- [Set up the remote MCP server](/docs/dbt-ai/setup-remote-mcp)
- [Available MCP tools](/docs/dbt-ai/mcp-available-tools)
- [Connect apps with OAuth](/docs/platform/manage-access/connect-apps-oauth)
