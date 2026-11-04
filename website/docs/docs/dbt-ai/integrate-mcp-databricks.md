---
title: "Integrate Databricks with dbt MCP"
sidebar_label: "Integrate Databricks with MCP"
description: "Install the dbt MCP server from Databricks Marketplace so you can use your dbt project from Databricks, including Genie."
id: "integrate-mcp-databricks"
availability: platform_login
---

The remote dbt MCP server is listed on [Databricks Marketplace](https://marketplace.databricks.com/details/6d83d4e0-5279-47b7-831c-3cb90a82ecb3/dbt-Labs_dbt-MCP). Install it from the marketplace to give Databricks access to your dbt project through Genie and other Databricks tools.

The connection uses OAuth with Dynamic Client Registration (DCR), so you don't manage a client secret. You authorize access from the MCP service page after installation.

## Prerequisites

- A <Constant name="dbt_platform" /> account with access to the remote dbt MCP server. Refer to [Set up the remote MCP server](/docs/dbt-ai/setup-remote-mcp).
- Your <Constant name="dbt_platform" /> host URL. Find it in **Account settings** or in your browser's address bar. For example, `https://vu491.us1.dbt.com/`.
- A Databricks workspace where you can install marketplace listings and create objects in a catalog and schema.

## Install from Databricks Marketplace

This is the easiest path:

1. Go to the [dbt MCP listing](https://marketplace.databricks.com/details/6d83d4e0-5279-47b7-831c-3cb90a82ecb3/dbt-Labs_dbt-MCP) on Databricks Marketplace.
   - If you're logged in to Databricks, select **Install**.
   - If you're not, select **Get access**, then log in to Databricks or create a new account.
2. Select a **Catalog** and a **Schema**, then enter an **MCP service name**.
3. Set the host. In **Tenant**, enter the first part of your <Constant name="dbt_platform" /> host. For `https://vu491.us1.dbt.com/`, the tenant is `vu491`.
4. If your host includes a region, add it to the **Host** field. For `https://vu491.us1.dbt.com/`, change `https://{tenant}.dbt.com` to `https://{tenant}.us1.dbt.com`.
5. Leave the remaining fields at their defaults, then select **Install**.
6. Open the MCP service page and authorize access to <Constant name="dbt_platform" />.

<Lightbox src="/img/mcp/databricks-install-dbt-mcp.png" width="60%" title="The Install dbt MCP dialog in Databricks Marketplace" />

The install dialog is prefilled with these values:

| Field | Value |
| --- | --- |
| Host | `https://{tenant}.dbt.com` |
| Base path | `/api/ai/v1/mcp/` |
| Credential type | Dynamic Client Registration |
| Port | `443` |
| OAuth scope | `offline_access account:read projects:query catalog:read projects:develop jobs:run` |

## Use the dbt MCP server in Databricks

After you authorize access, add the MCP service to Genie, or use it with any Databricks tool that supports MCP.

:::note
Some models in Genie Playground don't accept tool calls, so they can't use the dbt MCP server. If tools don't show up, try a different model.
:::

## Legacy: manual DCR setup

Use the marketplace install instead. If you need to create the connection yourself, set it up manually:

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
