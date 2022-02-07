---
title: "Team Permissions"
id: "team-permissions"
descriptions: "Permission sets for Team plans."
---
## Overview

The dbt Cloud Team plan supports a number of pre-built permission sets to
help manage access controls within a dbt Cloud account. See the docs on [access
control](access-control-overview) for more information on Role-Based access
control (RBAC).

## Permission Sets

The following permission sets are available for assignment in dbt Cloud Team accounts. They
can be granted to dbt Cloud groups, where you can add users. A dbt Cloud group
can be associated with more than one permission set.

### Owner (Account Admin)

**/ Update to a reusable with `enterprise-permissions` when available on docs.getdbt.com /**

This permission set is referred to as the Owner role, and these permissions can be assigned to an Account Admin service token.

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


### Member

### Job Admin

- **Has permissions on:** Authorized projects
- **License restrictions:** must have a developer license

Job Admins can perform the following actions in projects they are assigned to:

- View, edit, and create environments
- Trigger runs
- View historical runs

### Metadata Only

### Read-Only



