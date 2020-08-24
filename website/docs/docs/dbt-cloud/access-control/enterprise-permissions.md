---
title: "Enterprise Permissions"
id: "enterprise-permissions"
---

:::info Enterprise Feature

This guide describes a feature of the dbt Cloud Enterprise plan. 
If you’re interested in learning more about an Enterprise plan, contact us at sales@getdbt.com.

:::

## Overview

With enterprise security features, you can manage secure access to your dbt Cloud account and access dbt Cloud objects within the account. We recommend setting up [SSO](/docs/dbt-cloud/dbt-cloud-enterprise/sso-overview) and dbt Cloud groups to easily manage user access.

## RBAC groups

When you create dbt Cloud groups, you can associate Identity Provider (IdP) group(s) to the group.
This will allow users who log in via the SSO flow to be automatically associated with the corresponding dbt Cloud group. While multiple IdP groups may be associated with one dbt Cloud group, we recommend having a 1:1 mapping for simplicity. Having the same name for your IdP group as for your dbt Cloud group will make adminstration easier. 

To reset a user's group membership, have the user relog into dbt Cloud. This will be needed when a 
user is added to a new dbt Cloud group via a new IdP group.

## Permission Sets

The following permission sets are available for assignment in dbt Cloud Enterprise accounts. They 
can be granted to dbt Cloud groups which are then in turn granted to users. A dbt Cloud group 
can be associated with more than one permission sets.

### Account Admin
- **Has permissions on:** Authorized projects, account-level settings
- **License restrictions:** must have a developer license

Account Admins have unrestricted access to dbt Cloud accounts. Users with Account Admin permissions can:
- Create, delete and modify all projects in an account
- Create, delete, and modify Repositories
- Create, delete, and modify Connections
- Create, delete, and modify Environments
- Create, delete, and modify Jobs
- Create, delete, and modify Groups
- Create, delete, and modify Group Memberships
- Manage notification settings
- Manage account-level [artifacts](dbt-cloud/using-dbt-cloud/artifacts)
- View and modify Account Settings
- Use the IDE
- Run and cancel jobs

### Admin
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Admins have unrestricted access to _projects_ in dbt Cloud accounts which they are members of.
Admins can perform the following actions in projects they are assigned to:
- View project details
- Create, delete, and modify Repositories
- Create, delete, and modify Connections
- Create, delete, and modify Environments
- Create, delete, and modify Jobs
- Create, delete, and modify Group Memberships
- Use the IDE
- Run and cancel jobs

### Git Admin
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Git Admins can perform the following actions in projects they are assigned to:
- View project details
- Create, delete, and modify Repositories
- View Connections
- View Environments
- View Jobs

### Database Admin
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Database Admins can perform the following actions in projects they are assigned to:
- View project details
- Create, delete, and modify Connections
- View Repositories
- View Environments
- View Jobs

### Team Admin
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Team Admins can perform the following actions in projects they are assigned to:
- View project details
- Create, delete, and modify group memberships
- View Repositories
- View Environments
- View Jobs

### Job Admin
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Job Admins can perform the following actions in projects they are assigned to:
- View, edit, and create environments
- Trigger runs
- View historical runs

### Job Viewer
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Job Viewers can perform the following actions in projects they are assigned to:
- View environments
- View job definitions
- View historical runs

### Developer
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Developers can perform the following actions in projects they are assigned to:
- Create, delete, and modify Jobs
- Trigger runs
- Use the IDE
- Configure personal developer credentials

### Analyst
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Analysts can perform the following actions in projects they are assigned to:
- Use the IDE
- Configure personal developer credentials
- View environments
- View job definitions
- View historical runs


### Stakeholder
- **Has permissions on:** Authorized projects
- **License restrictions:** Intended for use with Read Only licenses, but may be used with Developer licenses.

Stakeholders can perform the following actions in projects they are assigned to:
- View the Read Only dashboard
- View generated documentation
- View generated source freshness reports

## Diagram of the Permission Sets

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/enterprise-permission-sets-diagram.png" title="Enterprise Permission Sets & Requirements."/>
static/

