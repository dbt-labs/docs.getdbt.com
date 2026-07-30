---
title: "Non-interactive environment setup for dbt State"
sidebar_label: "Non-interactive environment setup"
description: "Learn how to configure dbt State authentication for CI/CD and other non-interactive environments using service tokens or OAuth client credentials."
id: "dbt-state-cicd"
tags: ['dbt State']
availability: everywhere_usage
---

# Setting up dbt State for non-interactive environments <Lifecycle status="preview" />

In a non-interactive environment, dbt runs without a person available to complete authentication manually &mdash; for example, CI/CD pipelines (such as GitHub Actions, GitLab CI, and Jenkins) and production orchestration tools (such as Airflow and Prefect). Browser-based authentication isn't possible in these environments. Instead, dbt State authenticates using credentials provided through environment variables, allowing it to continue caching state and optimizing your builds.

dbt State automatically detects when it's running in a non-interactive environment. If valid credentials are not provided, dbt State disables itself and displays a warning, allowing your dbt commands to continue without caching.

There are two authentication methods depending on your setup:

- [**Service account token**](#service-token-dbt-platform) &mdash; for <Constant name="dbt_platform" /> users
- [**OAuth client credentials**](#oauth-client-credentials) &mdash; for standalone dbt State app users

## Service account token

For <Constant name="dbt_platform" /> users, you can authenticate dbt State with a [service token](/docs/dbt-apis/service-tokens).

### Prerequisites

Before you begin, make sure you have:

- A <Constant name="dbt_platform" /> account.
- **Owner** or **Account Admin** permissions to create a service token.
- dbt State installed and configured. Refer to [Set up dbt State](/docs/deploy/dbt-state-setup) for more information.

### Creating a service token

To create a service account token in <Constant name="dbt_platform" />, refer to [Generate service account tokens](/docs/dbt-apis/service-tokens#generate-service-account-tokens). When adding permissions for the token, assign at least one of the following:

- **Owner**
- **Account Admin**
- **Job Admin**
- **Job Creator**
- **Job Runner**
- **Developer**

### Configuring authentication

Set the following environment variables in your orchestration environment:

```bash
DBT_CLOUD_TOKEN=YOUR_SERVICE_TOKEN
DBT_CLOUD_ACCOUNT_HOST=YOUR_ACCOUNT_HOST
DBT_CLOUD_ACCOUNT_ID=YOUR_ACCOUNT_ID
```

Replace `YOUR_SERVICE_TOKEN` with your service token, `YOUR_ACCOUNT_HOST` with your account host (for example, `yc225.us1.dbt.com`), and `YOUR_ACCOUNT_ID` with your numeric account ID.

## OAuth client credentials

If you're using the standalone [dbt State web app](https://app.state.dbt.com/), authenticate with OAuth client credentials.

### Prerequisites

- dbt State installed and configured. Refer to [Set up dbt State](/docs/deploy/dbt-state-setup) for more information.
- A standalone dbt State account at [app.state.dbt.com](https://app.state.dbt.com/).
- Admin permissions in your dbt State organization.

### Creating an OAuth client

1. In the [dbt State web app](https://app.state.dbt.com/), navigate to the **Clients** tab.
2. Click **Add OAuth Client**.
3. Enter a name and description for the new client and click **Create**.
4. Copy the client ID and secret to use in your environment configuration.

### Configuring OAuth authentication

Once you have the client ID and secret, set the following environment variables in your environment. Using environment variables is the recommended approach as it keeps sensitive credentials out of your code repository.

```bash
DBT_ENGINE_STATE_OAUTH_CLIENT_ID=YOUR_CLIENT_ID
DBT_ENV_SECRET_STATE_OAUTH_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

Replace `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` with the values from your OAuth client.

## Verifying dbt State is active

1. Run any dbt transformation job in your orchestrated environment.
2. Check the log output. You should see a message like this, then the specific dbt State step status:

   ```
   dbt State adapter: dbt-state v2.10.1 is enabled
   ```

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
- [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration)
