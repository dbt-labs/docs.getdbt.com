---
title: "Set up environment-level permissions"
id: environment-permissions-setup
description: "Set up environment-level permissions to protect your information"
sidebar_label: "Set up environment-level permissions"
pagination_next: null
pagination_prev: null
---

To set up and configure environment-level permissions, you must have write permissions to the **Groups & Licenses** settings of your dbt Cloud account. For more information about roles and permissions, check out [User permissions and licenses](/docs/cloud/manage-access/seats-and-users).

Environment-level permissions are not the same as account-level [role-based access control (RBAC)](/docs/cloud/manage-access/about-user-access#role-based-access-control) and are configured separately from those workflows.

## Setup instructions

In your dbt Cloud account:

1. Click your account name, above your profile icon on the left side panel, then select **Account settings**. From there, select **Groups & Licenses**. While you can edit existing groups, we recommend not altering the default `Everyone`, `Member`, and `Owner` groups.

<Lightbox src="/img/docs/dbt-cloud/groups-and-licenses.png" width="80%" title="Groups & Licenses page in dbt Cloud with the default groups highlighted."/>

2. Create a new or open an existing group. If it's a new group, give it a name, then scroll down to **Access & permissions**. Click **Add**.

<Lightbox src="/img/docs/dbt-cloud/add-permissions.png" width="80%" title="The Access & permissions section with the Add button highlighted."/>

3. Select the **Permission set** for the group. Only the following permissions sets can have environment-level permissions configured:

- Database admin
- Git admin
- Team admin
- Analyst
- Developer

Other permission sets are restricted because they have access to everything (for example, Account admin), or limitations prevent them from having write access to environments (for example, Account viewer).

If you select a permission set that is not supported, the environment permission option will not appear.

<Lightbox src="/img/docs/dbt-cloud/no-option.png" width="80%" title="The view of the permissions box if there is no option for environment permissions."/>

4. Select the **Environment** for group access. The default is **All environments**, but you can select multiple. If none are selected, the group will have read-only access.

<Lightbox src="/img/docs/dbt-cloud/environment-options.png" width="80%" title="A list of available environments with the Staging and General boxes selected."/>

5. Save the Group settings. You're now setup and ready to assign users!

## User experience

Users with permissions to the environment will see all capabilities assigned to their role. The environment-level permissions are `write` or `read-only` access. This feature does not currently support determining which features in the environment are accessible. For more details on what can and can not be done with environment-level permissions, refer to [About environment-permissions](/docs/cloud/manage-access/environment-permissions).

For example, here is an overview of the **Jobs** section of the environment page if a user has been granted access:

<Lightbox src="/img/docs/dbt-cloud/write-access.png" width="80%" title="The jobs page with write access and the 'Create job' button visible ."/>

The same page if the user has not been granted environment-level permissions:

<Lightbox src="/img/docs/dbt-cloud/read-only-access.png" width="80%" title="The jobs page with read-only access and the 'Create job' button is not visible ."/>

