---
title: "Migrating to Auth0 for SSO"
id: "auth0-migration"
sidebar: "SSO Auth0 Migration"
description: "Required actions for migrating to Auth0 for SSO services on dbt Cloud"
---

dbt Labs is partnering with Auth0 to bring enhanced features to dbt Cloud's single sign-on (SSO) capabilities. Auth0 is an identity and access management (IAM) platform with advanced security features, and it will be the dbt Cloud SSO identity provider (IDP) moving forward. These changes will require some action from customers with SSO configured in dbt Cloud today, and this guide will outline the necessary changes for each environment. 

If you have not yet configured SSO in dbt Cloud, refer instead to our setup guides for [SAML](/docs/cloud/manage-access/set-up-saml-2.0), [Okta](/docs/cloud/manage-access/set-up-sso-okta), [Google Workspace](/docs/cloud/manage-access/set-up-google-workspace), or [Azure Active Directory](/docs/cloud/manage-access/set-up-azure-active-directory) single sign-on services.

## SAML 2.0 and Okta

SAML 2.0 users must update a few fields in the SSO app configuration to match the new Auth0 URL and URI.  You can approach this by editing the existing SSO app settings or creating a new one to accommodate the Auth0 settings. One approach isn't inherently better, so choose whichever works best for your organization.

The fields that will be updated are:
- Single sign-on URL &mdash; `https://us-devspace-cluster.us.auth0.com/login/callback?connection={slug}`
- Audience URI (SP Entity ID) &mdash; `urn:auth0:us-devspace-cluster:{slug}`

Replace {slug} with your organization’s login slug. It must be unique across all dbt Cloud instances and is usually something like your company name separated by dashes (for example, `dbt-labs`).

Here is an example of an updated SAML 2.0 setup in Okta.

<Lightbox src="/img/docs/dbt-cloud/access-control/new-okta-config.png" title="Okta configuration with new URL"/>

After the configuration is saved, your SAML settings should look something like this:

<Lightbox src="/img/docs/dbt-cloud/access-control/new-okta-completed.png" title="New Okta configuration completed"/>

Once you have saved this information in the SSO environment, you must edit some information in the dbt Cloud settings. Navigate to the **Account Settings**, update the single sign-on URL fields, and provide the updated x.509 certificate.

Make sure to enable the "Use Auth0" option to ensure that the traffic is routed correctly. _The Auth0 migration action is final and cannot be undone_

<Lightbox src="/img/docs/dbt-cloud/access-control/enable-auth0.png" title="Enable Auth0"/>

Save the settings and test the new configuration using the SSO login URL provided on the settings page. 

## Google Workspace

Google Workspace admins updating their SSO APIs with the Auth0 URL won't have to do much if it is an existing setup. This can be done as a new project or by editing an existing SSO setup. No additional scopes are needed since this is migrating from an existing setup. All scopes were defined during the initial configuration. 

Steps to update:

1. Open the [Google Cloud console](https://console.cloud.google.com/) and select the project with your dbt Cloud single sign-on settings. From the project page **Quick Access**, select **APIs and Services**

<Lightbox src="/img/docs/dbt-cloud/access-control/google-cloud-sso.png" title="Google Cloud Console"/>

2. Click **Credentials** from the left side pane and click the appropriate name from **OAuth 2.0 Client IDs**

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-project.png" title="Select the OAuth 2.0 Client ID"/>

3. In the **Client ID for Web application** window, find the **Authorized Redirect URIs** field and click **Add URI** and enter `https://us-devspace-cluster.us.auth0.com/login/callback` or, _if you are located on our AU multi-tenant instances_, `https://au-production-mt.au.auth0.com/login/callback`.

Click **Save** once you are done. 

<Lightbox src="/img/docs/dbt-cloud/access-control/google-uri.png" title="Add Redirect URI"/>

4. _You will need a person with Google Workspace admin privileges to complete these steps in dbt Cloud_. In dbt Cloud, navigate to the **Account Settings**, click on **Single Sign-on**, and then click **Edit** on the right side of the SSO pane. Enable the **Use Auth0** option and select **Save**. This will trigger an authorization window from Google that will require admin credentials. _The Auth0 migration action is final and cannot be undone_. Once the authentication has gone through, test the new configuration using the SSO login URL provided on the settings page.

<Lightbox src="/img/docs/dbt-cloud/access-control/enable-auth0.png" title="Enable Auth0"/>