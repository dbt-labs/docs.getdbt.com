---
title: "Enterprise permissions"
id: "enterprise-permissions"
description: "Permission sets for Enterprise plans."
---

import SetUpPages from '/snippets/_available-enterprise-only.md';

<SetUpPages features={'/snippets/_available-enterprise-only.md'}/>

The dbt Cloud Enterprise plan supports a number of pre-built permission sets to
help manage access controls within a dbt Cloud account. See the docs on [access
control](/docs/cloud/manage-access/about-user-access) for more information on Role-Based access
control (RBAC).

## Permission Sets

The following permission sets are available for assignment in dbt Cloud Enterprise accounts. They
can be granted to dbt Cloud groups which are then in turn granted to users. A dbt Cloud group
can be associated with more than one permission sets.

### Account Admin

- **Has permissions on:** Authorized projects, account-level settings
- **License restrictions:** must have a developer license

Account Admins have unrestricted access to dbt Cloud accounts. Users with Account Admin permissions can:

- Create, delete, and modify all projects in an account
- Create, delete, and modify Connections
- Create, delete, and modify Environments
- Create, delete, and modify Groups
- Create, delete, and modify Group Memberships
- Create, delete, and modify Jobs
- Create, delete, and modify outbound webhook subscriptions
- Create, delete, and modify Repositories
- Manage Notification Settings
- Manage account-level [artifacts](/docs/deploy/artifacts)
- Run and cancel jobs
- Use the IDE
- View and modify Account Settings
- Generate [service tokens](/docs/dbt-cloud-apis/service-tokens), such as for [API usage](/docs/dbt-cloud-apis/overview)

### Security Admin

- **Has permissions on:** Account-level settings
- **License restrictions:** must have a Developer or an IT license

Security Admins have access to modify certain account-level settings. Users with Security Admin permissions can:

- View and modify Account Settings such as:
    - View, invite, and modify account users
    - Create, delete, and modify Groups
    - Create, delete, and modify License Mappings
    - Create and modify SSO Configurations
    - View and export Audit Logs
    - Create, delete, and modify IP Restrictions

### Billing Admin

- **Has permissions on:** Account-level settings
- **License restrictions:** must have a Developer or an IT license

Billing Admins have access to modify certain account-level settings related to billing. Users with Billing Admin permissions can:

- View and modify **Account Settings** such as:
    - View billing information
    - Modify billing information (accounts on the Team plan)
        - This includes modifying Developer Seat counts for the Account

### Project Creator
- **Has permissions on:** Authorized projects, account-level settings
- **License restrictions:** must have a developer license

Project Creators have write and read-only access to dbt Cloud accounts, but do not have the permissions required to modify SSO settings and account integrations. 

Users with Project Creator permissions can:

- View Account Settings
- View and modify project users
- Create, delete and modify all projects in an account
- Create, delete, and modify Connections
- Create, delete, and modify Environments
- Create, delete, and modify Jobs
- Create, delete, and modify Repositories
- Run and cancel jobs
- Use the IDE
- View Groups
- View Notification Settings

### Account Viewer

- **Has permissions on:** Authorized projects, account-level settings
- **License restrictions:** must have a developer license

Account Viewers have read-only access to dbt Cloud accounts. Users with Account Viewer permissions can:
- View all projects in an account
- View Account Settings
- View account-level artifacts
- View Connections
- View Environments
- View Groups
- View Group Memberships
- View Jobs
- View Notification Settings
- View Repositories

### Admin
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Admins have unrestricted access to _projects_ in dbt Cloud accounts which they are members of.
Admins can perform the following actions in projects they are assigned to:
- Create, delete, and modify Repositories
- Create, delete, and modify Connections
- Create, delete, and modify Environments
- Create, delete, and modify Group Memberships
- Create, delete, and modify Jobs
- Create, delete, and modify outbound webhook subscriptions
- Run and cancel jobs
- Use the IDE
- View project details

### Git Admin
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Git Admins can perform the following actions in projects they are assigned to:
- Create, delete, and modify Repositories
- View Connections
- View Environments
- View Jobs
- View project details

### Database Admin
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Database Admins can perform the following actions in projects they are assigned to:
- Create, delete, and modify Connections
- View Environments
- View Jobs
- View project details
- View Repositories

### Team Admin
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Team Admins can perform the following actions in projects they are assigned to:
- View Groups
- View Environments
- View Jobs
- View project details
- View Repositories

### Job Admin
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Job Admins can perform the following actions in projects they are assigned to:
- Create, delete, and modify Jobs
- Run and cancel jobs
- View connections
- View, edit, and create environments
- View historical runs

### Job Viewer
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Job Viewers can perform the following actions in projects they are assigned to:
- View environments
- View historical runs
- View job definitions

### Developer
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Developers can perform the following actions in projects they are assigned to:
- Configure personal developer credentials
- Create, delete, and modify Jobs
- Create, delete, and modify outbound webhook subscriptions
- Run and cancel jobs
- Use the IDE

### Analyst
- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Analysts can perform the following actions in projects they are assigned to:
- Configure personal developer credentials
- Configure environmental variables
- View connections
- View environments
- View historical runs
- View job definitions
- Use the IDE


### Stakeholder
- **Has permissions on:** Authorized projects
- **License restrictions:** Intended for use with Read-Only licenses, but may be used with Developer licenses.

Stakeholders can perform the following actions in projects they are assigned to:
- View generated documentation
- View generated source freshness reports
- View the Read-Only dashboard

## Diagram of the Permission Sets

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/enterprise-permission-sets-diagram.png" title="Enterprise Permission Sets & Requirements."/>

## How to Set Up RBAC Groups in dbt Cloud

Role-Based Access Control (RBAC) is helpful for automatically assigning permissions to dbt admins based on their SSO provider group associations.

1. Click the gear icon to the top right and select **Account Settings**. From the **Team** section, click **Groups**

<Lightbox src="/img/docs/dbt-cloud/Select-Groups-RBAC.png" title="Navigate to Groups"/>

1. Select an existing group or create a new group to add RBAC. Name the group (this can be any name you like, but it's recommended to keep it consistent with the SSO groups). If you have configured SSO with SAML 2.0, you may have to use the GroupID instead of the name of the group.
2. Configure the SSO provider groups you want to add RBAC by clicking **Add** in the **SSO** section. These fields are case sensitive and must match the source group formatting.
3. Configure the permissions for users within those groups by clicking **Add** in the **Access** section of the window.
<Lightbox src="/img/docs/dbt-cloud/Configure-SSO-Access.png" title="Configure SSO groups and Access permissions"/>

4. When you've completed your configurations, click **Save**. Users will begin to populate the group automatically once they have signed in to dbt Cloud with their SSO credentials.
