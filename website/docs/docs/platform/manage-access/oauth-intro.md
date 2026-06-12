---
title: "OAuth overview"
description: "Connect development credentials to data platforms using OAuth in the dbt platform."
id: "oauth-intro"
sidebar_label: "OAuth overview"
---

# OAuth overview <Lifecycle status="managed, managed_plus" />

OAuth in <Constant name="dbt_platform" /> lets developers authorize their development credentials with a data platform using that platform’s login or its single sign-on (SSO) instead of storing usernames and passwords in <Constant name="dbt_platform" />. This improves security and aligns with how your team already signs in to the warehouse.

**Who it’s for:** Account admins and developers on Enterprise or Enterprise+ plans who connect to supported data platforms. Admins configure the OAuth integration; developers complete a one-time authorization in their profile.

## Available integrations

Pick the best documentation for your platform to configure OAuth and have developers authorize their credentials.

| Platform | Doc | Description |
|----------|-----|----------------|
| **Snowflake** | [Set up Snowflake OAuth](/docs/platform/manage-access/set-up-snowflake-oauth) | Authorize development credentials using Snowflake (or Snowflake SSO). |
| **Databricks** | [Set up Databricks OAuth](/docs/platform/manage-access/set-up-databricks-oauth) | Authorize development credentials using Databricks. |
| **BigQuery** | [Set up BigQuery OAuth](/docs/platform/manage-access/set-up-bigquery-oauth) | Authorize development credentials using Google. |
| **Snowflake (external)** | [Set up external OAuth with Snowflake](/docs/platform/manage-access/snowflake-external-oauth) | Use an external identity provider (IdP) for Snowflake OAuth. |
| **Redshift (external)** | [Set up external OAuth with Redshift](/docs/platform/manage-access/redshift-external-oauth) | Use an external identity provider (IdP) for Redshift OAuth. |


