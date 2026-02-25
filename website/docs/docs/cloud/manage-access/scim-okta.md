---
title: "Set up SCIM with Okta"
description: "Configure SCIM for Okta to automate user and group provisioning and license assignment."
id: "scim-okta"
sidebar_label: "Set up SCIM with Okta"
---

# Set up SCIM with Okta <Lifecycle status="managed, managed_plus" />

:::info SCIM available for Okta
SCIM [license mapping](/docs/cloud/manage-access/scim-manage-user-licenses) is currently only supported for Okta. For other providers, license types must be [managed](/docs/cloud/manage-access/seats-and-users#mapped-configuration) within the <Constant name="dbt_platform" /> user interface.
:::

## Prerequisites
- Available on [Enterprise or Enterprise+ plans](https://www.getdbt.com/pricing).
- You must use Okta as your SSO provider and have it connected in the <Constant name="dbt_platform" />.
- You must have permissions to configure the account settings in [<Constant name="dbt_platform" />](/docs/cloud/manage-access/enterprise-permissions).
- Complete [setup SSO with Okta](/docs/cloud/manage-access/set-up-sso-okta) before configuring SCIM settings.
- Complete the [Set up SCIM](/docs/cloud/manage-access/scim#set-up-dbt) to get your SCIM base URL and token.

## Set up Okta

1. Log in to your Okta account and locate the app configured for the <Constant name="cloud" /> SSO integration.
2. Navigate to the **General** tab and ensure **Enable SCIM provisioning** is checked or the **Provisioning** tab will not be displayed. 
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-provisioned.png" width="60%" title="Enable SCIM provisioning in Okta." />
3. Open the **Provisioning** tab and select **Integration**.
4. Paste the **SCIM base URL** from [Set up SCIM](/docs/cloud/manage-access/scim#set-up-dbt) to the first field, then enter your preferred **Unique identifier field for users** &mdash; we recommend `userName`.
5. Click the checkboxes for the following **Supported provisioning actions**:
    - Push New Users
    - Push Profile Updates
    - Push Groups
    - Import New Users and Profile Updates  (Optional for users created before SSO/SCIM setup)
6. From the **Authentication mode** dropdown, select **HTTP Header**.
7. In the **Authorization** section, paste the token from <Constant name="cloud" /> into the **Bearer** field.
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-okta-config.png" width="60%" title="The completed SCIM configuration in the Okta app." />
8. Ensure the following provisioning actions are selected:
    - Create users
    - Update user attributes
    - Deactivate users
    <Lightbox src="/img/docs/dbt-cloud/access-control/provisioning-actions.png" width="60%" title="Ensure the users are properly provisioned with these settings." />

9. Test the connection and click **Save** once completed. 

You've now configured SCIM for the Okta SSO integration in <Constant name="dbt_platform" />. You can [manage user licenses with SCIM](/docs/cloud/manage-access/scim-manage-user-licenses) to set license type for users as they are provisioned.

## SCIM username format

SCIM requires the username to be in the email address format. If your Okta configurations map the `Username` field to a different attribute, SCIM user provisioning will fail. To get around this without altering your user profiles, set your Okta app config to `Email`:

1. Open the SAML app created for the dbt integration.
2. In the **Sign on** tab, click **Edit** in the **Settings** pane.
3. Set the **Application username format** field to **Email**.
4. Click **Save**.

## SCIM license mapping

To automate seat assignments in Okta for users as they are provisioned, see [Manage user licenses with SCIM](/docs/cloud/manage-access/scim-manage-user-licenses).

## Existing Okta integrations

If you are adding SCIM to an existing Okta integration in <Constant name="cloud" /> (as opposed to setting up SCIM and SSO concurrently for the first time), there is some functionality you should be aware of:

- Users and groups already synced to <Constant name="cloud" /> will become SCIM-managed once you complete the SCIM configuration.
- (Recommended) Import and manage existing <Constant name="cloud" /> groups and users with Okta's **Import Groups** and **Import Users** features. Update the groups in your IdP with the same naming convention used for <Constant name="cloud" /> groups. New users, groups, and changes to existing profiles will be automatically imported into <Constant name="cloud" />.
    - Ensure the **Import users and profile updates** and **Import groups** checkboxes are selected in the **Provisioning settings** tab in the Okta SCIM configuration.
    - Use **Import Users** to sync all users from <Constant name="cloud" />, including previously deleted users, if you need to re-provision those users. 
    - Read more about this feature in the [Okta documentation](https://help.okta.com/en-us/content/topics/users-groups-profiles/usgp-import-groups-app-provisioning.htm).

To set license type for users as they are provisioned, see [Manage user licenses with SCIM](/docs/cloud/manage-access/scim-manage-user-licenses).
