---
title: "Enterprise Permissions"
id: "enterprise-permissions"
---

The following permission sets are available for assignment for dbt Cloud Enterprise.
Please contact your Account Manager to implement the permissions defined here.
See [Seats and Users](cloud-seats-and-users) for more information on user licenses.

## Permission Sets

The following permission sets are available for assignment in dbt Cloud Enterprise accounts.

### Account Admin
- **Authority:** Account-wide
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
- Manage account-level artifacts
- View and modify Account Settings
- Use the IDE
- Run and cancel jobs

### Admin
- **Authority:** Account-wide, or project-scoped
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
- **Authority:** Account-wide, or project-scoped
- **License restrictions:** must have a developer license

Git Admins can perform the following actions in projects they are assigned to:
- View project details
- Create, delete, and modify Repositories
- View Connections
- View Environments
- View Jobs

### Database Admin
- **Authority:** Account-wide, or project-scoped
- **License restrictions:** must have a developer license

Database Admins can perform the following actions in projects they are assigned to:
- View project details
- Create, delete, and modify Connections
- View Repositories
- View Environments
- View Jobs

### Team Admin
- **Authority:** Account-wide, or project-scoped
- **License restrictions:** must have a developer license

Team Admins can perform the following actions in projects they are assigned to:
- View project details
- Create, delete, and modify group memberships
- View Repositories
- View Environments
- View Jobs

### Job Admin
- **Authority:** Account-wide, or project-scoped
- **License restrictions:** must have a developer license

Job Admins can perform the following actions in projects they are assigned to:
- View, edit, and create environments
- Trigger runs
- View historical runs

### Job Viewer
- **Authority:** Account-wide, or project-scoped
- **License restrictions:** must have a developer license

Job Viewers can perform the following actions in projects they are assigned to:
- View environments
- View job definitions
- View historical runs

### Developer
- **Authority:** Account-wide, or project-scoped
- **License restrictions:** must have a developer license

Developers can perform the following actions in projects they are assigned to:
- Access the IDE
- Configure personal developer credentials
- Manage job definitions in assigned projects
- Kick off runs in deployment environments

### Analyst
- **Authority:** Account-wide, or project-scoped
- **License restrictions:** must have a developer license

Analysts can perform the following actions in projects they are assigned to:
- Use the IDE
- Manage their personal developer credentials
- View environments
- View job definitions
- View historical runs


### Stakeholder
- **Authority:** Account-wide, or project-scoped
- **License restrictions:** Intended for use with Read Only licenses, but may be used with Developer licenses.

Stakeholders can perform the following actions in projects they are assigned to:
- View the read-only dashboard
- View generated documentation
- View generated source freshness reports
