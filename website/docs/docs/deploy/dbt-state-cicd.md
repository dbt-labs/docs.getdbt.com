---
title: "Non-interactive environment setup for dbt State"
sidebar_label: "Non-interactive environment setup"
description: "Learn how to configure dbt State authentication for CI/CD and other non-interactive environments using OAuth client credentials."
id: "dbt-state-cicd"
tags: ['dbt State']
---

# Setting up dbt State for non-interactive environments <Lifecycle status="preview" />

:::note
This setup only applies when using the standalone [dbt State web app](https://app.state.dbt.com/).
:::

In a non-interactive environment, dbt runs without a person available to complete authentication manually &mdash; for example, CI/CD pipelines (such as GitHub Actions, GitLab CI, and Jenkins) and production orchestration tools (such as Airflow and Prefect). Browser-based authentication isn't possible in these environments; dbt State authenticates with OAuth client credentials instead, so it stays active and keeps caching to optimize your builds.

dbt State automatically detects when it's running in a non-interactive environment. If OAuth client credentials are not provided, dbt State disables itself and displays a warning, allowing your dbt commands to continue without caching.

## OAuth client credentials

OAuth client authentication requires two credentials:

- **Client ID** — A unique identifier for your OAuth client
- **Client secret** — A secret key used to authenticate your client

## Prerequisites

Before you begin, make sure you have:

- dbt State installed and configured. Refer to [Set up dbt State](/docs/deploy/dbt-state-setup) for more information.
- A standalone dbt State account at [app.state.dbt.com](https://app.state.dbt.com/).
- Admin permissions in your dbt State organization.

## Creating an OAuth client

1. In the [dbt State web app](https://app.state.dbt.com/), navigate to the **Clients** tab.
2. Click **Add OAuth Client**.
3. Enter a name and description for the new client and click **Create**.
4. Copy the client ID and secret to use in your environment configuration.

## Configuring authentication

Once you have the client ID and secret, set the following environment variables in your environment. Using environment variables is the recommended approach as it keeps sensitive credentials out of your code repository.

```bash
DBT_ENGINE_STATE_OAUTH_CLIENT_ID=your-client-id
DBT_ENV_SECRET_STATE_OAUTH_CLIENT_SECRET=your-client-secret
```

Make sure to replace `your-client-id` and `your-client-secret` with the values from your OAuth client.

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
