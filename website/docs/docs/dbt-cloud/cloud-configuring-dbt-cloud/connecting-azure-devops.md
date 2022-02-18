---
title: "Connecting your Azure DevOps Account"
id: "connecting-azure-devops"
sidebar_label: "Connecting Azure DevOps"
---

## Overview
Connecting your Azure DevOps account to dbt Cloud unlocks exciting new functionality in dbt Cloud:
- Import new repos with a couple clicks during dbt project setup
- Enforce user authorization with OAuth 2.0 
- Carry AzureDevOps user repository permissions through to dbt Cloud IDE's git actions
- Trigger CI builds when pull requests are opened in Azure DevOps (coming soon!)


## For Enterprise tier
Before developers can personally authenticate in Azure DevOps, account admins need to set up an Active Directory application.

To do this, sign into Azure Active Directory. You'll then nativigate to 'App registrations' on your left panel, and select 'New registration'. This will pull up the form for you to create a new Active Directory app.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD natigation.gif" title="Navigating to the AD app registrations"/>

Next, give your app an name. We reccomend 'dbt Labs Azure DevOps App'. Select 'Accounts in any organizational directory (Any Azure AD directory - Multitenant)' for Supported Account Types. Finally, add a redirect URI by selecting 'Web' and typing in 'https://cloud.getdbt.com/complete/azure-active-directory'. If you have a custom dbt Cloud url be sure to swap in your appropriate domain.

Your app should look as follows before you register it.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD app.png" title="Registering an AD app"/>

Next, you'll need to give your new app access to Azure DevOps. Select 'API permissions' on the left navigation panel. You can remove the Microsoft Graph User Read permission. Then click on 'Add a permission', select Azure DevOps and allow for the 'user_impersonation' permission.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/user-impersonation.gif" title="Adding permissions to the app"/>

Finally, you need to connect Azure DevOps to the Active Directory App you just created.



<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/connect AD to Azure DevOps.gif" title="Adding permissions to the app"/>