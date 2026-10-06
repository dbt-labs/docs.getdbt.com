---
title: "Non-interactive environment setup for dbt State"
sidebar_label: "Non-interactive environment setup"
description: "Learn how to configure dbt State authentication for CI/CD and other non-interactive environments using service tokens."
id: "dbt-state-cicd"
tags: ['dbt State']
availability: everywhere_usage
---

# Setting up dbt State for non-interactive environments

In a non-interactive environment, dbt runs without a person available to complete authentication manually &mdash; for example, CI/CD pipelines (such as GitHub Actions, GitLab CI, and Jenkins) and production orchestration tools (such as Airflow and Prefect). Browser-based authentication isn't possible in these environments. Instead, dbt State authenticates using credentials provided through environment variables, allowing it to continue caching state and optimizing your builds.

dbt State automatically detects when it's running in a non-interactive environment. If valid credentials are not provided, dbt State disables itself and displays a warning, allowing your dbt commands to continue without caching.

Running dbt in a non-interactive environment requires a service account token for authentication. A <Constant name="dbt_platform" /> account is required to generate a service token; if you don't have one yet, refer to [Set up dbt State](/docs/deploy/dbt-state-setup) to create a free account before proceeding.

If you previously signed up for dbt State at `app.state.dbt.com` and haven't migrated to <Constant name="dbt_platform" /> yet, refer to [OAuth client credentials](/docs/deploy/dbt-state-oauth).

## Prerequisites

Before you begin, make sure you have:

- A <Constant name="dbt_platform" /> account.
- **Owner** or **Account Admin** permissions to create a service token.
- dbt State installed and configured. Refer to [Set up dbt State](/docs/deploy/dbt-state-setup) for more information.

## Creating a service token

To create a service account token in <Constant name="dbt_platform" />, refer to [Generate service account tokens](/docs/dbt-apis/service-tokens#generate-service-account-tokens). When adding permissions for the token, assign at least one of the following:

- **Account Admin**

The following are available on Enterprise plans only:
- **Owner**
- **Job Admin**
- **Job Creator**
- **Job Runner** (Recommended; provides the minimum access required for dbt State)
- **Developer**

## Configuring authentication

Set the following environment variables in your orchestration environment:

```bash
DBT_CLOUD_TOKEN=YOUR_SERVICE_TOKEN
DBT_CLOUD_ACCOUNT_HOST=YOUR_ACCOUNT_HOST
DBT_CLOUD_ACCOUNT_ID=YOUR_ACCOUNT_ID
```

Replace `YOUR_SERVICE_TOKEN` with your service token, `YOUR_ACCOUNT_HOST` with your [account host](/docs/platform/about-platform/access-regions-ip-addresses) (for example, `abc123.us1.dbt.com`), and `YOUR_ACCOUNT_ID` with your numeric account ID. Go to **Account settings** > **Account** to find your account ID and account host (the hostname from the **Access URL** field).

Once configured, [verify dbt State is active](#verifying-dbt-state-is-active).

## Verifying dbt State is active

1. Run any dbt transformation job in your orchestrated environment.
2. Check the log output. You should see a message like this, then the specific dbt State step status:

   ```
   dbt State adapter: dbt-state v2.10.1 is enabled
   ```

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [OAuth client credentials (standalone app)](/docs/deploy/dbt-state-oauth)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
- [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration)
