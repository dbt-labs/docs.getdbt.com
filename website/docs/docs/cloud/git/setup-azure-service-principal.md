---
title: "Set up Azure DevOps"
id: "setup-service-principal"
description: "You can set up your Azure DevOps by creating a Microsoft Entra ID app and adding it to dbt Cloud."
sidebar_label: "Set up service principal"
---

# Set up Azure DevOps <Lifecycle status="enterprise" />

## Service principal overview

:::note

You can use these instructions to create a service principal app. The service principal feature is being gradually rolled out to dbt Cloud accounts, so it may not be available in all accounts. 

If you need to configure dbt Cloud and Azure DevOps but don't see the **Service principal** option in your account settings, use the [**Service user**](/docs/cloud/git/setup-service-user) configuration for now. You can easily [migrate to a service principal](#migrate-to-service-principal) when available for your account.

:::

To use dbt Cloud's native integration with Azure DevOps, an account admin needs to set up a Microsoft Entra ID app as a service principal. We recommend setting up a separate [Entra ID application than used for SSO](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id).

The application's service principal represents the Entra ID application object. While a "service user" represents a real user in Azure with an Entra ID (and an applicable license), the "service principal" is a secure identity used by an application to access Azure resources unattended. The service principal authenticates with a client ID and secret rather than a username and password (or any other form of user auth). Service principals are the [Microsoft recommended method](https://learn.microsoft.com/en-us/entra/architecture/secure-service-accounts#types-of-microsoft-entra-service-accounts) for authenticating apps. 


