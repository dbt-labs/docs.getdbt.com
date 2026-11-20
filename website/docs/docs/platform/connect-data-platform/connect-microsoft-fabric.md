---
title: "Connect Microsoft Fabric"
description: "Configure Microsoft Fabric connection."
sidebar_label: "Connect Microsoft Fabric"
availability:
  surface: platform
  access: login_required
---

## Supported authentication methods
The supported authentication methods are: 
- Microsoft Entra service principal
- Microsoft Entra password
- Microsoft Entra ID OAuth (development environments only)

SQL password (LDAP) is not supported in Microsoft Fabric Data Warehouse so you must use Microsoft Entra ID. This means that to use [Microsoft Fabric](https://www.microsoft.com/en-us/microsoft-fabric) in <Constant name="dbt" />, you need at least one Microsoft Entra service principal to connect <Constant name="dbt" /> to Fabric for deployment environments. For development, each user can use their own service principal or sign in with [OAuth](#microsoft-entra-id-oauth).

### Microsoft Entra service principal 
The following are the required fields for setting up a connection with a Microsoft Fabric using Microsoft Entra service principal authentication. 

| Field | Description |
| --- | --- |
| **Server** | The service principal's **host** value for the Fabric test endpoint. |
| **Port** | The port to connect to Microsoft Fabric. You can use `1433` (the default), which is the standard SQL server port number. |
| **Database** | The service principal's **database** value for the Fabric test endpoint. |
| **Authentication** | Choose **Service Principal** from the dropdown. | 
| **Tenant ID** | The service principal's **Directory (tenant) ID**. |
| **Client ID** | The service principal's **application (client) ID**. |
| **Client secret** | The service principal's **client secret** (not the **client secret id**). |  


### Microsoft Entra password 

The following are the required fields for setting up a connection with a Microsoft Fabric using Microsoft Entra password authentication. 

| Field | Description |
| --- | --- |
| **Server** | The server hostname to connect to Microsoft Fabric. |
| **Port** | The server port. You can use `1433` (the default), which is the standard SQL server port number. |
| **Database** | The database name. |
| **Authentication** | Choose **Active Directory Password** from the dropdown. | 
| **User** | The Microsoft Entra username. |
| **Password** | The Microsoft Entra password. |

### Microsoft Entra ID OAuth

With OAuth, each developer signs in to Fabric with their own Microsoft Entra account (including multi-factor authentication) instead of sharing a password or service principal. Queries in the <Constant name="studio_ide" /> and <Constant name="platform_cli" /> then run as that developer.

Before you begin, note the following:

- OAuth for Fabric is available on Enterprise and Enterprise+ plans.
- OAuth works in development environments only. Deployment environments don't have a signed-in user, so jobs still need a service principal.
- You need a <Constant name="dbt" /> account admin and a Microsoft Entra admin who can create [app registrations](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app). Setup goes faster if you keep both <Constant name="dbt" /> and the Azure portal open in separate browser tabs.
- Each developer needs access to the Fabric workspace and warehouse with their own Entra account.

#### 1. Start the integration in dbt

1. In <Constant name="dbt" />, go to **Account settings** and click **Integrations**.
2. Scroll to **Custom integrations** and click **Add integrations**.
3. Set the **Integration type** to **Entra ID**.
4. Copy the **Redirect URI** at the bottom of the page. Leave this window open, you come back to it in step 3.

#### 2. Register an app in Microsoft Entra

1. In the Azure portal, open **Microsoft Entra ID** and click **App registrations**, then **New registration**.
2. Give the app a name that's easy to spot later, like `dbt Fabric OAuth`.
3. Set **Supported account types** to **Accounts in this organizational directory only**.
4. Under **Redirect URI**, select **Web** and paste the redirect URI you copied from <Constant name="dbt" />.
5. Click **Register**.
6. Click **API permissions**, then **Add a permission**. Under **APIs my organization uses**, search for **Azure SQL Database** and add the delegated `user_impersonation` permission. Fabric only accepts tokens issued for its SQL endpoint, and this permission is what lets <Constant name="dbt" /> request one.
7. Click **Certificates & secrets**, then **New client secret**. Name the secret, set an expiration, and click **Add**.
8. Copy the secret's **Value** right away. Microsoft hides it after you leave the page.

Client secrets expire (the maximum is two years). Note the expiration date so you can rotate the secret before developers lose access.

#### 3. Finish the integration in dbt

Back on the **Integrations** page in <Constant name="dbt" />, fill out the fields and click **Save**:

| Field | Description |
| --- | --- |
| **Integration name** | A descriptive name, so future admins know which Entra tenant it belongs to. |
| **Client ID** | The **Application (client) ID** from the app's **Overview** page. |
| **Client secret** | The secret **Value** you copied in the previous step. |
| **Authorize URL** | The **OAuth 2.0 authorization endpoint (v2)** from the app's **Endpoints** tab. |
| **Token URL** | The **OAuth 2.0 token endpoint (v2)** from the app's **Endpoints** tab. |

#### 4. Add the integration to your Fabric connection

1. Go to **Account settings** and click **Connections**.
2. Select your Fabric connection (or click **New connection** and enter the **Server**, **Port**, and **Database** as usual).
3. For the **OAuth method**, select the integration you created.
4. Click **Save**.

#### 5. Link developer accounts

Each developer links their Microsoft account once:

1. Go to **Account settings**. Under **Your profile**, select **Credentials** and choose the project.
2. Set **Authentication** to **External OAuth**.
3. Follow the prompt to sign in with your Microsoft account and approve the access request.

**Test connection** isn't available while **External OAuth** is selected. <Constant name="dbt" /> checks the connection for you after you link your account.

After you link your account, <Constant name="dbt" /> refreshes your access in the background. If your sign-in stops working (for example, after a password reset or a policy change), link your account again.

## Configuration 

To learn how to optimize performance with data platform-specific configurations in <Constant name="dbt" />, refer to [Microsoft Fabric Data Warehouse configurations](/reference/resource-configs/fabric-configs).
