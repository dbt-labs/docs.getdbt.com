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
- You must use Okta or Entra ID as your SSO provider and have it connected in the dbt platform.
- You must have permissions to configure the account settings in [<Constant name="cloud" />](/docs/cloud/manage-access/enterprise-permissions) and change application settings in [Okta](https://help.okta.com/en-us/content/topics/security/administrators-admin-comparison.htm).
- If you have IP restrictions enabled, you must add [Okta's IPs](https://help.okta.com/en-us/content/topics/security/ip-address-allow-listing.htm) to your allowlist.

### Supported features

The currently available supported features for SCIM are:

- User provisioning and de-provisioning
- User profile updates
- Group creation and management
- Importing groups and users

When SCIM is enabled, the following functionality will change:
- Users are not automatically added to default groups
- Manual actions such as inviting users, updating user information and updating group memberships are disabled by default
- SSO group mappings are disabled in favor of SCIM group management

To overwrite these updates to functionality with SCIM enabled, enable manual updates as part of the SCIM configuration (not recommended).

When users are provisioned, the following attributes are supported
- Username
- Family name
- Given name

The following IdPs are supported in the <Constant name="cloud" /> UI:
- [Set up SCIM with Okta](/docs/cloud/manage-access/scim-okta) (includes [license management](/docs/cloud/manage-access/scim-okta#manage-user-licenses-with-scim))
- [Set up SCIM with Entra ID](/docs/cloud/manage-access/scim-entra-id)

If your IdP isn't on the list, it can be supported using <Constant name="cloud" /> [APIs](/dbt-cloud/api-v3#/operations/Retrieve%20SCIM%20configuration).

## Set up dbt {#set-up-dbt}

To retrieve the necessary <Constant name="cloud" /> configurations for use in Okta or Entra ID:

1. Navigate to your <Constant name="cloud" /> **Account settings**.
2. Under **Settings**, click **SSO & SCIM**.
3. Scroll to the bottom of your SSO configuration settings and click **Enable SCIM**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/enable-scim.png" width="60%" title="SCIM enabled in the configuration settings." />
4. Record the **SCIM base URL** field for use in a later step.
5. Click **Create SCIM token**.
    :::note
    To follow best practices, you should regularly rotate your SCIM tokens. To do so, follow these same instructions you did to create a new one. To avoid service disruptions, remember to replace your token in your IdP before deleting the old token in <Constant name="cloud" />.
    :::
6. In the pop-up window, give the token a name that will make it easily identifiable. Click **Save**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/name-scim-token.png" width="60%" title="Give your token and identifier." />
7. Copy the token and record it securely, as _it will not be available again after you close the window_. You must create a new token if you lose the current one.
    <Lightbox src="/img/docs/dbt-cloud/access-control/copy-scim-token.png" width="60%" title="Give your token and identifier." />
8. (Optional) Manual updates are turned off by default for all SCIM-managed entities, including the ability to invite new users manually. This ensures SCIM-managed entities stay in sync with the IdP, and we recommend keeping this setting disabled.
   - However, if you need to make manual updates (like update group membership for a SCIM-managed group), you can enable this setting by clicking **Allow manual updates**.
    <Lightbox src="/img/docs/dbt-cloud/access-control/scim-manual-updates.png" width="70%" title="Enabling manual updates in SCIM settings." />

## Next steps

Configure SCIM for your identity provider and optionally manage licenses:

- **[Set up SCIM with Okta](/docs/cloud/manage-access/scim-okta)** &mdash; User and group provisioning, profile updates, and [license management](/docs/cloud/manage-access/scim-okta#manage-user-licenses-with-scim) (Okta only).
- **[Set up SCIM with Entra ID](/docs/cloud/manage-access/scim-entra-id)** &mdash; User and group provisioning and profile updates, plus assigning users to the SCIM app.
