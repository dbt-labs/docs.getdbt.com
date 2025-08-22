---
title: "Set up SSO with Microsoft Entra ID (formerly Azure AD)"
description: "Learn how dbt administrators can use Microsoft Entra ID to control access in a dbt account."
id: "set-up-sso-microsoft-entra-id"
sidebar_label: "Set up SSO with Microsoft Entra ID"
---

# Set up SSO with Microsoft Entra ID <Lifecycle status="managed, managed_plus" />

import SetUpPages from '/snippets/_sso-docs-mt-available.md';

<SetUpPages features={'/snippets/_sso-docs-mt-available.md'}/>

<Constant name="cloud" /> Enterprise-tier plans support single-sign on via Microsoft Entra ID (formerly Azure AD). You will need permissions to create and manage a new Entra ID application. Currently supported features include:

* IdP-initiated SSO
* SP-initiated SSO
* Just-in-time provisioning

## Configuration

<Constant name="cloud" /> supports both single tenant and multi-tenant Microsoft Entra ID (formerly Azure AD) SSO Connections. For most Enterprise purposes, you will want to use the single-tenant flow when creating a Microsoft Entra ID Application.

### Creating an application

Log into the Azure portal for your organization. Using the [**Microsoft Entra ID**](https://portal.azure.com/#home) page, you will need to select the appropriate directory and then register a new application.

1. Under **Manage**, select **App registrations**.
2. Click **+ New Registration** to begin creating a new application registration.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-app-registration-empty.png" width="80%" title="Creating a new app registration"/>

3. Supply configurations for the **Name** and **Supported account types** fields as shown in the following table:

| Field | Value |
| ----- | ----- |
| **Name** | <Constant name="cloud" /> |
| **Supported account types** | Accounts in this organizational directory only _(single tenant)_ |

4. Configure the **Redirect URI**. The table below shows the appropriate Redirect URI values for single-tenant and multi-tenant deployments. For most enterprise use-cases, you will want to use the single-tenant Redirect URI. Replace `YOUR_AUTH0_URI` with the [appropriate Auth0 URI](/docs/cloud/manage-access/sso-overview#auth0-uris) for your region and plan.

| Application Type | Redirect URI |
| ----- | ----- |
| Single-tenant _(recommended)_ | `https://YOUR_AUTH0_URI/login/callback` |
| Multi-tenant | `https://YOUR_AUTH0_URI/login/callback` |

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-new-application-alternative.png" width="70%" title="Configuring a new app registration"/>

5. Save the App registration to continue setting up Microsoft Entra ID SSO.

:::info Configuration with the new Microsoft Entra ID interface (optional)

Depending on your Microsoft Entra ID settings, your App Registration page might look different than the screenshots shown earlier. If you are _not_ prompted to configure a Redirect URI on the **New Registration** page, then follow steps 6 - 7 below after creating your App Registration. If you were able to set up the Redirect URI in the steps above, then skip ahead to [step 8](#adding-users-to-an-enterprise-application).
:::

6. After registering the new application without specifying a Redirect URI, click on **App registration** and then navigate to the **Authentication** tab for the new application.

7. Click **+ Add platform** and enter a Redirect URI for your application. See step 4 above for more information on the correct Redirect URI value for your <Constant name="cloud" /> application.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-redirect-uri.png" title="Configuring a Redirect URI"/>

### Azure &lt;-&gt; dbt User and Group mapping

:::important

There is a [limitation](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#important-caveats-for-this-functionality) on the number of groups Azure will emit (capped at 150) via the SSO token, meaning if a user belongs to more than 150 groups, it will appear as though they belong to none. To prevent this, configure [group assignments](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal?pivots=portal) with the <Constant name="cloud" /> app in Azure and set a [group claim](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#add-group-claims-to-tokens-for-saml-applications-using-sso-configuration) so Azure emits only the relevant groups.

:::


The Azure users and groups you will create in the following steps are mapped to groups created in <Constant name="cloud" /> based on the group name. Reference the docs on [enterprise permissions](enterprise-permissions) for additional information on how users, groups, and permission sets are configured in <Constant name="cloud" />.

The <Constant name="dbt_platform" /> uses the **User principal name** (UPN) in Microsoft Entra ID to identify and match users logging in to <Constant name="cloud" /> through SSO. The UPN is usually formatted as an email address.

### Adding users to an Enterprise application

Once you've registered the application, the next step is to assign users to it. Add the users you want to be viewable to dbt with the following steps:

8. Navigate back to the [**Default Directory**](https://portal.azure.com/#home) (or **Home**) and click **Enterprise Applications**.
9. Click the name of the application you created earlier.
10. Click **Assign Users and Groups**.
11. Click **Add User/Group**.
12. Assign additional users and groups as needed.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-enterprise-app-users.png" title="Adding Users to an Enterprise Application a Redirect URI"/>

:::info User assignment required?
Under **Properties** check the toggle setting for **User assignment required?** and confirm it aligns to your requirements. Most customers will want this toggled to **Yes** so that only users/groups explicitly assigned to <Constant name="cloud" /> will be able to sign in. If this setting is toggled to **No** any user will be able to access the application if they have a direct link to the application per [Microsoft Entra ID Documentation](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/assign-user-or-group-access-portal#configure-an-application-to-require-user-assignment)
:::

### Configuring permissions

13. Navigate back to [**Default Directory**](https://portal.azure.com/#home) (or **Home**) and then **App registration**.
14. Select your application and then select **API permissions**.
15. Click **+Add a permission** and add the permissions shown below.

| API Name | Type | Permission |
| -------- | ---- | ---------- |
| Microsoft Graph | Delegated | `Directory.AccessAsUser.All` |
| Microsoft Graph | Delegated | `User.Read` |

`User.Read` is the only strictly required permission, but configuring `Directory.Accessasuser.all` prevents users from receiving extra prompts for consent when they log in. It lets <Constant name="cloud" /> see what groups the user belongs to and isn't used for anything else.

16. Save these permissions, then click **Grant admin consent** to grant admin consent for this directory on behalf of all of your users.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-permissions-overview.png" title="Configuring application permissions" />

### Creating a client secret

17. Under **Manage**, click **Certificates & secrets**.
18. Click **+New client secret**.
19. Name the client secret "<Constant name="cloud" />" (or similar) to identify the secret.
20. Select **730 days (24 months)** as the expiration value for this secret (recommended).
21. Click **Add** to finish creating the client secret value (not the client secret ID).
22. Record the generated client secret somewhere safe. Later in the setup process, we'll use this client secret in <Constant name="cloud" /> to finish configuring the integration.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-secret-config.png" title="Configuring certificates & secrets" />
<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-secret-saved.png" title="Recording the client secret" />

### Collect client credentials

23. Navigate to the **Overview** page for the app registration.
24. Note the **Application (client) ID** and **Directory (tenant) ID** shown in this form and record them along with your client secret. We'll use these keys in the steps below to finish configuring the integration in <Constant name="cloud" />.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-overview.png" title="Collecting credentials. Store these somewhere safe" />

## Configuring dbt

To complete setup, follow the steps below in the <Constant name="cloud" /> application.

### Supplying credentials

25. From <Constant name="cloud" />, click on your account name in the left side menu and select **Account settings**.
26. Click **Single sign-on** from the menu.
27. Click the **Edit** button and supply the following SSO details:

| Field | Value |
| ----- | ----- |
| **Log&nbsp;in&nbsp;with** | Microsoft Entra ID Single Tenant |
| **Client&nbsp;ID** | Paste the **Application (client) ID** recorded in the steps above |
| **Client&nbsp;Secret** | Paste the **Client Secret** (remember to use the Secret Value instead of the Secret ID) from the steps above; <br />**Note:** When the client secret expires, an Entra ID admin will have to generate a new one to be pasted into <Constant name="cloud" /> for uninterrupted application access. |
| **Tenant&nbsp;ID** | Paste the **Directory (tenant ID)** recorded in the steps above |
| **Domain** | Enter the domain name for your Azure directory (such as `fishtownanalytics.com`). Only use the primary domain; this won't block access for other domains. |
| **Slug** | Enter your desired login slug. Users will be able to log into <Constant name="cloud" /> by navigating to `https://YOUR_ACCESS_URL/enterprise-login/LOGIN-SLUG`, replacing `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/cloud/manage-access/sso-overview#auth0-uris) for your region and plan. Login slugs must be unique across all <Constant name="cloud" /> accounts, so pick a slug that uniquely identifies your company. |

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-cloud-sso.png" title="Configuring Entra ID AD SSO in dbt" />

28.  Click **Save** to complete setup for the Microsoft Entra ID SSO integration. From here, you can navigate to the login URL generated for your account's _slug_ to test logging in with Entra ID.

<Snippet path="login_url_note" />

### Additional configuration options

The **Single sign-on** section also contains additional configuration options which are located after the credentials fields.

- **Include all groups:** Retrieve all groups to which a user belongs from your identity provider. If a user is a member of nested groups, it will also include the parent groups. When this option is disabled, only groups where the user has direct membership will be supplied.  This option is enabled by default.

- **Maximum number of groups to retrieve:** Provides a configurable limit to the number of groups to retrieve for users.  By default, this is set to 250 groups, but this number can be increased if users' group memberships exceed that amount.

## Setting up RBAC
Now you have completed setting up SSO with Entra ID, the next steps will be to set up
[RBAC groups](/docs/cloud/manage-access/enterprise-permissions) to complete your access control configuration.

## Troubleshooting tips

Ensure that the domain name under which user accounts exist in Azure matches the domain you supplied in [Supplying credentials](#supplying-credentials) when you configured SSO.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-get-domain.png" title="Obtaining the user domain from Azure" />

## Learn more

<WistiaVideo id="e395rnl0cy" paddingTweak="62.25%" />
