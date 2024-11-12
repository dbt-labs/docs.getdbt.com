---
title: "Set up external OAuth"
id: external-oauth
description: "Configuration instructions for dbt Cloud and external OAuth connections"
sidebar_label: "Set up external OAuth"
pagination_next: null
pagination_prev: null
---

# Set up external OAuth <Lifecycle status="enteprise" />

:::note 

This feature is currently only available for the Okta and Entra ID identity providers and [Snowflake connections](/docs/cloud/connect-data-platform/connect-snowflake).

:::


dbt Cloud Enterprise supports [external OAuth authentication](https://docs.snowflake.com/en/user-guide/oauth-ext-overview) with external providers. When External OAuth is enabled, users can authorize their Development credentials using single sign-on (SSO) via the identity provider (IdP).  This grants users authorization to access multiple applications, including dbt Cloud, without their credentials being shared with the service. Not only does this make the process of authenticating for development environments easier on the user, it provides an additional layer of security to your dbt Cloud account. 

## Getting started

The process of setting up external OAuth will require a little bit of back-and-forth between your dbt Cloud, IdP, and Snowflake accounts, and having them open in multiple browser tabs will help speed up the configuration process:

- **dbt Cloud:** You’ll primarily be working in the **Account Settings** —> **Integrations** page. You will need [proper permission](/docs/cloud/manage-access/enterprise-permissions) to set up the integration and create the connections.
- **Snowflake:** Open a worksheet in an account that has permissions to [create a security integration](https://docs.snowflake.com/en/sql-reference/sql/create-security-integration).
- **Okta:** You’ll be working in multiple areas of the Okta account, but you can start in the **Applications** section. You will need permissions to [create an application](https://help.okta.com/en-us/content/topics/security/custom-admin-role/about-role-permissions.htm#Application_permissions) and an [authorization server](https://help.okta.com/en-us/content/topics/security/custom-admin-role/about-role-permissions.htm#Authorization_server_permissions).
- **Entra ID** An admin with access to create [Entra ID apps](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/custom-available-permissions) who is also a user in Snowflake is required. 

If the admins that handle these products are all different people, it’s better to have them coordinating simultaneously to reduce friction.

### Snowflake commands

The following is a template for creating the OAuth configurations in the Snowflake environment:

```sql

create security integration your_integration_name
type = external_oauth
enabled = true
external_oauth_type = okta
external_oauth_issuer = ''
external_oauth_jws_keys_url = ''
external_oauth_audience_list = ('')
external_oauth_token_user_mapping_claim = 'sub'
external_oauth_snowflake_user_mapping_attribute = 'email_address'
external_oauth_any_role_mode = 'ENABLE'

```

The `external_oauth_token_user_mapping_claim` and `external_oauth_snowflake_user_mapping_attribute` can be modified based on the your organizations needs. These values point to the claim in the users’ token. In the example, Snowflake will look up the Snowflake user whose `email` matches the value in the `sub` claim. 

**Note:** The Snowflake default roles ACCOUNTADMIN, ORGADMIN, or SECURITYADMIN, are blocked from external OAuth by default and they will likely fail to authenticate. See the [Snowflake documentation](https://docs.snowflake.com/en/sql-reference/sql/create-security-integration-oauth-external) for more information. 

## Identity provider configuration

Select a supported identity provider (IdP) for instructions on configuring external OAuth in their environment and completing the integration in dbt Cloud.

<Expandable alt_header="Okta">

### 1. Initialize the dbt Cloud settings

1. In your dbt Cloud account, navigate to **Account settings** —> **Integrations**.
2. Scroll down to **Custom integrations** and click **Add integrations**
3. Leave this window open. You can set the **Integration type** to Okta and note the **Redirect URI** at the bottom of the page. Copy this to your clipboard for use in the next steps.

<Lightbox src="/img/docs/dbt-cloud/callback-uri.png" width="60%" title="Copy the callback URI at the bottom of the integration page in dbt Cloud" />

### 2. Create the Okta app

1. Expand the **Applications** section from the Okta dashboard and click **Applications.** Click the **Create app integration** button.
2. Select **OIDC** as the sign-in method and **Web applications** as the application type. Click **Next**.

<Lightbox src="/img/docs/dbt-cloud/create-okta-app.png" width="60%" title="The Okta app creation window with OIDC and Web Application selected" />

3. Give the application an appropriate name, something like “External OAuth app for dbt Cloud,” that will make it easily identifiable.
4. In the **Grant type** section, enable the **Refresh token** option.
5. Scroll down to the **Sign-in redirect URIs** option. You’ll need to paste the redirect URI you gathered from dbt Cloud in step 1.3.

<Lightbox src="/img/docs/dbt-cloud/configure-okta-app.png" width="60%" title="The Okta app configuration window with the sign-in redirect URI configured to the dbt Cloud value" />

6. Save the app configuration. You’ll come back to it, but move on to the next steps for now.

### 3. Create the Okta API

1. Expand the **Security** section and click **API** from the Okta sidebar menu.
2. On the API screen, click **Add authorization server**. Give the authorization server a name (a nickname for your Snowflake account would be appropriate). For the **Audience** field, copy and paste your Snowflake login URL (for example, https://abdc-ef1234.snowflakecomputing.com). Give the server an appropriate description and click **Save**.

<Lightbox src="/img/docs/dbt-cloud/create-okta-api.png" width="60%" title="The Okta API window with the Audience value set to the Snowflake URL" />

3. On the authorization server config screen, open the **Metadata URI** in a new tab. You’ll need information from this screen in later steps.

<Lightbox src="/img/docs/dbt-cloud/metadata-uri.png" width="60%" title="The Okta API settings page with the metadata URI highlighted" />

<Lightbox src="/img/docs/dbt-cloud/metadata-example.png" width="60%" title="Sample output of the metadata URI" />

4. Click on the **Scopes** tab and **Add scope**. In the **Name** field, add `session:role-any`. (Optional) Configure **Display phrase** and **Description** and click **Create**.

<Lightbox src="/img/docs/dbt-cloud/add-api-scope.png" width="60%" title="API scope configured in the Add Scope window" />

5. Open the **Access policies** tab and click **Add policy**. Give the policy a **Name** and **Description** and set **Assign to** as **The following clients**. Start typing the name of the app you created in step 2.3, and you’ll see it autofill. Select the app and click **Create Policy**.

<Lightbox src="/img/docs/dbt-cloud/add-api-assignment.png" width="60%" title="Assignment field autofilling the value" />

6. On the **access policy** screen, click **Add rule**.

<Lightbox src="/img/docs/dbt-cloud/add-api-rule.png" width="60%" title="API Add rule button highlighted" />

7. Give the rule a descriptive name and scroll down to **token lifetimes**. Configure the **Access token lifetime is**, **Refresh token lifetime is**, and **but will expire if not used every** settings according to your organizational policies. We recommend the defaults of 1 hour and 90 days. Stricter rules increase the odds of your users having to re-authenticate.

<Lightbox src="/img/docs/dbt-cloud/configure-token-lifetime.png" width="60%" title="Toke lifetime settings in the API rule window" />

8. Navigate back to the **Settings** tab and leave it open in your browser. You’ll need some of the information in later steps.

### 4. Create the OAuth settings in Snowflake

1. Open up a Snowflake worksheet and copy/paste the following:

```sql

create security integration your_integration_name
type = external_oauth
enabled = true
external_oauth_type = okta
external_oauth_issuer = ''
external_oauth_jws_keys_url = ''
external_oauth_audience_list = ('')
external_oauth_token_user_mapping_claim = 'sub'
external_oauth_snowflake_user_mapping_attribute = 'email_address'
external_oauth_any_role_mode = 'ENABLE'

```

2. Change `your_integration_name` to something appropriately descriptive. For example, `dev_OktaAccountNumber_okta`. Copy the `external_oauth_issuer` and `external_oauth_jws_keys_url` from the metadata URI in step 3.3. Use the same Snowflake URL you entered in step 3.2 as the `external_oauth_audience_list`.

Adjust the other settings as needed to meet your organization's configurations in Okta and Snowflake.

<Lightbox src="/img/docs/dbt-cloud/gather-uris.png" width="60%" title="The issuer and jws keys URIs in the metadata URL" />

3. Run the steps to create the integration in Snowflake.

### 5. Configuring the integration in dbt Cloud

1. Navigate back to the dbt Cloud **Account settings** —> **Integrations** page you were on at the beginning. It’s time to start filling out all of the fields.
   1. `Integration name`: Give the integration a descriptive name that includes identifying information about the Okta environment so future users won’t have to guess where it belongs.
   2. `Client ID` and `Client secrets`: Retrieve these from the Okta application page.
   <Lightbox src="/img/docs/dbt-cloud/gather-clientid-secret.png" width="60%" title="TThe client ID and secret highlighted in the Okta app" />
   3. Authorize URL and Token URL: Found in the metadata URI.
   <Lightbox src="/img/docs/dbt-cloud/gather-authorization-token-endpoints.png" width="60%" title="The authorize and token URLs highlighted in the metadata URI" />

2. **Save** the configuration


### 6. Create a new connection in dbt Cloud


1. Navigate the **Account settings** and click **Connections** from the menu. Click **Add connection**.
2. Configure the `Account`, `Database`, and `Warehouse` as you normally would, and for the `OAuth method`, select the external OAuth you just created.


<Lightbox src="/img/docs/dbt-cloud/configure-new-connection.png" width="60%" title="The new configuration window in dbt Cloud with the External OAuth showing as an option" />


3. Scroll down to the **External OAuth** configurations box and select the config from the list.


<Lightbox src="/img/docs/dbt-cloud/select-oauth-config.png" width="60%" title="The new connection displayed in the External OAuth Configurations box" />


4. **Save** the connection, and you have now configured External OAuth with Okta and Snowflake!

</Expandable>

<Expandable alt_header="Entra ID">

### 1. Initialize the dbt Cloud settings

1. In your dbt Cloud account, navigate to **Account settings** —> **Integrations**.
2. Scroll down to **Custom integrations** and click **Add integrations**.
3. Leave this window open. You can set the **Integration type** to Entra ID and note the **Redirect URI** at the bottom of the page. Copy this to your clipboard for use in the next steps.

### Entra ID

You’ll create two apps in the Azure portal: A resource server and a client app.

:::important

The admin who creates the apps in the Microsoft Entra ID account must also be a user in Snowflake.

The `value` field gathered in these steps is only displayed once. When created, record it immediately.

:::

In your Azure portal, open the **Entra ID** and click **App registrations** from the left menu.

### 1. Create a resource server

1. From the app registrations screen, click **New registration**.
   1. Give the app a name.
   2. Ensure **Supported account types** are set to “Accounts in this organizational directory only (`Org name` - Single Tenant).”
   3. Click **Register**to see the application’s overview.
2. From the app overview page, click **Expose an API** from the left menu.
3. Click **Add** next to **Application ID URI**. The field will automatically populate. Click **Save**.
4. Record the `value` field for use in a future step. _This is only displayed once. Be sure to record it immediately. Microsoft hides the field when you leave the page and come back._
5. From the same screen, click **Add scope**.
   1. Give the scope a name.
   2. Set “Who can consent?” to **Admins and users**.
   3. Set **Admin consent display name** session:role-any and give it a description.
   4. Ensure **State** is set to **Enabled**.
   5. Click **Add scope**.

### 2. Create a client app

1. From the **App registration page**, click **New registration**.
   1. Give the app a name that uniquely identifies it as the client app.
   2. Ensure **Supported account types** are set to “Accounts in this organizational directory only (`Org name` - Single Tenant).”
   3. Set the **Redirect URI** to **Web** and copy/paste the **Redirect URI** from dbt Cloud into the field.
   4. Click **Register**.
2. From the app overview page, click **API permissions** from the left menu, and click **Add permission**.
3. From the pop-out screen, click **APIs my organization uses**, search for the resource server name from the previous steps, and click it.
4. Ensure the box for the **Permissions** `session:role-any` is enabled and click **Add permissions**.
5. Click **Grant admin consent** and from the popup modal click **Yes**.
6. From the left menu, click **Certificates and secrets** and click **New client secret**. Name the secret, set an expiration, and click **Add**.
**Note**: Microsoft does not allow “forever” as an expiration date. The maximum time is two years. Documenting the expiration date so you can refresh the secret before the expiration or user authorization fails is essential.
7. Record the `value` for use in a future step and record it immediately.
**Note**: Entra ID will not display this value again once you navigate away from this screen.

### 3. Snowflake configuration

You'll be switching between the Entra ID site and Snowflake. Keep your Entra ID account open for this process.

Copy and paste the following as a template in a Snowflake worksheet:

```sql

create or replace security integration <whatever you want to name it>
   type = external_oauth
   enabled = true
   external_oauth_type = azure
   external_oauth_issuer = '<AZURE_AD_ISSUER>'
   external_oauth_jws_keys_url = '<AZURE_AD_JWS_KEY_ENDPOINT>'
   external_oauth_audience_list = ('<SNOWFLAKE_APPLICATION_ID_URI>')
   external_oauth_token_user_mapping_claim = 'upn'
   external_oauth_any_role_mode = 'ENABLE'
   external_oauth_snowflake_user_mapping_attribute = 'login_name';

```

On the Entra ID site:

1. From the Client ID 
app in Entra ID, click **Endpoints** and open the **Federation metadata document** in a new tab.
   - The **entity ID** on this page maps to the `external_oauth_issuer` field in the Snowflake config.
2. Back on the list of endpoints, open the **OpenID Connect metadata document** in a new tab.
   - The **jwks_uri** field maps to the `external_oauth_jws_keys_url` field in Snowflake.
3. Navigate to the resource server in previous steps.
   - The **Application ID URI** maps to the `external_oauth_audience_list` field in Snowflake.
4. Run the configurations. Be sure the admin who created the Microsoft apps is also a user in Snowflake, or the configuration will fail.

### 4. Configuring the integration in dbt Cloud

1. Navigate back to the dbt Cloud **Account settings** —> **Integrations** page you were on at the beginning. It’s time to start filling out all of the fields. There will be some back-and-forth between the Entra ID account and dbt Cloud.
2. `Integration name`: Give the integration a descriptive name that includes identifying information about the Entra ID environment so future users won’t have to guess where it belongs.
3. `Client secrets`: Found in the Client ID from the **Certificates and secrets** page. `Value` is the `Client secret`. Note that it only appears when created; _Microsoft hides the secret if you return later, and you must recreate it._
4. `Client ID`: Copy the’ Application (client) ID’ on the overview page for the client ID app.
5. `Authorization URL` and `Token URL`: From the client ID app, open the `Endpoints` tab. These URLs map to the `OAuth 2.0 authorization endpoint (v2)` and `OAuth 2.0 token endpoint (v2)` fields. *You must use v2 of the `OAuth 2.0 authorization endpoint`. Do not use V1.* You can use either version of the `OAuth 2.0 token endpoint`.
6. `Application ID URI`: Copy the `Application ID URI` field from the resource server’s Overview screen.

</Expandable>

## FAQs

<FAQ path="Troubleshooting/failed-snowflake-oauth-connection" />
