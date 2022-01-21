---
title: "Service Account Tokens"
id: "service-tokens"
---

## Overview

Service tokens are like [User API tokens](user-tokens), but they belong to an account, rather than a user.

As such, they may be suitable for system-level integrations that do not run on behalf of any one user. Service tokens can be assigned any one of the roles that are available on dbt Cloud. More information on which roles are available can be found here.

## Generating a Service Token

In the Account Settings view of dbt Cloud, you can click on the Service Account tokens page and generate a new token. Create and save your token. Please note that you will not be able to view this token again after it is generated, so store it somewhere safe for later use.

## Service Token Permissions

Service tokens can be assigned any of the roles available in dbt Cloud. The list below is a summarized view of what each of the roles do. For a detailed view of the permissions in these roles please refer here.

### Account Admin Service Token

Account Admin Service tokens have full `read+write` access to an account, so please use them with caution.

### Metadata Only Service Token

Metadata only service tokens can be used to authorize requests to the metadata API.

### Account Viewer Service Token

Account viewer service tokens have read only access to dbt Cloud accounts

### Admin Service Token

Admin service tokens have unrestricted access to projects in dbt Cloud accounts. You have the option to grant that permission all projects in the account or grant the permission only on specific projects.

### Git Admin Service Token

Git admin service tokens have all the permissions listed [here](/docs/dbt-cloud/access-control/enterprise-permissions#git-admin).

### Database Admin Service Token

Database admin service tokens have all the permissions listed [here](/docs/dbt-cloud/access-control/enterprise-permissions#git-admin).

### Team Admin Service Token

Team admin service tokens have all the permissions listed [here](/docs/dbt-cloud/access-control/enterprise-permissions#git-admin).

### Job Admin Service Token

Job admin service tokens have all the permissions listed [here](/docs/dbt-cloud/access-control/enterprise-permissions#git-admin).

### Job Viewer Service Token

Job viewer admin service tokens have all the permissions listed [here](/docs/dbt-cloud/access-control/enterprise-permissions#git-admin).

### Developer Service Token

Developer service tokens have all the permissions listed [here](/docs/dbt-cloud/access-control/enterprise-permissions#git-admin).

### Analyst Service Token

Analyst admin service tokens have all the permissions listed [here](/docs/dbt-cloud/access-control/enterprise-permissions#git-admin).

### Stakeholder Service Token

Stakeholder service tokens have all the permissions listed [here](/docs/dbt-cloud/access-control/enterprise-permissions#git-admin).
