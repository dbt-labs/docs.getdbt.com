---
title: "Set up SCIM with Okta"
description: "Configure SCIM for Okta to automate user and group provisioning and license assignment."
id: "scim-okta"
sidebar_label: "Set up SCIM with Okta"
---

# Set up SCIM with Okta <Lifecycle status="managed, managed_plus" />

:::info SCIM available for Okta
<Constant name="cloud" /> supports SCIM with Okta for user and group provisioning, profile updates, and [license management](#manage-user-licenses-with-scim) (optional). Complete the steps below after SSO is configured.
:::

Complete [Set up SCIM](/docs/cloud/manage-access/scim#set-up-dbt) first to get your SCIM base URL and token, then complete [setup SSO with Okta](/docs/cloud/manage-access/set-up-sso-okta) before configuring SCIM settings.

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

You've now configured SCIM for the Okta SSO integration in <Constant name="dbt_platform" />. You can now [manage user licenses with SCIM](#manage-user-licenses-with-scim) to set license type for users as they are provisioned.

## SCIM username format

SCIM requires the username to be in the email address format. If your Okta configurations map the `Username` field to a different attribute, SCIM user provisioning will fail. To get around this without altering your user profiles, set your Okta app config to `Email`:

1. Open the SAML app created for the dbt integration.
2. In the **Sign on** tab, click **Edit** in the **Settings** pane.
3. Set the **Application username format** field to **Email**.
4. Click **Save**.

## Existing Okta integrations

If you are adding SCIM to an existing Okta integration in <Constant name="cloud" /> (as opposed to setting up SCIM and SSO concurrently for the first time), there is some functionality you should be aware of:

- Users and groups already synced to <Constant name="cloud" /> will become SCIM-managed once you complete the SCIM configuration.
- (Recommended) Import and manage existing <Constant name="cloud" /> groups and users with Okta's **Import Groups** and **Import Users** features. Update the groups in your IdP with the same naming convention used for <Constant name="cloud" /> groups. New users, groups, and changes to existing profiles will be automatically imported into <Constant name="cloud" />.
    - Ensure the **Import users and profile updates** and **Import groups** checkboxes are selected in the **Provisioning settings** tab in the Okta SCIM configuration.
    - Use **Import Users** to sync all users from <Constant name="cloud" />, including previously deleted users, if you need to re-provision those users. 
    - Read more about this feature in the [Okta documentation](https://help.okta.com/en-us/content/topics/users-groups-profiles/usgp-import-groups-app-provisioning.htm).

## Manage user licenses with SCIM {#manage-user-licenses-with-scim}

You can manage user license assignments via SCIM with a user attribute in your Okta environment, so license type is set as users are provisioned and onboarded.

:::note Before you enable SCIM license mapping
- Default license: New users are assigned a Developer license unless you change it manually, using [SSO license mappings](/docs/cloud/manage-access/cloud-seats-and-users#mapped-configuration), or using SCIM.
- Best practice: Use one source of truth for license assignment (either <Constant name="dbt_platform" /> or SCIM). Don't mix SCIM license management with manual or SSO mapping changes.
- Analyst license: Only available on select plans. Assigning it using SCIM will error if that license type isn't available for your account.
:::

To use license management via SCIM, enable the feature under the **SCIM** section in the **SSO & SCIM** settings. This setting will enforce license type for a user based on their SCIM attribute and disable the license mapping and manual configuration set up in dbt.
<Lightbox src="/img/docs/dbt-cloud/access-control/scim-managed-licenses.png" width="60%" title="Enable SCIM managed user license distribution." />

We recommend that you complete the setup instructions for your identity provider prior to enabling this toggle in your dbt account. Once enabled, any existing license mappings in <Constant name="cloud" /> will be ignored.

The recommended steps for migrating to SCIM license mapping are as follows:
1. Set up SCIM but keep the toggle disabled so existing license mappings continue to work as expected.
2. Configure license attributes in your Identity Provider (IdP).
3. Test that SCIM attributes are being used to set license type in <Constant name="cloud" />.
4. Enable the toggle to ignore existing license mappings so that SCIM is the source-of-truth for assigning licenses to users.

### Add license type attribute for Okta

To add the attribute for license types to your Okta environment:

1. From your Okta application, navigate to the **Provisioning** tab, scroll down to **Attribute Mappings**, and click **Go to Profile Editor**.
2. Click **Add Attribute**.
3. Configure the attribute fields as follows (the casing should match for the values of each):
    - **Date type:** `string`
    - **Display name:** `License Type`
    - **Variable name:** `licenseType`
    - **External name:** `licenseType`
    - **External namespace:** `urn:ietf:params:scim:schemas:extension:dbtLabs:2.0:User`
    - **Description:** An arbitrary string of your choosing.
    - **Enum:** Check the box for **Define enumerated list of values**
    - **Attribute members:** Add the initial attribute and then click **Add another** until each license type is defined. We recommend adding all of the values even if you don't use them today, so they'll be available in the future.
        | Display name | Value |
        |--------------|-------|
        | **IT**       | `it`  |
        | **Analyst**  | `analyst` |
        | **Developer**| `developer` |
        | **Read Only**| `read_only` |
    - **Attribute type:** Personal

    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-license-attributes.png" width="60%" title="Enter the fields as they appear in the image. Ensure the cases match." />

4. **Save** the attribute mapping.
5. Users can now have license types set in their profiles and when they are being provisioned.
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-license-provisioning.png" width="60%" title="Set the license type for the user in their Okta profile." />
