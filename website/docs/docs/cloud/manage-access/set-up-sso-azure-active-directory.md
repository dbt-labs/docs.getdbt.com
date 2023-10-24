---
title: "Set up SSO with Azure Active Directory"
description: "Learn how dbt Cloud administrators can use Azure Active Directory to control access in a dbt Cloud account."
id: "set-up-sso-azure-active-directory"
sidebar_label: "Set up SSO with Azure AD"
---

import SetUpPages from '/snippets/_sso-docs-mt-available.md';

<SetUpPages features={'/snippets/_sso-docs-mt-available.md'}/>

dbt Cloud Enterprise supports single-sign on via Azure Active Directory (Azure AD).
You will need permissions to create and manage a new Azure AD application.
Currently supported features include:

* IdP-initiated SSO
* SP-initiated SSO
* Just-in-time provisioning

## Configuration

dbt Cloud supports both single tenant and multi-tenant Azure Active Directory SSO
Connections. For most Enterprise purposes, you will want to use the single
tenant flow when creating an Azure AD Application.

### Creating an application

Log into the Azure portal for your organization. Using the **Azure Active Directory** page, you will
need to select the appropriate directory and then register a new application.

1. Under **Manage**, select **App registrations**
2. Click **+ New Registration** to begin creating a new application
3. Supply configurations for the **Name** and **Supported account types**
   fields as shown in the <Term id="table" /> below.

| Field | Value |
| ----- | ----- |
| **Name** | dbt Cloud |
| **Supported account types** | Accounts in this organizational directory only _(single tenant)_ |

