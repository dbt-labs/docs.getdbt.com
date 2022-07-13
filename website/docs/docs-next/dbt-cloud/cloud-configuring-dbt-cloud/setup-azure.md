---
title: "Set up Azure DevOps"
id: "setup-azure"
description: "You can set up your Azure DevOps by creating an Azure AD app and adding it to dbt Cloud."
sidebar_label: "Set up Azure DevOps"
---

<Snippet src="available-beta-banner" />

<Snippet src="available-enterprise-tier-only" />

## Overview

To use our native integration with Azure DevOps in dbt Cloud, an account admin needs to set up an Azure Active Directory (Azure AD) app.

1. [Register an Azure AD app](#register-an-azure-ad-app).
2. [Add permissions to your new app](#add-permissions-to-your-new-app).
3. [Add another redirect URI](#add-another-redirect-URI).
4. [Connect Azure DevOps to your new app](#connect-azure-devops-to-your-new-app).
5. [Add your Azure AD app to dbt Cloud](#add-your-azure-ad-app-to-dbt-cloud).

Once the the Azure AD app is added to dbt Cloud, an account admin must also connect a service user via OAuth, which will be used to power headless actions in dbt Cloud such as scheduled runs and CI.
1. [Connecting a Service User](#connecting-a-service-user).


Once the Azure AD app added to dbt Cloud and the service user is connected, then dbt Cloud developers can personally authenticate in dbt Cloud from Azure DevOps. For more on this, see [Authenticate with Azure DevOps](docs/dbt-cloud/cloud-configuring-dbt-cloud/authenticate-azure).

## Register an Azure AD app

1. Sign into you Azure portal and click **Azure Active Directory** under Azure services.
2. Select **App registrations** in the left panel.
3. Select **New registration**. The form for creating a new Active Directory app opens.
4. Provide a name for your app. We recommend using, "dbt Labs Azure DevOps App".
5. Select **Accounts in any organizational directory (Any Azure AD directory - Multitenant)** as the Supported Account Types.
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
5. Select the **user_impersonation** permission.

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

Connect Azure DevOps to the Active Directory App you just created:

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
    - **Azure DevOps Organization:** Must match the name of your Azure DevOps organization exactly.
    - **Application (client) ID:** Found in the Azure AD App.
    - **Client Secrets:** Need to first create in the Azure AD App under "Client credentials." You are responsible for the Azure AD app secret expiration and rotation. 
        - Note: Copy the "Value" field in the Azure AD App and paste it in the "Client Secret" field in dbt Cloud. 
       
    - **Directory(tenant) ID:** Found in the Azure AD App.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/Azure Devops App in dbt Cloud.gif" title="Adding an Active Directory App to dbt Cloud"/>


Your Azure AD app should now be added to your dbt Cloud Account. People on your team who want to develop in dbt Cloud's IDE can now personally [authorize Azure DevOps from their profiles](dbt-cloud/cloud-configuring-dbt-cloud/authenticate-azure).

## Connecting a service user
Because Azure DevOps forces all authentication to be linked to a user's permissions, we recommend you create a "service user" to manage access to your dbt Cloud account. For dbt Cloud scheduled runs, you should avoid linking authentication to an individual Azure DevOps user. Primarily this prevents your dbt Cloud production runs from failing if the person leaves your organization causing a loss of read access for the dbt repository. 

A "service user" account is a pseudo user account in Azure DevOps with read access to all dbt repos for the whole dbt Cloud account. This account enables you to scope permissions appropriately and preserve access. 

If you don't want to create a separate Azure DevOps user, you can link scheduled runs to an admin profile who has appropriate read access to the dbt repositories, but we don't recommended approach, as you could over permission the service user or risk losing read access should the admin leave your organization. dbt Cloud will refresh the service user's OAuth access token regularly behind the scenes.

:::info  Azure DevOps admin must grant read access to the service user
This service user's permissions will also power which repos a team can select from during dbt project set up, so an Azure DevOps admin must grant read access to the service user before setting up a project in dbt Cloud.
:::

To connect the service user:
1. An admin must first be signed into the service user's Azure DevOps account.
2. The admin should click **Link Azure Service User** in dbt Cloud.
3. The admin will be directed to Azure DevOps and must accept the Azure AD app's permissions.
4. Finally, the admin will be redirected to dbt Cloud, and the service user will be connected.
<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/azure-service-user.png" title="Connecting an Azure Service User"/>

Once connected, dbt Cloud displays the email address of the service user so you know which user's permissions are enabling headless actions in deployment environments. To change which account is connected, disconnect the profile in dbt Cloud, sign into the alternative Azure DevOps service account, and re-link the account in dbt Cloud.

:::info Service user authentication expiration
dbt Cloud will refresh the authentication for the service user on each run triggered by the scheduler, API, or CI. If your account does not have any active runs for over 90 days, an admin will need to manually refresh the authentication of the service user by disconnecting and reconnecting the service user's profile via the OAuth flow described above.

:::
