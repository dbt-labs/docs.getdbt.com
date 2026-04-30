---
title: "How to find your dbt MCP IDs"
sidebar_label: "Finding your IDs"
description: "Step-by-step instructions for finding the numeric IDs needed for dbt MCP configuration."
id: "mcp-find-ids"
---

Several dbt MCP environment variables and headers require numeric IDs from your <Constant name="dbt_platform"/> account. This guide shows exactly where to find each one.

:::warning Use numeric IDs, not full URLs
ID variables expect integers, not URLs. A common mistake is copying the URL from your browser address bar.

```bash
# ✅ Correct
DBT_HOST=cloud.getdbt.com            # https://cloud.getdbt.com also works
DBT_PROD_ENV_ID=54321
DBT_USER_ID=123

# ❌ Wrong — IDs must be numeric, not full URLs
DBT_PROD_ENV_ID=https://cloud.getdbt.com/deploy/12345/projects/67890/environments/54321
DBT_USER_ID=https://cloud.getdbt.com/settings/profile
```
:::

## DBT_HOST (account hostname) {#dbt-host}

Your hostname is the domain you use to access <Constant name="dbt_platform"/>. Both `cloud.getdbt.com` and `https://cloud.getdbt.com` are accepted.

1. Log in to your <Constant name="dbt_platform"/> account.
2. Go to **Account settings**.
3. Copy the **Access URL** value.

| Account type | Example Access URL | DBT_HOST value |
| --- | --- | --- |
| US multi-tenant | `cloud.getdbt.com` | `cloud.getdbt.com` |
| Accounts with a subdomain prefix | `abc123.us1.dbt.com` | `abc123.us1.dbt.com` |
| Single-tenant | `your-company.getdbt.com` | `your-company.getdbt.com` |

For more information on regions and hosting, refer to [Access, Regions, & IP addresses](/docs/platform/about-platform/access-regions-ip-addresses).

## DBT_ACCOUNT_ID (account ID) {#dbt-account-id}

1. Log in to your <Constant name="dbt_platform"/> account.
2. Go to **Account settings**.
3. The account ID is displayed on the settings page, or you can find it in the URL: `https://cloud.getdbt.com/settings/accounts/ACCOUNT_ID/`. So for example, if the URL is `https://YOUR_ACCESS_URL/settings/accounts/12345/`, the account ID would be `12345`.

Alternatively, see [Finding your user and account IDs](/faqs/Accounts/find-user-id) for additional methods.

## DBT_PROD_ENV_ID (production environment ID) {#dbt-prod-env-id}

1. Log in to your <Constant name="dbt_platform"/> account.
2. Go to **Deploy** → **Environments**.
3. Click on your production environment.
4. The environment ID is in the URL: `https://cloud.getdbt.com/deploy/ACCOUNT_ID/projects/PROJECT_ID/environments/ENVIRONMENT_ID`. So for example, if the URL is `https://YOUR_ACCESS_URL/deploy/12345/projects/67890/environments/54321`, the environment ID would be `54321`.

Copy only the number at the end — for example, `54321`.

## DBT_DEV_ENV_ID (development environment ID) {#dbt-dev-env-id}

Follow the same steps as for `DBT_PROD_ENV_ID`, but click on your development environment instead of production.

This variable is required for `execute_sql`. If you don't have a dedicated development environment, you can use your production environment ID here, though a separate development environment is recommended.

## DBT_USER_ID (user ID) {#dbt-user-id}

1. Log in to your <Constant name="dbt_platform"/> account.
2. Go to **Account settings** → **Profile** (or click your profile/avatar).
3. Your user ID is in the URL: `https://cloud.getdbt.com/settings/profile/USER_ID`. So for example, if the URL is `https://YOUR_ACCESS_URL/settings/profile/123`, the user ID would be `123`.

Copy only the number.

Alternatively, see [Finding your user and account IDs](/faqs/Accounts/find-user-id).

## DBT_TOKEN (access token) {#dbt-token}

The following sections explain how to find your Personal Access Token (PAT) and Service token.

### Personal Access Token (PAT) {#pat}

Required for `execute_sql`. Tied to your personal account.

1. Go to **Account settings** → **API tokens** → **Personal tokens**.
2. Click **+ New token**, give it a name, and copy the token value.
3. Store it somewhere safe — you can't view it again after closing the dialog.

### Service token {#service-token}

Used for shared or team setups. Better for CI/automation.

1. Go to **Account settings** → **API tokens** → **Service tokens**.
2. Click **+ New token**, assign the required permissions, and copy the token value.
3. For full MCP access, the service token needs at least `Semantic Layer Only`, `Metadata Only`, and `Developer` permissions.

For more information, see [User tokens (PAT)](/docs/dbt-apis/user-tokens) and [Service tokens](/docs/dbt-apis/service-tokens).
