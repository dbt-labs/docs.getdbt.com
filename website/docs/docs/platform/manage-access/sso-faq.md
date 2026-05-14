---
title: "SSO FAQs and troubleshooting"
description: "Common questions and troubleshooting for single sign-on (SSO) in dbt platform"
id: "sso-faq"
sidebar: "SSO FAQ and troubleshooting"
---

# SSO FAQs and troubleshooting <Lifecycle status="managed, managed_plus" />

Find answers to common questions about configuring and using single sign-on (SSO) in <Constant name="dbt_platform" />, plus guidance for resolving common issues.

## FAQs

<Expandable alt_header="Do SSO group mappings apply to SCIM-managed users?">

No. When SCIM is enabled, SSO group mappings do not apply to SCIM-managed users. Group membership is controlled entirely by your IdP.


This means that if you have a dbt group with SSO group mappings configured, those mappings will only apply to users who authenticate with SSO and are not SCIM-managed

</Expandable>

<Expandable alt_header="Where do I find my Auth0 URI for configuring SSO?">

Your Auth0 URI is displayed on the **Single Sign-On** settings page in <Constant name="dbt_platform" /> under **Account settings → Single Sign-On**. 

When you begin the SSO setup flow and select your provider (for example, SAML 2.0 or Microsoft Entra ID), the page will show your IdP values. These are the values you share with your identity provider (IdP) administrator to configure the enterprise application on their end.

The Auth0 URI is not the same as your SCIM Base URL, though they share a similar domain pattern. Use the value shown on the SSO settings page directly — do not copy it from the SCIM section.

</Expandable>


<Expandable alt_header="Can I disable password logins for SSO users?">

When SSO is configured, it enforces SSO-only logins for the account. However, if [**Allow password logins for account administrators**](/docs/platform/manage-access/sso-overview?version=1.12#sso-enforcement) is enabled, account admins and IT-licensed users can still sign in with email and password.

:::caution
Before enabling SSO enforcement, ensure that at least one account admin can successfully sign in through SSO. If SSO is misconfigured and enforcement is enabled, admins may be locked out of the account. Contact [support@getdbt.com](mailto:support@getdbt.com) if this occurs.
:::

</Expandable>

<Expandable alt_header="What Entra ID permissions does the dbt SSO integration require?">

The required permissions are `User.Read` and `GroupMember.Read.All`. However, depending on your Entra ID tenant configuration — particularly if your tenant has more than 200 groups — you may see an additional request for `Directory.Read.All`, which requires admin consent.

</Expandable>

<Expandable alt_header="Can I use different IdPs for SSO and SCIM?">

SSO and SCIM are configured independently in <Constant name="dbt_platform" />, but should use the same IdP. Using different providers &mdash; for example, Okta for SSO and Microsoft Entra ID for SCIM &mdash; is not supported and can cause unintended behavior.

If your organization uses separate IdPs for authentication and directory management, contact your account team to discuss your options.

</Expandable>

---

## Troubleshooting

<Expandable alt_header="User is stuck on the email verification screen — no verification email received">

When a user signs in to a <Constant name="dbt_platform" /> account through SSO for the first time, a verification email is sent to confirm their identity. If the email is not received, it's usually caused by one of the following:

- **Email security tools (for example, Proofpoint and Outlook Safe Links)** may follow the verification link automatically before the user clicks it, consuming the one-time token and causing it to expire. Contact your IT or email security team to allowlist dbt verification link domains.
- **The email is being suppressed** in our email delivery provider. Contact [support@getdbt.com](mailto:support@getdbt.com) to check delivery logs for the affected address.

</Expandable>

<Expandable alt_header="Users are prompted for MFA twice when signing in">

If a user signs in with a regional root URL (for example, `au.dbt.com` or `eu2.dbt.com`) instead of their account-specific URL (for example, `abc123.au.dbt.com`), they may be redirected to an account with an active license, which can result in a second MFA prompt if they haven't remembered their device.

Ask users to bookmark and sign in with their account-specific URL. If MFA is only prompted once there, this is expected behavior. Enabling "Remember this device for 30 days" on the first MFA prompt also suppresses the second prompt when using a regional root URL.

</Expandable>

<Expandable alt_header='"Access Denied" redirect after a successful SAML authentication'>

The SAML assertion succeeds on the IdP side, but <Constant name="dbt_platform" /> is rejecting the response. This is almost always caused by a mismatch between the values configured in the IdP and what <Constant name="dbt_platform" /> expects.

To resolve, verify all the SSO configuration values in <Constant name="dbt_platform" /> match what was configured in your IdP

</Expandable>

<Expandable alt_header='New users see an "Admin consent required" prompt after SSO is set up'>

This occurs when tenant-level admin consent hasn't been granted for the dbt SSO app's permissions. Users who have previously signed in are unaffected, they've already consented individually.

**Steps to resolve:**

1. Have an Entra ID admin navigate to **Azure portal → Enterprise Applications → Your dbt application → Permissions**.
2. Click **Grant admin consent** for the organization. This grants consent on behalf of all users in the tenant and prevents the prompt from appearing for new users going forward.
3. Once granted, have the affected users retry signing in.

</Expandable>

<Expandable alt_header='"This SSO endpoint is disabled. Please contact your administrator to have them update your IdP SSO settings to use Auth0 instead."'>

This error message appears after a successful login when your IdP is misconfigured and the callback URL is pointing to <Constant name="dbt_platform" /> instead of Auth0. Your admin needs to update the IdP configuration to use the correct IdP values from **Account settings → Single Sign-On**.

</Expandable>
