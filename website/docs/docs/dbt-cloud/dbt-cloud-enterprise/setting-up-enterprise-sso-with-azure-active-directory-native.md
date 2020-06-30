---
title: "Setting up SSO with Azure Active Directory"
id: "setting-up-enterprise-sso-with-azure-active-directory-native"
---


:::info Enterprise Feature
This guide describes a feature of the dbt Cloud Enterprise plan. If you’re
interested in learning more about an Enterprise plan, contact us at
sales@getdbt.com.
:::

dbt Cloud Enterprise supports single-sign on via Azure Active Directory (Azure AD).
You will need permissions to create and manage a new Azure AD application.
Currently supported features include:

* IdP-initiated SSO
* SP-initiated SSO
* Just-in-time provisioning

## Configuration

dbt Cloud supports both single tenant and multitenant Azure Active Directory SSO
Connections. For most Enterprise purposes, you will want to use the single
tenant flow when creating an Azure AD Application.

### Creating an application

Log into the Azure portal for your organization. Using the **Azure Active Directory** page, you will
need to select the appropriate directory and then register a new application. 

1. Under **Manage**, select **App registrations**
2. Click **+ New Registration** to begin creating a new application
3. Create the new app registration with the following configurations:

| Field | Value |
| ----- | ----- |
| **Name** | dbt Cloud |
| **Supported account types** | Accounts in this organizational directory only _(single tenant)_ |
| **Platform configuration** | Client Application |

4. Save the App registration to continue setting up Azure AD SSO


<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-app-registration-empty.png" title="Creating a new app registration"/>
<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-new-application.png" title="Configuring a new app registration"/>

### Configuring the redirect URI

:::note Redirect URIs
If you are deploying dbt Cloud into a VPC, you should use the hostname where
the dbt Cloud application is deployed instead of `https://cloud.getdbt.com` in
the **Redirect URI** configuration shown below.
:::

5. Under **Manage**, click the **Authentication** link
6. Add a **Platform configuration** for the dbt Cloud **Redirect URI**. For most
   typical enterprise use-cases, you will only need to supply the Single-Tenant
   Redirect URI shown below.

| Application Type | Redirect URI |
| ----- | ----- |
| Single-Tenant _(recommended)_ | `https://cloud.getdbt.com/complete/azure_single_tenant` |
| Multi-Tenant | `https://cloud.getdbt.com/complete/azure_multi_tenant` |

7. Verify that the Redirect URI has been added successfully and save the page to continue

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-redirect-uri.png" title="Configuring a Redirect URI"/>




### Configuring permissions

8. Under **Manage**, click **API Permissions**
9. Click **+Add a permission** and add the permissions shown below

| API Name | Type | Permission |
| -------- | ---- | ---------- |
| Microsoft Graph | Delegated | `Directory.AccessAsUser.All` |
| Microsoft Graph | Delegated | `Directory.Read.All` |
| Microsoft Graph | Application | `Directory.Read.All` |
| Microsoft Graph | Delegated | `User.Read.All` |

10. Save these permissions, then click **Grant admin consent** to grant admin
   consent for this directory on behalf of all of your users.

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-permissions-overview.png" title="Configuring application permissions" />

### Creating a client secret

11. Under **Manage**, click **Certificates & secrets**
12. Click **+New client secret**
13. Name the client secret "dbt Cloud" (or similar) to identify the secret
14. Select **Never** as the expiration value for this secret
15. Click **Add** to finish creating the client secret
16. Record the generated client secret somewhere safe. Later in the setup process,
   we'll use this client secret in dbt Cloud to finish configuring the
   integration.

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-secret-config.png" title="Configuring certificates & secrets" />
<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-secret-saved.png" title="Recording the client secret" />

### Collect client credentials

17. Navigate to the **Overview** page for the app registration
18. Note the **Application (client) ID** and **Directory (tenant) ID** shown in
   this form and record them along with your client secret. We'll use these keys
   in the steps below to finish configuring the integration in dbt Cloud.

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-overview.png" title="Collecting credentials. Store these somewhere safe!" />

## Configuring dbt Cloud

To complete setup, follow the steps below in the dbt Cloud application.

### Enable Azure AD Native Auth (beta)

- For users accessing dbt Cloud at cloud.getdbt.com, contact your account manager to
  gain access to the Azure AD Native auth configuration UI
- For users accessing dbt Cloud deployed in a VPC, enable the `native_azure`
  feature flag in the dbt Cloud admin backend.

### Supplying credentials

19. Navigate to the **Enterprise &gt; Single Sign On** page under Account
Settings.
20. Click the **Edit** button and supply the following SSO details:

| Field | Value |
| ----- | ----- |
| **Log&nbsp;in&nbsp;with** | Azure AD Single Tenant |
| **Client&nbspID** | Paste the **Application (client) ID** recorded in the steps above |
| **Client&nbsp;Secret** | Paste the **Client Secret** recorded in the steps above |
| **Tenant&nbsp;ID** | Paste the **Directory (tenant ID)** recorded in the steps above |
| **Domain** | Enter the domain name for your Azure directory (eg. `fishtownanalytics.com`). Only users with an email address from this domain will be able to log into your dbt Cloud account using Azure AD SSO. |
| **Slug** | Enter your desired login slug. Users will be able to log into dbt Cloud by navigating to `https://cloud.getdbt.com/enterprise-login/<login-slug>`. Login slugs must be unique across all dbt Cloud accounts, so pick a slug that uniquely identifies your company. |


<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-cloud-sso.png" title="Configuring credentials in dbt Cloud" />

21. Click **Save &amp; Authorize** to authorize your credentials. You should be
   dropped into the Azure AD login flow and prompted to log into dbt Cloud with
   your work email address. If authentication is successful, you will be
   redirected back to the dbt Cloud application.
22. On the **Verify SSO Credentials** page, verify that a `groups` entry is
   present, and that it reflects the groups you are a member of in Azure AD.

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-cloud-sso-verify.png" title="Verifying configured credentials" />

If the verification information looks appropriate, then you have completed
the configuration of GSuite SSO. Members of your team should now be able to log
into the dbt Cloud application at `https://cloud.getdbt.com/enterprise-login/<login-slug>`.
