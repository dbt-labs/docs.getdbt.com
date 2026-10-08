---
title: "OAuth client credentials for dbt State"
sidebar_label: "OAuth client credentials (Retired)"
description: "Learn how to configure dbt State authentication using OAuth client credentials for the standalone dbt State app."
id: "dbt-state-oauth"
tags: ['dbt State']
availability: everywhere_usage
---

import DbtStateAppRetirement from '/snippets/_dbt-state-app-retirement.md';

# OAuth client credentials for dbt State <Lifecycle status="Retired" />

<DbtStateAppRetirement />

If you're using the standalone [dbt State web app](https://app.state.dbt.com/), authenticate dbt State with OAuth client credentials.

## Prerequisites

- dbt State installed and configured. Refer to [Set up dbt State](/docs/deploy/dbt-state-setup) for more information.
- A standalone dbt State account at [app.state.dbt.com](https://app.state.dbt.com/).
- An **Admin** or **Owner** role in your dbt State organization. Refer to [Roles and tab access](#roles-and-tab-access) for details.

## Roles and tab access

The dbt State web app has four tabs under **Organization**:

<SimpleTable>
| Tab | Description |
|-----|-------------|
| **Usage** | View your project reuses and compute time saved once dbt State is enabled. |
| **Users** | Invite team members and grant or revoke access. |
| **Billing** | View daily active target tables (DATTs) for the current billing period. |
| **Clients** | Create and manage OAuth clients for CI/CD and other non-interactive environments. |
</SimpleTable>
<br />
Your role determines which tabs you can access.

<SimpleTable>
| Role | Access | Notes |
|------|-----------|-------|
| **Owner** | Usage, Users, Billing, Clients | The user who created the organization is the Owner by default. An Owner can transfer their role to another user, which demotes the original Owner to Admin. |
| **Admin** | Usage, Users, Billing, Clients | — |
| **Developer** | Usage | Default role when users are added. |
</SimpleTable>

An existing **Owner** or **Admin** can grant or revoke admin access from the **Users** tab.

## Creating an OAuth client

1. In the [dbt State web app](https://app.state.dbt.com/), navigate to the **Clients** tab.
2. Click **Add OAuth Client**.
3. Enter a name and description for the new client and click **Create**.
4. Copy the client ID and secret to use in your environment configuration.

## Configuring OAuth authentication

Once you have the client ID and secret, set the following environment variables in your environment. Using environment variables is the recommended approach as it keeps sensitive credentials out of your code repository.

```bash
DBT_ENGINE_STATE_OAUTH_CLIENT_ID=YOUR_CLIENT_ID
DBT_ENV_SECRET_STATE_OAUTH_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

Replace `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` with the values from your OAuth client.

Once configured, [verify dbt State is active](/docs/deploy/dbt-state-cicd#verifying-dbt-state-is-active).

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [Setting up authentication for non-interactive environments](/docs/deploy/dbt-state-cicd)
