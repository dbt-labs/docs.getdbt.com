---
title: "Set up SCIM"
description: "Configure SCIM for SSO"
id: "scim"
sidebar: "Set up SCIM"
---

# Set up SCIM <Lifecycle status="managed, managed_plus" />

The System for Cross-Domain Identity Management (SCIM) makes user data more secure and simplifies the admin and end-user lifecycle experience by automating user identities and groups. You can create or disable user identities in your Identity Provider (IdP), and SCIM will automatically make those changes in near real-time downstream in <Constant name="cloud" />.

## Prerequisites 

To configure SCIM in your <Constant name="cloud" /> environment:
- You must be on an [Enterprise or Enterprise+ plan](https://www.getdbt.com/pricing).
- You must be using Okta as your SSO provider.
- You must have permissions to configure the account settings in [<Constant name="cloud" />](/docs/cloud/manage-access/enterprise-permissions) and change application settings in [Okta](https://help.okta.com/en-us/content/topics/security/administrators-admin-comparison.htm).
- If you have IP restrictions enabled, you must add [Okta's IPs](https://help.okta.com/en-us/content/topics/security/ip-address-allow-listing.htm) to your allowlist.

### Supported features

The currently available supported features for SCIM are:

- User provisioning and de-provisioning
- User profile updates
- Group creation and management
- Importing groups and users

When users are provisioned, the following attributes are supported
- Username
- Family name
- Given name

The following IdPs are supported in the <Constant name="cloud" /> UI:
- Okta
- Entra ID (_coming soon_)

If your IdP isn’t on the list, it can be supported using <Constant name="cloud" /> APIs (_docs coming soon_).

## SCIM configuration for Okta <Lifecycle status="beta" />

Please complete the [setup SSO with Okta](/docs/cloud/manage-access/set-up-sso-okta) steps before configuring SCIM settings.


### Set up dbt

To retrieve the necessary <Constant name="cloud" /> configurations for use in Okta:

1. Navigate to your <Constant name="cloud" /> **Account settings**.
2. Select **Single sign-on** from the left-side menu.
3. Scroll to the bottom of your Okta configuration settings and click **Enable SCIM**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/enable-scim.png" width="60%" title="SCIM enabled in the Okta configuration settings." />
4. Record the **SCIM base URL** field for use in a later step.
5. Click **Create SCIM token**.
    :::note
    
    To follow best practices, you should regularly rotate your SCIM tokens. To do so, follow these same instructions you did to create a new one. To avoid service disruptions, remember to replace your token in your IdP before deleting the old token in <Constant name="cloud" />.

    :::
6. In the pop-out window, give the token a name that will make it easily identifiable. Click **Save**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/name-scim-token.png" width="60%" title="Give your token and identifier." />
7. Copy the token and record it securely, as _it will not be available again after you close the window_. You must create a new token if you lose the current one. 
    <Lightbox src="/img/docs/dbt-cloud/access-control/copy-scim-token.png" width="60%" title="Give your token and identifier." />
8. (Optional) Manual updates are turned off by default for all SCIM-managed entities, including the ability to invite new users manually. This ensures SCIM-managed entities stay in sync with the IdP, and we recommend keeping this setting disabled.
   - However, if you need to make manual updates (like update group membership for a SCIM-managed group), you can enable this setting by clicking **Allow manual updates**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-manual-updates.png" width="70%" title="Enabling manual updates in SCIM settings." />

:::note License mapping

<Constant name="cloud" /> maps SCIM groups to its own groups, so you can assign licenses to SCIM groups using the group name as an identifier. Currently, setting a license type directly as an attribute on the SCIM group isn't supported.


:::

### Set up Okta

1. Log in to your Okta account and locate the app configured for the <Constant name="cloud" /> SSO integration.
2. Navigate to the **General** tab and ensure **Enable SCIM provisioning** is checked or the **Provisioning** tab will not be displayed. 
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-provisioned.png" width="60%" title="Enable SCIM provisioning in Okta." />
3. Open the **Provisioning** tab and select **Integration**.
4. Paste the [**SCIM base URL** from <Constant name="cloud" />](#set-up-dbt-cloud) to the first field, then enter your preferred **Unique identifier field for users** &mdash; we recommend `userName`.
5. Click the checkboxes for the following **Supported provisioning actions**:
    - Push New Users
    - Push Profile Updates
    - Push Groups
6. From the **Authentication mode** dropdown, select **HTTP Header**.
7. In the **Authorization** section, paste the token from <Constant name="cloud" /> into the **Bearer** field.
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-okta-config.png" width="60%" title="The completed SCIM configuration in the Okta app." />
8. Ensure that the following provisioning actions are selected:
    - Create users
    - Update user attributes
    - Deactivate users
    <Lightbox src="/img/docs/dbt-cloud/access-control/provisioning-actions.png" width="60%" title="Ensure the users are properly provisioned with these settings." />

9. Test the connection and click **Save** once completed. 

You've now configured SCIM for the Okta SSO integration in <Constant name="cloud" />.

### Existing Okta integrations

If you are adding SCIM to an existing Okta integration in <Constant name="cloud" /> (as opposed to setting up SCIM and SSO concurrently for the first time), there is some functionality you should be aware of:

- Users and groups already synced to <Constant name="cloud" /> will become SCIM-managed once you complete the SCIM configuration.
- You can leverage SCIM to import and manage existing <Constant name="cloud" /> groups. Update the groups in your IdP with the same naming convention used for <Constant name="cloud" /> groups. New users, groups, and existing profile changes will be automatically imported into <Constant name="cloud" />.
    - Ensure the **Import users and profile updates** and **Import groups** checkboxes are selected in the **Provisioning settings** tab in the Okta SCIM configuration.
    - Read more about this feature in the [Okta documentation](https://help.okta.com/en-us/content/topics/users-groups-profiles/usgp-import-groups-app-provisioning.htm).

