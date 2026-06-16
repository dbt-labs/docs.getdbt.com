---
title: "Set up SCIM with Okta"
description: "Configure SCIM for Okta to automate user and group provisioning and license assignment."
id: "scim-okta"
sidebar_label: "Set up SCIM with Okta"
---

# Set up SCIM with Okta <Lifecycle status="managed, managed_plus" />

:::info SCIM available for Okta
System for Cross-Domain Identity Management (SCIM) [license mapping](/docs/platform/manage-access/scim-manage-user-licenses) is currently only supported for Okta. For other providers, license types must be [managed](/docs/platform/manage-access/seats-and-users#mapped-configuration) within the <Constant name="dbt_platform" /> user interface.
:::

## Prerequisites
- Available on [Enterprise or Enterprise+ plans](https://www.getdbt.com/pricing).
- You must use Okta as your single sign-on (SSO) provider and have it connected in the <Constant name="dbt_platform" />.
- You must have [permissions](/docs/platform/manage-access/enterprise-permissions) to configure the account settings in <Constant name="dbt_platform" />.
- Complete [setup SSO with Okta](/docs/platform/manage-access/set-up-sso-okta) before configuring SCIM settings.
- Complete the [Set up SCIM](/docs/platform/manage-access/scim#set-up-dbt) to get your SCIM base URL and token.

## Set up Okta

1. Log in to your Okta account and select **Applications** from the sidebar. Open the application you configured for SSO. 
2. Click on the app and navigate to the **General** tab.
3. In **App Settings**, click **Edit** and make sure you check the **SCIM** checkbox on the **Provisioning** row to enable SCIM provisioning. 
4. Click **Save** and the **Provisioning** tab will now be visible.
    <Lightbox src="/img/docs/dbt-platform/access-control/scim-provisioned.png" width="80%" title="Enable SCIM provisioning in Okta." />
5. Open the **Provisioning** tab and select **Integration**.
6. Click **Edit** and enter the **SCIM base URL** from [Set up SCIM](/docs/platform/manage-access/scim#set-up-dbt) in the first field. For **Unique identifier field for users**, we recommend `userName`.
7. Under **Supported provisioning actions**, select:
    - **Push New Users**
    - **Push Profile Updates**
    - **Push Groups**
    - **Import New Users and Profile Updates** (Optional for users created before SSO/SCIM setup)
    - **Import Groups** (Optional)
8. For **Authentication mode** dropdown, select **HTTP Header**.
9. In the **Authorization** section, enter the token from <Constant name="dbt" /> into the **Bearer** field.
    <Lightbox src="/img/docs/dbt-platform/access-control/scim-okta-config.png" width="80%" title="The completed SCIM configuration in the Okta app." />
10. Click **Save** to test the connection and you will be taken to the **Provisioning** tab.
11. Click **Edit** and ensure the following provisioning actions are selected:
    - **Create Users**
    - **Update User Attributes**
    - **Deactivate Users**
    <Lightbox src="/img/docs/dbt-platform/access-control/provisioning-actions.png" width="70%" title="Ensure the users are properly provisioned with these settings." />

12. Click **Save** to complete the provisioning configuration. 
13. To complete your group setup, go to **Push Groups** and push your Okta groups to <Constant name="dbt_platform" />. This makes the groups available in <Constant name="dbt_platform" />. Then, an admin must assign the [required permissions](/docs/platform/manage-access/enterprise-permissions) to each group.

You've now configured SCIM for the Okta SSO integration in <Constant name="dbt_platform" />. You can [manage user licenses with SCIM](/docs/platform/manage-access/scim-manage-user-licenses) to set license type for users as they are provisioned.

## SCIM username format

For <Constant name="dbt_platform" /> SCIM with Okta, `userName` **must be the email address format**. <Constant name="dbt_platform" /> uses `userName` to look up existing users during SCIM sync. If Okta sends another format (such as an Okta internal ID like `00u...` or an employee ID), <Constant name="dbt_platform" /> cannot match the existing user, and provisioning will fail.

If your Okta configurations map the `Username` field to a different attribute, set your Okta app config to `Email`:

1. Open the SAML app created for the dbt integration.
2. In the **Sign on** tab, click **Edit** in the **Settings** pane.
3. Set the **Application username format** field to **Email**.
4. Click **Save**.

:::info SSO and SCIM username
When you use both SSO and SCIM with Okta, the SAML **Application username** format must be **Email**. SCIM requires `userName` in email address format, and it must be the same value as the email attribute so users match between SSO and provisioning.
:::

## SCIM license mapping

To automate seat assignments in Okta for users as they are provisioned, see [Manage user licenses with SCIM](/docs/platform/manage-access/scim-manage-user-licenses).

## Existing Okta integrations

If you are adding SCIM to an existing Okta integration in <Constant name="dbt_platform" /> (as opposed to setting up SCIM and SSO concurrently for the first time), be aware of the following behavior. Refer to [SCIM FAQ](/docs/platform/manage-access/scim-faq) for more details on what happens to pre-existing users:

- Users and groups already synced to <Constant name="dbt" /> will become SCIM-managed once you complete the SCIM configuration.
- (Recommended) Import and manage existing <Constant name="dbt" /> groups and users with Okta's **Import Groups** and **Import Users** features. Update the groups in your IdP with the same naming convention used for <Constant name="dbt" /> groups. New users, groups, and changes to existing profiles will be automatically imported into <Constant name="dbt" />.
    - Ensure the **Import users and profile updates** and **Import Groups** boxes are selected under the **Provisioning settings** tab in the Okta SCIM configuration.
    - Use **Import Users** to sync all users from <Constant name="dbt" />, including previously deleted users, if you need to re-provision those users. 
    - Read more about this feature in the [Okta documentation](https://help.okta.com/en-us/content/topics/users-groups-profiles/usgp-import-groups-app-provisioning.htm).

To set license type for users as they are provisioned, see [Manage user licenses with SCIM](/docs/platform/manage-access/scim-manage-user-licenses).

## FAQ and troubleshooting

For common questions about SCIM provisioning with Okta — including onboarding workflows, SSO group mapping behavior, and troubleshooting, refer to [SCIM FAQs and troubleshooting](/docs/platform/manage-access/scim-faq).
