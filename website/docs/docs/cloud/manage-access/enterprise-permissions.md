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

The user's [license](/docs/cloud/manage-access/seats-and-users) type always overrides their assigned permission set. This means that even if a user belongs to a dbt Cloud group with 'Account Admin' permissions, having a 'Read-Only' license would still prevent them from performing administrative actions on the account.
:::

<Permissions feature={'/snippets/_enterprise-permissions-table.md'} />

## How to set up RBAC Groups in dbt Cloud

Role-Based Access Control (RBAC) is helpful for automatically assigning permissions to dbt admins based on their SSO provider group associations. RBAC does not apply to [model groups](/docs/collaborate/govern/model-access#groups).

1. Click the gear icon to the top right and select **Account Settings**. Click **Groups & Licenses**

<Lightbox src="/img/docs/dbt-cloud/Select-Groups-RBAC.png" width="70%" title="Navigate to Groups"/>

2. Select an existing group or create a new group to add RBAC. Name the group (this can be any name you like, but it's recommended to keep it consistent with the SSO groups). If you have configured SSO with SAML 2.0, you may have to use the GroupID instead of the name of the group.
3. Configure the SSO provider groups you want to add RBAC by clicking **Add** in the **SSO** section. These fields are case-sensitive and must match the source group formatting.
4. Configure the permissions for users within those groups by clicking **Add** in the **Access** section of the window.
<Lightbox src="/img/docs/dbt-cloud/Configure-SSO-Access.png" width="45%"  title="Configure SSO groups and Access permissions"/>

5. When you've completed your configurations, click **Save**. Users will begin to populate the group automatically once they have signed in to dbt Cloud with their SSO credentials.
