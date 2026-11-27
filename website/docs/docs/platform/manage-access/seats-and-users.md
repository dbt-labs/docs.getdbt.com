---
title: "Users and licenses"
description: "Learn how dbt administrators can use licenses and seats to control access in a dbt account."
id: "seats-and-users"
sidebar: "Users and licenses"
pagination_next: "docs/platform/manage-access/enterprise-permissions"
pagination_prev: null
availability:
  surface: platform
  access: login_required
---


import LicenseTypes from '/snippets/_cloud-license-types.md';

In <Constant name="dbt" />, _licenses_ are used to allocate users to your account. 

<LicenseTypes/>

The user's assigned license determines the specific capabilities they can access in <Constant name="dbt" />.

| Functionality | <div style={{width:'125px'}}>Developer or Analyst license** *</div> | <div style={{width:'125px'}}>Read-Only users</div> |<div style={{width:'125px'}}> IT license \*</div> |
| ------------- | -------------- | --------------- | -------- |
| Use the <Constant name="studio_ide" /> | ✅ | ❌ | ❌ |
| Use the <Constant name="dbt" /> CLI | ✅ | ❌ | ❌ |
| Use [<Constant name="wizard" />](/docs/platform/wizard-overview) | ✅ | ✅ ([Explore mode](/docs/platform/wizard-home#ask-questions-in-explore-mode) in the home tab only) | ❌ |
| Use Jobs | ✅ | ❌ | ❌ |
| Manage Account | ✅ | ❌ | ✅ |
| API access <br />(create personal access tokens) | ✅ | ✅ | ✅ |
| API access <br />(create service tokens) | ✅ | ❌ | ❌ |
| Use [<Constant name="catalog" />](/docs/explore/explore-projects) | ✅  | ✅ | ❌  |
| Use [Source Freshness](/docs/deploy/source-freshness) | ✅ | ✅ | ❌ |
| Use [Docs](/docs/explore/build-and-view-your-docs) | ✅ | ✅ | ❌ |
| Receive [Job notifications](/docs/deploy/job-notifications) |  ✅ |  ✅  |  ✅ |
| Use the [dbt MCP server](/docs/dbt-ai/about-mcp) | ✅ | ✅ (with [Analyst read](/docs/platform/manage-access/enterprise-permissions#analyst-read) permission set) | ❌ |
| Manage own warehouse credentials | ✅ | ✅ (with [Analyst read](/docs/platform/manage-access/enterprise-permissions#analyst-read) permission set) | ❌ |
| Use [Cost Insights](/docs/explore/cost-insights) | ✅ | ✅ (with [Cost Insights Viewer](/docs/platform/manage-access/enterprise-permissions#cost-insights-viewer) permission set) | ❌ |

<br />

*The [Analyst license type](/docs/platform/manage-access/about-user-access?version=1.12#licenses) is not available for new purchase.

**Available on Starter, Enterprise, and Enterprise+ plans only. IT seats are limited to 1 seat per Starter or Enterprise-tier account and don't count toward developer seat usage. 

## Licenses

import LicenseOverrideNote from '/snippets/_license-override-note.md';

<LicenseOverrideNote />

dbt has different [license types](https://www.getdbt.com/pricing) and you can add or remove them by modifying the number of users in your account settings. If you have a Developer plan account and want to add more people to your team, you'll need to upgrade to the Starter plan. Refer to [dbt Pricing Plans](https://www.getdbt.com/pricing/) for more information about licenses available with each plan.

The following tabs detail steps on how to modify your user license count:

<Tabs>

<TabItem value="enterprise" label="Enterprise-tier plans">

If you're on an Enterprise-tier plan and have the correct [permissions](/docs/platform/manage-access/enterprise-permissions), you can add or remove licenses by adjusting your user seat count. Note, an IT license does not count toward seat usage.

- To remove a user, click on your account name in the left side menu, click **Account settings** and select **Users**.
  - Select the user you want to remove, click **Edit**, and then **Delete**. 
  - This action cannot be undone. However, you can re-invite the user with the same info if you deleted the user in error.<br />

- To add a user, go to **Account settings** and select **Users**. 
  - Click [**Invite Users**](/docs/platform/manage-access/invite-users). 
  - For fine-grained permission configuration, refer to [Role based access control](/docs/platform/manage-access/about-user-access#role-based-access-control-).


</TabItem>

<TabItem value="starter" label="Starter plans">

If you're on a Starter plan and have the correct [permissions](/docs/platform/manage-access/self-service-permissions), you can add or remove developers. 

Refer to [Self-service Starter account permissions](/docs/platform/manage-access/self-service-permissions#licenses) for more information on the number of each license type included in the Starter plan.

You'll need to make two changes:

- Adjust your developer billing seat count on **Billing details**, which controls how many billable seats you pay for.
- Invite or delete users under **Users**, which controls who has access to your <Constant name="dbt" /> account.

Inviting a user does not purchase a seat. If you don't have a free seat, buy one on **Billing details** before you send the invite.

<Tabs>
<TabItem value="addusers" label="Adding users">

To add a user in <Constant name="dbt" />, you must be an account owner or have admin privileges. Purchase enough developer seats first, then invite the user. Inviting a user does not buy a seat.

**Purchasing developer seats**

1. From <Constant name="dbt" />, click your account name in the left side menu and select **Account settings**.

<Lightbox src="/img/docs/dbt-platform/account-settings-menu.png" width="75%" title="Open Account settings from the account menu in the left sidebar" />

2. Under **Settings**, select **Billing & Usage** (labeled **Billing** on some accounts).
3. Open **Overview** if it appears, then open the **Billing details** tab.
4. Under **Payment information**, go to the **Seat purchases** section.
5. From the **Number of developer seats** dropdown, select how many seats you want (up to five on Starter). Options below the number of seats already in use are unavailable.
6. Fill in your payment details, including the billing address, if prompted. You can't save changes if required fields are blank.
7. Click **Update payment information** (or **Complete purchase** if you're finishing a trial or first purchase).
8. If a **Confirm additional seats** modal appears, review the change and click **Add seats**.

**Inviting users**

1. In **Account settings**, select **Users**.
2. Click **Invite users**.
3. Enter one or more email addresses, choose a license type, and select at least one group.
4. Click **Send invitations**.

If you don't have enough seats, the invite fails and shows a **Purchase seats** link that takes you back to **Billing details**. You can also follow the full [invite users](/docs/platform/manage-access/invite-users) guide.

Great work! After completing these steps, your <Constant name="dbt" /> user count and billing count should now be the same.
</TabItem>

<TabItem value="deleteusers" label="Deleting users">

To delete a user in <Constant name="dbt" />, you must be an account owner or have admin privileges. If the user has a `developer` license type, this will open up their seat for another user or allow the admins to lower the total number of seats. 

1. From <Constant name="dbt" />, click your account name in the left side menu and select **Account settings**.

<Lightbox src="/img/docs/dbt-platform/account-settings-menu.png" width="85%" title="Open Account settings from the account menu in the left sidebar" />

2. In **Account settings**, select **Users**.
3. Select the user you want to delete, then click **Edit**. 
4. Click **Delete** in the upper right. Click **Confirm Delete** to immediately delete the user without additional password prompts. This action cannot be undone. However, you can re-invite the user with the same information if the deletion was made in error.

<Lightbox src="/img/docs/dbt-platform/delete_user.png" width="75%" title="Deleting a user" />

import LicenseCount from '/snippets/_license-count.md';

<LicenseCount/>

Great work! After completing these steps, your <Constant name="dbt" /> user count and billing count should now be the same.

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## Managing license types

You can assign licenses to users individually or through group membership. Add users to groups when inviting them or after they join <Constant name="dbt" />.

On Enterprise plans, you can also automatically assign users to groups using [SSO config](/docs/platform/manage-access/sso-overview) and [role-based access control](/docs/platform/manage-access/about-user-access#role-based-access-control-).

New users receive your account's default license. Admins can check the default and update it as needed. Refer to [set a different default license](#default-license-for-new-users) for more info.

### Manual configuration

To manually assign a specific type of license to a user on your team:
1. Click on your account name in the left side menu and select **Account settings**.
2. Navigate to the **Users** page in your **Account settings**. 
3. Select the user you want to manage and click the **Edit** button.
4. On the **User details** page, you can select the license type and relevant groups for the user.

**Note:** You will need to have an available license ready to allocate for the user. If your account does not have an available license to allocate, you will need to add more licenses to your plan to complete the license change.

<Lightbox src="/img/docs/dbt-platform/access-control/license-manual-user-details-v2.png" width="85%" title="Manually assigning a license on the User details page"/>

### Default license for new users <Lifecycle status="managed,managed_plus" />

Users who aren't assigned a license through SSO, SCIM, or license mapping receive your account's default license. Admins should check the current default and change it to **Read-Only**, **Developer**, or **Analyst** (if available) as needed.

To set the default license:

1. Click your account name in the left side menu and select **Account settings**.
2. Go to **Groups & Licenses** and scroll to the **Default license type** section.
3. Click **Edit**.
4. Select **Developer**, **Read-Only**, or **Analyst**.
5. Click **Save**.

The **IT** license can't be set as the default.

<Lightbox src="/img/docs/dbt-platform/access-control/default-license.png" width="90%" title="Set the default license for new users"/>

### Mapped configuration <Lifecycle status="managed,managed_plus" /> 

If your account is connected to an Identity Provider (IdP) for [Single Sign On](/docs/platform/manage-access/sso-overview), you can automatically map IdP user groups to specific license types in <Constant name="dbt" />. For SCIM-based license mapping with Okta, see [Automated license mapping](/docs/platform/manage-access/scim-manage-user-licenses#automated-license-mapping).

#### Configure license mappings

1. Click on your account name in the left side menu and select **Account settings**.
2. Navigate to **Groups & Licenses** and scroll to the **License mappings** section.
3. Create or edit SSO mappings for both Read-Only and Developer license types.
4. Enter a comma-separated list of **IdP group names** that should receive each license type.

<Lightbox src="/img/docs/dbt-platform/access-control/license-mapping.png" width="65%" title="Configuring IdP group license mapping"/>

#### Fundamental licensing rules

- **Default assignment**: New members without a mapped license receive your account's [default license](#default-license-for-new-users), unless an admin changes it.
- **Mapping basis**: License type mappings are based on _IdP groups_ (groups in your identity provider), not _<Constant name="dbt" /> groups_. Check group memberships in your IdP when configuring or troubleshooting.
- **When changes take effect**: License types are adjusted when users sign into <Constant name="dbt" /> using single sign-on. Changes to license type mappings take effect the next time users sign in.

#### Mapping logic and precedence

When a user belongs to multiple IdP groups, the Developer license takes precedence. The following table shows how group membership determines the assigned license:

| In a Developer license-mapped group? | In a Read-Only license-mapped group? | License assigned |
|---|---|---|
| No | No | Account default license |
| No | Yes | Read-Only |
| Yes | No | Developer |
| Yes | Yes | Developer (Developer takes precedence) |

:::note
If a user's IdP groups do not match _any_ license type mappings, <Constant name="dbt" /> assigns your account's [default license](#default-license-for-new-users). Admins can check the default and update as needed.
:::

## Granular permissioning <Lifecycle status="managed,managed_plus" />

<Constant name="dbt" /> Enterprise-tier plans support role-based access controls for configuring granular in-app permissions. See [access control](/docs/platform/manage-access/about-user-access) for more information on Enterprise permissioning.

#### Read-Only granular permissions

<Constant name="dbt" /> Enterprise-tier plans support granular permissions to help you control which projects your Read-Only users can access by assigning them to specific groups, rather than granting access to the entire account.

Enabling granular permissions is a one-time, permanent change. Before you enable this, make sure your Read-Only users are in a group with a Read-Only permission set that covers all projects. If a user isn't in a group, or their group's permission set only covers some projects, they'll lose access to the projects that aren't covered.

For complete setup instructions, refer to [How to enable granular permissions for read-only users](/docs/platform/manage-access/about-user-access#enable-granular-permissions-for-read-only-users) for the full setup steps.

