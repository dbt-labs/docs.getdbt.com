---
title: "dbt Cloud API"
id: "cloud-api"
---

## Overview

Accounts on the _Team_ and _Enterprise_ plans can query the dbt Cloud API.
The dbt Cloud API can be used to:

- Download artifacts after a job has completed 
- Kick off a job run from an orchestration tool
- Manage your dbt Cloud account
- and more

Full reference documentation for the dbt Cloud API can be found [here](/dbt-cloud/api).

## How to Access the API 

dbt Cloud supports two types of API Tokens: User tokens and Service Account
tokens.

### User API tokens

Each dbt Cloud user with a [Developer license](cloud-seats-and-users) is
issued an API token. This token can be used to execute queries against
the dbt Cloud API on the user's behalf. User API tokens inherit the
permissions of the user the that they were created for.

You can find your User API token in the Profile page under the `API Access`
label.

<Lightbox src="/img/api-access-profile.png" title="Finding your API token in your dbt Cloud Profile" />

### Service Account API tokens

<Changelog>

 - Service Account tokens were launched in February, 2021

</Changelog>

Service Account API tokens are like User API tokens, but they belong to an
_account_, rather than _a user_. As such, they may be suitable for system-level
integrations that do not run on behalf of any one user. Service Account tokens
may only be created or modified by users with Account Admin (Enterprise plan) or
Owner (Team plan) permissions on an account. Service Account tokens may be revoked
if they become lost or compromised.

Service Account API tokens currently have full read+write access to an account,
so please use them with caution. A future release of dbt Cloud will add granular
project-level permissioning to Service Account API tokens.

You can manage Service Account API tokens from the Account Settings > Service Tokens
page within dbt Cloud.

<LoomVideo id="55eb660a52bf4417b1274c6a55796cda" />

