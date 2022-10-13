---
title: "Service account tokens"
id: "service-tokens"
description: "Service account tokens help you define permissions for securing access to your dbt Cloud account and its projects."
---

## About service tokens

Service account tokens enable you to securely authenticate with the dbt Cloud API by assigning each token a narrow set of permissions that more precisely manages access to the API. While similar to [User API tokens](user-tokens), service account tokens belong to an account rather than a user.

You can use service account tokens for system-level integrations that do not run on behalf of any one user. Assign any permission sets available in dbt Cloud to your service account token, which can vary slightly depending on your plan:

* Enterprise plans can apply any permission sets available to service tokens.
* Team plans can apply Account Admin, Member, Job Admin, Read-Only, and Metadata permissions sets to service tokens.

You can assign as many permission sets as needed to one token. For more on permissions sets, see "[Enterprise Permissions](/docs/collaborate/manage-access/enterprise-permissions)."

## Generating service account tokens

In the Account Settings view of dbt Cloud, you can click on the Service Account tokens page and generate a new token. Create and save your token somewhere safe.

:::caution Note

You will not be able to view this token again after generating it, so store the token somewhere safe for later use.

:::

## Permissions for service account tokens

You can assign service account tokens any permission set available in dbt Cloud. When you assign a permission set to a token, you will also be able to choose whether to grant that permissions to all projects in the account or to specific projects.

### Team plans using service account tokens

The following permissions can be assigned to a service account token on a Team plan.

**Account Admin**<br/>
Account Admin service tokens have full `read + write` access to an account, so please use them with caution.  A Team plan refers to this permission set as an "Owner role." For more on these permissions, see [Account Admin](/docs/collaborate/manage-access/enterprise-permissions#account-admin).

**Metadata Only**<br/>
Metadata only service tokens can authorize requests to the metadata API.

**Job Admin**<br/>
Job admin service tokens can authorize requests for viewing, editing, and creating environments, triggering runs, and viewing historical runs.  

**Member** <br/>
Member service tokens can authorize requests for viewing and editing resources, triggering runs, and inviting members to the account. Tokens assigned the Member permission set will have the same permissions as a Member user. For more information about Member users, see "[Self-service permissions](/docs/collaborate/manage-access/self-service-permissions)".

**Read-only**<br/>
Read-only service tokens can authorize requests for viewing a read-only dashboard, viewing generated documentation, and viewing source freshness reports.

### Enterprise plans using service account tokens

The following permissions can be assigned to a service account token on an Enterprise plan. For more details about these permissions, see "[Enterprise permissions](/docs/collaborate/manage-access/enterprise-permissions)."

**Account Admin** <br/>
Account Admin service tokens have full `read + write` access to an account, so please use them with caution.  For more on these permissions, see [Account Viewer](/docs/collaborate/manage-access/enterprise-permissions#account-admin).

**Metadata Only**<br/>
Metadata only service tokens can authorize requests to the metadata API.

**Job Admin**<br/>
Job Admin service tokens can authorize request for viewing, editing, and creating environments, triggering runs, and viewing historical runs. For more on these permissions, see [Account Viewer](/docs/collaborate/manage-access/enterprise-permissions#job-admin).

**Account Viewer**<br/>
Account Viewer service tokens have read only access to dbt Cloud accounts. For more on these permissions, see [Account Viewer](/docs/collaborate/manage-access/enterprise-permissions#account-viewer) on the Enterprise Permissions page.

**Admin** <br/>
Admin service tokens have unrestricted access to projects in dbt Cloud accounts. You have the option to grant that permission all projects in the account or grant the permission only on specific projects. For more on these permissions, see [Admin Service](/docs/collaborate/manage-access/enterprise-permissions#admin-service) on the Enterprise Permissions page.

**Git Admin**<br/>
Git admin service tokens have all the permissions listed in [Git admin](/docs/collaborate/manage-access/enterprise-permissions#git-admin) on the Enterprise Permissions page.

**Database Adminn**<br/>
Database admin service tokens have all the permissions listed in [Database admin](/docs/collaborate/manage-access/enterprise-permissions#database-admin) on the Enterprise Permissions page.

**Team Admin**<br/>
Team admin service tokens have all the permissions listed in [Team admin](/docs/collaborate/manage-access/enterprise-permissions#team-admin) on the Enterprise Permissions page.

**Job Viewer**<br/>
Job viewer admin service tokens have all the permissions listed in [Job viewer](/docs/collaborate/manage-access/enterprise-permissions#job-viewer) on the Enterprise Permissions page.

**Developer**<br/>
Developer service tokens have all the permissions listed in [Developer](/docs/collaborate/manage-access/enterprise-permissions#developer) on the Enterprise Permissions page.
 
**Analyst**<br/>
Analyst admin service tokens have all the permissions listed in [Analyst](/docs/collaborate/manage-access/enterprise-permissions#analyst) on the Enterprise Permissions page.

**Stakeholder**<br/>
Stakeholder service tokens have all the permissions listed in [Stakeholder](/docs/collaborate/manage-access/enterprise-permissions#stakeholder) on the Enterprise Permissions page.
