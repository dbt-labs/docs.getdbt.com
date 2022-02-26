---
title: "Connecting your Azure DevOps Account"
id: "connecting-azure-devops"
sidebar_label: "Connecting Azure DevOps"
---

## Overview

Connecting your Azure DevOps account to dbt Cloud unlocks exciting new functionality in dbt Cloud:

- Import new Azure DevOps repos with a couple clicks during dbt Cloud project setup
- Enforce user authorization with OAuth 2.0 
- Carry Azure DevOps user repository permissions through to dbt Cloud IDE's git actions
- Trigger Continuous integration (CI) builds when pull requests are opened in Azure DevOps (coming soon!)

:::info Beta feature
This feature is currently in Beta. If you are interested in getting access to the beta, please reach out to support@getdbt.com
:::

Account admins need to set up an Active Directory application before developers can personally authenticate in Azure DevOps:

1. [Register an Active directory app](#registering-an-active-director-app) in Azure DevOps.
2. [Add permissions to your new app](#add-permissions-to-your-new-app).
3. [Connect Azure DevOps to your new app](#connect-azure-devops-to-your-new-app).
4. [Add your Active Directory app to dbt Cloud](#add-your-active-directory-app-to-dbt-cloud).

Developers can authenticate to Azure DevOps:

4. [Link your dbt Cloud profile to Azure DevOps](#link-your-dbt-cloud-profile-to-azure-devops).


## Register an Active Director app

1. Sign into Azure Active Directory.
2. Select **App registrations** in the left panel.
3. Select **New registration**. You should see the form for creating a new Active Directory app.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/ADnavigation.gif" title="Navigating to the AD app registrations"/>

4. Provide a name for your app. We recommend "dbt Labs Azure DevOps App'. 
5. Select 'Accounts in any organizational directory (Any Azure AD directory - Multitenant)' for Supported Account Types.
6. Add a redirect URI by selecting 'Web' and typing in 'https://cloud.getdbt.com/complete/azure_active_directory'. If you have a custom dbt Cloud url be sure to swap in your appropriate domain.

Here's what your app should look before registering it:

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD app.png" title="Registering an Active Directory app"/>

## Add permissions to your new app

Provide your new app access to Azure DevOps: 

1. Select **API permissions** in the left navigation panel. 
2. You can remove the Microsoft Graph / User Read permission. 
3. Click **Add a permission**
4. Select **Azure DevOps**
5. Select `user_impersonation` permission.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/user-impersonation.gif" title="Adding permissions to the app"/>

## Connect Azure DevOps to your new app

Connect Azure DevOps to the Active Directory App you just created:

1. From your Azure DevOps account, select **Organization settings** in the bottom left.
2. Navigate to Azure Active Directory.
3. Click **Connect directory**.
4. Select the directory you want to connect.
5. Click **Connect**.


<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/connect AD to Azure DevOps.gif" title="Connecting Azure DevOps and Active Directory"/>

## Add your Active Directory app to dbt Cloud

Now that Active Directory and Azure DevOps are connected. You need to give dbt Cloud proper information about your Active Directory App. To do so, navigate to your account settings in dbt Cloud, select Integrations and then scroll to the Azure DevOps section. 

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/Azure Devops App in dbt Cloud.gif" title="Adding an Active Directory App to dbt Cloud"/>

There you should add the following:
 - Azure DevOps Organization, which must match the name of your Azure DevOps organization exactly.
 - Application (client) ID from the Active Directory App
 - Directory (tenant) ID from the Active Directory App
 - Client secrets, which must be first created in the Active Directory App under Client credentials. The customer will be responsible for the AD app secret expiration and rotation.

Your Active Directory app should now be added to your dbt Cloud Account. Developers on your team are now ready to authorize Azure DevOps from their profiles.

## Link your dbt Cloud profile to Azure DevOps

All dbt Cloud developers will need to connect their dbt Cloud profiles to Azure DevOps using OAuth:

1. From your profile page, click **Integrations** in the left pane.
2. Click **Link your Azure DevOps Profile**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/profile link.gif" title="Linking your Azure DevOps Profile" />

3. Once you're redirected to Azure DevOps, sign into your account.
4. When you see the permission request screen from Azure DevOps App, click **Accept**. You will be directed back to dbt Cloud, and your profile should be linked. You are now ready for developing in the IDE!

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/OAuth Acceptance.png" title="Azure DevOps Authorization Screen"/>
