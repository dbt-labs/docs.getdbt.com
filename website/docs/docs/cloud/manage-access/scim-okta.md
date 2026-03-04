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

### What you'll see if misconfigured

If `userName` is not an email address, you may encounter errors like:

- Okta reports **"User already exists"** when attempting to provision a user.
- SCIM logs show a filter like `userName eq "00uXXXXXXXXX"` (an Okta internal ID instead of an email).
- <Constant name="dbt_platform" /> returns no match on the SCIM `GET` request, then the subsequent `POST` to create the user fails with a conflict because the user already exists under their email.

When this occurs, <Constant name="dbt_platform" /> cannot match the existing user during SCIM sync, and provisioning fails with a conflict error.

## SCIM license mapping

To automate seat assignments in Okta for users as they are provisioned, see [Manage user licenses with SCIM](/docs/cloud/manage-access/scim-manage-user-licenses).

## Existing Okta integrations

If you are adding SCIM to an existing Okta integration in <Constant name="cloud" /> (as opposed to setting up SCIM and SSO concurrently for the first time), be aware of the following behavior:

- Users and groups already synced to <Constant name="cloud" /> will become SCIM-managed once you complete the SCIM configuration.
- Before enabling SCIM, confirm that user emails in <Constant name="dbt_platform" /> match the email addresses in Okta. If they differ, SCIM may create duplicate users rather than matching existing ones. See [Email domain changes](#email-domain-changes) below for guidance on ordering.

### Import users

When adding SCIM to an existing integration, use the following guidance:

- **Import users** from the app to bring existing <Constant name="dbt_platform" /> users under SCIM management. In Okta, go to the app's **Import** tab (located at the top of the app, not under the **Provisioning** tab) and click **Import Now**.
- **Avoid importing groups** unless you intend to fully manage group membership through Okta. Importing groups transfers ownership to SCIM, which disables manual group management in <Constant name="dbt_platform" />.
- Ensure **Import New Users and Profile Updates** is selected under the **Provisioning** → **To App** settings in Okta.
- Use **Import Users** to re-provision previously deleted users if needed.

For more detail, see the [Okta documentation on importing groups](https://help.okta.com/en-us/content/topics/users-groups-profiles/usgp-import-groups-app-provisioning.htm).

To set license type for users as they are provisioned, see [Manage user licenses with SCIM](/docs/cloud/manage-access/scim-manage-user-licenses).

## Email domain changes

If your organization is migrating to a new email domain (for example, through an acquisition), the order of operations matters for SCIM to work correctly.

**If users are already SCIM-managed**, SCIM can update email addresses automatically when the IdP changes them. However, email changes trigger a verification email to the new address — the user must accept the change before it takes effect in <Constant name="dbt_platform" />.

**If users are not yet SCIM-managed** and email addresses have already changed in the IdP, enabling SCIM may create duplicate users (one for the old email, one for the new) unless emails are aligned first.

### Recommended order for a domain migration

1. Align email addresses in <Constant name="dbt_platform" /> to match the new IdP emails (users will receive a verification email and must confirm the change).
2. Enable SCIM and confirm existing users become SCIM-managed (verify via **Import Users** in Okta).
3. From this point forward, email updates can flow through SCIM — though each change still requires user verification.

SCIM reduces ongoing manual work _after_ initial identity alignment, but it does not automatically reconcile mismatched identities during the first sync.

## Emails users receive when SCIM is enabled

When SCIM is enabled, users may receive the following emails from <Constant name="dbt_platform" />. This is expected behavior.

| Trigger | Email sent |
|---|---|
| New user provisioned via SCIM for the first time | MFA or account verification email (depending on your Okta configuration) |
| User's email address updated via SCIM | Verification email to the **new** address; the change does not take effect until the user confirms it |
| User accepts a group or license assignment invite | Confirmation email |

:::note
If a newly provisioned user does not complete email or MFA verification, their account is created but remains in an unconfirmed state. Group and license assignments may not take effect until the user completes verification. If a user reports missing group access after being provisioned, verify that their account confirmation is complete.
:::
