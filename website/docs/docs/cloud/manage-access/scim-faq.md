---
title: "SCIM FAQs and troubleshooting"
description: "Common questions and troubleshooting for SCIM provisioning in dbt platform"
id: "scim-faq"
sidebar: "SCIM FAQ and troubleshooting"
---

# SCIM FAQ and troubleshooting <Lifecycle status="managed, managed_plus" />

Find answers to common questions about configuring and using SCIM provisioning in <Constant name="dbt_platform" />, plus guidance for resolving common issues.

## FAQs

<Expandable alt_header="Do the userName and email.value fields have to point to the same value in SCIM?">

Yes. They must match the email value on the user object in your IdP that's used to sign in to <Constant name="dbt_platform" />. If they don't match, a validation error will occur during user provisioning.

</Expandable>

<Expandable alt_header="What is the recommended workflow for onboarding new users through SCIM?">

#### Entra ID

Once SCIM provisioning is configured in Entra according to the schema requirements, provisioning begins automatically. Entra will sync users and groups assigned to the Entra app with <Constant name="dbt_platform" />.

**For users:**
- Matching is based on the `userName` (and `email.value`) field, which should be set to the user's email — the same email used in <Constant name="dbt_platform" /> and expected at sign-in.
- If a user with that email already exists in <Constant name="dbt_platform" />, they will be linked and become SCIM-managed.
- If no matching user exists, a new user will be provisioned and invited through email.

**For groups:**
- Matching is based on the group name.
- If a group with the same name exists in <Constant name="dbt_platform" />, it will be linked and become SCIM-managed.
- If no match exists, a new group will be created through SCIM.

**Important considerations:**
- Entra does not support importing existing users or groups into the app for SCIM — users and groups must already exist in Entra and be assigned to the app.
- To ensure users and groups become SCIM-managed, they must exist in both Entra and <Constant name="dbt_platform" /> with matching identifiers (email for users, name for groups).
- After setup, ongoing syncs automatically provision and manage any newly assigned users or groups in Entra.

#### Okta

SCIM provisioning with Okta differs from Entra in that it does not perform continuous full syncs. Instead, provisioning is initiated manually for the initial setup and then continues incrementally as changes are made.

When SCIM is enabled on an existing Okta SSO application, you must trigger the initial sync (if there are existing users in the Okta app) using the **Provision Users** button in the Okta Assignments tab. This performs a one-time synchronization of users to <Constant name="dbt_platform" />. Okta does not provide a native way to re-run this full sync, so reprocessing typically requires removing and re-adding users.

User matching is based on the `userName` (email) field. This field must match the email used by the user in <Constant name="dbt_platform" />. If a matching user exists, they will be linked and become SCIM-managed. If no match is found, a new user will be provisioned. Alternatively, if users exist in <Constant name="dbt_platform" /> but not in Okta, they can be imported into Okta to ensure alignment between the two systems.

After the initial provisioning, any new users assigned to the Okta app will be automatically provisioned into <Constant name="dbt_platform" />. Once users are in sync, group memberships can be managed through Okta's Push Groups feature, which allows groups and their memberships to be pushed into <Constant name="dbt_platform" />.

For new Okta SSO applications with no assigned users, you can either manually assign users to the app (which will trigger provisioning), or import users from <Constant name="dbt_platform" /> into Okta before syncing. Ensuring that users exist in both systems and that their emails match is critical for proper linking and avoiding duplicate user creation.

For larger rollouts, consider working with your IdP admin to plan based on your setup and [SCIM license mapping](/docs/cloud/manage-access/scim-manage-user-licenses) to reduce manual steps.

</Expandable>

<Expandable alt_header="Do SSO group mappings still apply when SCIM is enabled?">

No. For users who are provisioned and managed through SCIM, SSO group mappings are bypassed entirely. Group membership for SCIM-managed users is controlled by your IdP. SSO group mappings only apply to users who authenticate through SSO and are not SCIM-managed.

This means that if you have a dbt group with SSO mappings, those mappings will not be applied to users who have been provisioned through SCIM.

</Expandable>

<Expandable alt_header='What does "Allow manual updates" mean?'>

The **Allow manual updates** toggle controls whether an admin can manually update SCIM-managed entities, including the ability to send invites.

- **Disabled (default):** All user and group management is deferred entirely to your IdP. Manual changes in <Constant name="dbt_platform" /> to SCIM-managed users are blocked. This is the recommended setting, as any manual changes made while enabled can be overridden by subsequent SCIM requests.
- **Enabled:** Admins can make manual changes to users in <Constant name="dbt_platform" /> alongside SCIM. This can be useful during initial setup and testing, but manual changes do not prevent SCIM from overriding them.

