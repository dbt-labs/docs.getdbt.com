---
title: "Set up SCIM with Okta"
description: "Configure SCIM for Okta to automate user and group provisioning and license assignment."
id: "scim-okta"
sidebar_label: "Set up SCIM with Okta"
---

# Set up SCIM with Okta <Lifecycle status="managed, managed_plus" />

:::info SCIM available for Okta
System for Cross-Domain Identity Management (SCIM) [license mapping](/docs/cloud/manage-access/scim-manage-user-licenses) is currently only supported for Okta. For other providers, license types must be [managed](/docs/cloud/manage-access/seats-and-users#mapped-configuration) within the <Constant name="dbt_platform" /> user interface.
:::

## Prerequisites
- Available on [Enterprise or Enterprise+ plans](https://www.getdbt.com/pricing).
- You must use Okta as your single sign-on (SSO) provider and have it connected in the <Constant name="dbt_platform" />.
- You must have [permissions](/docs/cloud/manage-access/enterprise-permissions) to configure the account settings in <Constant name="dbt_platform" />.
- Complete [setup SSO with Okta](/docs/cloud/manage-access/set-up-sso-okta) before configuring SCIM settings.
- Complete the [Set up SCIM](/docs/cloud/manage-access/scim#set-up-dbt) to get your SCIM base URL and token.

## Set up Okta

1. Log in to your Okta account and locate the app configured for the <Constant name="cloud" /> SSO integration.
2. Navigate to the **General** tab and ensure **Enable SCIM provisioning** is selected or the **Provisioning** tab will not be displayed. 
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-provisioned.png" width="60%" title="Enable SCIM provisioning in Okta." />
3. Open the **Provisioning** tab and select **Integration**.
4. Enter the **SCIM base URL** from [Set up SCIM](/docs/cloud/manage-access/scim#set-up-dbt) in the first field, then enter your preferred **Unique identifier field for users** &mdash; we recommend `userName`.
5. Select the boxes for the following **Supported provisioning actions**:
    - **Push New Users**
    - **Push Profile Updates**
    - **Push Groups**
    - **Import New Users and Profile Updates** (Optional for users created before SSO/SCIM setup)
6. From the **Authentication mode** dropdown, select **HTTP Header**.
7. In the **Authorization** section, enter the token from <Constant name="cloud" /> into the **Bearer** field.
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-okta-config.png" width="60%" title="The completed SCIM configuration in the Okta app." />
8. Ensure the following provisioning actions are selected:
    - **Create Users**
    - **Update User Attributes**
    - **Deactivate Users**
    <Lightbox src="/img/docs/dbt-cloud/access-control/provisioning-actions.png" width="60%" title="Ensure the users are properly provisioned with these settings." />

9. Test the connection and click **Save** once completed. 

You've now configured SCIM for the Okta SSO integration in <Constant name="dbt_platform" />. You can [manage user licenses with SCIM](/docs/cloud/manage-access/scim-manage-user-licenses) to set license type for users as they are provisioned.

## SCIM username format

For <Constant name="dbt_platform" /> SCIM with Okta, `userName` **must be the user's email address**. <Constant name="dbt_platform" /> uses `userName` to look up existing users during SCIM sync. If Okta sends a non-email value (such as an Okta internal ID like `00u...` or an employee ID), <Constant name="dbt_platform" /> cannot match the existing user and provisioning will fail.

If your Okta configurations map the `Username` field to a different attribute, set your Okta app config to `Email`:

1. Open the SAML app created for the dbt integration.
2. In the **Sign on** tab, click **Edit** in the **Settings** pane.
3. Set the **Application username format** field to **Email**.
4. Click **Save**.

#### What you'll see if misconfigured

If `userName` is not an email address, you may encounter errors like:

- Okta reports **"User already exists"** when attempting to provision a user.
- SCIM logs show a filter like `userName eq "00uXXXXXXXXX"` (an Okta internal ID instead of an email).
- <Constant name="dbt_platform" /> returns no match on the SCIM `GET` request, then the subsequent `POST` to create the user fails with a conflict because the user already exists under their email.

When this occurs, <Constant name="dbt_platform" /> cannot match the existing user during SCIM sync, and provisioning fails with a conflict error. To fix this, set the **Application username format** field to **Email** in your Okta app configuration.

## SCIM license mapping

To automate seat assignments in Okta for users as they are provisioned, see [Manage user licenses with SCIM](/docs/cloud/manage-access/scim-manage-user-licenses).

## Existing Okta integrations

If you are adding SCIM to an existing Okta integration in <Constant name="cloud" /> (as opposed to setting up SCIM and SSO concurrently for the first time), be aware of the following behavior:

- Users and groups already synced to <Constant name="cloud" /> will become SCIM-managed once you complete the SCIM configuration.
- (Recommended) Import and manage existing <Constant name="cloud" /> groups and users with Okta's **Import Groups** and **Import Users** features. Update the groups in your IdP with the same naming convention used for <Constant name="cloud" /> groups. New users, groups, and changes to existing profiles will be automatically imported into <Constant name="cloud" />.
    - Ensure the **Import users and profile updates** and **Import Groups** boxes are selected under the **Provisioning settings** tab in the Okta SCIM configuration.
    - Use **Import Users** to sync all users from <Constant name="cloud" />, including previously deleted users, if you need to re-provision those users. 
    - Read more about this feature in the [Okta documentation](https://help.okta.com/en-us/content/topics/users-groups-profiles/usgp-import-groups-app-provisioning.htm).

To set license type for users as they are provisioned, see [Manage user licenses with SCIM](/docs/cloud/manage-access/scim-manage-user-licenses).
