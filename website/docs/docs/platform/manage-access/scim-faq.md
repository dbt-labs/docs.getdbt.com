---
title: "SCIM FAQs and troubleshooting"
description: "Common questions and troubleshooting for SCIM provisioning in dbt platform"
id: "scim-faq"
sidebar: "SCIM FAQ and troubleshooting"
---

# SCIM FAQs and troubleshooting <Lifecycle status="managed, managed_plus" />

Find answers to common questions about configuring and using SCIM provisioning in <Constant name="dbt_platform" />, plus guidance for resolving common issues.

## FAQs

<Expandable alt_header="Do the userName and email.value fields have to be the same value for SCIM to work?">

Yes. Both must match the email address the user uses to sign in to <Constant name="dbt_platform" /> (email value on the user object in your IdP that's used to sign in). If they don't match, a validation error will occur during provisioning.

</Expandable>

<Expandable alt_header="What is the recommended workflow for onboarding new users through SCIM?">

#### Entra ID

Once SCIM provisioning is configured in Entra ID according to the schema requirements, provisioning begins automatically. Entra ID will sync users and groups assigned to the Entra app with <Constant name="dbt_platform" />.

**For users:**
- Matching is based on the `userName` (and `email.value`) field, which should be set to the user's email — the same email used in <Constant name="dbt_platform" /> and expected at sign-in.
- If a user with that email already exists in <Constant name="dbt_platform" />, they will be linked and become SCIM-managed.
- If no matching user exists, a new user will be provisioned and invited through email.

**For groups:**
- Matching is based on the group name.
- If a group with the same name exists in <Constant name="dbt_platform" />, it will be linked and become SCIM-managed.
- If no match exists, a new group will be created through SCIM.

**Important considerations:**
- Entra ID does not support importing existing users or groups into the app for SCIM — users and groups must already exist in Entra ID and be assigned to the app.
- To ensure users and groups become SCIM-managed, they must exist in both Entra and <Constant name="dbt_platform" /> with matching identifiers (email for users, name for groups).
- After setup, ongoing syncs automatically provision and manage any newly assigned users or groups in Entra.

#### Okta

Unlike Entra ID, Okta does not run continuous full syncs. You trigger initial provisioning manually, then Okta continues provisioning incrementally as changes are made.

When you enable SCIM on an existing Okta SSO app, trigger the initial sync (if there are existing users in the Okta app) using the **Provision Users** button in the Okta Assignments tab. This runs a one-time sync of users to <Constant name="dbt_platform" />. Okta doesn't provide a native way to re-run this full sync &mdash; which means reprocessing typically requires removing and re-adding users.

**For users:**
User matching is based on the `userName` (email) field, which must match the email used in <Constant name="dbt_platform"/>:

- If a match is found, Okta links the user and marks them as SCIM-managed.
- If no match is found, Okta provisions a new user.
- If users exist in <Constant name="dbt_platform"/> but not in Okta, you can import them into Okta to keep both systems aligned.

**For groups:**
- After initial user sync, assign new users to the Okta app to provision them automatically into <Constant name="dbt_platform" />.
- Manage group memberships with Okta's Push Groups feature, which pushes groups and memberships into <Constant name="dbt_platform" />.

For new Okta SSO applications with no assigned users, either manually assign users to the app to trigger provisioning, or import users from <Constant name="dbt_platform" /> into Okta first. Users must exist in both systems with matching emails to link correctly and avoid duplicates.

For larger rollouts, consider working with your IdP admin to plan based on your setup and [SCIM license mapping](/docs/platform/manage-access/scim-manage-user-licenses) to reduce manual steps.

</Expandable>

<Expandable alt_header="Do SSO group mappings still apply when SCIM is enabled?">

No. SSO group mappings do not apply to SCIM-managed users. For SCIM-managed users, group membership is controlled by your IdP.

SSO group mappings only apply to users who authenticate with SSO and are not SCIM-managed.

This means that if you have a dbt group with SSO mappings, those mappings will not be applied to users who have been provisioned through SCIM.

</Expandable>

<Expandable alt_header='What does "Allow manual updates" mean?'>

The **Allow manual updates** toggle determines whether admins can manually modify SCIM-managed users and groups in <Constant name="dbt_platform" />, including sending invites.


- **Disabled (default)**: Your IdP remains the source of truth for SCIM-managed users and groups. Manual changes to SCIM-managed users in <Constant name="dbt_platform"/> are blocked. This is the recommended setting because any manual changes made while enabled can be overwritten by later SCIM updates.
- **Enabled:** Admins can make manual changes to users in <Constant name="dbt_platform" /> alongside SCIM. This can be useful during initial setup and testing, but manual changes do not prevent SCIM from overriding them.

</Expandable>

<Expandable alt_header="What happens to existing users and groups when I enable SCIM?">

Enabling SCIM does not automatically convert existing users and groups to SCIM-managed status. Your IdP only manages users who have been explicitly assigned to the app and provisioned through SCIM.

To bring existing users and groups under SCIM management, assign them to the <Constant name="dbt_platform" /> app in your IdP and trigger a sync. Until a user is provisioned through SCIM, they remain unmanaged and are unaffected by SCIM sync operations.

</Expandable>

<Expandable alt_header="What happens when a user's email address changes in my IdP when SCIM is enabled?">

When a SCIM-managed user's email is updated in the IdP, <Constant name="dbt_platform" /> receives a SCIM request to update it. A confirmation email is sent to the new address, and once accepted, the change takes effect in <Constant name="dbt_platform" />.

</Expandable>

<Expandable alt_header="Does SCIM support automatic license assignment?">

SCIM-native license mapping (using a SCIM attribute) is supported for Okta only. For Okta license mapping setup, refer to [Manage user licenses with SCIM](/docs/platform/manage-access/scim-manage-user-licenses).

Althought Entra ID doesn't support SCIM-native license mapping, you can, however, use SSO-based Active Directory group → license mapping alongside your Entra ID SCIM setup. This approach works so long as the **Manage user licenses with SCIM** toggle (found in **Account settings > SSO & SCIM**) toggle stays disabled. 

- **Disabled (recommended)**: <Constant name="dbt_platform" /> honors your [SSO license mappings](/docs/platform/manage-access/seats-and-users#mapped-configuration) based on Entra ID group membership.
- **Enabled:** <Constant name="dbt_platform" /> ignores your SSO license mappings. Because Entra ID doesn't support SCIM-native license attributes, enabling this toggle effectively removes license mapping entirely for Entra ID users.

</Expandable>

<Expandable alt_header="Can I use Okta for SSO and Entra ID for SCIM (or vice versa)?">

SSO and SCIM should be configured using the same IdP. Using different providers — for example, Okta for SSO and Entra ID for SCIM &mdash; can cause discrepancies in user state and unintended behavior.

If your organization uses separate IdPs for authentication and directory management, contact your account team to discuss your options.

</Expandable>

---

## Troubleshooting

<Expandable alt_header='There is a "All users must have licenses on the account" error'>

This error occurs when a SCIM group push includes a user who hasn't been licensed in <Constant name="dbt_platform" /> yet &mdash; typically because they haven't accepted their invitation.

**Steps to resolve:**

1. Identify the user(s) causing the error from your IdP's provisioning logs.
2. Check whether those users have accepted their <Constant name="dbt_platform" /> invitation. Users are not licensed until they complete this step.
3. Once the user accepts and signs in, retry the group push from your IdP.
4. If the invitation has expired, remove the user from the push group temporarily, re-invite them using <Constant name="dbt_platform" />, have them accept, then re-add them to the group.

</Expandable>

<Expandable alt_header="Existing users and groups are not becoming SCIM-managed after enabling SCIM">

After enabling SCIM and completing the initial sync, pre-existing <Constant name="dbt_platform" /> users and groups do not show as SCIM-managed.

**Why this happens:** SCIM provisioning links an IdP identity to a <Constant name="dbt_platform" /> user record. Users created before SCIM was enabled don't have this link unless the IdP explicitly provisions them through SCIM.

**Steps to resolve:**

1. In your IdP, assign existing users to the <Constant name="dbt_platform" /> SCIM application.
2. Trigger a provisioning sync. The IdP will attempt to match users by their `userName` (typically their email address) and establish the SCIM-managed link.
    :::info Entra ID note
    For Entra ID, note that the provisioning sync is one-way (push only) — there is no import option to pull existing dbt users into Entra as a managed identity.
    :::
4. If users aren't being matched correctly after a sync, confirm that the `userName` and `email.value` attributes in your IdP exactly match the email on the user's <Constant name="dbt_platform" /> account, including case.

</Expandable>

<Expandable alt_header="Entra SCIM provisioning fails due to IP allowlisting">

If your <Constant name="dbt_platform" /> account has **IP restrictions** enabled, Entra's SCIM provisioning requests may be blocked. Azure's provisioning service IPs rotate approximately every two weeks and can't be statically allowlisted.

**Recommended approach:**

1. Filter to the `AzureActiveDirectory` service tag in [Azure's published IP ranges JSON](https://www.microsoft.com/en-us/download/details.aspx?id=56519) rather than allowlisting all Azure IPs.
2. Use the <Constant name="dbt_platform" /> Admin API with a service token to update your IP allowlist on a schedule &mdash; for example, a weekly script that pulls the current `AzureActiveDirectory` ranges and updates your allowlist through the API.

Contact [support@getdbt.com](mailto:support@getdbt.com) for guidance on using the Admin API for allowlist management.

</Expandable>
