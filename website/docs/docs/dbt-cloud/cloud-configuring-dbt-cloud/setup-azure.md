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

Once the Azure AD app is set up and added to dbt Cloud, then dbt Cloud developers can personally authenticate in dbt Cloud from Azure DevOps. For more on this, see [Authenticate with Azure DevOps](docs/dbt-cloud/cloud-configuring-dbt-cloud/authenticate-azure).

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

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/ADnavigation.gif" title="Navigating to the AD app registrations"/>

Here's what your app should look before registering it:

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD app.png" title="Registering an Active Directory app"/>

## Add permissions to your new app

Provide your new app access to Azure DevOps:

1. Select **API permissions** in the left navigation panel.
2. Remove the "Microsoft Graph / User Read" permission.
3. Click **Add a permission**.
4. Select **Azure DevOps**.
5. Select the **user_impersonation** permission.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/user-impersonation.gif" title="Adding permissions to the app"/>

## Connect Azure DevOps to your new app

Connect Azure DevOps to the Active Directory App you just created:

1. From your Azure DevOps account, select **Organization settings** in the bottom left.
2. Navigate to Azure Active Directory.
3. Click **Connect directory**.
4. Select the directory you want to connect.
5. Click **Connect**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/connect AD to Azure DevOps.gif" title="Connecting Azure DevOps and Active Directory"/>

## Add your Azure AD app to dbt Cloud

Once you connect Azure AD app and Azure DevOps, you need to provide dbt Cloud information about the app:

1. Navigate to your account settings in dbt Cloud.
2. Select **Integrations**.
3. Scroll to the Azure DevOps section.
4. Complete the form:
    - **Azure DevOps Organization:** Must match the name of your Azure DevOps organization exactly.
    - **Application (client) ID:** Found in the Azure AD App.
    - **Client secrets:** Need to first create in the Azure AD App under "Client credentials." You are responsible for the Azure AD app secret expiration and rotation.
    - **Directory(tenant) ID:** Found in the Azure AD App.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/Azure Devops App in dbt Cloud.gif" title="Adding an Active Directory App to dbt Cloud"/>


Your Azure AD app should now be added to your dbt Cloud Account. People on your team who want to develop in dbt Cloud's <Term id="ide" /> can now personally [authorize Azure DevOps from their profiles](dbt-cloud/cloud-configuring-dbt-cloud/authenticate-azure).
