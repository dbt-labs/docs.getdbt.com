---
title: "Manage user licenses with SCIM"
description: "Automate license assignment for Okta users via SCIM."
id: "scim-manage-user-licenses"
sidebar_label: "Manage user licenses with SCIM"
---

# Manage user licenses with SCIM <Lifecycle status="managed, managed_plus" />

You can manage user license assignments using System for Cross-Domain Identity Management (SCIM) and a user attribute in Okta, so the license type is set as users are provisioned and onboarded.

:::info SCIM license mapping available for Okta only
SCIM license mapping is currently only supported for Okta. For other providers, use [SSO license mapping](/docs/platform/manage-access/seats-and-users#mapped-configuration) or manage [licenses](/docs/platform/manage-access/seats-and-users) in the <Constant name="dbt_platform" /> user interface.
:::

#### Considerations
Before you enable SCIM license mapping:
- **Default license**: New users are assigned a Developer license unless you change it manually using [SSO license mappings](/docs/platform/manage-access/seats-and-users#mapped-configuration), or using SCIM.
- **Best practice**: Use one source of truth for license assignment (either <Constant name="dbt_platform" /> or SCIM). Don't mix SCIM license management with manual or single sign-on (SSO) mapping changes.
- **Analyst license**: Only available on [select plans](/docs/platform/manage-access/seats-and-users). Assigning this license using SCIM will return an error if that license type isn't available for your account. The [Analyst license type](/docs/platform/manage-access/about-user-access?version=1.12#licenses) is not available for new purchase.

## Enable SCIM license mapping

To use license management using SCIM, go to your **Account settings** > **SSO & SCIM**. Under the **SCIM** section, enable **Manage user licenses with SCIM**. This setting enforces license type for a user based on their SCIM attribute and disable the license mapping and manual configuration set up in dbt.
<Lightbox src="/img/docs/dbt-platform/access-control/scim-managed-licenses.png" width="60%" title="Enable SCIM managed user license distribution." />

We recommend that you complete the setup instructions for your identity provider (IdP) prior to enabling this toggle in your dbt account. Once enabled, any existing license mappings in <Constant name="dbt" /> will be ignored.

:::info Microsoft Entra ID users
Do not enable the **Manage user licenses with SCIM** if you use Microsoft Entra ID. SCIM-native license attributes aren't supported for Entra ID, so enabling this toggle would disable your existing SSO license mappings without a replacement, leaving users without license mapping.

Instead, keep this toggle _disabled_ and use [SSO-based Active Directory group > license mapping](/docs/platform/manage-access/seats-and-users#mapped-configuration). This setup works alongside an active Entra ID SCIM configuration.
:::

The recommended steps for migrating to SCIM license mapping are as follows:
1. Set up SCIM but keep the toggle disabled so existing license mappings continue to work as expected.
2. Configure license attributes in your IdP.
3. Test that SCIM attributes are being used to set license type in <Constant name="dbt" />.
4. Enable the toggle to ignore existing license mappings so that SCIM is the source of truth for assigning licenses to users.

## Enterprise default groups

On the Enterprise licensing page, the following default groups are available. These are often used for initial setup but should be managed or removed once IdP groups are successfully synced via SCIM.

| Group | Access permissions |
|-------|---------------------|
| **Owner** | Full access to account features and billing. |
| **Member** | Robust access to the account with restrictions on billing and security settings. Users in the Member group are assigned a Developer license by default. |
| **Everyone** | A catch-all group for all users. This group does not have permission assignments beyond the user's profile. Users must be assigned to the Member or Owner group to work in dbt. |

:::tip Best practice
After creating and syncing your specific IdP groups, remove users from these default groups to ensure that SCIM remains the single source of truth for permissions and licensing. Once all users have been removed, you can also delete the groups altogether.
:::

## Automated license mapping

Automating license assignments is available for Okta only. It's a common strategy to reduce administrative overhead. For SSO-based license mapping (for example, Entra ID), see [Mapped configuration](/docs/platform/manage-access/seats-and-users#mapped-configuration).

#### Define IdP groups

A common strategy involves defining two primary groups in your IdP, for example:
- `dbt_developers`
- `dbt_read_only`

#### Fundamental licensing rules

Understanding these rules will help you plan your group structure in Okta:

- **Default assignment:** When someone new is added to your account, they automatically receive a Developer license unless you configure otherwise.
- **Mapping basis:** The license someone receives is determined by which groups they belong to in your identity provider (Okta) &mdash; not by groups you create in <Constant name="dbt_platform" />. In other words, your Okta groups are the source of truth. When you add or remove someone from a group in Okta, their license in <Constant name="dbt_platform" /> updates automatically to match.

#### Mapping logic and precedence

With SSO license mapping, the Developer license takes precedence over all other licenses. With SCIM license mapping (Okta), precedence depends on your configuration &mdash; whether you assign the license attribute directly to the user or derive it from group membership through the expression in your Okta Profile Editor.

When you use groups like `dbt_developers` and `dbt_read_only`, a user might be in one group, both groups, or neither. The following table shows one common scenario (group-based mapping) and can be useful when you're deciding how to structure your groups or troubleshooting why someone received a particular license.

Users in the Enterprise default group **Member** are assigned a **Developer** license by default. Until you remove users from **Member** (per the [best practice](#enterprise-default-groups) earlier), that default applies when they're not in any IdP license-mapping groups. Once you enable SCIM license mapping, the IdP group mapping overrides the Member default.

**SSO license mapping (IdP group-based):**
| In `dbt_developers` group? | In `dbt_read_only` group? | License assigned |
|----------------------|---------------------|------------------|
| No | No | Developer (Member default or default for new users) |
| No | Yes | Read-Only |
| Yes | No | Developer |
| Yes | Yes | Developer (Developer takes precedence) |

## Add license type attribute for Okta

To add the attribute for license types to your Okta environment:

1. From your Okta application, navigate to the **Provisioning** tab, scroll down to **Attribute Mappings**, and click **Go to Profile Editor**.
2. Click **Add Attribute**.
3. Configure the attribute fields as follows (the casing should match for each value):
    - **Data type:** `string`
    - **Display name:** `License Type`
    - **Variable name:** `licenseType`
    - **External name:** `licenseType`
    - **External namespace:** `urn:ietf:params:scim:schemas:extension:dbtLabs:2.0:User`
    - **Description:** An arbitrary string of your choosing.
    - **Enum:** Select the box for **Define enumerated list of values**.
    - **Attribute members:** Add the initial attribute and then click **Add another** until each license type is defined. We recommend adding all of the values even if you don't use them today, so they'll be available in the future. Refer to the following table for the values you can use.
        | Display name | Value |
        |--------------|-------|
        | **IT**       | `it`  |
        | **Analyst**  | `analyst` |
        | **Developer**| `developer` |
        | **Read Only**| `read_only` |

    The **Analyst** license is only available on [select plans](/docs/platform/manage-access/seats-and-users). It is not available for new purchase.

    - **Attribute type:** Group

    <Lightbox src="/img/docs/dbt-platform/access-control/scim-license-attributes.png" width="60%" title="Enter the fields as they appear in the image. Ensure the cases match." />

4. **Save** the attribute mapping.
Users can now have license types set in their profiles and when they are being provisioned.
    <Lightbox src="/img/docs/dbt-platform/access-control/scim-license-provisioning.png" width="60%" title="Set the license type for the user in their Okta profile." />

## Automate license assignments with Okta groups

To automate seat assignments in Okta, use the Profile Editor to map Okta group memberships to dbt license types.

1. Create groups in Okta, for example:
   - `dbt_developers`
   - `dbt_read_only`

2. Within the dbt app Profile Editor in Okta, create mapping rules for Okta users to dbt app users:
   - **Attribute:** `licenseType` 
   - **Logic (Expression):** `(isMemberOfGroupName("dbt_developers") ? 'developer' : 'read_only')`
   - **Default behavior:** Users not in the `dbt_developers` group will default to Read-Only.

Adding or removing users from these Okta groups automatically updates their dbt app profile and triggers a SCIM update to synchronize the `licenseType` in <Constant name="dbt" />. Admins also have the option of using **Manual Push** in the Okta app to synchronize the changes.
