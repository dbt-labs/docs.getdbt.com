---
title: "Enterprise Permissions"
id: "enterprise-permissions"
---

The following permission sets are available for assignment for dbt Cloud Enterprise. Please contact your Account Manager to implement the permissions defined here. See [Seats and Users](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-seats-and-users) for more information on user licenses.


## Project level permission sets

The following permissions may be assigned to groups at the project-level.

- Admin:
  - Can create, read, update, and delete all objects in assigned projects
  - Can add groups with any permission to assigned projects
  - Implies GitAdmin, DatabaseAdmin, and TeamAdmin permissions sets
  - Requires user to have a developer user license 
- GitAdmin:
  - Can create, read, update, and delete the git repo in assigned projects
  - Requires user to have a developer user license 
- DatabaseAdmin:
  - Can create, read, update, and delete the database connection in assigned projects
  - Can create, edit, update, and delete deployment credentials in assigned projects
  - Requires user to have a developer user license 
- TeamAdmin:
  - Can create, read, update, and delete group membership in the project
  - Can only groups to assigned projects with Developer, Stakeholder, or TeamAdmin permissions
  - Requires user to have a developer user license 
- Developer:
  - Can access the IDE, configure personal developer credentials, and manage job definitions in assigned projects
  - Requires user to have a developer user license 
- Stakeholder:
  - Can access the documentation and source freshness reports for assigned projects
  - User can have a read-only or a developer user license

## Account-wide permissions:

The following permissions are assigned outside the scope of any particular project, and apply to the entire account.

- AccountAdmin
  - Create Projects
  - Create groups, assign SSO mappings between SSO groups and dbt Cloud groups
  - Manage notifications
  - Manage account-wide build artifacts
  - Requires user to have a developer user license 
