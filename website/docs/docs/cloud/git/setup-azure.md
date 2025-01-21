---
title: "Set up Azure DevOps"
id: "setup-azure"
description: "You can set up your Azure DevOps by creating a Microsoft Entra ID app and adding it to dbt Cloud."
sidebar_label: "Set up Azure DevOps"
---

<Snippet path="available-enterprise-tier-only" />

## Overview

To use our native integration with Azure DevOps in dbt Cloud, an account admin needs to set up an Microsoft Entra ID app. We recommend setting up a separate [Entra ID application than used for SSO](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id).

1. [Register an Entra ID app](#register-a-microsoft-entra-id-app).
2. [Connect Azure DevOps to your new app](#connect-azure-devops-to-your-new-app).
3. [Add your Entra ID app to dbt Cloud](#add-your-azure-ad-app-to-dbt-cloud).

Once the Microsoft Entra ID app is added to dbt Cloud, an account admin must also connect a [service principal](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals?tabs=browser), which will be used to power headless actions in dbt Cloud such as deployment runs and CI.


Once the Microsoft Entra ID app is added to dbt Cloud and the service principal is connected, then dbt Cloud developers can personally authenticate in dbt Cloud from Azure DevOps. For more on this, see [Authenticate with Azure DevOps](/docs/cloud/git/authenticate-azure).

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
Many customers ask why they need to select Multitenant instead of Single tenant, and they frequently get this step wrong. Microsoft considers Azure DevOps (formerly called Visual Studio) and Microsoft Entra ID as separate tenants, and in order for this Entra ID application to work properly, you must select Multitenant.
6. Click **Register**.

Here's what your app should look like before registering it:

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/AD app.png" title="Registering a Microsoft Entra ID app"/>

## Create a client secret

A Microsoft Entra ID admin needs to complete the following steps:

1. Navigate to **Microsoft Entra ID**, click **App registrations**, and click on your app.
2. Select **Certificates and Secrets** from the left navigation panel.
3. Select **Client secrets** and click **New client secret**
4. Give the secret a description and select the expiration time. Click **Add**.
5. Copy the **Value** field and securely share it with the dbt Cloud account admin who will complete the setup. 

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

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/add-service-principal.png" width="90%" title="Example setup with the service principal added as a user."/>

## Configure the Entra ID connection

There are two connection methods currently available for dbt Cloud and Azure DevOps:
- **Service principal** (recommended): Create an application connection via client ID and secret for unattended authentication.
- **Service user** (legacy): Create a user that will authenticate the connection with username and password. This configuration should be avoided.

<Tabs>

<TabItem value="Service principal">

## Create a service principal

The application's service principal represents the Entra ID application object. Whereas a service user represents a real user in Azure with an Entra ID (and an applicable license), the service principal is a secure identity used by an application to access Azure resources unattended. The service principal authenticates with a client ID and secret rather than a username and password (or any other form of user auth). Service principals are the [Microsoft recommended method](https://learn.microsoft.com/en-us/entra/architecture/secure-service-accounts#types-of-microsoft-entra-service-accounts) for authenticating apps. 

### Add a role to the Service Principal

In your Azure account:

1. Navigate to **Subscriptions** and click on the appropriate subscription name for the application environment. 
2. From the left-side menu of the subscription window, click **Access control (IAM)**.
3. From the top menu, click **Add** and select **Add role assignment** from the dropdown.

<Lightbox src="/img/docs/cloud-integrations/azure-subscription.png" width="60%" title="The 'Access control (IAM)' window in the 'Subscriptions' section of Azure."/>

4. In the **Role** tab, select a role with appropriate permissions to assign the service principal. 
5. Click the **Members** tab. You must set **Assign access to** to **User, group, or service principal**.
6. Click **Select members** and search for your app name in the window. Once it appears, click your app, which will appear in the **Selected members** section. Click **Select** at the bottom to save your selection.

    <Lightbox src="/img/docs/cloud-integrations/assign-app-to-members.png" width="80%" title="The dbt Cloud ADO app in the member’s section."/>

5. Confirm the correct details and click **Review + assign**.

    <Lightbox src="/img/docs/cloud-integrations/review-and-assign.png" width="80%" title="Review screen with the app service principal and permissions."/>

Navigate back to the **App registrations** screen and click the app. On the left menu, click **Roles and administrators**, and you will see the app role assignment. 

### Migrate to service principal

If your dbt Cloud app does not have a service principal, take the following actions in your Azure account:

1. Navigate to **Microsoft Entra ID**.
2. Under **Manage** on the left-side menu, click **App registrations**.
3. Click the app for the dbt Cloud and Azure DevOps integration.
4. Locate the **Managed application in local directory** field and click **Create Service Principal**.

    <Lightbox src="/img/docs/cloud-integrations/create-service-principal.png" width="80%" title="Example of the 'Create Service Principal' option highlighted ."/>

5. Follow the instructions in [Add role to service principal](#add-a-role-to-the-service-principal) if the app doesn't already have them assigned.
6. In dbt Cloud, navigate to **Account settings** --> **Integrations** and edit the **Azure DevOps** integration.
7. Click the **Service principal** option, fill out the fields, and click **Save**. The services will continue to function uninterrupted. 


</TabItem>

<TabItem value="Service user">

:::important

Service users are no longer a recommended method for authentication and accounts using them should [migrate](#migrate-to-service-principal) to Entra ID [service principals](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals) in the future. Service prinicpals are the [Microsoft recommended service account type](https://learn.microsoft.com/en-us/entra/architecture/secure-service-accounts#types-of-microsoft-entra-service-accounts) for app authentication.

:::

An Azure DevOps admin can create a "service user (not recommended)" in Azure DevOps whose permissions will be used to power headless actions in dbt Cloud such as dbt Cloud project repo selection, deployment runs, and CI. A service user is a pseudo user set up in the same way an admin would set up a real user, but it's given permissions specifically scoped for service to service interactions. You should avoid linking authentication to a real Azure DevOps user because if this person leaves your organization, dbt Cloud will lose privileges to the dbt Azure DevOps repositories, causing production runs to fail.

:::info Service user authentication expiration
dbt Cloud will refresh the authentication for the service user on each run triggered by the scheduler, API, or CI. If your account does not have any active runs for over 90 days, an admin will need to manually refresh the authentication of the service user by disconnecting and reconnecting the service user's profile via the OAuth flow described above in order to resume headless interactions like project set up, deployment runs, and CI.

:::

### Service users permissions

A service user account must have the following Azure DevOps permissions for all Azure DevOps projects and repos you want accessible in dbt Cloud. Read more about how dbt Cloud uses each permission in the following paragraphs.

 - **Project Reader**
 - **ViewSubscriptions**
 - **EditSubscriptions**
 - **DeleteSubscriptions** *
 - **PullRequestContribute**
 - **GenericContribute**

\* Note: **DeleteSubscriptions** permission might be included in **EditSubscriptions** depending on your version of Azure.

Some of these permissions are only accessible via the [Azure DevOps API](https://docs.microsoft.com/en-us/azure/devops/organizations/security/namespace-reference?view=azure-devops) or [CLI](https://learn.microsoft.com/en-us/cli/azure/devops?view=azure-cli-latest). We’ve also detailed more information on Azure DevOps API usage below to help accelerate the setup. Alternatively, you can use the Azure DevOps UI to enable permissions, but you cannot get the least permissioned set.

<!-- tabs for service user permissions and turning off MFA for service users -->
<Tabs>

<TabItem value="permission" label="Required permissions for service users">

The service user's permissions will also power which repositories a team can select from during dbt project set up, so an Azure DevOps admin must grant at minimum Project Reader access to the service user _before_ creating a new project in dbt Cloud. If you are migrating an existing dbt project to use the native Azure DevOps integration, the dbt Cloud account's service user must have proper permissions on the repository before migration.
</TabItem>

<TabItem value="mfa" label="Turn off MFA for service user">

While it's common to enforce multi-factor authentication (MFA) for normal user accounts, service user authentication must not need an extra factor. If you enable a second factor for the service user, this can interrupt production runs and cause a failure to clone the repository. In order for the OAuth access token to work, the best practice is to remove any more burden of proof of identity for service users.

As a result, MFA must be explicitly disabled in the Office 365 or Microsoft Entra ID administration panel for the service user.  Just having it "un-connected" will not be sufficient, as dbt Cloud will be prompted to set up MFA instead of allowing the credentials to be used as intended.


**To disable MFA for a single user using the Office 365 Administration console:**

- Go to Microsoft 365 admin center -> Users -> Active users -> Select the user -> Manage multifactor authentication -> Select the user -> Disable multi-factor authentication.

**To use the Microsoft Entra ID interface:**

Note, this procedure involves disabling Security Defaults in your Entra ID environment.

1. Go to the Azure Admin Center. Open Microsoft Entra ID and under the **Manage** section of the left navigation, click **Properties**, scroll down to **Manage Security defaults**, and then select **No** in "Enable Security Defaults" and click **Save**.
2. Go to **Microsoft Entra ID** -> Manage -> Users ->click on the ellipsis (...) and then the **Multi-Factor Authentication** link. If the link is grayed out, you need to make sure you disable **Security Defaults** from the previous step.
3. If MFA is enabled for users, select the user(s) and select **Disable** under **Quick steps**. 
4. Select **Yes** to confirm your changes.

To re-enable MFA for the user, select them again and click **Enable**. Note, you may have to go through MFA setup for that user after enabling it.

</TabItem>

</Tabs>

<!-- End tabs for service user permissions and turning off MFA for service users-->

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
- PublisherSecurity/&lt;azure_devops_project_object_id&gt; for per project access

**UI/API/CLI:** API/CLI only

**Sample CLI code snippet**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id cb594ebe-87dd-4fc9-ac2c-6a10a4c92046 --subject <service_account>@xxxxxx.onmicrosoft.com --token PublisherSecurity/<azure_devops_project_object_id> --allow-bit 1
```

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
- PublisherSecurity/&lt;azure_devops_project_object_id&gt; for per project access

**UI/API/CLI:** API/CLI only

**Sample CLI code snippet**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id cb594ebe-87dd-4fc9-ac2c-6a10a4c92046 --subject <service_account>@xxxxxx.onmicrosoft.com --token PublisherSecurity/<azure_devops_project_object_id> --allow-bit 2
```

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
- PublisherSecurity/&lt;azure_devops_project_object_id&gt; for per project access

**UI/API/CLI:** API/CLI only

**Sample CLI code snippet**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id cb594ebe-87dd-4fc9-ac2c-6a10a4c92046 --subject <service_account>@xxxxxx.onmicrosoft.com --token PublisherSecurity/<azure_devops_project_object_id> --allow-bit 4
```

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
- repoV2/&lt;azure_devops_project_object_id&gt; for per project access
- repoV2/&lt;azure_devops_project_object_id&gt;/&lt;azure_devops_repository_object_id&gt; for per repo access


**UI/API/CLI:** UI, API, and CLI

**Sample CLI code snippet**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87 --subject <service_account>@xxxxxx.onmicrosoft.com --token repoV2/<azure_devops_project_object_id>/<azure_devops_repository_object_id> --allow-bit 16384
```

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
- repoV2/&lt;azure_devops_project_object_id&gt; for access to a single project at a time
- repoV2/&lt;azure_devops_project_object_id&gt;/&lt;azure_devops_repository_object_id&gt; for access to a single repo at a time


**UI/API/CLI:** UI, API, and CLI

**Sample CLI code snippet**
```bash
az devops security permission update --organization https://dev.azure.com/<org_name> --namespace-id 2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87 --subject <service_account>@xxxxxx.onmicrosoft.com --token repoV2/<azure_devops_project_object_id>/<azure_devops_repository_object_id> --allow-bit 4
```

**Additional Notes:** This permission is automatically inherited if Project Contributor/Administrator is set in the UI.


</details>

You must connect your service user before setting up a dbt Cloud project, as the service user's permissions determine which projects dbt Cloud can import.

A dbt Cloud account admin with access to the service user's Azure DevOps account must complete the following to connect the service user:
1. Sign in to the service user's Azure DevOps account.
2. In dbt Cloud, click **Link Azure Service User**.
3. You will be directed to Azure DevOps and must accept the Microsoft Entra ID app's permissions.
4. Finally, you will be redirected to dbt Cloud, and the service user will be connected.

<Lightbox src="/img/docs/dbt-cloud/connecting-azure-devops/azure-service-user.png" title="Connecting an Azure Service User"/>

Once connected, dbt Cloud displays the email address of the service user so you know which user's permissions are enabling headless actions in deployment environments. To change which account is connected, disconnect the profile in dbt Cloud, sign into the alternative Azure DevOps service account, and re-link the account in dbt Cloud.

### Using Azure AD for SSO with dbt Cloud and Microsoft tools

If you're using Azure AD for SSO with dbt Cloud and Microsoft tools, the SSO flow may sometimes direct your account admin to their personal user account instead of the service user. If this happens, follow these steps to resolve it:

1. Sign in to the service user's Azure DevOps account (ensure they are also connected to dbt Cloud through SSO).
2. When connected to dbt Cloud, sign out of Azure AD through the [Azure portal](https://portal.azure.com/).
3. Disconnect the service user in dbt Cloud, and follow the steps to set it up again.
4. You should then be prompted to enter service user credentials.


:::info Personal Access Tokens (PATs)
dbt Cloud leverages the service user to generate temporary access tokens called [PATs](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops&tabs=Windows). 

These tokens are limited in scope, are only valid for 5 minutes, and become invalid after a single API call.

These tokens are limited to the following [scopes](https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops):
- `vso.code_full`: Grants full access to source code and version control metadata (commits, branches, and so on). Also grants the ability to create and manage code repositories, create and manage pull requests and code reviews, and receive notifications about version control events with service hooks. Also includes limited support for Client OM APIs.
- `vso.project`: Grants the ability to read projects and teams.
- `vso.build_execute`: Grants the ability to access build artifacts, including build results, definitions, and requests, and the ability to queue a build, update build properties, and the ability to receive notifications about build events with service hooks.
:::

</TabItem>
</Tabs>

## Add your Microsoft Entra ID app to dbt Cloud

A dbt Cloud account admin must take the following actions.

Once you connect your Microsoft Entra ID app and Azure DevOps, you need to provide dbt Cloud information about the app:

1. Navigate to your account settings in dbt Cloud.
2. Select **Integrations**.
3. Scroll to the Azure DevOps section.
4. Complete the form:
    - **Azure DevOps Organization:** Must match the name of your Azure DevOps organization exactly. Do not include the `dev.azure.com/` prefix in this field. ✅ Use `my-devops-org` ❌ Avoid `dev.azure.com/my-devops-org`
    - **Application (client) ID:** Found in the Microsoft Entra ID app.
    - **Client Secrets:** Copy the **Value** field in the Microsoft Entra ID app client secrets and paste it in the **Client Secret** field in dbt Cloud. Entra ID admins are responsible for the Entra ID app secret expiration and dbt Admins should note the expiration date for rotation.
    - **Directory(tenant) ID:** Found in the Microsoft Entra ID app.
        <Lightbox src="/img/docs/cloud-integrations/service-principal-fields.png" title="Fields for adding Entra ID app to dbt Cloud."/>
    - **Redirect URI (Service users only)**: Copy this field to **Redirect URIs** field in your Entra ID app.

Your Microsoft Entra ID app should now be added to your dbt Cloud Account. People on your team who want to develop in the dbt Cloud IDE or dbt Cloud CLI can now personally [authorize Azure DevOps from their profiles](/docs/cloud/git/authenticate-azure).
