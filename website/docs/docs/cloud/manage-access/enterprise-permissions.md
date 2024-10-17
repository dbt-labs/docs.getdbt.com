---
title: "Enterprise permissions"
id: "enterprise-permissions"
description: "Permission sets for Enterprise plans."
hide_table_of_contents: true #For the sake of the tables on this page
pagination_next: null
---

import Permissions from '/snippets/_enterprise-permissions-table.md';
import SetUpPages from '/snippets/_available-enterprise-only.md';

<SetUpPages features={'/snippets/_available-enterprise-only.md'}/>

The dbt Cloud Enterprise plan supports a number of pre-built permission sets to
help manage access controls within a dbt Cloud account. See the docs on [access
control](/docs/cloud/manage-access/about-user-access) for more information on Role-Based access
control (RBAC).

## Roles and permissions

The following roles and permission sets are available for assignment in dbt Cloud Enterprise accounts. They can be granted to dbt Cloud groups which are then in turn granted to users. A dbt Cloud group can be associated with more than one role and permission set. Roles with more access take precedence. 

:::tip Licenses or Permission sets

The user's [license](/docs/cloud/manage-access/about-user-access) type always overrides their assigned permission set. This means that even if a user belongs to a dbt Cloud group with 'Account Admin' permissions, having a 'Read-Only' license would still prevent them from performing administrative actions on the account.
:::

<Permissions feature={'/snippets/_enterprise-permissions-table.md'} />

## Additional resources

- [Grant users access](/docs/cloud/manage-access/about-user-access#grant-access)
- [Role-based access control](/docs/cloud/manage-access/about-user-access#role-based-access-control-)
- [Environment-level permissions](/docs/cloud/manage-access/environment-permissions)

