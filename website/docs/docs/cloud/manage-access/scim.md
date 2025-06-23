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
- You must be using Okta or Entra ID as your SSO provider.
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
- [Okta](#scim-configuration-for-okta)
- [Entra ID](#scim-configuration-for-entra-id) <Lifecycle status="beta" />

If your IdP isn’t on the list, it can be supported using <Constant name="cloud" /> [APIs](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Retrieve%20SCIM%20configuration).

## Set up dbt

To retrieve the necessary <Constant name="cloud" /> configurations for use in Okta or Entra ID:

1. Navigate to your <Constant name="cloud" /> **Account settings**.
2. Select **Single sign-on** from the left-side menu.
3. Scroll to the bottom of your SSO configuration settings and click **Enable SCIM**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/enable-scim.png" width="60%" title="SCIM enabled in the configuration settings." />
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

## SCIM configuration for Okta

Please complete the [setup SSO with Okta](/docs/cloud/manage-access/set-up-sso-okta) steps before configuring SCIM settings.

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
- (Recommended) Import and manage existing <Constant name="cloud" /> groups and users with Okta's **Import Groups** and **Import Users** features. Update the groups in your IdP with the same naming convention used for <Constant name="cloud" /> groups. New users, groups, and changes to existing profiles will be automatically imported into <Constant name="cloud" />.
    - Ensure the **Import users and profile updates** and **Import groups** checkboxes are selected in the **Provisioning settings** tab in the Okta SCIM configuration.
    - Use **Import Users** to sync all users from <Constant name="cloud" />, including previously deleted users, if you need to re-provision those users. 
    - Read more about this feature in the [Okta documentation](https://help.okta.com/en-us/content/topics/users-groups-profiles/usgp-import-groups-app-provisioning.htm).

## SCIM configuration for Entra ID <Lifecycle status="beta" />

Please complete the [setup SSO with Entra ID](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id) steps before configuring SCIM settings.

### Set up Entra ID

1. Log in to your Azure account and open the **Entra ID** configurations.
2. From the sidebar, under **Manage**, click **Enterprise Applications**.
3. Click **New Application** and select the option to **Create your own application**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/create-your-own.png" width="60%" title="Create your own application." />
4. Give your app a unique name and ensure the **Integrate any other application you don't find in the gallery (Non-gallery)** field is selected. Ignore any prompts for existing apps. Click **Create**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/create-application.png" width="60%" title="Give your app a unique name." />
5. From the application **Overview** screen, click **Provision User Accounts**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/provision-user-accounts.png" width="60%" title="The 'Provision user accounts' option." />
6. From the **Create configuration** section, click **Connect your application**
7. Fill out the form with the information from your dbt account:
    - The **Tenant URL** in Entra ID is your **SCIM based URL** from dbt
    - The **Secret token** in Entra ID is your *SCIM token** from dbt
8. Click **Test connection** and click **Create** once complete.
    <Lightbox src="/img/docs/dbt-cloud/access-control/provisioning-config.png" width="60%" title="Configure the app and test the connection." />

### Attribute mapping

To map the attributes that will sync with dbt:

1. From the enteprise app **Overview** screen sidebar menu, click **Provisioning**. 
    <Lightbox src="/img/docs/dbt-cloud/access-control/provisioning.png" width="60%" title="The Provisioning option on the sidebar." />
2. From under **Manage**, again click **Provisioning**.
3. Expand the **Mappings** section and click **Provision Microsoft Entra ID users**.
     <Lightbox src="/img/docs/dbt-cloud/access-control/provision-entra-users.png" width="60%" title="Provision the Entra ID users." />
4. Click the box for **Show advanced options** and then click **Edit attribute list for customappsso**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/customappsso-attributes.png" width="60%" title="Click to edit the customappsso attributes." />
5. Scroll to the bottom of the **Edit attribute list** window and find an empty field where you can add a new entry with the following fields: 
    - **Name:** `emails[type eq "work"].primary`
    - **Type:** `Boolean`
    - **Required:** True
    <Lightbox src="/img/docs/dbt-cloud/access-control/customappsso-entry.png" width="60%" title="Add the new field to the entry list." />
6. Mark all of the fields listed in Step 10 below as `Required`.
    <Lightbox src="/img/docs/dbt-cloud/access-control/mark-as-required.png" width="60%" title="Mark the fields as required." />    
7. Click **Save**
8. Back on the **Attribute mapping** window, click **Add new mapping** and complete fields with the following:
    - **Mapping type:** `none`
    - **Default value if null (optional):** `True`
    - **Target attribute:** `emails[type eq "work"].primary`
    - **Match objects using this attribute:** `No`
    - **Matching precedence:** *Leave blank*
    - **Apply this mapping:** `Always`
9. Click **Ok**
    <Lightbox src="/img/docs/dbt-cloud/access-control/edit-attribute.png" width="60%" title="Edit the attribute as shown." />
10. Make sure the following mappings are in place and delete any others:
    - **UserName:** `userPrincipalName`
    - **active:** `Switch([IsSoftDeleted], , "False", "True", "True", "False")`
    - **emails[type eq "work"].value:** `userPrincipalName`
    - **name.givenName:** `givenName`
    - **name.familyName:** `surname`
    - **externalid:** `mailNickname`
    - **emails[type eq "work"].primary** 
     <Lightbox src="/img/docs/dbt-cloud/access-control/attribute-list.png" width="60%" title="Edit the attributes so they match the list as shown." />


You can now begin assigning users to your SCIM app in Entra ID!


## Manage user licenses with SCIM

You can manage user license assignments via SCIM with a user attribute in your IdP environment. This ensures accurate license assignment as users are provisioned in the IdP and onboarded into your dbt account.

To use license management via SCIM, enable the feature under the **SCIM** section in the **Single sign-on** settings. This setting will enforce license type for a user based on their SCIM attribute and disable the license mapping and manual configuration set up in dbt.  
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-managed-licenses.png" width="60%" title="Enable SCIM managed user license distribution." />

_We recommend that you complete the setup instructions for your identity provider prior to enabling this toggle in your dbt account. Once enabled, any existing license mappings in <Constant name="dbt_platform" /> will be ignored._

The recommended steps for migrating to SCIM license mapping are as follows:
1. Set up SCIM but keep the toggle disabled so existing license mappings continue to work as expected.
2. Configure license attributes in your Identity Provider (IdP).
3. Test that SCIM attributes are being used to set license type in <Constant name="dbt_platform" />.
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
