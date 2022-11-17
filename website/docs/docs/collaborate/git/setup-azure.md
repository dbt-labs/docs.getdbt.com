---
title: "Set up Azure DevOps"
id: "setup-azure"
description: "You can set up your Azure DevOps by creating an Azure AD app and adding it to dbt Cloud."
sidebar_label: "Set up Azure DevOps"
---

<Snippet src="available-enterprise-tier-only" />

## Overview

To use our native integration with Azure DevOps in dbt Cloud, an account admin needs to set up an Azure Active Directory (Azure AD) app. We recommend setting up a separate [Azure AD application than used for SSO](/docs/collaborate/manage-access/set-up-sso-azure-active-directory).

1. [Register an Azure AD app](#register-an-azure-ad-app).
2. [Add permissions to your new app](#add-permissions-to-your-new-app).
3. [Add another redirect URI](#add-another-redirect-URI).
4. [Connect Azure DevOps to your new app](#connect-azure-devops-to-your-new-app).
5. [Add your Azure AD app to dbt Cloud](#add-your-azure-ad-app-to-dbt-cloud).

Once the the Azure AD app is added to dbt Cloud, an account admin must also connect a service user via OAuth, which will be used to power headless actions in dbt Cloud such as deployment runs and CI.
1. [Connecting a Service User](#connecting-a-service-user).


Once the Azure AD app is added to dbt Cloud and the service user is connected, then dbt Cloud developers can personally authenticate in dbt Cloud from Azure DevOps. For more on this, see [Authenticate with Azure DevOps](/docs/collaborate/git/authenticate-azure).

## Register an Azure AD app

1. Sign into your Azure portal and click **Azure Active Directory** under Azure services.
2. Select **App registrations** in the left panel.
3. Select **New registration**. The form for creating a new Active Directory app opens.
4. Provide a name for your app. We recommend using, "dbt Labs Azure DevOps App".
5. Select **Accounts in any organizational directory (Any Azure AD directory - Multitenant)** as the Supported Account Types.
Many customers ask why they need to select Multitenant instead of Single tenant, and they frequently get this step wrong. Microsoft considers Azure DevOps (formerly called Visual Studio) and Azure Active Directory as separate tenants, and in order for this Active Directory application to work properly, you must select Multitenant.
6. Add a redirect URI by selecting **Web** and typing in `https://cloud.getdbt.com/complete/azure_active_directory`. If you have a custom dbt Cloud URL be sure to use the appropriate domain.
7. Click **Register**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/ADnavigation.gif" title="Navigating to the Azure AD app registrations"/>

Here's what your app should look before registering it:

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD app.png" title="Registering an Active Directory app"/>


## Add permissions to your new app

Provide your new app access to Azure DevOps:

1. Select **API permissions** in the left navigation panel.
2. Remove the **Microsoft Graph / User Read** permission.
3. Click **Add a permission**.
4. Select **Azure DevOps**.
5. Select the **user_impersonation** permission. This is the only permission available for Azure DevOps.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/user-impersonation.gif" title="Adding permissions to the app"/>

## Add another redirect URI

You also need to add another redirect URI to your Azure AD application. This redirect URI will be used to authenticate the service user for headless actions in deployment environments.

1. Navigate to your Azure AD application.
2. Select the link next to **Redirect URIs**
3. Click **Add URI** and add the URI, making sure to use the appropriate domain if you have a custom dbt Cloud URL:
`https://cloud.getdbt.com/complete/azure_active_directory_service_user`
4. Click **Save**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/redirect-uri.gif" title="Adding the Service User redirect URI"/>




## Connect Azure DevOps to your new app
If you have already connected your Azure DevOps account to Active Directory, then you can proceed to [Connecting a service user](#connecting-a-service-user). However, if you're just getting set up, connect Azure DevOps to the Active Directory App you just created:

1. From your Azure DevOps account, select **Organization settings** in the bottom left.
2. Navigate to Azure Active Directory.
3. Click **Connect directory**.
4. Select the directory you want to connect.
5. Click **Connect**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/connect AD to Azure DevOps.gif" title="Connecting Azure DevOps and Active Directory"/>

## Add your Azure AD app to dbt Cloud

Once you connect your Azure AD app and Azure DevOps, you need to provide dbt Cloud information about the app:

1. Navigate to your account settings in dbt Cloud.
2. Select **Integrations**.
3. Scroll to the Azure DevOps section.
4. Complete the form:
    - **Azure DevOps Organization:** Must match the name of your Azure DevOps organization exactly. Do not include the `dev.azure.com/` prefix in this field. ✅ Use `my-devops-org` ❌ Avoid `dev.azure.com/my-devops-org`
    - **Application (client) ID:** Found in the Azure AD App.
    - **Client Secrets:** You need to first create a secret in the Azure AD App under **Client credentials**. Make sure to copy the **Value** field in the Azure AD App and paste it in the **Client Secret** field in dbt Cloud. You are responsible for the Azure AD app secret expiration and rotation.
    - **Directory(tenant) ID:** Found in the Azure AD App.
        <Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AzureDevopsAppdbtCloud.gif" title="Adding an Active Directory App to dbt Cloud"/>

Your Azure AD app should now be added to your dbt Cloud Account. People on your team who want to develop in dbt Cloud's IDE can now personally [authorize Azure DevOps from their profiles](/docs/collaborate/git/authenticate-azure).

## Connecting a service user

Because Azure DevOps forces all authentication to be linked to a user's permissions, we recommend you create a "service user" in Azure DevOps whose permissions will be used to power headless actions in dbt Cloud such as dbt Cloud project repo selection, deployment runs, and CI. A service user is a pseudo user set up in the same way an admin would set up a real user, but it's given permissions specifically scoped for service to service interactions. You should avoid linking authentication to a real Azure DevOps user because if this person leaves your organization, dbt Cloud will lose privileges to the dbt Azure DevOps repositories, causing production runs to fail.

### More on Service Users

A service user account must have the following Azure DevOps permissions for all Azure DevOps projects and repos you want accessible in dbt Cloud. Read more about how dbt Cloud uses each permission in the following paragraphs.

 - **Project Reader**
 - **ViewSubscriptions**
 - **EditSubscriptions**
 - **DeleteSubscriptions** *
 - **PullRequestContribute**
 - **GenericContribute**

\* Note: **DeleteSubscriptions** permission might be included in **EditSubscriptions** depending on your version of Azure.

Some of these permissions are only accessible via the Azure DevOps API, for which documentation can be found [here](https://docs.microsoft.com/en-us/azure/devops/organizations/security/namespace-reference?view=azure-devops). We’ve also detailed more information on Azure DevOps API usage below to help accelerate the set up. Alternatively, you can use the Azure DevOps UI to enable permissions, but you cannot get the least permissioned set.

:::info  Provide the service user with required permissions before setting up a dbt Cloud project
This service user's permissions will also power which repositories a team can select from during dbt project set up, so an Azure DevOps admin must grant at minimum Project Reader access to the service user before setting up a project in dbt Cloud.
:::

<details>
<summary>  <b>ViewSubscriptions</b> </summary>
<br></br>

**Security Namespace ID:** cb594ebe-87dd-4fc9-ac2c-6a10a4c92046

**Namespace:** ServiceHooks

**Permission:**
```json
{
    "bit": 1,
    "displayName": "View Subscriptions",
    "name": "ViewSubscriptions"
}
```

**Uses:** To view existing Azure DevOps service hooks subscriptions

**Token (where applicable - API only):**
- PublisherSecurity for access to all projects
- PublisherSecurity/<azure_devops_project_object_id> for per project access

**UI/API:** API only

</details>

<details>
<summary>  <b>EditSubscriptions</b> </summary>
<br></br>

**Security Namespace ID:** cb594ebe-87dd-4fc9-ac2c-6a10a4c92046

**Namespace:** ServiceHooks

**Permission:**
```json
{
    "bit": 2,
    "displayName": "Edit Subscription",
    "name": "EditSubscriptions"
}

```

**Uses:** To add or update existing Azure DevOps service hooks subscriptions

**Token (where applicable - API only):**
- PublisherSecurity for access to all projects
- PublisherSecurity/<azure_devops_project_object_id> for per project access

**UI/API:** API only

</details>

<details>
<summary>  <b>DeleteSubscriptions</b> </summary>
<br></br>

**Security Namespace ID:** cb594ebe-87dd-4fc9-ac2c-6a10a4c92046

**Namespace:** ServiceHooks

**Permission:**
```json
{
    "bit": 4,
    "displayName": "Delete Subscriptions",
    "name": "DeleteSubscriptions"
}


```

**Uses:** To delete any redundant Azure DevOps service hooks subscriptions


**Token (where applicable - API only):**
- PublisherSecurity for access to all projects
- PublisherSecurity/<azure_devops_project_object_id> for per project access

**UI/API:** API only

**Additional Notes:** This permission has been deprecated in recent Azure DevOps versions. Edit Subscriptions (bit 2) has Delete permissions.


</details>

<details>
<summary>  <b>PullRequestContribute</b> </summary>
<br></br>

**Security Namespace ID:** 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87

**Namespace:** Git Repositories

**Permission:**
```json
{ 	
    "bit": 16384,  
    "displayName": "Contribute to pull requests",
    "name": "PullRequestContribute"
}

```

**Uses:** To post Pull Request statuses to Azure DevOps


**Token (where applicable - API only):**
- repoV2 for access to all projects
- repoV2/<azure_devops_project_object_id> for per project access
- repoV2/<azure_devops_project_object_id>/<azure_devops_repository_object_id> for per repo access


**UI/API:** UI and API

**Additional Notes:** This permission is automatically inherited if Project Reader/Contributor/Administrator is set in the UI.


</details>

<details>
<summary>  <b>GenericContribute</b> </summary>
<br></br>

**Security Namespace ID:** 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87

**Namespace:** Git Repositories

**Permission:**
```json
{
    "bit": 4,
    "displayName": "Contribute",
    "name": "GenericContribute"
}


```

**Uses:** To post commit statuses to Azure DevOps


**Token (where applicable - API only):**
- repoV2 for access to all projects
- repoV2/<azure_devops_project_object_id> for access to a single project at a time
- repoV2/<azure_devops_project_object_id>/<azure_devops_repository_object_id> for access to a single repo at a time


**UI/API:** UI and API

**Additional Notes:** This permission is automatically inherited if Project Contributor/Administrator is set in the UI.


</details>

You must connect your service user before setting up a dbt Cloud project, as the the service user's permissions determine which projects dbt Cloud can import.

To connect the service user:
1. An admin must first be signed into the service user's Azure DevOps account.
2. The admin should click **Link Azure Service User** in dbt Cloud.
3. The admin will be directed to Azure DevOps and must accept the Azure AD app's permissions.
4. Finally, the admin will be redirected to dbt Cloud, and the service user will be connected.
<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/azure-service-user.png" title="Connecting an Azure Service User"/>

Once connected, dbt Cloud displays the email address of the service user so you know which user's permissions are enabling headless actions in deployment environments. To change which account is connected, disconnect the profile in dbt Cloud, sign into the alternative Azure DevOps service account, and re-link the account in dbt Cloud.

:::info Service user authentication expiration
dbt Cloud will refresh the authentication for the service user on each run triggered by the scheduler, API, or CI. If your account does not have any active runs for over 90 days, an admin will need to manually refresh the authentication of the service user by disconnecting and reconnecting the service user's profile via the OAuth flow described above in order to resume headless interactions like project set up, deployment runs, and CI.

:::
