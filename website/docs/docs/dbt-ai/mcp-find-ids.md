---
title: "How to find your dbt MCP IDs"
sidebar_label: "Finding your IDs"
description: "Step-by-step instructions for finding the numeric IDs needed for dbt MCP configuration."
id: "mcp-find-ids"
---

Several dbt MCP environment variables and headers require numeric IDs from your dbt platform account. This guide shows exactly where to find each one.

:::warning Use numeric IDs, not full URLs
These variables expect integers or hostnames — not URLs. A common mistake is copying the URL from your browser address bar.

```bash
# ✅ Correct
DBT_PROD_ENV_ID=54321
DBT_USER_ID=123
DBT_HOST=cloud.getdbt.com

# ❌ Wrong — these are URLs, not IDs
DBT_PROD_ENV_ID=https://cloud.getdbt.com/deploy/12345/projects/67890/environments/54321
DBT_USER_ID=https://cloud.getdbt.com/settings/profile
DBT_HOST=https://cloud.getdbt.com
```
:::

## DBT_HOST (account hostname)

Your hostname is the domain you use to access dbt Cloud, without `https://`.

1. Log in to your dbt platform account.
2. Go to **Account settings**.
3. Copy the **Access URL** value.
4. Remove the `https://` prefix — use only the hostname.

| Account type | Example Access URL | DBT_HOST value |
| --- | --- | --- |
| US multi-tenant | `cloud.getdbt.com` | `cloud.getdbt.com` |
| Multi-cell | `abc123.us1.dbt.com` | `us1.dbt.com` (set `MULTICELL_ACCOUNT_PREFIX=abc123`) |
| Single-tenant | `your-company.getdbt.com` | `your-company.getdbt.com` |

For more information on regions and hosting, refer to [Access, Regions, & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses).

## DBT_ACCOUNT_ID (account ID)

1. Log in to your dbt platform account.
2. Go to **Account settings**.
3. The account ID is displayed on the settings page, or you can find it in the URL: `https://cloud.getdbt.com/settings/accounts/**{account_id}**/`

Alternatively, see [Finding your user and account IDs](/faqs/Accounts/find-user-id) for additional methods.

## DBT_PROD_ENV_ID (production environment ID)

1. Log in to your dbt platform account.
2. Go to **Deploy** → **Environments**.
3. Click on your production environment.
4. The environment ID is in the URL: `https://cloud.getdbt.com/deploy/**{account_id}**/projects/**{project_id}**/environments/**{environment_id}**`

Copy only the number at the end — for example, `54321`.

## DBT_DEV_ENV_ID (development environment ID)

Follow the same steps as for `DBT_PROD_ENV_ID`, but click on your development environment instead of production.

This variable is required for `execute_sql`. If you don't have a dedicated development environment, you can use your production environment ID here, though a separate development environment is recommended.

## DBT_USER_ID (user ID)

1. Log in to your dbt platform account.
2. Go to **Account settings** → **Profile** (or click your profile/avatar).
3. Your user ID is in the URL: `https://cloud.getdbt.com/settings/profile/**{user_id}**`

Copy only the number — for example, `123`.

Alternatively, see [Finding your user and account IDs](/faqs/Accounts/find-user-id).

## DBT_TOKEN (access token)

### Personal Access Token (PAT)

Required for `execute_sql`. Tied to your personal account.

1. Go to **Account settings** → **API tokens** → **Personal tokens**.
2. Click **+ New token**, give it a name, and copy the token value.
3. Store it somewhere safe — you can't view it again after closing the dialog.

### Service token

Used for shared or team setups. Better for CI/automation.

1. Go to **Account settings** → **API tokens** → **Service tokens**.
2. Click **+ New token**, assign the required permissions, and copy the token value.
3. For full MCP access, the service token needs at least `Semantic Layer Only`, `Metadata Only`, and `Developer` permissions.

For more information, see [User tokens (PAT)](/docs/dbt-cloud-apis/user-tokens) and [Service tokens](/docs/dbt-cloud-apis/service-tokens).
