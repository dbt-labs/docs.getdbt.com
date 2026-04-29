---
title: "Set up SCIM with Entra ID"
description: "Configure SCIM for Microsoft Entra ID to automate user and group provisioning."
id: "scim-entra-id"
sidebar_label: "Set up SCIM with Entra ID"
---

# Set up SCIM with Entra ID <Lifecycle status="managed, managed_plus" />

<Constant name="dbt_platform" /> supports System for Cross-Domain Identity Management (SCIM) with Microsoft Entra ID for user and group provisioning and profile updates.

Microsoft Entra ID doesn't support SCIM-native license mapping (the ability to assign licenses directly via a SCIM attribute, as Okta does). As a workaround, you can use [SSO-based Active Directory group → license mapping](/docs/platform/manage-access/seats-and-users#mapped-configuration) instead. This works even if you have an active Entra ID SCIM integration running alongside it.

When you use the SSO-based Active Directory group → license mapping setup, keep the **Manage user licenses with SCIM** (found in **Account settings > SSO & SCIM**) toggle disabled. Turning it on tells <Constant name="dbt_platform" /> to ignore existing SSO license mappings, which would remove license mapping entirely for Entra ID users.

## Prerequisites
- Available on [Enterprise or Enterprise+ plans](https://www.getdbt.com/pricing).
- You must use Entra ID as your single sign-on (SSO) provider and have it connected in the <Constant name="dbt_platform" />.
- You must have [permissions](/docs/platform/manage-access/enterprise-permissions) to configure the account settings in <Constant name="dbt_platform" />.
- Complete [setup SSO with Entra ID](/docs/platform/manage-access/set-up-sso-microsoft-entra-id) before configuring SCIM settings.
- Complete the [Set up SCIM](/docs/platform/manage-access/scim#set-up-dbt) to get your SCIM base URL and token.

## Set up Entra ID

1. Log in to your Azure account and open the **Entra ID** configurations.
2. From the sidebar, under **Manage**, click **Enterprise Applications**.
3. Click **New Application** and select the option to **Create your own application**.
    <Lightbox src="/img/docs/dbt-platform/access-control/create-your-own.png" width="60%" title="Create your own application." />
4. Give your app a unique name and ensure the **Integrate any other application you don't find in the gallery (Non-gallery)** field is selected. Ignore any prompts for existing apps. Click **Create**.
    <Lightbox src="/img/docs/dbt-platform/access-control/create-application.png" width="60%" title="Give your app a unique name." />
5. From the application **Overview** screen, click **Provision User Accounts**.
    <Lightbox src="/img/docs/dbt-platform/access-control/provision-user-accounts.png" width="60%" title="The 'Provision user accounts' option." />
6. From the **Create configuration** section, click **Connect your application**.
7. Fill out the form with the information from your dbt account:
    - The **Tenant URL** in Entra ID is your **SCIM base URL** from dbt.
    - The **Secret token** in Entra ID is your **SCIM token** from dbt.
8. Click **Test connection** and click **Create** once complete.
    <Lightbox src="/img/docs/dbt-platform/access-control/provisioning-config.png" width="60%" title="Configure the app and test the connection." />

## Attribute mapping

To map the attributes that will sync with dbt:

1. From the enterprise app **Overview** screen sidebar menu, click **Provisioning**. 
    <Lightbox src="/img/docs/dbt-platform/access-control/provisioning.png" width="60%" title="The Provisioning option on the sidebar." />
2. Under **Manage**, click **Provisioning** again.
3. Expand the **Mappings** section and click **Provision Microsoft Entra ID users**.
     <Lightbox src="/img/docs/dbt-platform/access-control/provision-entra-users.png" width="60%" title="Provision the Entra ID users." />
4. Select the box for **Show advanced options** and then click **Edit attribute list for customappsso**.
    <Lightbox src="/img/docs/dbt-platform/access-control/customappsso-attributes.png" width="60%" title="Click to edit the customappsso attributes." />
5. Scroll to the bottom of the **Edit Attribute List** window and find an empty field where you can add a new entry with the following fields: 
    - **Name:** `emails[type eq "work"].primary`
    - **Type:** `Boolean`
    - **Required:** True
    <Lightbox src="/img/docs/dbt-platform/access-control/customappsso-entry.png" width="60%" title="Add the new field to the entry list." />
6. Mark all of the fields listed in Step 10 below as `Required`.
    <Lightbox src="/img/docs/dbt-platform/access-control/mark-as-required.png" width="60%" title="Mark the fields as required." />    
7. Click **Save**.
8. Back on the **Attribute mapping** window, click **Add new mapping** and complete fields with the following:
    - **Mapping type:** `none`
    - **Default value if null (optional):** `True`
    - **Target attribute:** `emails[type eq "work"].primary`
    - **Match objects using this attribute:** `No`
    - **Matching precedence:** *Leave blank*
    - **Apply this mapping:** `Always`
    <Lightbox src="/img/docs/dbt-platform/access-control/edit-attribute.png" width="60%" title="Complete the fields as shown." />
9. Click **Ok**.
10. Make sure the following mappings are in place and delete any others:
    - **UserName:** `userPrincipalName` or the value you want users to leverage to log in to dbt. 
    - **active:** `Switch([IsSoftDeleted], , "False", "True", "True", "False")`
    - **emails[type eq "work"].value:** `userPrincipalName` is the most common, but this value needs to be the same set for **UserName**. 
    - **name.givenName:** `givenName`
    - **name.familyName:** `surname`
    - **externalid:** `mailNickname`
    - **emails[type eq "work"].primary** 
     <Lightbox src="/img/docs/dbt-platform/access-control/attribute-list.png" width="60%" title="Edit the attributes so they match the list as shown." />

    :::info SSO and SCIM username
    When you use both SSO and SCIM with Entra ID, map SCIM **UserName** to **userPrincipalName** (or the same Entra attribute users use to sign in to <Constant name="dbt_platform" />). Set **emails[type eq "work"].value** to that same source.  
    
    SCIM needs the values to match so provisioning aligns with SSO; if **UserName** and **emails[type eq "work"].value** don't match, users may not sync or match correctly.
    :::

11. Click **Save**.

You can now begin assigning users to your SCIM app in Entra ID!

## Assign users to SCIM app

The following steps go over how to assign users/groups to the SCIM app. Refer to Microsoft's [official instructions for assigning users or groups to an Enterprise App in Entra ID](https://learn.microsoft.com/en-us/azure/databricks/admin/users-groups/scim/aad#step-3-assign-users-and-groups-to-the-application) to learn more. Although the article is written for Databricks, the steps are identical.

1. Navigate to Enterprise applications and select the SCIM app.
2. Go to **Manage** > **Provisioning**.
3. To synchronize Microsoft Entra ID users and groups to dbt, click **Start provisioning**.
    <Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/access-control/scim-entraid-start-provision.png" width="80%" title="Start provisioning to synchronize users and groups." />
4. Navigate back to the SCIM app's overview page and go to **Manage** > **Users and groups**.
5. Click **Add user/group** and select the users and groups. 
       <Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/access-control/scim-entraid-add-users.png" width="80%" title="Add user/group." />
6. Click the **Assign** button.
7. Wait a few minutes. In the <Constant name="dbt_platform" />, confirm the users and groups exist in your dbt account.
    - Users and groups that you add and assign will automatically be provisioned to your dbt account when Microsoft Entra ID schedules the next sync.
    - By enabling provisioning, you immediately trigger the initial Microsoft Entra ID sync. Subsequent syncs are triggered every 20-40 minutes, depending on the number of users and groups in the application. Refer to Microsoft Entra ID's [Provisioning tips](https://learn.microsoft.com/en-us/azure/databricks/admin/users-groups/scim/aad#provisioning-tips) documentation for more information.
    - You can also prompt a manual provisioning outside of the cycle by clicking **Restart provisioning**.
    <Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/access-control/scim-entraid-manual.png" width="80%" title="Prompt manual provisioning." />

## FAQ and troubleshooting

For common questions about SCIM provisioning with Entra ID — including onboarding workflows, attribute matching, IP allowlisting issues, and troubleshooting — refer to [SCIM FAQs and troubleshooting](/docs/platform/manage-access/scim-faq).
