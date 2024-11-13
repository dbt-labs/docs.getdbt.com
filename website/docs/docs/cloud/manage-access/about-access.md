---
title: "About user access in dbt Cloud"
description: "Learn how dbt Cloud administrators can use dbt Cloud's permissioning model to control user-level access in a dbt Cloud account."
id: "about-user-access"
pagination_next: "docs/cloud/manage-access/seats-and-users"
pagination_prev: null
---

:::info "User access" is not "Model access"

This page is specific to user groups and access, which includes:
- User licenses, permissions, and group memberships
- Role-based access controls for projects and environments
- Single sign-on and secure authentication

"Model groups and access" is a feature specific to models and their availability across projects. Refer to [Model access](/docs/collaborate/govern/model-access) for more info on what it means for your dbt projects.

:::

# About user access

You can regulate access to dbt Cloud by various measures, including licenses, groups, permissions, and role-based access control (RBAC). To understand the possible approaches to user access to dbt Cloud features and functionality, you should first know how we approach users and groups.

### Users

Individual users in dbt Cloud can be people you [manually invite](/docs/cloud/manage-access/invite-users) or grant access via an external identity provider (IdP), such as Microsoft Entra ID, Okta, or Google Workspace.

In either scenario, when you add a user to dbt Cloud, they are assigned a [license](#licenses). You assign licenses at the individual user or group levels. When you manually invite a user, you will assign the license in the invitation window.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/license-dropdown.png" width="60%" title="Example of the license dropdown in the user invitation window." />

You can edit an existing user's license by navigating to the **Users** section of the **Account settings**, clicking on a user, and clicking **Edit** on the user pane. Delete users from this same window to free up licenses for new users.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/edit-user.png" width="60%" title="Example of the user information window in the user directory" />


### Groups

Groups in dbt Cloud serve much of the same purpose as they do in traditional directory tools &mdash; to gather individual users together to make bulk assignment of permissions easier. Admins use groups in dbt Cloud to assign [licenses](#licenses) and [permissions](#permissions). The permissions are more granular than licenses, and you only assign them at the group level; _you can’t assign permissions at the user level._ Every user in dbt Cloud must be assigned to at least one group.

There are three default groups available as soon as you create your dbt Cloud account (the person who created the account is added to all three automatically):

- **Owner:** This group is for individuals responsible for the entire account and will give them elevated account admin privileges. You cannot change the permissions. 
- **Member:** This group is for the general members of your organization, who will also have full access to the account. You cannot change the permissions. By default, dbt Cloud adds new users to this group.
- **Everyone:** A general group for all members of your organization. Customize the permissions to fit your organizational needs. By default, dbt Cloud adds new users to this group.

We recommend deleting the default `Owner`, `Member`, and `Everyone` groups before deploying and replacing them with your organizational groups. This prevents users from receiving more elevated privileges than they should and helps admins ensure they are properly placed.

Create new groups from the **Groups & Licenses** section of the **Account settings**. If you use an external IdP for SSO, you can sync those SSO groups to dbt Cloud from the **Group details** pane when creating or editing existing groups.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/new-group.png" width="60%" title="Example the new group pane in the account settings." />

:::important

If a user is assigned licenses and permissions from multiple groups, the group that grants the most access will take precedence. You must assign a permission set to any groups created beyond the three defaults, or users assigned will not have access to features beyond their user profile.

:::

#### SSO mappings

SSO Mappings connect an identity provider (IdP) group membership to a dbt Cloud group. When users log into dbt Cloud via a supported identity provider, their IdP group memberships sync with dbt Cloud. Upon logging in successfully, the user's group memberships (and permissions) will automatically adjust within dbt Cloud.

:::tip Creating SSO Mappings

While dbt Cloud supports mapping multiple IdP groups to a single dbt Cloud group, we recommend using a 1:1 mapping to make administration as simple as possible. Use the same names for your dbt Cloud groups and your IdP groups.

:::

Create an SSO mapping in the group view:

1. Open an existing group to edit or create a new group.
2. In the **SSO** portion of the group screen, enter the name of the SSO group exactly as it appears in the IdP. If the name is not the same, the users will not be properly placed into the group. 
3. In the **Users** section, ensure the **Add all users by default** option is disabled.
4. Save the group configuration. New SSO users will be added to the group upon login, and existing users will be added to the group upon their next login. 

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/sso-mapping.png" width="60%" title="Example of an SSO group mapped to a dbt Cloud group." />

Refer to [role-based access control](#role-based-access-control) for more information about mapping SSO groups for user assignment to dbt Cloud groups.

## Grant access

dbt Cloud users have both a license (assigned to an individual user or by group membership) and permissions (by group membership only) that determine what actions they can take. Licenses are account-wide, and permissions provide more granular access or restrictions to specific features.

### Licenses

Every user in dbt Cloud will have a license assigned. Licenses consume "seats" which impact how your account is [billed](/docs/cloud/billing), depending on your [service plan](https://www.getdbt.com/pricing).

There are three license types in dbt Cloud:

- **Developer** &mdash; User can be granted _any_ permissions.
- **Read-Only** &mdash; User has read-only permissions applied to all dbt Cloud resources regardless of the role-based permissions that the user is assigned.
- **IT** &mdash; User has Security Admin and Billing Admin [permissions](/docs/cloud/manage-access/enterprise-permissions) applied, regardless of the group permissions assigned.

Developer licenses will make up a majority of the users in your environment and have the highest impact on billing, so it's important to monitor how many you have at any given time.

For more information on these license types, see [Seats & Users](/docs/cloud/manage-access/seats-and-users)

### Permissions

Permissions determine what a developer-licensed user can do in your dbt Cloud account. By default, members of the `Owner` and `Member` groups have full access to all areas and features. When you want to restrict access to features, assign users to groups with stricter permission sets. Keep in mind that if a user belongs to multiple groups, the most permissive group will take precedence.

The permissions available depends on whether you're on an [Enterprise](/docs/cloud/manage-access/enterprise-permissions) or [self-service Team](/docs/cloud/manage-access/self-service-permissions) plan. Developer accounts only have a single user, so permissions aren't applicable.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/assign-group-permissions.png" width="60%" title="Example permissions dropdown while editing an existing group." />

Some permissions (those that don't grant full access, like admins) allow groups to be "assigned" to specific projects and environments only. Read about [environment-level permissions](/docs/cloud/manage-access/environment-permissions-setup) for more information on restricting environment access.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/environment-access-control.png" width="60%" title="Example environment access control for a group with Git admin assigned." />

## Role-based access control <Lifecycle status='enterprise' />

Role-based access control (RBAC) allows you to grant users access to features and functionality based on their group membership. With this method, you can grant users varying access levels to different projects and environments. You can take access and security to the next level by integrating dbt Cloud with a third-party identity provider (IdP) to grant users access when they authenticate with your SSO or OAuth service.

There are a few things you need to know before you configure RBAC for SSO users:
- New SSO users join any groups with the **Add all new users by default** option enabled. By default, the `Everyone` and `Member` groups have this option enabled. Disable this option across all groups for the best RBAC experience.
- You must have the appropriate SSO groups configured in the group details SSO section. If the SSO group name does not match _exactly_, users will not be placed in the group correctly. 
  <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/sso-window-details.png" width="60%" title="The Group details SSO section with a group configured." />
- dbt Labs recommends that your dbt Cloud group names match the IdP group names.

Let's say you have a new employee being onboarded into your organization using [Okta](/docs/cloud/manage-access/set-up-sso-okta) as the IdP and dbt Cloud groups with SSO mappings. In this scenario, users are working on `The Big Project` and a new analyst named `Euclid Ean` is joining the group.

Check out the following example configurations for an idea of how you can implement RBAC for your organization (these examples assume you have already configured [SSO](/docs/cloud/manage-access/sso-overview)):

<Expandable alt_header="Okta configuration"> 

You and your IdP team add `Euclid Ean` to your Okta environment and assign them to the `dbt Cloud` SSO app via a group called `The Big Project`. 

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/okta-group-config.png" width="60%" title="The user in the group in Okta." />

Configure the group attribute statements the `dbt Cloud` application in Okta. The group statements in the following example are set to the group name exactly (`The Big Project`), but yours will likely be a much broader configuration. Companies often use the same prefix across all dbt groups in their IdP. For example `DBT_GROUP_`

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/group-attributes.png" width="60%" title="Group attributes set in the dbt Cloud SAML 2.0 app in Okta." />

</Expandable>

<Expandable alt_header="dbt Cloud configuration"> 

You and your dbt Cloud admin team configure the groups in your account's settings: 
1. Navigate to the **Account settings** and click **Groups & Licenses** on the left-side menu. 
2. Click **Create group** or select an existing group and click **Edit**.
3. Enter the group name in the **SSO** field.
4. Configure the **Access and permissions** fields to your needs. Select a [permission set](/docs/cloud/manage-access/enterprise-permissions), the project they can access, and [environment-level access](/docs/cloud/manage-access/environment-permissions).

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/dbt-cloud-group-config.png" width="60%" title="The group configuration with SSO field filled out in dbt Cloud." />

Euclid is limited to the `Analyst` role, the `Jaffle Shop` project, and the `Development`, `Staging`, and `General` environments of that project. Euclid has no access to the `Production` environment in their role. 

</Expandable>

<Expandable alt_header="The user journey">

Euclid takes the following steps to log in: 

1. Access the SSO URL or the dbt Cloud app in their Okta account. The URL can be found on the **Single sign-on** configuration page in the **Account settings**. 

  <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/sso-login-url.png" width="60%" title="The SSO login URL in the account settings." />

2. Login with their Okta credentials.

  <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/sso-login.png" width="60%" title="The SSO login screen when using Okta as the identity provider." />

3. Since it's their first time logging in with SSO, Euclid Ean is presented with a message and no option to move forward until they check the email address associated with their Okta account. 

  <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/post-login-screen.png" width="60%" title="The screen users see after their first SSO login." />

4. They now open their email and click the link to join dbt Labs, which completes the process.

  <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/sample-email.png" width="60%" title="The email the user receives on first SSO login." />

Euclid is now logged in to their account. They only have access to the `Jaffle Shop` pr, and the project selection option is removed from their UI entirely. 

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/rbac-account-home.png" width="60%" title="The home screen with access restricted." />

They can now configure development credentials. The `Production` environment is visible, but it is `read-only`, and they have full access in the `Staging` environment. 

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/production-restricted.png" width="60%" title="The Production environment landing page with read-only access." />

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/staging-access.png" width="60%" title="The Staging environment landing page with full access." />

</Expandable>

With RBAC configured, you now have granular control over user access to features across dbt Cloud.

## FAQs

<Expandable alt_header="When are IdP group memberships updated for SSO Mapped groups?">

Group memberships are updated whenever a user logs into dbt Cloud via a supported SSO provider. If you've changed group memberships in your identity provider or dbt Cloud, ask your users to log back into dbt Cloud to synchronize these group memberships.

</Expandable>

<Expandable alt_header="Can I set up SSO without RBAC?">

Yes, see the documentation on [Manual Assignment](#manual-assignment) above for more information on using SSO without RBAC.

</Expandable>

<Expandable alt_header="Can I configure a user's license type based on IdP attributes?">

Yes, see the docs on [managing license types](/docs/cloud/manage-access/seats-and-users#managing-license-types) for more information.

</Expandable>

<Expandable alt_header="Why can't I edit a user's group membership?">

Don't try to edit your own user, as this isn't allowed for security reasons. You'll need a different user to make changes to your own user's group membership.

</Expandable>

<Expandable alt_header="How do I add or remove users?">

Each dbt Cloud plan has a base number of Developer and Read-Only licenses. You can add or remove licenses by modifying the number of users in your account settings. 
  - If you're on an Enterprise plan and have the correct [permissions](/docs/cloud/manage-access/enterprise-permissions), you can add or remove developers by adjusting your developer user seat count in **Account settings** -> **Users**.
  - If you're on a Team plan and have the correct [permissions](/docs/cloud/manage-access/self-service-permissions), you can add or remove developers by making two changes: adjust your developer user seat count AND your developer billing seat count in **Account settings** -> **Users** and then in **Account settings** -> **Billing**.

For detailed steps, refer to [Users and licenses](/docs/cloud/manage-access/seats-and-users#licenses).

</Expandable>