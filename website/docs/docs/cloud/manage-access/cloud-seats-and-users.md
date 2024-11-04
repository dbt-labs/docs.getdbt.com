---
title: "Users and licenses"
description: "Learn how dbt Cloud administrators can use licenses and seats to control access in a dbt Cloud account."
id: "seats-and-users"
sidebar: "Users and licenses"
pagination_next: "docs/cloud/manage-access/enterprise-permissions"
pagination_prev: null
---

In dbt Cloud, _licenses_ are used to allocate users to your account. There are three different types of licenses in dbt Cloud:

- **Developer** &mdash; Granted access to the Deployment and [Development](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) functionality in dbt Cloud.
- **Read-Only** &mdash; Intended to view the [artifacts](/docs/deploy/artifacts) created in a dbt Cloud account. Read-Only users can receive job notifications but not configure them.
- **IT** &mdash; Can manage users, groups, and licenses, among other permissions. IT users can receive job notifications but not configure them. Available on Enterprise and Team plans only.  In Enterprise plans, the IT license type grants access equivalent to the ['Security admin' and 'Billing admin' roles](/docs/cloud/manage-access/enterprise-permissions#account-permissions-for-account-roles). 

The user's assigned license determines the specific capabilities they can access in dbt Cloud.

| Functionality | Developer User | Read-Only Users | IT Users* |
| ------------- | -------------- | --------------- | -------- |
| Use the dbt Cloud IDE | ✅ | ❌ | ❌ |
| Use the dbt Cloud CLI | ✅ | ❌ | ❌ |
| Use Jobs | ✅ | ❌ | ❌ |
| Manage Account | ✅ | ❌ | ✅ |
| API Access | ✅ | ❌ | ❌ |
| Use [dbt Explorer](/docs/collaborate/explore-projects) | ✅  | ✅ | ❌  |
| Use [Source Freshness](/docs/deploy/source-freshness) | ✅ | ✅ | ❌ |
| Use [Docs](/docs/collaborate/build-and-view-your-docs) | ✅ | ✅ | ❌ |
| Receive [Job notifications](/docs/deploy/job-notifications) |  ✅ |  ✅  |  ✅ | 

*Available on Enterprise and Team plans only and doesn't count toward seat usage. Please note, that IT seats are limited to 1 seat per Team or Enterprise account.

## Licenses

:::tip Licenses or Permission sets

The user's license type always overrides their assigned [Enterprise permission](/docs/cloud/manage-access/enterprise-permissions) set. This means that even if a user belongs to a dbt Cloud group with 'Account Admin' permissions, having a 'Read-Only' license would still prevent them from performing administrative actions on the account.

:::

Each dbt Cloud plan comes with a base number of Developer, IT, and Read-Only licenses. You can add or remove licenses by modifying the number of users in your account settings. 

If you have a Developer plan account and want to add more people to your team, you'll need to upgrade to the Team plan. Refer to [dbt Pricing Plans](https://www.getdbt.com/pricing/) for more information about licenses available with each plan.

The following tabs detail steps on how to modify your user license count:

<Tabs>

<TabItem value="enterprise" label="Enterprise plans">

If you're on an Enterprise plan and have the correct [permissions](/docs/cloud/manage-access/enterprise-permissions), you can add or remove licenses by adjusting your user seat count. Note, an IT license does not count toward seat usage.

- To remove a user, go to **Account Settings** and select **Users**.
  - Select the user you want to remove, click **Edit**, and then **Delete**. 
  - This action cannot be undone. However, you can re-invite the user with the same info if you deleted the user in error.<br />

- To add a user, go to **Account Settings** and select **Users**. 
  - Click the [**Invite Users**](/docs/cloud/manage-access/invite-users) button. 
  - For fine-grained permission configuration, refer to [Role based access control](/docs/cloud/manage-access/about-user-access#role-based-access-control-).


</TabItem>

<TabItem value="team" label="Team plans">

If you're on a Team plan and have the correct [permissions](/docs/cloud/manage-access/self-service-permissions), you can add or remove developers. You'll need to make two changes:

- Adjust your developer user seat count, which manages the users invited to your dbt Cloud project. AND
- Adjust your developer billing seat count, which manages the number of billable seats. 


You can add or remove developers by increasing or decreasing the number of users and billable seats in your account settings:

<Tabs>
<TabItem value="addusers" label="Adding users">

To add a user in dbt Cloud, you must be an account owner or have admin privileges. 

1. From dbt Cloud, click the gear icon at the top right and select **Account Settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate To Account Settings.png" width="75%" title="Navigate to Account Settings" />

2. In **Account Settings**, select **Billing**. 
3. Enter the number of developer seats you want and make sure you fill in all the payment details, including the **Billing Address** section. Leaving these blank won't allow you to save your changes.
4. Press **Update Payment Information** to save your changes.

<Lightbox src="/img/docs/dbt-cloud/faq-account-settings-billing.jpg" width="75%" title="Navigate to Account Settings -> Billing to modify billing seat count" />


Now that you've updated your billing, you can now [invite users](/docs/cloud/manage-access/invite-users) to join your dbt Cloud account:

Great work! After completing those these steps, your dbt Cloud user count and billing count should now be the same.
</TabItem>

<TabItem value="deleteusers" label="Deleting users">

To delete a user in dbt Cloud, you must be an account owner or have admin privileges. If the user has a `developer` license type, this will open up their seat for another user or allow the admins to lower the total number of seats. 

1. From dbt Cloud, click the gear icon at the top right and select **Account Settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate To Account Settings.png" width="85%" title="Navigate to Account Settings" />

2. In **Account Settings** and select **Users**.
3. Select the user you want to delete, then click **Edit**. 
4. Click **Delete** in the bottom left. Click **Confirm Delete** to immediately delete the user without additional password prompts. This action cannot be undone. However, you can re-invite the user with the same information if the deletion was made in error. 

<Lightbox src="/img/docs/dbt-cloud/delete_user_20221023.gif" width="75%" title="Deleting a user" />


If you are on a **Teams** plan and you're deleting users to reduce the number of billable seats, follow these steps to lower the license count to avoid being overcharged:

1. In **Account Settings**, select **Billing**. 
2. Enter the number of developer seats you want and make sure you fill in all the payment details, including the **Billing Address** section. If you leave any field blank, you won't be able to save your changes.
3. Click **Update Payment Information** to save your changes. 
        
<Lightbox src="/img/docs/dbt-cloud/faq-account-settings-billing.jpg" width="75%" title="The Billing** page in your **Account Settings" />

Great work! After completing these steps, your dbt Cloud user count and billing count should now be the same.

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## Managing license types

Licenses can be assigned to users individually or through group membership. To assign a license via group membership, you can manually add a user to a group during the invitation process or assign them to a group after they’ve enrolled in dbt Cloud. Alternatively, with [SSO configuration](/docs/cloud/manage-access/sso-overview) and [role-based access control](/docs/cloud/manage-access/about-user-access#role-based-access-control-) (Enterprise only), users can be automatically assigned to groups. By default, new users in an account are assigned a Developer license.

### Manual configuration

To manually assign a specific type of license to a user on your team, navigate
to the Team page in your Account Settings and click the "edit" button for the user
you want to manage. From this page, you can select the license type and relevant
groups for the user.

**Note:** You will need to have an available license ready
to allocate for the user. If your account does not have an available license to
allocate, you will need to add more licenses to your plan to complete the license
change.

<Lightbox src="/img/docs/dbt-cloud/access-control/license-manual.png" width="55%" title="Manually assigning licenses"/>

### Mapped configuration <Lifecycle status="enterprise"/> 

If your account is connected to an Identity Provider (IdP) for [Single Sign On](/docs/cloud/manage-access/sso-overview), you can automatically map IdP user groups to specific groups in dbt Cloud and assign license types to those groups. To configure license mappings, navigate to the **Account Settings** > **Groups & Licenses** > **License Mappings** page. From here, you can create or edit SSO mappings for both Read-Only and Developer license types.

By default, all new members of a dbt Cloud account will be assigned a Developer
license. To assign Read-Only licenses to certain groups of users, create a new
License Mapping for the Read-Only license type and include a comma separated
list of IdP group names that should receive a Read-Only license at sign-in time.

<Lightbox src="/img/docs/dbt-cloud/access-control/license-mapping.png" width="65%" title="Configuring IdP group license mapping"/>

Usage notes:
- If a user's IdP groups match both a Developer and Read-Only license type
  mapping, a Developer license type will be assigned
- If a user's IdP groups do not match _any_ license type mappings, a Developer
  license will be assigned
- License types are adjusted when users sign into dbt Cloud via Single Sign On.
  Changes made to license type mappings will take effect the next time users
  sign in to dbt Cloud.
- License type mappings are based on _IdP Groups_, not _dbt Cloud groups_, so be
  sure to check group memberships in your identity provider when configuring
  this feature.


## Granular permissioning

The dbt Cloud Enterprise plan supports role-based access controls for
configuring granular in-app permissions. See [access control](/docs/cloud/manage-access/about-user-access)
for more information on Enterprise permissioning.
