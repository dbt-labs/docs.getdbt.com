---
title: "Users and licenses"
description: "Learn how dbt administrators can use licenses and seats to control access in a dbt account."
id: "seats-and-users"
sidebar: "Users and licenses"
pagination_next: "docs/platform/manage-access/enterprise-permissions"
pagination_prev: null
---


import LicenseTypes from '/snippets/_cloud-license-types.md';

In <Constant name="dbt" />, _licenses_ are used to allocate users to your account. 

<LicenseTypes/>

The user's assigned license determines the specific capabilities they can access in <Constant name="dbt" />.

| Functionality | <div style={{width:'125px'}}>Developer or Analyst license** *</div> | <div style={{width:'125px'}}>Read-Only users</div> |<div style={{width:'125px'}}> IT license \*</div> |
| ------------- | -------------- | --------------- | -------- |
| Use the <Constant name="studio_ide" /> | ✅ | ❌ | ❌ |
| Use the <Constant name="dbt" /> CLI | ✅ | ❌ | ❌ |
| Use Jobs | ✅ | ❌ | ❌ |
| Manage Account | ✅ | ❌ | ✅ |
| API access <br />(create personal access tokens) | ✅ | ✅ | ✅ |
| API access <br />(create service tokens) | ✅ | ❌ | ❌ |
| Use [<Constant name="catalog" />](/docs/explore/explore-projects) | ✅  | ✅ | ❌  |
| Use [Source Freshness](/docs/deploy/source-freshness) | ✅ | ✅ | ❌ |
| Use [Docs](/docs/explore/build-and-view-your-docs) | ✅ | ✅ | ❌ |
| Receive [Job notifications](/docs/deploy/job-notifications) |  ✅ |  ✅  |  ✅ | 

