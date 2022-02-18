---
title: "Connecting your Azure DevOps Account"
id: "connecting-azure-devops"
sidebar_label: "Connecting Azure DevOps"
---

## Overview
Connecting your Azure DevOps account to dbt Cloud unlocks exciting new functionality in dbt Cloud. It allows customers to:
- Import new Azure DevOps repos with a couple clicks during dbt Cloud project setup
- Enforce user authorization with OAuth 2.0 
- Carry Azure DevOps user repository permissions through to dbt Cloud IDE's git actions
- Trigger CI builds when pull requests are opened in Azure DevOps (coming soon!)

:::info Beta feature
This feature is currently in Beta. If you are interested in getting access to the beta, please reach out to support@getdbt.com
:::
## For account admins
Before developers can personally authenticate in Azure DevOps, account admins need to set up an Active Directory application.

To do this, sign into Azure Active Directory. You'll then nativigate to 'App registrations' on your left panel, and select 'New registration'. This will pull up the form for you to create a new Active Directory app.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD natigation.gif" title="Navigating to the AD app registrations"/>

Next, give your app a name. We recommend 'dbt Labs Azure DevOps App'. Select 'Accounts in any organizational directory (Any Azure AD directory - Multitenant)' for Supported Account Types. Finally, add a redirect URI by selecting 'Web' and typing in 'https://cloud.getdbt.com/complete/azure-active-directory'. If you have a custom dbt Cloud url be sure to swap in your appropriate domain.

Your app should look as follows before you register it.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD app.png" title="Registering an Active Directory app"/>

Next, you'll need to give your new app access to Azure DevOps. Select 'API permissions' on the left navigation panel. You can remove the Microsoft Graph User Read permission. Then click on 'Add a permission', select Azure DevOps and allow for the 'user_impersonation' permission.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/user-impersonation.gif" title="Adding permissions to the app"/>

Finally, you need to connect Azure DevOps to the Active Directory App you just created. To do so, head to your Azure DevOps account, select 'Organization settings', navigate to Azure Active Directory, click 'Connect directory', and select the directory to connect to.


<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/connect AD to Azure DevOps.gif" title="Connecting Azure DevOps and Active Directory"/>

Now that Active Directory and Azure DevOps are connected. You need to give dbt Cloud proper information about your Active Directory App. To do so, navigate to your account settings in dbt Cloud, select Integrations and then scroll to the Azure DevOps section. There you should add the following:
 - Azure DevOps Organization, which must match the name of your Azure DevOps organization exactly.
 - Application (client) ID from the Active Directory App
 - Directory (tenant) ID from the Active Directory App
 - Client secrets, which must be added to the Active Directory App under Client credentials

Once you've hit save, your Active Directory app has been added to your dbt Cloud Account. Developers on your team are now ready to authorize Azure DevOps on their profiles.

## For dbt Cloud developers
All dbt Cloud developers will need to connect their dbt Cloud profiles to Azure DevOps via OAuth. You can do so in your profile page by navigating to Integrations and clicking 'Link your Azure DevOps Profile'. 

You should then be redirected to Azure DevOps and prompted to sign into your account. Azure DevOps will then ask for your explicit authorization: 

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/OAuth Acceptance.png" title="Azure DevOps Authorization Screen" />

Once you've accepted, you should be redirected back to dbt Cloud, and you'll see that your profile has been linked. You are now ready for developing in the IDE.
