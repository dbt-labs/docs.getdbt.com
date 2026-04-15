---
title: "SSO FAQs and troubleshooting"
description: "Common questions and troubleshooting for single sign-on (SSO) in dbt platform"
id: "sso-faq"
sidebar: "SSO FAQ and troubleshooting"
---

# SSO FAQ and troubleshooting <Lifecycle status="managed, managed_plus" />

Find answers to common questions about configuring and using single sign-on (SSO) in <Constant name="dbt_platform" />, plus guidance for resolving common issues.

## FAQs

<Expandable alt_header="Do SSO group mappings apply to SCIM-managed users?">

No. When SCIM is enabled, SSO group mappings are bypassed entirely for users who are provisioned and managed through SCIM. Group membership for SCIM-managed users is controlled by your IdP — <Constant name="dbt_platform" /> will not apply SSO group mapping rules on top of SCIM-provisioned group assignments.

This means that if you have a dbt group with SSO group mappings configured, those mappings will only apply to users who authenticate with SSO and are **not** SCIM-managed.

</Expandable>

{/* TODO: Needs engineering verification before publishing — confirm exact field label and whether a screenshot is available */}
<Expandable alt_header="Where do I find my Auth0 URI for configuring SSO?">

Your Auth0 URI is displayed on the **Single Sign-On** settings page in <Constant name="dbt_platform" /> under **Account settings → Single Sign-On**. When you begin the SSO setup flow and select your provider (for example, SAML 2.0 or Microsoft Entra ID), the page will show your IdP values. These are the values you share with your identity provider (IdP) administrator to configure the enterprise application on their end.

The Auth0 URI is **not** the same as your SCIM Base URL, though they share a similar domain pattern. Use the value shown on the SSO settings page directly — do not copy it from the SCIM section.

</Expandable>

{/* TODO: Needs engineering sign-off — DO NOT publish until confirmed. Source note: "WE NEED TO CONFIRM THIS ONE". Behavior around slug regeneration needs to be verified by engineering. */}
<Expandable alt_header="Why does my Entity ID or ACS URL change when I re-enter the SSO setup?">

The SSO slug — which forms the basis of your `Entity ID` and `ACS URL` — is auto-generated the first time you access the SSO setup flow. If you navigate away from the setup page without saving and then return, a new slug may be generated, changing these values.

This is a common issue when different teams manage the <Constant name="dbt_platform" /> setup and the IdP configuration. For example, if your team retrieves the `AUTH0_URI` and `AUTH0_ENTITYID` to send to an Entra ID administrator, then navigates away before the admin finishes their side, a new slug may be generated when you return.

**To avoid this:** Once you have opened the SSO setup page and noted your `AUTH0_URI` and `AUTH0_ENTITYID`, complete both sides of the configuration before saving. If you need to pause, take note of the current slug and confirm it hasn't changed before submitting.

:::caution
If your Entity ID changes after your IdP has already been configured, you will need to update the enterprise application in your IdP with the new values and re-test the connection. Deleted SSO configurations cannot have their original slug restored.
:::

</Expandable>

{/* TODO: Needs engineering verification before publishing — confirm toggle behavior and lockout edge case */}
<Expandable alt_header="Can I disable password logins for SSO users?">

Yes. Account admins can enable the **Require SSO** option in **Account settings → Single Sign-On** to prevent users from authenticating with a username and password.

:::caution
Before enabling SSO enforcement, ensure that at least one account admin can successfully log in through SSO. If SSO is misconfigured and enforcement is enabled, admins may be locked out of the account. Contact [support@getdbt.com](mailto:support@getdbt.com) if this occurs.
:::

</Expandable>

{/* TODO: Needs engineering sign-off — DO NOT publish until confirmed. The Directory.Read.All scope request may be tenant-size dependent and was not conclusively confirmed in testing. */}
<Expandable alt_header="What Entra ID permissions does the dbt SSO integration require?">

Our documentation lists `User.Read` and `GroupMember.Read.All` as the required permissions. However, depending on your Entra ID tenant configuration — particularly if your tenant has more than 200 groups — you may see an additional request for `Directory.Read.All`, which requires admin consent.

</Expandable>

