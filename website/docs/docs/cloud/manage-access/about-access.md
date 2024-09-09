---
title: "About user access in dbt Cloud"
description: "Learn how dbt Cloud administrators can use dbt Cloud's permissioning model to control user-level access in a dbt Cloud account."
id: "about-user-access"
pagination_next: "docs/cloud/manage-access/seats-and-users"
pagination_prev: null
---

:::info "User access" is not "Model access"

**User groups and access** and **model groups and access** are two different things. "Model groups and access" is a specific term used in the language of [model governance](/docs/collaborate/govern/about-model-governance). Refer to [Model access](/docs/collaborate/govern/model-access) for more information.

:::

# About user access

You can regulate access to dbt Cloud by various measures, including licenses, groups, permissions, and role-based access control (RBAC). To understand the possible approaches to user access to dbt Cloud features and functionality, you should first know how we approach users and groups.

### Users

Individual users in dbt Cloud can be people you [manually invite](/docs/cloud/manage-access/invite-users) or grant access via an external identity provider (IdP), such as Microsoft Entra ID, Okta, or Google Workspace.

In either scenario, when you add a user to dbt Cloud, they are assigned a [license](#licenses). You assign licenses at the individual user or group levels. When you manually invite a user, you will assign the license in the invitation window.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/license-dropdown.png" width="60%" title="Example of the license dropdown in the user invitation window." />

You can edit an existing user's license by navigating to the **Users** section of the **Account settings**, clicking on a user, and clicking **Edit** on the user pane.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/edit-user.png" width="60%" title="Example of the user information window in the user directory" />

Delete users from this same window to free up licenses for new users.

### Groups

Groups in dbt Cloud serve much of the same purpose as they do in traditional directory tools &mdash; to gather individual users together to make bulk assignment of permissions easier. Admins use groups in dbt Cloud to assign [licenses](#licenses) and [permissions](#permissions). The permissions are more granular than licenses, and you only assign them at the group level; _you can’t assign permissions at the user level._ Every user in dbt Cloud must be assigned to at least one group.

There are three default groups available as soon as you create your dbt Cloud account (the person who created the account is added to all three automatically):

- **Owner:** This group is for individuals responsible for the entire account. You can not change the permissions.
- **Member:** This group is for the general members of your organization, who will also have full access to the account. You can not change the permissions. By default, dbt Cloud adds new users to this group.
- **Everyone:** A general group for all members of your organization. Customize the permissions to fit your organizational needs. By default, dbt Cloud adds new users to this group.

Create new groups from the **Groups & Licenses** section of the **Account settings**. If you use an external IdP for SSO, you can sync those SSO groups to dbt Cloud from the **Group details** pane when creating or editing existing groups.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/new-group.png" width="60%" title="Example the new group pane in the account settings." />

If a user is assigned licenses and permissions from multiple groups, the group that grants the most access will take precedence. You must assign a permission set to any groups created beyond the three defaults or users assigned will not have access to features beyond their user profile.

#### SSO mappings

SSO Mappings connect an identity provider (IdP) group membership to a dbt Cloud group. When a user logs into dbt Cloud via a supported identity provider, their IdP group memberships sync with dbt Cloud. Upon logging in successfully, the user's group memberships (and permissions) automatically adjust within dbt Cloud.

:::tip Creating SSO Mappings

While dbt Cloud supports mapping multiple IdP groups to a single dbt Cloud group, we recommend using a 1:1 mapping to make administration as simple as possible. Use the same names for your dbt Cloud groups and your IdP groups.

:::

## Grant access

dbt Cloud users have both a license (individually or by group) and permissions (by group only) that determine what actions they can take. Licenses are account-wide, and permissions provide more granular access or restrictions to specific features.

### Licenses

Every user in dbt Cloud will have a license assigned. Licenses consume "seats" which impact how your account is [billed](/docs/cloud/billing), depending on your [service plan](https://www.getdbt.com/pricing).

There are three license types in dbt Cloud:

- **Developer** &mdash; User can be granted _any_ permissions.
- **Read-Only** &mdash; User has read-only permissions applied to all dbt Cloud resources regardless of the role-based permissions that the user is assigned.
- **IT** &mdash; User has [Security Admin](/docs/cloud/manage-access/enterprise-permissions#security-admin) and [Billing Admin](/docs/cloud/manage-access/enterprise-permissions#billing-admin) permissions applied, regardless of the group permissions assigned.

Developer licenses will make up a majority of the users in your environment and have the highest impact on billing, so it's important to monitor how many you have at any given time.

For more information on these license types, see [Seats & Users](/docs/cloud/manage-access/seats-and-users)

### Permissions

Permissions determine what a developer-licensed user can do in your dbt Cloud account. By default, members of the `Owner` and `Member` groups have full access to all areas and features. When you want to restrict access to features, assign users to groups with stricter permission sets. Keep in mind that if a user belongs to multiple groups, the most permissive group will take precedence.

The permissions available depends on whether you're on an [Enterprise](/docs/cloud/manage-access/enterprise-permissions) or [self-service Team](/docs/cloud/manage-access/self-service-permissions) plan. Developer accounts only have a single user, so permissions aren't applicable.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/assign-group-permissions.png" width="60%" title="Example the permissions dropdown while editing an existing group." />

Some permissions (those that don't grant full access, like admins) allow groups to be "assigned" to specific projects and environments only. Read about [environment-level permissions](/docs/cloud/manage-access/environment-permissions-setup) for more information on restricting environment access.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/environment-access-control.png" width="60%" title="Example the environment access control for a group with Git admin assigned." />

### Role-based access control

:::info dbt Cloud Enterprise


Role-based access control is a feature of the dbt Cloud Enterprise plan


:::

Role-based access control (RBAC) allows you to grant users access to features and functionality based on their group membership. With this method, you can grant users varying access levels to different projects and environments. You can take access and security to the next level by integrating dbt Cloud with a third-party identity provider (IdP) to grant users access when they authenticate with your SSO or OAuth service.


Let's use the example of a new employee being onboarded in your organization using [Okta](/docs/cloud/manage-access/set-up-sso-okta) and dbt Cloud groups with SSO mappings.


## FAQs

<Expandable alt_header="When are IdP group memberships updated for SSO Mapped groups?">

Group memberships are updated whenever a user logs into dbt Cloud via a supported SSO provider. If you've changed group memberships in your identity provider or dbt Cloud, ask your users to log back into dbt Cloud to synchronize these group memberships.

</Expandable>

<Expandable alt_header="Can I set up SSO without RBAC?">

Yes, see the documentation on [Manual Assignment](#manual-assignment) above for more information on using SSO without RBAC.

</Expandable>

<Expandable alt_header="Can I configure a user's License Type based on IdP Attributes?">

Yes, see the docs on [managing license types](/docs/cloud/manage-access/seats-and-users#managing-license-types) for more information.

</Expandable>

<Expandable alt_header="Why can't I edit a user's group membership?">

Make sure you're not trying to edit your own user as this isn't allowed for security reasons. To edit the group membership of your own user, you'll need a different user to make those changes.

</Expandable>

<Expandable alt_header="How do I add or remove users?">

Each dbt Cloud plan comes with a base number of Developer and Read-Only licenses. You can add or remove licenses by modifying the number of users in your account settings. 
  - If you're on an Enterprise plans and have the correct [permissions](/docs/cloud/manage-access/enterprise-permissions), you can add or remove developers by adjusting your developer user seat count in **Account settings** -> **Users**.
  - If you're on a Team plan and have the correct [permissions](/docs/cloud/manage-access/self-service-permissions), you can add or remove developers by making two changes: adjust your developer user seat count AND your developer billing seat count in **Account settings** -> **Users** and then in **Account settings** -> **Billing**.

 Refer to [Users and licenses](/docs/cloud/manage-access/seats-and-users#licenses) for detailed steps.

</Expandable>