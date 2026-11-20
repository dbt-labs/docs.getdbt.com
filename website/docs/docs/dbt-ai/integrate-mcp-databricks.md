---
title: "Integrate Databricks with dbt MCP"
sidebar_label: "Integrate Databricks with MCP"
description: "Install the dbt MCP server from Databricks Marketplace so you can use your dbt project from Databricks, including Genie."
id: "integrate-mcp-databricks"
availability: platform_login
---

Databricks agents can call external MCP servers as tools. This guide walks you through connecting a Databricks agent to the remote dbt MCP server so it can query your Semantic Layer metrics and data in plain English through [Genie](https://docs.databricks.com/aws/en/genie/) and other Databricks tools.

To get started, install the server from [Databricks Marketplace](https://marketplace.databricks.com/details/6d83d4e0-5279-47b7-831c-3cb90a82ecb3/dbt-Labs_dbt-MCP).

The connection uses OAuth with Dynamic Client Registration (DCR), so you don't need to manage a client secret. You authorize access from the MCP service page after installation.

## Prerequisites

- A <Constant name="dbt_platform" /> account with access to the remote dbt MCP server. Refer to [Set up the remote MCP server](/docs/dbt-ai/setup-remote-mcp).
- Your <Constant name="dbt_platform" /> host URL. Find it in **Account settings** or in your browser's address bar. For example, `https://vu491.us1.dbt.com/`.
- A Databricks workspace where you can install marketplace listings and create objects in a catalog and schema.

## Install from Databricks Marketplace

Use these steps to install the dbt MCP sever from the Databricks marketplace: 

1. Go to the [dbt MCP listing](https://marketplace.databricks.com/details/6d83d4e0-5279-47b7-831c-3cb90a82ecb3/dbt-Labs_dbt-MCP) on Databricks Marketplace.
   - If you're logged in to Databricks, select **Install**.
   - If you're not, select **Get access**, then log in to Databricks or create a new account.
2. Select a **Catalog** and a **Schema**, then enter an **MCP service name** (such as `dbt_mcp`)
3. Find your <Constant name="dbt_platform" /> [access URL](/docs/platform/about-platform/access-regions-ip-addresses). It looks like `https://vu491.us1.dbt.com/`. 
4. In **Host**, leave the `{tenant}` placeholder as is. If your access URL has a region such as `us1`, add it, so the host is `https://{tenant}.us1.dbt.com`. If it doesn't, keep the default `https://{tenant}.dbt.com`.
5. In **Tenant**, enter the first part of your access URL, before the first dot. For `https://vu491.us1.dbt.com/`, enter `vu491`. The **Server host** line under **Tenant** should now match your access URL.
6. Leave the remaining fields at their defaults, accept the terms, then select **Install**.
7. Open the MCP service page and authorize access to <Constant name="dbt_platform" />.
The install requests these OAuth scopes: `offline_access account:read projects:query catalog:read projects:develop jobs:run`.
<Lightbox src="/img/mcp/databricks-install-dbt-mcp.png" width="60%" title="The Install dbt MCP dialog filled in for tenant vu491 in the us1 region" />


## Use the dbt MCP server in Databricks

After you authorize access, add the MCP service to [Genie Code](https://docs.databricks.com/aws/en/genie-code/mcp), or use it in other Databricks tools that support MCP. Refer to [Databricks MCP docs](https://docs.databricks.com/aws/en/agents/mcp-tools/) for the options.

:::info About AI models in Genie Playground
Some models in Genie Playground don't accept tool calls, so they can't use the dbt MCP server. If tools don't show up, try a different model.
:::

## Legacy: manual DCR setup

We recommend using the marketplace install instead as it's the easiest but if you need to create the connection yourself, you can set it up manually:

1. In Databricks, go to **Connections** and create a new connection.
2. Select **HTTP** as the connection type.
3. Enter a catalog and schema.
4. Select **Dynamic Client Registration** as the credential type.
5. Enter your host, for example `https://vu491.us1.dbt.com/`.
6. Set the OAuth scope, for example `offline_access account:read projects:query catalog:read projects:develop jobs:run`.
7. Set the base path to `/api/ai/v1/mcp`, then create the connection.
8. Select **Login** and authorize access.

## Related docs

- [Set up the remote MCP server](/docs/dbt-ai/setup-remote-mcp)
- [Available MCP tools](/docs/dbt-ai/mcp-available-tools)
- [Connect apps with OAuth](/docs/platform/manage-access/connect-apps-oauth)