*The [Analyst license type](/docs/platform/manage-access/about-user-access?version=1.12#licenses) is not available for new purchase.

**Available on Starter, Enterprise, and Enterprise+ plans only. IT seats are limited to 1 seat per Starter or Enterprise-tier account and don't count toward developer seat usage. 

## Licenses

import LicenseOverrideNote from '/snippets/_license-override-note.md';

<LicenseOverrideNote />

Each <Constant name="dbt" /> plan comes with a base number of Developer, IT, and Read-Only licenses. You can add or remove licenses by modifying the number of users in your account settings. 

If you have a Developer plan account and want to add more people to your team, you'll need to upgrade to the Starter plan. Refer to [dbt Pricing Plans](https://www.getdbt.com/pricing/) for more information about licenses available with each plan.

The following tabs detail steps on how to modify your user license count:

<Tabs>

<TabItem value="enterprise" label="Enterprise-tier plans">

If you're on an Enterprise-tier plan and have the correct [permissions](/docs/platform/manage-access/enterprise-permissions), you can add or remove licenses by adjusting your user seat count. Note, an IT license does not count toward seat usage.

- To remove a user, click on your account name in the left side menu, click **Account settings** and select **Users**.
  - Select the user you want to remove, click **Edit**, and then **Delete**. 
  - This action cannot be undone. However, you can re-invite the user with the same info if you deleted the user in error.<br />

- To add a user, go to **Account Settings** and select **Users**. 
  - Click the [**Invite Users**](/docs/platform/manage-access/invite-users) button. 
  - For fine-grained permission configuration, refer to [Role based access control](/docs/platform/manage-access/about-user-access#role-based-access-control-).


</TabItem>

<TabItem value="starter" label="Starter plans">

If you're on a Starter plan and have the correct [permissions](/docs/platform/manage-access/self-service-permissions), you can add or remove developers. 

Refer to [Self-service Starter account permissions](/docs/platform/manage-access/self-service-permissions#licenses) for more information on the number of each license type included in the Starter plan.

You'll need to make two changes:

- Adjust your developer user seat count, which manages the users invited to your <Constant name="dbt" /> project. 
- Adjust your developer billing seat count, which manages the number of billable seats. 

You can add or remove developers by increasing or decreasing the number of users and billable seats in your account settings:

<Tabs>
<TabItem value="addusers" label="Adding users">

To add a user in <Constant name="dbt" />, you must be an account owner or have admin privileges. 

1. From <Constant name="dbt" />, click on your account name in the left side menu and select **Account settings**.

<Lightbox src="/img/docs/dbt-platform/Navigate-to-account-settings.png" width="75%" title="Navigate to Account settings" />

2. In **Account Settings**, select **Billing**. 
3. Under **Billing details**, enter the number of developer seats you want and make sure you fill in all the payment details, including the **Billing address** section. Leaving these blank won't allow you to save your changes.
4. Press **Update Payment Information** to save your changes.

<Lightbox src="/img/docs/dbt-platform/faq-account-settings-billing.png" width="75%" title="Navigate to Account settings -> Billing to modify billing seat count" />


Now that you've updated your billing, you can now [invite users](/docs/platform/manage-access/invite-users) to join your <Constant name="dbt" /> account:

Great work! After completing those these steps, your <Constant name="dbt" /> user count and billing count should now be the same.
</TabItem>

<TabItem value="deleteusers" label="Deleting users">

To delete a user in <Constant name="dbt" />, you must be an account owner or have admin privileges. If the user has a `developer` license type, this will open up their seat for another user or allow the admins to lower the total number of seats. 

1. From <Constant name="dbt" />, click on your account name in the left side menu and select **Account settings**.

<Lightbox src="/img/docs/dbt-platform/Navigate-to-account-settings.png" width="85%" title="Navigate to Account settings" />

2. In **Account settings**, select **Users**.
3. Select the user you want to delete, then click **Edit**. 
4. Click **Delete** in the bottom left. Click **Confirm Delete** to immediately delete the user without additional password prompts. This action cannot be undone. However, you can re-invite the user with the same information if the deletion was made in error. 

<Lightbox src="/img/docs/dbt-platform/delete_user_20221023.gif" width="75%" title="Deleting a user" />

import LicenseCount from '/snippets/_license-count.md';

<LicenseCount/>
        
<Lightbox src="/img/docs/dbt-platform/faq-account-settings-billing.png" width="75%" title="The Billing** page in your **Account settings" />

Great work! After completing these steps, your <Constant name="dbt" /> user count and billing count should now be the same.

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## Managing license types

Licenses can be assigned to users individually or through group membership. To assign a license via group membership, you can manually add a user to a group during the invitation process or assign them to a group after they’ve enrolled in <Constant name="dbt" />. Alternatively, with [SSO configuration](/docs/platform/manage-access/sso-overview) and [role-based access control](/docs/platform/manage-access/about-user-access#role-based-access-control-) (Enterprise-tier only), users can be automatically assigned to groups. By default, new users in an account are assigned a Developer license.

### Manual configuration

To manually assign a specific type of license to a user on your team:
1. Click on your account name in the left side menu and select **Account settings**.
2. Navigate to the **Users** page in your **Account settings**. 
3. Select the user you want to manage and click the **Edit** button.
4. On the **User details** page, you can select the license type and relevant groups for the user.

**Note:** You will need to have an available license ready to allocate for the user. If your account does not have an available license to allocate, you will need to add more licenses to your plan to complete the license change.

<Lightbox src="/img/docs/dbt-platform/access-control/license-manual.png" width="55%" title="Manually assigning licenses"/>

### Mapped configuration <Lifecycle status="managed,managed_plus" /> 

If your account is connected to an Identity Provider (IdP) for [Single Sign On](/docs/platform/manage-access/sso-overview), you can automatically map IdP user groups to specific license types in <Constant name="dbt" />. For SCIM-based license mapping with Okta, see [Automated license mapping](/docs/platform/manage-access/scim-manage-user-licenses#automated-license-mapping).

#### Configure license mappings

1. Click on your account name in the left side menu and select **Account settings**.
2. Navigate to **Groups & Licenses** and scroll to the **License mappings** section.
3. Create or edit SSO mappings for both Read-Only and Developer license types.
4. Enter a comma-separated list of **IdP group names** that should receive each license type.

<Lightbox src="/img/docs/dbt-platform/access-control/license-mapping.png" width="65%" title="Configuring IdP group license mapping"/>

#### Fundamental licensing rules

- **Default assignment**: All new members of a <Constant name="dbt" /> account are assigned a Developer license unless you configure otherwise.
- **Mapping basis**: License type mappings are based on _IdP groups_ (groups in your identity provider), not _<Constant name="dbt" /> groups_. Check group memberships in your IdP when configuring or troubleshooting.
- **When changes take effect**: License types are adjusted when users sign into <Constant name="dbt" /> using single sign-on. Changes to license type mappings take effect the next time users sign in.

#### Mapping logic and precedence

When a user belongs to multiple IdP groups, the Developer license takes precedence. The following table shows how group membership determines the assigned license:

| In a Developer license-mapped group? | In a Read-Only license-mapped group? | License assigned |
|---|---|---|
| No | No | Developer (default) |
| No | Yes | Read-Only |
| Yes | No | Developer |
| Yes | Yes | Developer (Developer takes precedence) |

:::note
If a user's IdP groups do not match _any_ license type mappings, <Constant name="dbt" /> assigns a Developer license by default.
:::

## Granular permissioning

<Constant name="dbt" /> Enterprise-tier plans support role-based access controls for configuring granular in-app permissions. See [access control](/docs/platform/manage-access/about-user-access) for more information on Enterprise permissioning.