</Expandable>

<Expandable alt_header="What happens to existing users and groups when I enable SCIM?">

Existing users and groups in <Constant name="dbt_platform" /> are not automatically converted to SCIM-managed status when you first enable SCIM. Your IdP will only manage users that have been explicitly assigned to the <Constant name="dbt_platform" /> application in their IdP and provisioned with SCIM.

To bring existing users under SCIM management, assign them to the <Constant name="dbt_platform" /> app in your IdP and trigger a sync. Until a user is provisioned with SCIM, they remain unmanaged and are unaffected by SCIM sync operations.

</Expandable>

<Expandable alt_header="What happens when a user's email address changes in my IdP when SCIM is enabled?">

If the user is SCIM-managed, when their email is updated in the IdP, <Constant name="dbt_platform" /> will receive a request from SCIM to update their email. An email will be sent to the new address to confirm the change. Once accepted, the user's email will be updated in <Constant name="dbt_platform" />.

</Expandable>

<Expandable alt_header="Does SCIM support automatic license assignment?">

SCIM license mapping is supported for Okta. It is not supported for Microsoft Entra ID — however, SSO license mapping is supported for Entra ID and can be configured that way.

For Okta license mapping setup, see [Manage user licenses with SCIM](/docs/cloud/manage-access/scim-manage-user-licenses).

</Expandable>

<Expandable alt_header="Can I use Okta for SSO and Entra ID for SCIM (or vice versa)?">

This is not a recommended configuration. SSO and SCIM should be configured using the same IdP to avoid discrepancies in user state between SCIM and SSO, which could cause unintended behavior. If your organization has separate IdPs for authentication and directory management, contact your account team to discuss your options.

</Expandable>

---

## Troubleshooting

<Expandable alt_header='"All users must have licenses on the account" error'>

This error occurs when a SCIM group push includes a user who has not yet been licensed in <Constant name="dbt_platform" /> — typically because the user hasn't accepted their invitation yet.

**Steps to resolve:**

1. Identify the user(s) causing the error from your IdP's provisioning logs.
2. Check whether those users have accepted their <Constant name="dbt_platform" /> invitation. Users are not licensed until they complete this step.
3. Once the user accepts their invitation and signs in, retry the group push from your IdP.
4. If the invitation has expired, remove the user from the push group temporarily, re-invite them using <Constant name="dbt_platform" />, have them accept, and then re-add them to the push group.

</Expandable>

<Expandable alt_header="Existing users and groups are not becoming SCIM-managed after enabling SCIM">

After enabling SCIM and completing the initial sync, pre-existing <Constant name="dbt_platform" /> users and groups do not show as SCIM-managed.

**Why this happens:** SCIM provisioning creates a managed association between an IdP identity and a <Constant name="dbt_platform" /> user record. Users created before SCIM was enabled do not have this association unless the IdP explicitly provisions them through SCIM.

**Steps to resolve:**

1. In your IdP, assign existing users to the <Constant name="dbt_platform" /> SCIM application.
2. Trigger a provisioning sync. The IdP will attempt to match existing users by their `userName` (typically email address) and establish the SCIM-managed link.
3. For Entra ID, note that the provisioning sync is one-way (push only) — there is no import option to pull existing dbt users into Entra as a managed identity.
4. If users are not being matched correctly after a sync, confirm that the `userName` attribute in your IdP matches the email address on the user's <Constant name="dbt_platform" /> account exactly, including case.

</Expandable>

<Expandable alt_header="Azure SCIM provisioning fails due to IP allowlisting">

If your <Constant name="dbt_platform" /> account has **IP restrictions** enabled, Azure's SCIM provisioning requests may be blocked because Azure's provisioning service IPs rotate approximately every two weeks and cannot be statically allowlisted.

**Recommended approach:**

1. Filter to the `AzureActiveDirectory` service tag in [Azure's published IP ranges JSON](https://www.microsoft.com/en-us/download/details.aspx?id=56519) rather than allowlisting all Azure IPs.
2. Use the <Constant name="dbt_platform" /> Admin API with a service token to programmatically update your IP allowlist on a schedule (for example, a weekly script that pulls the current `AzureActiveDirectory` ranges and updates your allowlist through the API).

Contact [support@getdbt.com](mailto:support@getdbt.com) for guidance on using the Admin API for allowlist management.

</Expandable>
