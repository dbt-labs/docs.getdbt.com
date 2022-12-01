---
title: "Enterprise permissions"
id: "enterprise-permissions"
description: "Permission sets for Enterprise plans."
---

:::info Enterprise Feature

This guide describes a feature of the dbt Cloud Enterprise plan.
If you're interested in learning more about an Enterprise plan, contact us at sales@getdbt.com.

:::

## Overview

The dbt Cloud Enterprise plan supports a number of pre-built permission sets to
help manage access controls within a dbt Cloud account. See the docs on [access
control](/docs/collaborate/manage-access/about-access) for more information on Role-Based access
control (RBAC).

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
- Manage Notification Settings
- Manage account-level [artifacts](dbt-cloud/using-dbt-cloud/artifacts)
- View and modify Account Settings
- Use the IDE
- Run and cancel jobs

### Project Creator
- **Has permissions on:** Authorized projects, account-level settings
- **License restrictions:** must have a developer license

Project Creators have write and read-only access to dbt Cloud accounts, but do not have the permissions required to modify SSO settings and account integrations. 

Users with Project Creator permissions can:

- View Account Settings
- View and modify project users
- Create, delete and modify all projects in an account
- Create, delete, and modify Repositories
- Create, delete, and modify Connections
- Create, delete, and modify Environments
- Create, delete, and modify Jobs
- Use the IDE
- Run and cancel jobs
- View Groups
- View Notification Settings

### Account Viewer

- **Has permissions on:** Authorized projects, account-level settings
- **License restrictions:** must have a developer license

Account Viewers have read only access to dbt Cloud accounts. Users with Account Viewer permissions can:
- View all projects in an account
- View Account Settings
- View Repositories
- View Connections
- View Environments
- View Jobs
- View Groups
- View Group Memberships
- View Notification Settings
- View account-level artifacts

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
- View connections
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
- View connections
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

## How to Set Up RBAC Groups in dbt Cloud

Role-Based Access Control (RBAC) is helpful for automatically assigning permissions to dbt admins based on their SSO provider group associations.

- **If you are on a dbt Labs Hosted dbt Cloud instance:**
Contact support via the webapp button or support@getdbt.com to turn on this feature.
- **If you are on a customer deployed dbt Cloud instance:**
Contact your account manager for instructions on how to turn on this feature.

Click the gear icon to the top right and select **Account Settings**. From the **Team** section, click **Groups**

<Lightbox src="/img/docs/dbt-cloud/Select-Groups-RBAC.png" title="Navigate to Groups"/>

1. Select an existing group or create a new group to add RBAC. Name the group (this can be any name you like, but it's recommended to keep it consistent with the SSO groups). If you have configured SSO with SAML 2.0, you may have to use the GroupID instead of the name of the group.
2. Configure the SSO provider groups you want to add RBAC by clicking **Add** in the **SSO** section. These fields are case sensitive and must match the source group formatting.
3. Configure the permissions for users within those groups by clicking **Add** in the **Access** section of the window.
<Lightbox src="/img/docs/dbt-cloud/Configure-SSO-Access.png" title="Configure SSO groups and Access permissions"/>

4. When you've completed your configurations, click **Save**. Users will begin to populate the group automatically once they have signed in to dbt Cloud with their SSO credentials.
