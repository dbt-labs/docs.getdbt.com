---
title: "Set up Azure DevOps"
id: "setup-azure"
description: "You can set up your Azure DevOps by creating an Azure AD app and adding it to dbt Cloud."
sidebar_label: "Set up Azure DevOps"
---

## Overview

To use Azure Active Directory (Azure AD) for identity and access management in dbt Cloud, an account admin needs to set up an Azure AD app:

1. [Register an Azure AD app](#register-an-azure-ad-app) in Azure DevOps.
2. [Add permissions to your new app](#add-permissions-to-your-new-app).
3. [Connect Azure DevOps to your new app](#connect-azure-devops-to-your-new-app).
4. [Add your Azure AD app to dbt Cloud](#add-your-azure-ad-app-to-dbt-cloud).

Once the the Azure AD app is added to dbt Cloud, an account admin must also connect a service user via OAuth, which will be used to power headless actions in dbt Cloud such as scheduled runs and CI.
1. [Connecting a Service User](#connecting-a-service-user).

Once the Azure AD app added to dbt Cloud and the service user is connected, then dbt Cloud developers can personally authenticate in dbt Cloud from Azure DevOps. For more on this, see [Authenticate with Azure DevOps](docs/dbt-cloud/cloud-configuring-dbt-cloud/authenticate-azure).

:::info Beta feature
This feature is currently in Beta. If you are interested in getting access to the beta, please reach out to support@getdbt.com.
:::

## Register an Azure AD app

1. Sign into you Azure DevOps account and click **Azure AD**.
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

You will also need to add an additional redirect URI to your Azure AD application which will be used to authenticate the service user for headless actions in deployment environments.

1. Navigate to your Azure AD application.
2. Select the link next to **Redirect URIs**
3. Add an additional URI `https://cloud.getdbt.com/complete/azure_active_directory_service_user`. If you have a custom dbt Cloud URL be sure to use the appropriate domain.
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
    - **Client secrets:** Need to first create in the Azure AD App under "Client credentials." You are responsible for the Azure AD app secret expiration and rotation.
    - **Directory(tenant) ID:** Found in the Azure AD App.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/Azure Devops App in dbt Cloud.gif" title="Adding an Active Directory App to dbt Cloud"/>


Your Azure AD app should now be added to your dbt Cloud Account. People on your team who want to develop in dbt Cloud's IDE can now personally [authorize Azure DevOps from their profiles](dbt-cloud/cloud-configuring-dbt-cloud/authenticate-azure).

## Connecting a service user
Azure DevOps' permissions are tightly coupled to a developer's identity. However, in deployment environments in dbt Cloud, we don't want runs to be tied to an individual's identity as that would create production problems should an individual lose access to a dbt project repository. We encourage our customers to create service account users in Azure DevOps for the purposes of powering headless actions in dbt Cloud deployment environments. This service user must have read access to all dbt repos across projects in the dbt Cloud account. dbt Cloud will refresh the OAuth access token regularly.

This service user's permissions will also power which repos a team can select from during dbt project set up, so an Azure DevOps admin must grant read access to the service user before setting up a project in dbt Cloud.

To connect the service user:
1. An admin must first be signed into the service user's Azure DevOps account.
2. The admin should click **Link Azure Service User** in dbt Cloud.
3. The admin will be directed to Azure DevOps and must accept the Azure AD app's permissions.
4. Finally, the admin will be redirected to dbt Cloud, and the service user will be connected.
<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/azure-service-user.png" title="Connecting an Azure Service User"/>

Once connected, dbt Cloud will display the email address of the service user so as to explicitly show which user's permissions are enabling headless actions in deployment environments. To change which account is connected, disconnect the profile in dbt Cloud, sign into the alternative Azure DevOps service account, and re-link the account in dbt Cloud.