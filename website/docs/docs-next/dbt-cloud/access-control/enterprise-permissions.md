---
title: "Enterprise Permissions"
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
control](access-control-overview) for more information on Role-Based access
control (RBAC).

## Permission Sets

The following permission sets are available for assignment in dbt Cloud Enterprise accounts. They can be granted to dbt Cloud groups, where users belong. A dbt Cloud group can be associated with more than one permission set.

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
- View notification settings
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

<Lightbox src="/img-next/docs/dbt-cloud/dbt-cloud-enterprise/enterprise-permission-sets-diagram.png" title="Enterprise Permission Sets & Requirements."/>

## How to Set Up RBAC Groups in dbt Cloud
 
- **If you are on a dbt Labs Hosted dbt Cloud instance:**
Contact support via the webapp button or support@getdbt.com to turn on this feature. 

<LoomVideo id="8e2e00c57bde4fbfa4b519bf35d7632d" />

