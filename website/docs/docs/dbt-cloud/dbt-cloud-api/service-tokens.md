---
title: "Service account tokens"
id: "service-tokens"
description: "Service account tokens help you define permissions for securing access to your dbt Cloud account and its projects."
---

## About service tokens

Service account tokens enable you to securely authenticate with the dbt Cloud API by assigning each token a narrow set of permissions that more precisely manages access to the API. While similar to [User API tokens](user-tokens), service account tokens belong to an account rather than a user.

You can use service account tokens for system-level integrations that do not run on behalf of any one user. You can assign service account tokens any role available in dbt Cloud. For more information about roles, see "[Enterprise Permissions](docs/dbt-cloud/access-control/enterprise-permissions)".

## Generating service account tokens

In the Account Settings view of dbt Cloud, you can click on the Service Account tokens page and generate a new token. Create and save your token somewhere safe.

**Important!:** You will not be able to view this token again after generating it, so store the token somewhere safe for later use.

## Permissions for service account tokens

You can assign service account tokens any role available in dbt Cloud. When you assign a role to a token, you will also be able to choose whether to grant that permissions to all projects in the account or to specific projects.

The following permission list summarizes each role. For more details about the permissions in these roles, see "[Enterprise permissions](/docs/dbt-cloud/access-control/enterprise-permissions)."



### Account Admin service token

Account Admin service tokens have full `read + write` access to an account, so please use them with caution. For more on these permissions, see [Account Admin](docs/dbt-cloud/access-control/enterprise-permissions#account-admin) on the Enterprise Permissions page.

### Metadata Only Service Token

Metadata only service tokens can be used to authorize requests to the metadata API.

### Account Viewer Service Token

Account Viewer service tokens have read only access to dbt Cloud accounts. For more on these permissions, see [Account Viewer](docs/dbt-cloud/access-control/enterprise-permissions#account-viewer) on the Enterprise Permissions page.

### Admin Service Token

Admin service tokens have unrestricted access to projects in dbt Cloud accounts. You have the option to grant that permission all projects in the account or grant the permission only on specific projects. For more on these permissions, see [Admin Service](docs/dbt-cloud/access-control/enterprise-permissions#admin-service) on the Enterprise Permissions page.

### Git Admin Service Token

Git admin service tokens have all the permissions listed in [Git admin](/docs/dbt-cloud/access-control/enterprise-permissions#git-admin) on the Enterprise Permissions page.

### Database Admin Service Token

Database admin service tokens have all the permissions listed in [Database admin](/docs/dbt-cloud/access-control/enterprise-permissions#database-admin) on the Enterprise Permissions page.

### Team Admin Service Token

Team admin service tokens have all the permissions listed in [Team admin](/docs/dbt-cloud/access-control/enterprise-permissions#team-admin) on the Enterprise Permissions page.

### Job Admin Service Token

Job admin service tokens have all the permissions listed [Job admin](/docs/dbt-cloud/access-control/enterprise-permissions#job-admin).

### Job Viewer Service Token

Job viewer admin service tokens have all the permissions listed in [Job viewer](/docs/dbt-cloud/access-control/enterprise-permissions#job-viewer) on the Enterprise Permissions page.

### Developer Service Token

Developer service tokens have all the permissions listed in [Developer](/docs/dbt-cloud/access-control/enterprise-permissions#developer) on the Enterprise Permissions page.
### Analyst Service Token

Analyst admin service tokens have all the permissions listed in [Analyst](/docs/dbt-cloud/access-control/enterprise-permissions#analyst) on the Enterprise Permissions page.

### Stakeholder Service Token

Stakeholder service tokens have all the permissions listed in [Stakeholder](/docs/dbt-cloud/access-control/enterprise-permissions#stakeholder) on the Enterprise Permissions page.
