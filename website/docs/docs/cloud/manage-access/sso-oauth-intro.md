---
title: "Single sign-on, SCIM, and OAuth"
description: "Overview of SSO, SCIM, and OAuth options for authentication and access in the dbt platform."
id: "sso-oauth-intro"
---

# Single sign-on and OAuth <Lifecycle status="managed, managed_plus" />

This section covers how to authenticate users and connect data platforms in <Constant name="dbt_platform" /> using:

<!-- no toc -->
- [SSO](#sso)
- [SCIM](#scim)
- [Connection OAuth](#connection-oauth)

These features are available on Enterprise and Enterprise+ plans and are typically configured by account admins or security teams.

## SSO

Lets users log in to <Constant name="cloud" /> with your identity provider (IdP) instead of a password. Supports Just-in-Time provisioning and IdP-initiated login. *For admins setting up Okta, Microsoft Entra ID, Google Workspace, or SAML 2.0.*

- [Single sign-on (SSO) overview](/docs/cloud/manage-access/sso-overview) &mdash; How SSO works and prerequisites
- [Migrating to Auth0 for SSO](/docs/cloud/manage-access/auth0-migration)
- [Set up SSO with SAML 2.0](/docs/cloud/manage-access/set-up-sso-saml-2.0)
- [Set up SSO with Okta](/docs/cloud/manage-access/set-up-sso-okta)
- [Set up SSO with Google Workspace](/docs/cloud/manage-access/set-up-sso-google-workspace)
- [Set up SSO with Microsoft Entra ID](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id)

## SCIM

Automates user and group provisioning from your IdP into <Constant name="cloud" /> (and, with Okta, license assignment). *For admins using Okta or Microsoft Entra ID who want to sync users and groups.*

- [Set up SCIM](/docs/cloud/manage-access/scim) &mdash; Prerequisites and enabling SCIM in <Constant name="cloud" />
- [Set up SCIM with Okta](/docs/cloud/manage-access/scim-okta) (includes [license management](/docs/cloud/manage-access/scim-manage-user-licenses))
- [Set up SCIM with Entra ID](/docs/cloud/manage-access/scim-entra-id)

## Connection OAuth {#connection-oauth}

Connection OAuth is for authenticating to your data platform (like Snowflake, BigQuery), which is different from SSO, which handles user login to <Constant name="dbt_platform" />. It lets developers authorize their development credentials with a data platform using that platform's login instead of storing passwords in <Constant name="cloud" />. *For admins and developers connecting to supported data platforms.*

- [OAuth overview](/docs/cloud/manage-access/oauth-intro) &mdash; What's available and by platform
- [Set up Snowflake OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth)
- [Set up Databricks OAuth](/docs/cloud/manage-access/set-up-databricks-oauth)
- [Set up BigQuery OAuth](/docs/cloud/manage-access/set-up-bigquery-oauth)
- [Set up external OAuth with Snowflake](/docs/cloud/manage-access/snowflake-external-oauth)
- [Set up external OAuth with Redshift](/docs/cloud/manage-access/redshift-external-oauth)
