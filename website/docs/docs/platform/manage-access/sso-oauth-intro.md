---
title: "Single sign-on, SCIM, and OAuth"
description: "Overview of SSO, SCIM, and OAuth options for authentication and access in the dbt platform."
id: "sso-oauth-intro"
---

# Single sign-on and OAuth <Lifecycle status="managed, managed_plus" />

This section covers how to authenticate users and connect data platforms in <Constant name="dbt_platform" /> using:

<!-- no toc -->
- [Single sign-on (SSO)](#sso)
- [System for Cross-Domain Identity Management (SCIM)](#scim)
- [Connection OAuth](#connection-oauth)

These features are available on Enterprise and Enterprise+ plans and are typically configured by account admins or security teams.

## SSO

Lets users log in to <Constant name="dbt" /> with your identity provider (IdP) instead of a password. Supports Just-in-Time provisioning and IdP-initiated login. *For admins setting up Okta, Microsoft Entra ID, Google Workspace, or SAML 2.0.*

- [Single sign-on (SSO) overview](/docs/platform/manage-access/sso-overview) &mdash; How SSO works and prerequisites
- [Migrating to Auth0 for SSO](/docs/platform/manage-access/auth0-migration)
- [Set up SSO with SAML 2.0](/docs/platform/manage-access/set-up-sso-saml-2.0)
- [Set up SSO with Okta](/docs/platform/manage-access/set-up-sso-okta)
- [Set up SSO with Google Workspace](/docs/platform/manage-access/set-up-sso-google-workspace)
- [Set up SSO with Microsoft Entra ID](/docs/platform/manage-access/set-up-sso-microsoft-entra-id)

## SCIM

Automates user and group provisioning from your IdP into <Constant name="dbt" /> (and, with Okta, license assignment). *For admins using Okta or Microsoft Entra ID who want to sync users and groups.*

- [Set up SCIM](/docs/platform/manage-access/scim) &mdash; Prerequisites and enabling SCIM in <Constant name="dbt" />
- [Set up SCIM with Okta](/docs/platform/manage-access/scim-okta) (includes [license management](/docs/platform/manage-access/scim-manage-user-licenses))
- [Set up SCIM with Entra ID](/docs/platform/manage-access/scim-entra-id)

## Connection OAuth {#connection-oauth}

Connection OAuth is for authenticating to your data platform (like Snowflake, BigQuery), which is different from SSO, which handles user login to <Constant name="dbt_platform" />. It lets developers authorize their development credentials with a data platform using that platform's login instead of storing passwords in <Constant name="dbt" />. *For admins and developers connecting to supported data platforms.*

- [OAuth overview](/docs/platform/manage-access/oauth-intro) &mdash; What's available by platform
- [Set up Snowflake OAuth](/docs/platform/manage-access/set-up-snowflake-oauth)
- [Set up Databricks OAuth](/docs/platform/manage-access/set-up-databricks-oauth)
- [Set up BigQuery OAuth](/docs/platform/manage-access/set-up-bigquery-oauth)
- [Set up external OAuth with Snowflake](/docs/platform/manage-access/snowflake-external-oauth)
- [Set up external OAuth with Redshift](/docs/platform/manage-access/redshift-external-oauth)