1. [Register an Entra ID app](#register-a-microsoft-entra-id-app).
2. [Connect Azure DevOps to your new app](#connect-azure-devops-to-your-new-app).
3. [Add your Entra ID app to dbt Cloud](#add-your-azure-ad-app-to-dbt-cloud).

Once the Microsoft Entra ID app is added to dbt Cloud, it will act as a [service principal](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals?tabs=browser), which will be used to power headless actions in dbt Cloud such as deployment runs and CI. The dbt Cloud developers can then personally authenticate in dbt Cloud from Azure DevOps. For more, see [Authenticate with Azure DevOps](/docs/cloud/git/authenticate-azure).

The following personas are required to complete the steps on this page:
- Microsoft Entra ID admin
- Azure DevOps admin
- dbt Cloud account admin
- Azure admin (if your Entra ID and Azure DevOps environments are not connected)

## Register a Microsoft Entra ID app

A Microsoft Entra ID admin needs to perform the following steps:

1. Sign into your Azure portal and click **Microsoft Entra ID**.
2. Select **App registrations** in the left panel.
3. Select **New registration**. The form for creating a new Entra ID app opens.
4. Provide a name for your app. We recommend using, "dbt Labs Azure DevOps app".
5. Select **Accounts in any organizational directory (Any Entra ID directory - Multitenant)** as the Supported Account Types.
Many customers ask why they need to select Multitenant instead of Single Tenant, and they frequently get this step wrong. Microsoft considers Azure DevOps (formerly called Visual Studio) and Microsoft Entra ID separate tenants, and for the Entra ID application to work properly, you must select Multitenant.
6. Set **Redirect URI (optional)** to **Web**. Copy and paste the Redirect URI from dbt Cloud into the next field.  To find the Redirect URI in dbt Cloud:
    1. In dbt Cloud, navigate to **Account Settings** -> **Integrations**.
    2. Click the **edit icon** next to **Azure DevOps**.
    3. Copy the first **Redirect URIs** value which looks like `https://<YOUR_ACCESS_URL>/complete/azure_active_directory` and does NOT end with `service_user`.
7. Click **Register**.

Here's what your app should look like before registering it:

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD app.png" title="Registering a Microsoft Entra ID app"/>

## Create a client secret

A Microsoft Entra ID admin needs to complete the following steps:

1. Navigate to **Microsoft Entra ID**, click **App registrations**, and click on your app.
2. Select **Certificates and Secrets** from the left navigation panel.
3. Select **Client secrets** and click **New client secret**
4. Give the secret a description and select the expiration time. Click **Add**.
5. Copy the **Value** field and securely share it with the dbt Cloud account admin, who will complete the setup. 

## Create the app's service principal

After you've created the app, you need to verify whether it has a service principal. In many cases, if this has been configured before, new apps will get one assigned upon creation.

1. Navigate to **Microsoft Entra ID**.
2. Under **Manage** on the left-side menu, click **App registrations**.
3. Click the app for the dbt Cloud and Azure DevOps integration.
4. Locate the **Managed application in local directory** field and, if it has the option, click **Create Service Principal**. If the field is already populated, a service principal has already been assigned.  

    <Lightbox src="/img/docs/cloud-integrations/create-service-principal.png" width="80%" title="Example of the 'Create Service Principal' option highlighted ."/>

## Add permissions to your service principal

An Entra ID admin needs to provide your new app access to Azure DevOps:

1. Select **API permissions** in the left navigation panel.
2. Remove the **Microsoft Graph / User Read** permission.
3. Click **Add a permission**.
4. Select **Azure DevOps**.
5. Select the **user_impersonation** permission. This is the only permission available for Azure DevOps.

## Add a role to service principal

This section will require an Azure admin to complete.

To add a role to your service principal:
1. In your Azure account, navigate to **Subscriptions** and select an existing subscription.
2. From the left-side menu, click **Access Control (IAM)** -> **Add** -> **Add role assignment**.
3. From the **Role** tab, select a role with appropriate permissions to assign the service principal.
4. Continue to the **Members** tab and assign access to **User, group, or service principal**.
5. Click ***Select members** and find your app in the search bar. 
6. Once your app has been selected, click **Review and Assign**.

## Connect Azure DevOps to your new app

An Azure admin will need one of the following permissions in both the Microsoft Entra ID and Azure DevOps environments:
- Azure Service Administrator
- Azure Co-administrator

:::note

You can only add a managed identity or service principal for the tenant to which your organization is connected. You need to add a directory to your organization so that it can access all the service principals and other identities.
Navigate to **Organization settings** --> **Microsoft Entra** --> **Connect Directory** to connect.

:::

1. From your Azure DevOps account organization screen, click **Organization settings** in the bottom left.
2. Under **General** settings, click **Users**.
3. Click **Add users**, and in the resulting panel, enter the service principal's name in the first field. Then, click the name when it appears below the field.
4. In the **Add to projects** field, click the boxes for any projects you want to include (or select all).
5. Set the **Azure DevOps Groups** to **Project Administrator**.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/add-service-principal.png" width="80%" title="Example setup with the service principal added as a user."/>

## Connect your Microsoft Entra ID app to dbt Cloud

A dbt Cloud account admin must take the following actions.

Once you connect your Microsoft Entra ID app and Azure DevOps, you must provide dbt Cloud information about the app. If this is a first-time setup, you will create a new configuration. If you are [migrating from a service user](#migrate-to-service-principal), you can edit an existing configuration and change it to **Service principal**.


To create the configuration: 
1. Navigate to your account settings in dbt Cloud.
2. Select **Integrations**.
3. Scroll to the Azure DevOps section and click the **Edit icon**.
4. Select the **Service principal** option (service user configurations will auto-complete the fields, if applicable).
5. Complete/edit the form (if you are migrating, the existing configurations carry over):
    - **Azure DevOps Organization:** Must match the name of your Azure DevOps organization exactly. Do not include the `dev.azure.com/` prefix in this field. ✅ Use `my-DevOps-org` ❌ Avoid `dev.azure.com/my-DevOps-org`
    - **Application (client) ID:** Found in the Microsoft Entra ID app.
    Client Secrets: Copy the **Value** field in the Microsoft Entra ID app client secrets and paste it into the **Client Secret** field in dbt Cloud. Entra ID admins are responsible for the expiration of the app secret, and dbt Admins should note the expiration date for rotation.
    - **Directory(tenant) ID:** Found in the Microsoft Entra ID app.
        <Lightbox src="/img/docs/cloud-integrations/service-principal-fields.png" title="Fields for adding Entra ID app to dbt Cloud."/>

Your Microsoft Entra ID app should now be added to your dbt Cloud Account. People on your team who want to develop in the dbt Cloud IDE or dbt Cloud CLI can now personally [authorize Azure DevOps from their profiles](/docs/cloud/git/authenticate-azure).


## Migrate to service principal

Migrate from a service user to a service principal using the existing app. It will only take a few steps, and you won't experience any service disruptions. 

- Verify whether or not your app has a service principal
    - If not, create the app service principal
- Update the application's configuration
- Update the configuration in dbt Cloud

### Verify the service principal

You will need an Entra ID admin to complete these steps.

To confirm whether your existing app already has a service principal:
 
1. In the Azure account, navigate to **Microsoft Entra ID** -> **Manage** -> **App registrations**.
2. Click on the application for the service user integration with dbt Cloud. 
3. Verify whether a name populates the **Managed application in local directory** field. 
    - If a name exists, continue to the next step from the [add a role to your service principal](#add-a-role-to-service-principal) and follow the remaining instructions.
    - If no name exists, go to the next section, [Create the service principal](#create-the-service-principal).
4. Follow the instructions to [add permissions](#add-permissions-to-your-service-principal) to your service principal.
5. Follow the instructions to [connect DevOps to your app](#connect-azure-devops-to-your-new-app).
6. In your dbt Cloud account:
    1. Navigate to **Account settings** and click **Integrations**
    2. Click the **edit icon** to the right of the **Azure DevOps** settings.
    3. Change **Service user** to **Service principal** and click **Save**. You do not need to edit any existing fields.

### Create the service principal

If there is no name populating that field, a Service Principal does not exist. To configure a Service Principal, please review the instructions here.

If your dbt Cloud app does not have a service principal, take the following actions in your Azure account:

1. Navigate to **Microsoft Entra ID**.
2. Under **Manage** on the left-side menu, click **App registrations**.
3. Click the app for the dbt Cloud and Azure DevOps integration.
4. Locate the **Managed application in local directory** field and click **Create Service Principal**. 

    <Lightbox src="/img/docs/cloud-integrations/create-service-principal.png" width="80%" title="Example of the 'Create Service Principal' option highlighted ."/>

5. Follow the instructions to [add permissions](#add-permissions-to-your-service-principal) to your service principal.
6. Follow the instructions to [connect DevOps to your app](#connect-azure-devops-to-your-new-app).
7. In your dbt Cloud account:
    1. Navigate to **Account settings** and click **Integrations**
    2. Click the **edit icon** to the right of the **Azure DevOps** settings.
    3. Change **Service user** to **Service principal** and click **Save**. You do not need to edit any existing fields.
