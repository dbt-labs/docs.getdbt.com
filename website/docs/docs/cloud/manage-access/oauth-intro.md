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

| Platform | Doc | What it does |
|----------|-----|----------------|
| **Snowflake** | [Set up Snowflake OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth) | Developers authorize dev credentials via Snowflake (or Snowflake SSO). |
| **Databricks** | [Set up Databricks OAuth](/docs/cloud/manage-access/set-up-databricks-oauth) | Developers authorize dev credentials via Databricks. |
| **BigQuery** | [Set up BigQuery OAuth](/docs/cloud/manage-access/set-up-bigquery-oauth) | Developers authorize dev credentials via Google. |
| **Snowflake (external)** | [Set up external OAuth with Snowflake](/docs/cloud/manage-access/snowflake-external-oauth) | Use an external IdP for Snowflake OAuth. |
| **Redshift (external)** | [Set up external OAuth with Redshift](/docs/cloud/manage-access/redshift-external-oauth) | Use an external IdP for Redshift OAuth. |