4. Configure the **Redirect URI**. The table below shows the appropriate
   Redirect URI values for single-tenant and multi-tenant deployments. For most
   enterprise use-cases, you will want to use the single-tenant Redirect URI. Replace `YOUR_AUTH0_URI` with the [appropriate Auth0 URI](/docs/cloud/manage-access/sso-overview#auth0-multi-tenant-uris) for your region and plan.


| Application Type | Redirect URI |
| ----- | ----- |
| Single-Tenant _(recommended)_ | `https://YOUR_AUTH0_URI/login/callback` |
| Multi-Tenant | `https://YOUR_AUTH0_URI/login/callback` |


5. Save the App registration to continue setting up Azure AD SSO

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-app-registration-empty.png" title="Creating a new app registration"/>
<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-new-application-alternative.png" title="Configuring a new app registration"/>


**Configuration with the new Azure AD interface (optional)**

Depending on your Azure AD settings, your App Registration page might look
different than the screenshots shown above. If you are _not_ prompted to
configure a Redirect URI on the **New Registration** page, then follow steps 6
and 7 below after creating your App Registration. If you were able to set up
the Redirect URI in the steps above, then skip ahead to step 8.

6. After registering the new application without specifying a Redirect URI,
   navigate to the **Authentication** tab for the new application.

7. Click **+ Add platform** and enter a Redirect URI for your application. See
   step 4 above for more information on the correct Redirect URI value for your
   dbt Cloud application.

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-redirect-uri.png" title="Configuring a Redirect URI"/>

### Azure <-> dbt Cloud User and Group mapping

The Azure users and groups you will create in the following steps are mapped to groups created in dbt Cloud based on the group name. Reference the docs on [enterprise permissions](enterprise-permissions) for additional information on how users, groups, and permission sets are configured in dbt Cloud.

### Adding Users to an Enterprise Application

Once you've registered the application, the next step is to assign users to it. Add the users you want to be viewable to dbt with the following steps:

8. From the **Default Directory** click **Enterprise Applications**
9. Click the name of the application you created earlier
10. Click **Assign Users and Groups**
11. Click **Add User/Group**
12. Assign additional users and groups as-needed

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-enterprise-app-users.png" title="Adding Users to an Enterprise Application a Redirect URI"/>

:::info User assignment required?
Under **Properties** check the toggle setting for **User assignment required?** and confirm it aligns to your requirements. Most customers will want this toggled to **Yes** so that only users/groups explicitly assigned to dbt Cloud will be able to sign in. If this setting is toggled to **No** any user will be able to access the application if they have a direct link to the application per [Azure AD Documentation](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/assign-user-or-group-access-portal#configure-an-application-to-require-user-assignment)
:::

### Configuring permissions

13. Under **Manage**, click **API Permissions**
14. Click **+Add a permission** and add the permissions shown below

| API Name | Type | Permission |
| -------- | ---- | ---------- |
| Microsoft Graph | Delegated | `Directory.AccessAsUser.All` |
| Microsoft Graph | Delegated | `Directory.Read.All` |
| Microsoft Graph | Delegated | `User.Read` |

15. Save these permissions, then click **Grant admin consent** to grant admin
   consent for this directory on behalf of all of your users.

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-permissions-overview.png" title="Configuring application permissions" />

### Creating a client secret

16. Under **Manage**, click **Certificates & secrets**
17. Click **+New client secret**
18. Name the client secret "dbt Cloud" (or similar) to identify the secret
19. Select **730 days (24 months)** as the expiration value for this secret (recommended)
20. Click **Add** to finish creating the client secret value (not the client secret ID)
21. Record the generated client secret somewhere safe. Later in the setup process,
   we'll use this client secret in dbt Cloud to finish configuring the
   integration.

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-secret-config.png" title="Configuring certificates & secrets" />
<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-secret-saved.png" title="Recording the client secret" />

### Collect client credentials

22. Navigate to the **Overview** page for the app registration
23. Note the **Application (client) ID** and **Directory (tenant) ID** shown in
   this form and record them along with your client secret. We'll use these keys
   in the steps below to finish configuring the integration in dbt Cloud.

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-overview.png" title="Collecting credentials. Store these somewhere safe!" />

## Configuring dbt Cloud

To complete setup, follow the steps below in the dbt Cloud application.

### Supplying credentials

24. Click the gear icon at the top right and select **Profile settings**. To the left, select **Single Sign On** under **Account Settings**.
25. Click the **Edit** button and supply the following SSO details:

| Field | Value |
| ----- | ----- |
| **Log&nbsp;in&nbsp;with** | Azure AD Single Tenant |
| **Client&nbspID** | Paste the **Application (client) ID** recorded in the steps above |
| **Client&nbsp;Secret** | Paste the **Client Secret** (remember to use the Secret Value instead of the Secret ID) recorded in the steps above; **Note:** When the client secret expires, an Azure AD admin will have to generate a new one to be pasted into dbt Cloud for uninterrupted application access |
| **Tenant&nbsp;ID** | Paste the **Directory (tenant ID)** recorded in the steps above |
| **Domain** | Enter the domain name for your Azure directory (such as `fishtownanalytics.com`). Only use the primary domain; this won't block access for other domains. |
| **Slug** | Enter your desired login slug. Users will be able to log into dbt Cloud by navigating to `https://YOUR_ACCESS_URL/enterprise-login/LOGIN-SLUG`, replacing `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/cloud/manage-access/sso-overview#auth0-multi-tenant-uris) for your region and plan. Login slugs must be unique across all dbt Cloud accounts, so pick a slug that uniquely identifies your company. |


<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-cloud-sso.png" title="Configuring Azure AD SSO in dbt Cloud" />

26. Click **Save** to complete setup for the Azure AD SSO integration. From
    here, you can navigate to the login URL generated for your account's _slug_ to
    test logging in with Azure AD.

<Snippet path="login_url_note" />




## Setting up RBAC
Now you have completed setting up SSO with Azure AD, the next steps will be to set up
[RBAC groups](/docs/cloud/manage-access/enterprise-permissions) to complete your access control configuration.

## Troubleshooting Tips

Ensure that the domain name under which user accounts exist in Azure matches the domain you supplied in [Supplying credentials](#supplying-credentials) when you configured SSO.

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-get-domain.png" title="Obtaining the user domain from Azure" />
