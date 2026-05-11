---
title: "Connect apps with OAuth"
description: "Manage OAuth 2.0 client registrations to connect AI tools and third-party apps to dbt."
id: "connect-apps-oauth"
sidebar_label: "Connect apps with OAuth"
---

# Connect apps with OAuth <Lifecycle status="private_beta,managed,managed_plus" />

The **App integrations** section in <Constant name="dbt_platform" /> lets admins manage OAuth 2.0 client registrations &mdash; a standard that lets external apps connect to dbt securely without sharing API tokens. Use it for:

- AI tools that connect to the remote dbt MCP server (such as Claude, ChatGPT, or Gemini).
- Your own API integrations built against <Constant name="dbt_platform" /> APIs, when you want end users to sign in with their dbt identity instead of distributing tokens.
- Third-party apps and IDE extensions that support OAuth for connecting to dbt.

This feature is available to Account admins on Enterprise or Enterprise+ plans.

To access this section, go to **Account settings** → **Integrations** → **App integrations**.

<Lightbox src="/img/docs/dbt-cloud/app-integrations-oauth.png" title="App integrations page showing manually and dynamically registered OAuth clients" />

## Registration methods

There are two ways you can register an app as an OAuth client:
- [Dynamic registration](#dynamic-registration): Apps that support [Dynamic Client Registration (RFC 7591)](https://datatracker.ietf.org/doc/html/rfc7591) self-register automatically when a user connects them to dbt. No admin action is required. Most popular AI tools (Claude, ChatGPT) use dynamic registration.
- [Manual registration](#manual-registration): For apps that don't support dynamic registration (for example, Salesforce agent or custom-built integrations), an admin can manually register an OAuth client.

### Dynamic registration

Apps that support [Dynamic Client Registration (RFC 7591)](https://datatracker.ietf.org/doc/html/rfc7591) self-register automatically when a user connects them to dbt. No admin action is required. The most popular AI tools (Claude, ChatGPT) use dynamic registration.

Dynamically registered apps appear in the **Dynamically registered** table, which shows:

| Column | Description |
|--------|-------------|
| Name | The app name |
| Redirect URL | The OAuth callback URL the app registered |
| Created on | When the client was first registered |
| Last used on | When the client last made an authenticated request |

<!-- add info on how to disable dynamic client registration when it's live -->

### Manual registration

For apps that don't support dynamic registration (for example, Salesforce agent or custom-built integrations), an admin can manually register an OAuth client.

To add a manually registered integration:

1. Go to **Account settings** → **Integrations** → **App integrations**.
2. Click **+ Add integration**.
3. Complete the registration form. Each manually registered client receives a unique client ID. Note that no client secret is issued, and the client must instead support the [PKCE extension (RFC 7636)](https://datatracker.ietf.org/doc/html/rfc7636).

Manually registered clients appear in the **Manually registered** section.

## Use with remote MCP

When you connect an MCP client to the [remote dbt MCP server](/docs/dbt-ai/setup-remote-mcp#oauth-remote-mcp), it authenticates using OAuth. Clients that support dynamic registration (like Claude) complete this automatically — you'll see them appear in the **Dynamically registered** table after first use.

The **App integrations** section will also display the full **MCP URL** for your account so you can copy it directly into your AI tool.

For more information on remote MCP OAuth setup, see [Use the remote dbt MCP server](/docs/dbt-ai/mcp-quickstart-remote).
