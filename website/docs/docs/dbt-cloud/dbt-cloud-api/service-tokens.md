---
title: "Service Account Tokens"
id: "service-tokens"
---

## Overview
Service Account Admin API tokens are like [User API tokens](user-tokens), but they belong to an
_account_, rather than _a user_.

As such, they may be suitable for system-level integrations that do not run on behalf of any one user. Service Account Admin tokens may only be created or modified by users with Account Admin (Enterprise plan) or Owner (Team plan) permissions on an account. Service Account tokens may be revoked if they become lost or compromised.

### Service Account Admin API tokens

<Changelog>

 - Service Account Admin tokens were launched in February, 2021

</Changelog>

Service Account Admin API tokens currently have full read+write access to an account, so please use them with caution.

#### Generating a Service Account Admin Token

In the Account Settings view of dbt Cloud, you can click on the Service Account tokens page and generate a new Account Admin token.  Create and save your token. Please note that you will not be able to view this token again after its is generated, so store it somewhere safe for later use.

### Metadata Only Service Account Tokens

<Changelog>

 - Metadata Only Service Account tokens were launched in April, 2021

</Changelog>

dbt Cloud users can create metadata only service account based API Tokens to authorize requests to the metadata API.

#### Generating a Metadata Only Service Account Token

In the Account Settings view of dbt Cloud, you can click on the Service Account tokens page and generate a new Metadata Only token.  Create and save your Metadata Only token. Please note that you will not be able to view this token again after its is generated, so store it somewhere safe for later use.