{/* TODO: Needs engineering sign-off — DO NOT publish until confirmed. Answer is inferred from system behavior, not explicitly confirmed by engineering. See also: SCIM FAQ for the same question. */}
<Expandable alt_header="Can I use different IdPs for SSO and SCIM?">

SSO and SCIM are configured independently in <Constant name="dbt_platform" />, but they need to be compatible. Using different providers for SSO and SCIM (for example, Okta for SSO and Microsoft Entra ID for SCIM) is not a supported configuration. This can cause unintended behavior if there are discrepancies between the IdPs.

If your organization has separate IdPs for authentication and directory management, contact your account team to discuss your options.

</Expandable>

---

## Troubleshooting

<Expandable alt_header="User is stuck on the email verification screen — no verification email received">

When a user logs into a dbt account through SSO for the first time, a verification email is sent to confirm their identity. If the email is not received, this is usually caused by one of the following:

- **Email security tools (Proofpoint, Outlook Safe Links, etc.)** are following the verification link before the user clicks it, consuming the one-time token and causing it to expire. Contact your IT or email security team to allowlist dbt verification link domains.
- **The email is being suppressed** in our email delivery provider. Contact [support@getdbt.com](mailto:support@getdbt.com) to check delivery logs for the affected address.

</Expandable>

{/* TODO: Needs engineering verification before publishing — confirm whether the "Remember this device for 30 days" workaround fully addresses the second MFA prompt */}
<Expandable alt_header="Users are prompted for MFA twice when logging in">

If a user logs in with a regional root URL (for example, `au.dbt.com` or `eu2.dbt.com`) instead of their account-specific URL (for example, `abc123.au.dbt.com`), they may be redirected through two separate Auth0 flows, causing a second MFA prompt.

**Workaround:** Advise users to bookmark and log in with their account-specific URL. If MFA is only prompted once at the account-specific URL, this is expected behavior and not a bug. Enabling "Remember this device for 30 days" on the first MFA prompt also suppresses the second prompt when using the regional root URL.

</Expandable>

{/* TODO: Needs engineering verification before publishing — the specific customer case was unresolved; confirm the common causes listed are exhaustive */}
<Expandable alt_header='"Access Denied" redirect after a successful SAML authentication'>

The SAML assertion is completing successfully on the IdP side, but <Constant name="dbt_platform" /> is rejecting the response. This is almost always caused by a mismatch between the values configured in the IdP and the values <Constant name="dbt_platform" /> expects.

**Common causes:**

- The **Issuer** in the SAML response doesn't match the connection identifier in Auth0. Check that the Entity ID configured in your IdP matches the one shown in <Constant name="dbt_platform" />'s SSO settings.
- The **ACS URL** or **Audience** in the IdP app was set up with an old slug that has since changed.
- The **NameID format** is set to a value Auth0 doesn't accept. Use `email` or `persistent` format.

</Expandable>

{/* TODO: Needs engineering verification before publishing — confirm resolution steps are current for all Entra tenant types */}
<Expandable alt_header='New users see an "Admin consent required" prompt after SSO is set up'>

This occurs when Entra ID requires admin consent for the permissions the dbt SSO app is requesting, but consent has not yet been granted at the tenant level. Existing users who have previously logged in are unaffected because they have already consented individually.

**Steps to resolve:**

1. Have an Entra ID admin navigate to **Azure portal → Enterprise Applications → [your dbt app] → Permissions**.
2. Click **Grant admin consent** for the organization. This grants consent on behalf of all users in the tenant and prevents the prompt from appearing for new users going forward.
3. Once granted, have the affected users retry logging in.

</Expandable>

{/* TODO: Needs engineering sign-off — DO NOT publish until confirmed. Root cause was never reproduced or confirmed in Datadog. Steps below are best-effort guidance only. */}
<Expandable alt_header='"This SSO endpoint is disabled. Please contact your administrator to have them update your IdP SSO settings to use Auth0 instead."'>

This error appears when your IdP is misconfigured and the callback URL is pointing to <Constant name="dbt_platform" /> instead of Auth0. Your admin will need to update the IdP configuration and ensure it uses all the correct IdP values provided in **Account settings → Single Sign-On**.

</Expandable>
