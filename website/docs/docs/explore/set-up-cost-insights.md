---
title: "Set up Cost Insights"
sidebar_label: "Set up Cost Insights"
description: "Learn how to set up Cost Insights to track warehouse compute costs and view realized savings from state-aware orchestration across your dbt projects and models."
id: "set-up-cost-insights"
tags: ['SAO', 'cost savings', 'models built', 'cost insights', 'cost reduction', 'cost optimization']
---

# Set up Cost Insights <Lifecycle status="private_beta,managed,managed_plus" />

This guide walks you through setting up Cost Insights to track warehouse compute costs and cost reductions from state-aware orchestration across your dbt projects and models.

## Prerequisites

Before setting up Cost Insights, ensure you have:

- A dbt account with <Constant name="fusion_engine" /> enabled. Contact your account manager to enable <Constant name="fusion" /> for your account.
- An administrator role.
- A supported data warehouse: Snowflake, BigQuery, or Databricks.

To set up Cost Insights, follow these steps:

1. [Assign required permissions.](#assign-required-permissions)
2. [Configure platform metadata credentials.](#configure-platform-metadata-credentials)
3. [(Optional) Configure Cost Insights settings.](#configure-cost-insights-settings-optional)
4. [(Optional) Enable state-aware orchestration in your job settings.](#enable-state-aware-orchestration-optional)

After completing these setup steps, you can view cost and optimization data across multiple areas of the <Constant name="dbt_platform" />. Refer to [Explore cost data](/docs/explore/explore-cost-data) to learn more about the Cost Insights section and how to use it.

## Assign required permissions

Users with the following [permission sets](/docs/platform/manage-access/enterprise-permissions) can view cost data by default:

- Account Admin
- Account Viewer
- Cost Insights Admin
- Cost Insights Viewer
- Database Admin
- Git Admin
- Job Admin
- Project Creator
- Team Admin

For more information on how to assign permissions to users, refer to [About user access](/docs/platform/manage-access/about-user-access).

## Configure platform metadata credentials

1. Click your account name at the bottom of the left-side menu and click **Account settings**.
2. Under **Settings**, go to **Connections**.
3. Select an existing connection or create a new connection for the project where you want to enable Cost Insights.
4. Configure platform metadata credentials for your connection.
    1. Go to the **Platform metadata credentials** section. Depending on your current configuration, you may see one of the following:
        - If no platform metadata credentials are configured yet, the credentials form is immediately in edit mode.
        - If you previously canceled the form and see **Add credentials**, click the button to reopen the form.
        - If you have multiple connections that reference the same account identifier, you will only be prompted to add platform metadata credentials to one of them. Other connections using the same account identifier will display a message indicating that platform metadata credentials are already configured.
    2. Add credentials with permissions to the warehouse tables. Expand each connection to see the permissions required.

        <Expandable alt_header="Snowflake">
        - `read` permissions to the [`ORGANIZATION_USAGE`](https://docs.snowflake.com/en/sql-reference/organization-usage) and [`ACCOUNT_USAGE`](https://docs.snowflake.com/en/sql-reference/account-usage) schemas
        - A Snowflake database role assigned the following access:
            - `ACCOUNT_USAGE.QUERY_HISTORY`
            - `ACCOUNT_USAGE.QUERY_ATTRIBUTION_HISTORY`
            - `ACCOUNT_USAGE.ACCESS_HISTORY`
            - `ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY`
            - `ORGANIZATION_USAGE.USAGE_IN_CURRENCY_DAILY` (Optional)
        </Expandable>

        <Expandable alt_header="BigQuery">
        - `bigquery.datasets.get`
        - `bigquery.jobs.create`
        - `bigquery.jobs.listAll`
        </Expandable>

        <Expandable alt_header="Databricks">
        - Access to a [Unity Catalog workspace](https://docs.databricks.com/aws/en/admin/system-tables/#requirements)
        - `USE` permissions on the catalog and schema
        - `SELECT` permissions on the following system tables:
            - [`system.billing.usage`](https://docs.databricks.com/aws/en/admin/system-tables/billing)
            - [`system.billing.list_prices`](https://docs.databricks.com/aws/en/admin/system-tables/pricing)
            - [`system.query.history`](https://docs.databricks.com/aws/en/admin/system-tables/query-history)

        For more information, refer to the Databricks documentation on [granting access to system tables](https://docs.databricks.com/aws/en/admin/system-tables/#grant-access-to-system-tables).
        </Expandable>

5. Verify that **Cost insights** is enabled under **Features**. This feature is enabled by default when you configure platform metadata credentials.
6. Click **Save**.

## Configure Cost Insights settings (optional)

By default, dbt uses standard warehouse pricing. If you have custom pricing contracts, you can override these values _except_ for Databricks connections. The default values vary by warehouse:

| Warehouse | Default values |
|-----------|----------------|
| [Snowflake](https://www.snowflake.com/en/pricing-options/) | `price_per_credit` = $3 |
| [BigQuery](https://cloud.google.com/bigquery/pricing) | `price_per_slot_hour` = $0.04, `price_per_tib` = $6.25 |
| [Databricks](https://docs.databricks.com/aws/en/admin/system-tables/pricing) | dbt queries the `list_prices` system table directly, so there is no default value. |

<br></br>

To change the default value:

1. Click your account name at the bottom of the left-side menu and click **Account settings**.
2. Under **Settings**, go to **Connections**.
3. Select the connection where you want to configure Cost Insights settings.
4. Go to the **Cost Insights settings** section.
5. Enter your custom value in the **Price per credit** field.
6. Click **Save**.

These custom values will apply to all future cost calculations for this connection. If you clear these values, they will reset to the default warehouse pricing.

## Enable state-aware orchestration (optional)

Cost Insights displays cost data for your dbt models and jobs without state-aware orchestration. However, to understand the impact of optimizations and see cost reductions from model and test reuse, you must enable state-aware orchestration in your jobs. For steps on how to enable this feature, see [Setting up state-aware orchestration](/docs/deploy/state-aware-setup).

import CostInsights from '/snippets/_cost-insights-sao.md';

<CostInsights />

## Disable Cost Insights

To disable Cost Insights, you must have an administrator role.

1. Click your account name at the bottom of the left-side menu and click **Account settings**.
2. Under **Settings**, go to **Connections**.
3. Select the connection where you want to disable Cost Insights.
4. Go to **Platform metadata credentials** and click **Edit**.
5. Go to the **Features** section and clear the **Cost Insights** option.
6. Click **Save**.
