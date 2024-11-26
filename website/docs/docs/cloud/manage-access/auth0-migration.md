---
title: "Migrating to Auth0 for SSO"
id: "auth0-migration"
sidebar: "SSO Auth0 Migration"
description: "Required actions for migrating to Auth0 for SSO services on dbt Cloud."
---

dbt Labs is partnering with Auth0 to bring enhanced features to dbt Cloud's single sign-on (SSO) capabilities. Auth0 is an identity and access management (IAM) platform with advanced security features, and it will be leveraged by dbt Cloud. These changes will require some action from customers with SSO configured in dbt Cloud today, and this guide will outline the necessary changes for each environment. 

If you have not yet configured SSO in dbt Cloud, refer instead to our setup guides for [SAML](/docs/cloud/manage-access/set-up-sso-saml-2.0), [Okta](/docs/cloud/manage-access/set-up-sso-okta), [Google Workspace](/docs/cloud/manage-access/set-up-sso-google-workspace), or [Microsoft Entra ID (formerly Azure AD)](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id) single sign-on services.

## Start the migration

The Auth0 migration feature is being rolled out incrementally to customers who have SSO features already enabled. When the migration option has been enabled on your account, you will see **SSO Updates Available** on the right side of the menu bar, near the settings icon. 

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-migration-available.png" title="SSO migration available"/>

Alternatively, you can start the process from the **Settings** page in the **Single Sign-on** pane. Click the **Begin Migration** button to start. 

<Lightbox src="/img/docs/dbt-cloud/access-control/begin-migration.png" title="Begin Migration"/>

Once you have opted to begin the migration process, the following steps will vary depending on the configured identity provider. You can just skip to the section that's right for your environment. These steps only apply to customers going through the migration; new setups will use the existing [setup instructions](/docs/cloud/manage-access/sso-overview).

:::warning Login \{slug\}

Slugs should contain only letters, numbers, and dashes. Make sure to remove underscores (if they exist) from login slugs: 
* before migrating on the **Account Settings** page, or 
* while migrating (before enabling), as shown in the Migrate authentication screenshots for your respective setup. 
After changing the slug, admins must share the new login URL with their dbt Cloud users.

:::

## SAML 2.0 and Okta

SAML 2.0 users must update a few fields in the SSO app configuration to match the new Auth0 URL and URI.  You can approach this by editing the existing SSO app settings or creating a new one to accommodate the Auth0 settings. One approach isn't inherently better, so you can choose whichever works best for your organization.

The fields that will be updated are:
- Single sign-on URL &mdash; `https://<YOUR_AUTH0_URI>/login/callback?connection={slug}`
- Audience URI (SP Entity ID) &mdash; `urn:auth0:<YOUR_AUTH0_ENTITYID>:{slug}`

Below are sample steps to update. You must complete all of them to ensure uninterrupted access to dbt Cloud and you should coordinate with your identity provider admin when making these changes.

1. Replace `{slug}` with your organization’s login slug. It must be unique across all dbt Cloud instances and is usually something like your company name separated by dashes (for example, `dbt-labs`).

Here is an example of an updated SAML 2.0 setup in Okta.

<Lightbox src="/img/docs/dbt-cloud/access-control/new-okta-config.png" title="Okta configuration with new URL"/>

2. Save the configuration, and your SAML settings will look something like this:

<Lightbox src="/img/docs/dbt-cloud/access-control/new-okta-completed.png" title="New Okta configuration completed"/>

3. Toggle the `Enable new SSO authentication` option to ensure the traffic is routed correctly. _The new SSO migration action is final and cannot be undone_

<Lightbox src="/img/docs/dbt-cloud/access-control/saml-enable.png" title="Enable new SSO for SAML/Okta"/>

4. Save the settings and test the new configuration using the SSO login URL provided on the settings page. 

## Google Workspace

Google Workspace admins updating their SSO APIs with the Auth0 URL won't have to do much if it is an existing setup. This can be done as a new project or by editing an existing SSO setup. No additional scopes are needed since this is migrating from an existing setup. All scopes were defined during the initial configuration. 

Below are steps to update. You must complete all of them to ensure uninterrupted access to dbt Cloud and you should coordinate with your identity provider admin when making these changes.

1. Open the [Google Cloud console](https://console.cloud.google.com/) and select the project with your dbt Cloud single sign-on settings. From the project page **Quick Access**, select **APIs and Services**

<Lightbox src="/img/docs/dbt-cloud/access-control/google-cloud-sso.png" title="Google Cloud Console"/>

2. Click **Credentials** from the left side pane and click the appropriate name from **OAuth 2.0 Client IDs**

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-project.png" title="Select the OAuth 2.0 Client ID"/>

3. In the **Client ID for Web application** window, find the **Authorized Redirect URIs** field and click **Add URI** and enter `https://<YOUR_AUTH0_URI>/login/callback`.

Click **Save** once you are done. 

<Lightbox src="/img/docs/dbt-cloud/access-control/google-uri.png" title="Add Redirect URI"/>

4. _You will need a person with Google Workspace admin privileges to complete these steps in dbt Cloud_. In dbt Cloud, navigate to the **Account Settings**, click on **Single Sign-on**, and then click **Edit** on the right side of the SSO pane. Toggle the **Enable New SSO Authentication** option and select **Save**. This will trigger an authorization window from Google that will require admin credentials. _The migration action is final and cannot be undone_. Once the authentication has gone through, test the new configuration using the SSO login URL provided on the settings page.

:::warning Domain authorization

You must complete the domain authorization before you toggle `Enable New SSO Authentication`, or the migration will not complete successfully.

:::

<Lightbox src="/img/docs/dbt-cloud/access-control/google-enable.png" title="Enable new SSO for Google Workspace"/>

## Microsoft Entra ID

Microsoft Entra ID admins will need to make a slight adjustment to the existing authentication app in the Azure portal. This migration does not require that the entire app be deleted or recreated; you can edit the existing app. Start by opening the Azure portal and navigating to the Microsoft Entra ID overview.

Below are steps to update. You must complete all of them to ensure uninterrupted access to dbt Cloud and you should coordinate with your identity provider admin when making these changes.

1. Click **App Registrations** on the left side menu. 

<Lightbox src="/img/docs/dbt-cloud/access-control/aad-app-registration.png" title="Select App Registrations"/>

2. Select the proper **dbt Cloud** app (name may vary) from the list. From the app overview, click on the hyperlink next to **Redirect URI**

<Lightbox src="/img/docs/dbt-cloud/access-control/app-overview.png" title="Click the Redirect URI hyperlink"/>

3. In the **Web** pane with **Redirect URIs**, click **Add URI** and enter the appropriate `https://<YOUR_AUTH0_URI>/login/callback`. Save the settings and verify it is counted in the updated app overview.

<Lightbox src="/img/docs/dbt-cloud/access-control/redirect-URI.png" title="Enter new redirect URI"/>

4. Navigate to the dbt Cloud environment and open the **Account Settings**. Click the **Single Sign-on** option from the left side menu and click the **Edit** option from the right side of the SSO pane. The **domain** field is the domain your organization uses to login to Microsoft Entra ID. Toggle the **Enable New SSO Authentication** option and **Save**. _Once this option is enabled, it cannot be undone._

:::warning Domain authorization

You must complete the domain authorization before you toggle `Enable New SSO Authentication`, or the migration will not complete successfully.

:::

<Lightbox src="/img/docs/dbt-cloud/access-control/azure-enable.png" title="Enable new SSO"/>
