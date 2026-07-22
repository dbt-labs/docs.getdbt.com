---
title: "Set up external OAuth for Redshift"
id: redshift-external-oauth
description: "Configuration instructions for dbt and external OAuth connections with Redshift"
sidebar_label: "Set up external OAuth with Redshift"
pagination_next: null
pagination_prev: null
---

# Set up external OAuth with Redshift <Lifecycle status="managed, managed_plus" />

import AboutExternal from '/snippets/_about-external-oauth.md';

<AboutExternal/>

## Getting started

The process of setting up external OAuth will require a little bit of back-and-forth between your <Constant name="dbt" />, IdP, and data warehouse accounts, and having them open in multiple browser tabs will help speed up the configuration process:

- **<Constant name="dbt" />:** You’ll primarily be working in the **Account settings** —> **Integrations** page. You will need [proper permission](/docs/platform/manage-access/enterprise-permissions) to set up the integration and create the connections.
- **Identity providers:**
   - **Okta:** You’ll be working in multiple areas of the Okta account, but you can start in the **Applications** section. You will need permissions to [create an application](https://help.okta.com/en-us/content/topics/security/custom-admin-role/about-role-permissions.htm#Application_permissions) and an [authorization server](https://help.okta.com/en-us/content/topics/security/custom-admin-role/about-role-permissions.htm#Authorization_server_permissions).
   - **Entra ID** An admin with access to create [Entra ID apps](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/custom-available-permissions) who is also a user in the data warehouse is required. 
- **Data warehouse:**
   - **Redshift:** Create and manage the [Identity Center integration](https://aws.amazon.com/blogs/big-data/integrate-identity-provider-idp-with-amazon-redshift-query-editor-v2-and-sql-client-using-aws-iam-identity-center-for-seamless-single-sign-on/) with your identity provider.

If the admins that handle these products are all different people, it’s better to have them coordinating simultaneously to reduce friction.

Ensure your Amazon admins have completed the [Amazon Identity Center integration](https://aws.amazon.com/blogs/big-data/integrate-identity-provider-idp-with-amazon-redshift-query-editor-v2-and-sql-client-using-aws-iam-identity-center-for-seamless-single-sign-on/) with Okta or Entra ID.


## Identity provider configuration

Select a supported identity provider (IdP) for instructions on configuring external OAuth in their environment and completing the integration in <Constant name="dbt" />:

<Tabs>

<TabItem value="Okta">

### 1. Initialize the dbt settings

1. In your <Constant name="dbt" /> account, navigate to **Account settings** —> **Integrations**.
2. Scroll down to **Custom integrations** and click **Add integrations**
3. Leave this window open. You can set the **Integration type** to Okta and note the **Redirect URI** at the bottom of the page. Copy this to your clipboard for use in the next steps.

<Lightbox src="/img/docs/dbt-platform/callback-uri.png" width="60%" title="Copy the callback URI at the bottom of the integration page in dbt." />

### 2. Create the Okta app

1. Expand the **Applications** section from the Okta dashboard and click **Applications.** Click the **Create app integration** button.
2. Select **OIDC** as the sign-in method and **Web applications** as the application type. Click **Next**.

<Lightbox src="/img/docs/dbt-platform/create-okta-app.png" width="60%" title="The Okta app creation window with OIDC and Web Application selected." />

3. Give the application an appropriate name, something like “External OAuth app for <Constant name="dbt" />,” that will make it easily identifiable.
4. In the **Grant type** section, enable the **Refresh token** option.
5. Scroll down to the **Sign-in redirect URIs** option. You’ll need to paste the redirect URI you gathered from <Constant name="dbt" /> in step 1.3.

<Lightbox src="/img/docs/dbt-platform/configure-okta-app.png" width="60%" title="The Okta app configuration window with the sign-in redirect URI configured to the dbt value." />

6. Save the app configuration. You’ll come back to it, but move on to the next steps for now.

### 3. Create the Okta API

1. Expand the **Security** section and click **API** from the Okta sidebar menu.
2. On the API screen, click **Add authorization server**. Give the authorization server a name (a nickname for your data warehouse account would be appropriate). For the **Audience** field, copy and paste your data warehouse login URL. Give the server an appropriate description and click **Save**.

<Lightbox src="/img/docs/dbt-platform/create-okta-api.png" width="60%" title="The Okta API window with the Audience value set." />

3. On the authorization server config screen, open the **Metadata URI** in a new tab. You’ll need information from this screen in later steps.

<Lightbox src="/img/docs/dbt-platform/metadata-uri.png" width="60%" title="The Okta API settings page with the metadata URI highlighted." />

<Lightbox src="/img/docs/dbt-platform/metadata-example.png" width="60%" title="Sample output of the metadata URI." />

4. Click on the **Scopes** tab and **Add scope**. In the **Name** field, add `session:role-any`. (Optional) Configure **Display phrase** and **Description** and click **Create**.

<Lightbox src="/img/docs/dbt-platform/add-api-scope.png" width="60%" title="API scope configured in the Add Scope window." />

5. Open the **Access policies** tab and click **Add policy**. Give the policy a **Name** and **Description** and set **Assign to** as **The following clients**. Start typing the name of the app you created in step 2.3, and you’ll see it autofill. Select the app and click **Create Policy**.

<Lightbox src="/img/docs/dbt-platform/add-api-assignment.png" width="60%" title="Assignment field autofilling the value." />

6. On the **access policy** screen, click **Add rule**.

<Lightbox src="/img/docs/dbt-platform/add-api-rule.png" width="60%" title="API Add rule button highlighted." />

7. Give the rule a descriptive name and scroll down to **token lifetimes**. Configure the **Access token lifetime is**, **Refresh token lifetime is**, and **but will expire if not used every** settings according to your organizational policies. We recommend the defaults of 1 hour and 90 days. Stricter rules increase the odds of your users having to re-authenticate.

<Lightbox src="/img/docs/dbt-platform/configure-token-lifetime.png" width="60%" title="Token lifetime settings in the API rule window." />

8. Navigate back to the **Settings** tab and leave it open in your browser. You’ll need some of the information in later steps.

### 4. Create the OAuth settings in the data warehouse

Ensure your Amazon admins have completed the Identity Center integration with Okta.

Configure the Okta application and APIs in accordance with your Amazon configs.

### 5. Configuring the integration in dbt

1. Navigate back to the <Constant name="dbt" /> **Account settings** —> **Integrations** page you were on at the beginning. It’s time to start filling out all of the fields.
   1. `Integration name`: Give the integration a descriptive name that includes identifying information about the Okta environment so future users won’t have to guess where it belongs.
   2. `Client ID` and `Client secrets`: Retrieve these from the Okta application page.
   <Lightbox src="/img/docs/dbt-platform/gather-clientid-secret.png" width="60%" title="The client ID and secret highlighted in the Okta app." />
   3. Authorize URL and Token URL: Found in the metadata URI.
   <Lightbox src="/img/docs/dbt-platform/gather-authorization-token-endpoints.png" width="60%" title="The authorize and token URLs highlighted in the metadata URI." />

2. **Save** the configuration


### 6. Create a new connection in dbt


1. Navigate to **Account settings** and click **Connections** from the menu. Click **New connection**.
2. Configure the `Account`, `Database`, and `Warehouse` as you normally would, and for the `OAuth method`, select the external OAuth you just created.


<Lightbox src="/img/docs/dbt-platform/configure-new-connection.png" width="60%" title="The new configuration window in dbt with the External OAuth showing as an option." />


3. Scroll down to the **External OAuth** configurations box and select the config from the list.


<Lightbox src="/img/docs/dbt-platform/select-oauth-config.png" width="60%" title="The new connection displayed in the External OAuth Configurations box." />

4. **Save** the connection, and you have now configured External OAuth with Okta!

</TabItem>

<TabItem value="Entra ID">

### 1. Initialize the dbt settings

1. In your <Constant name="dbt" /> account, navigate to **Account settings** —> **Integrations**.
2. Scroll down to **Custom integrations** and click **Add integrations**.
3. Leave this window open. You can set the **Integration type** to Entra ID and note the **Redirect URI** at the bottom of the page. Copy this to your clipboard for use in the next steps.

### 2. Create the Entra ID apps

You’ll create two apps in the Azure portal: A resource server and a client app.

#### Create a resource server

In your Entra ID account: 

1. From the app registrations screen, click **New registration**.
    1. Give the app a name.
    2. Ensure **Supported account types** are set to “Accounts in this organizational directory only (`Org name` - Single Tenant).”
    3. Click **Register** to see the application’s overview.
2. From the app overview page left menu, click **Expose an API**.
3. Click **Add** next to **Application ID URI**. The field will automatically populate. 
4. Click **Save**.

   <Lightbox src="/img/docs/dbt-platform/create-resource-server.png" width="60%" title="Create the Entra ID resource server." />

5. Record the `value` field for use in a future step.
6. From the same screen, click **Add scope**:
    1. Name the scope `dbt-redshift`.
    2. Set **Who can consent?** to **Admins and users**.
    3. Set **Admin consent display name** to `dbt-redshift` and give it a description.
    4. Ensure **State** is set to **Enabled**.
    5. Click **Add scope**.


#### Create a client app

1. From the **App registration page**, click **New registration**.
    1. Give the app a name that uniquely identifies it as the client app.
    2. Ensure **Supported account types** are set to “Accounts in this organizational directory only (`Org name` - Single Tenant).”
    3. Set the **Redirect URI** to **Web** and copy/paste the **Redirect URI** from dbt into the field.
    4. Click **Register**.
2. From the app overview page, click **API permissions** from the left menu, and click **Add permission**.

   <Lightbox src="/img/docs/dbt-platform/add-permission-entra.png" width="60%" title="Add permissions to the Entra ID app." />

3. From the pop-out screen, click **APIs my organization uses**, search for the resource server name from the previous steps, and click it.
4. Ensure the box for the **Permissions** `dbt-redshift` is enabled and click **Add permissions**.
5. Click **Grant admin consent** and from the popup modal click **Yes**.
6. From the left menu, click **Certificates and secrets** and click **New client secret**. Name the secret, set an expiration, and click **Add**. 
    - **Note**: Microsoft does not allow “forever” as an expiration date. The maximum time is two years. Documenting the expiration date so you can refresh the secret before the expiration or user authorization fails is essential.
7. Record the `value` for use in a future step and record it immediately. 
   - **Note**: Entra ID will not display this value again once you navigate away from this screen.

### 3. Configuring the integration in dbt

1. Navigate back to the <Constant name="dbt" /> **Account settings** —> **Integrations** page you were on at the beginning. It’s time to start filling out all of the fields. There will be some back-and-forth between the Entra ID account and <Constant name="dbt" />.
2. `Integration name`: Give the integration a descriptive name that includes identifying information about the Entra ID environment so future users won’t have to guess where it belongs.
3. `Client secrets`: Found in the Client ID from the **Certificates and secrets** page. `Value` is the `Client secret`. Note that it only appears when created; _Microsoft hides the secret if you return later, and you must recreate it._
4. `Client ID`: Copy the’ Application (client) ID’ on the overview page for the client ID app.
5. `Authorization URL` and `Token URL`: From the client ID app, open the `Endpoints` tab. These URLs map to the `OAuth 2.0 authorization endpoint (v2)` and `OAuth 2.0 token endpoint (v2)` fields. *You must use v2 of the `OAuth 2.0 authorization endpoint`. Do not use V1.* You can use either version of the `OAuth 2.0 token endpoint`.
6. `Application ID URI`: Copy the `Application ID URI` field from the resource server’s Overview screen.


</TabItem>

</Tabs>

## Configure the Trusted Token Issuer in IAM IdC

A *trusted token issuer* generates an access token that is used to identify a user, and then authenticates that user. This essentially lets services outside of the AWS ecosystem, such as the dbt platform, connect to IAM IdC (and Redshift) with access tokens they have generated or retrieved from an external IdP (Entra ID or Okta). 

The following steps are outlined per [this blog post](https://aws.amazon.com/blogs/big-data/integrate-tableau-and-microsoft-entra-id-with-amazon-redshift-using-aws-iam-identity-center/): 

1. Open the AWS Management Console and navigate to [IAM Identity Center](https://console.aws.amazon.com/singlesignon), and then to the **Settings**.
2. Select the **Authentication** tab and under **Trusted token issuers**, choose **Create trusted token issuer**.
3. On the **Set up an external IdP to issue trusted tokens** page, under **Trusted token issuer details**, do the following:
    1. For **Issuer URL**, enter the OIDC discovery URL of the external IdP that will issue tokens for trusted identity propagation. _Include the forward slash at the end of the URL_. 
    2. For **Trusted token issuer name**, enter a name to identify this TTI in IAM Identity Center and the application console.
    3. Under Map attributes, do the following:
        1. For **Identity provider attribute**, select an attribute from the list to map to an attribute in the Identity Center identity store. You can choose:
         - Email 
         - Object Identifier
         - Subject
         - Other &mdash; When using this options with UPN, it's been our experience that `upn` matched up with `Email`.

## Configure Redshift IdC application to utilize TTI

To start, select **IAM Identity Center connection** from the Amazon Redshift console menu.

   <Lightbox src="/img/docs/dbt-platform/redshift-idc.png" width="60%" title="The AWS Redshift console." />

1. Select the Amazon Redshift application that you created as part of the setup.
2. Select the **Client connections tab** and choose **Edit**.
3. Choose **Yes** under **Configure client connections that use third-party IdPs**.
4. Select the checkbox for **Trusted token issuer** that you created in the previous section.
5. Enter the aud claim value under **Configure selected trusted token issuers**. **This should be the application ID URI you set for the integration in the dbt platform.**


## Finalizing the dbt configuration

If you have an existing connection, make sure that the OAuth method is set to **External OAuth** and select the integration you created in an earlier step. Otherwise, create a new Redshift connection, being sure to set values for:
- **Server Hostname** 
- **OAuth Method** 
- **Database name** (this field can be found under the **Optional Settings**)

This connection should be set as the connection for a development environment in an existing or new project. 

Once the connection has been assigned to a development environment, you can configure your user credentials for that development environment under `Account Settings > Your Profile > Credentials > <Your Project Name>`. Set the authentication method to `External OAuth`, set the `schema` and other fields if desired, and save the credentials. You can then click the `Connect to Redshift` button.

### Verify connection in Studio

Once your development session has initialized, you can test that you’re able to connect to Redshift using external OAuth by running `dbt debug`.
