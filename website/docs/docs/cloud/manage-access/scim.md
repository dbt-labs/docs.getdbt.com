---
title: "Set up SCIM"
description: "Configure SCIM for SSO"
id: "scim"
sidebar: "Set up SCIM"
---

# SCIM for SSO configuration <Lifecycle status="beta" />

The System for Cross-Domain Identity Management (SCIM) makes user data more secure and simplifies the admin and end-user lifecycle experience by automating user identities and groups. You can create or disable user identities in your Identity Provider (IdP), and SCIM will automatically make those changes in near real-time downstream in dbt Cloud.

### Supported features

The currently available supported features for SCIM are:

- User provisioning and de-provisioning
- User profile updates
- Group creation and management

The following IdPs are supported in the dbt Cloud UI:
- Okta
- Entra ID (_coming soon_)

If your IDP isn’t on the list, it can be supported using dbt Cloud APIs (_docs coming soon_).

## SCIM configuration for Okta <Lifecycle status="beta" />

Please complete the [setup SSO with Okta](/docs/cloud/manage-access/set-up-sso-okta) steps before configuring SCIM settings.

To configure the SCIM settings for Okta:

1. Navigate to your dbt Cloud **Account settings**.
2. Select **Single sign-on** from the left-side menu.
3. Click **Edit**, scroll to the bottom of your Okta configuration settings, and click **Enable SCIM**.
    - In later steps, you will need both the **SCIM base URL** and **SCIM token**.

<Lightbox src="/img/docs/dbt-cloud/access-control/enable-scim.png" width="60%" title="SCIM enabled in the Okta configuration settings." />

4. Log in to your Okta account and locate the app configured for the dbt Cloud SSO integration.
5. Navigate to the **General** tab an ensure **Enable SCIM provisioning** is checked or the **Provisioning** tab will not be displayed. 
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-provisioned.png" width="60%" title="Enable SCIM provisioning in Okta." />
6. Open the **Provisioning** tab and select **Integration**.
7. Paste the **SCIM base URL** from dbt Cloud to the first field and enter your preferred **Unique identifier field for users** (such as _username_) next.
8. Click the checkboxes for the following **Supported provisioning actions**:
    - Push New Users
    - Push Profile Updates
    - Push Groups
9. For **Authentication mode** select **HTTP Header** from the dropdown.
10. In the **Authorization** section, paste the token from dbt Cloud into the **Bearer** field.
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-okta-config.png" width="60%" title="The completed SCIM configuration in the Okta app." />

11. Test the connection and click **Save** once completed. 

You've now configured SCIM for the Okta SSO integration in dbt Cloud.