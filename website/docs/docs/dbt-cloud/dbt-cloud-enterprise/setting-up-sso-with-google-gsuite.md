---
title: "Setting up SSO with Google GSuite"
id: "setting-up-sso-with-google-gsuite"
---

_To view setup instructions for GSuite SSO
using Auth0, see [here](setting-up-sso-with-google-gsuite-deprecated)._

:::info Enterprise Feature
This guide describes a feature of the dbt Cloud Enterprise plan. If you’re
interested in learning more about an Enterprise plan, contact us at
sales@getdbt.com.
:::

dbt Cloud Enterprise supports Single-Sign On (SSO) via Google GSuite. You will need
permissions to create and manage a new Google OAuth2 application, as well as
access to enable the Google Admin SDK.

 Currently supported features include:

* SP-initiated SSO
* Just-in-time provisioning

This guide outlines the setup process for authenticating to dbt Cloud with
Google GSuite.

## Configuration in GCP

dbt Cloud uses a Client ID and Client Secret to authenticate users of a
GSuite organization. The steps below outline how to create a Client ID and
Client Secret for use in dbt Cloud.

### Creating credentials

1. Navigate to the GCP [API Manager](https://console.developers.google.com/projectselector/apis/credentials)
1. Select an existing project, or create a new project for your API Credentials
1. Click on **Create Credentials** and select **OAuth Client ID** in the resulting
   popup
1. Google requires that you configure an OAuth consent screen for OAuth
   credentials. Click the **Configure consent screen** button to create
   a new consent screen if prompted.
1. On the OAuth consent screen page, configure the following settings
    - **Application type**: internal
    - **Application name**: dbt Cloud
    - **Application logo (optional)**: You can download the dbt logo <a href="/img/docs/dbt-cloud/dbt-cloud-enterprise/icon.png" target="_blank">here</a>
    - **Authorized domains**: `getdbt.com`, or the hostname of your dbt
    Cloud deployment if you are deploying dbt Cloud into a VPC.
    - Note: The default scopes (`email`, `profile`, and `openid`) are sufficient
    for dbt Cloud's usage of the GSuite API. No additional scopes are required.
    - For more information on Google's consent screen, consult the [Google docs](https://support.google.com/cloud/answer/6158849?hl=en#userconsent)
    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-consent-top.png" title="GSuite Consent Screen configuration"/>
1. Save the **Consent screen** settings to navigate back to the **Create OAuth client
   id** page.
1. Use the following configuration values when creating your Credentials:
    :::note Authorized URIs
    If you are deploying dbt Cloud into a VPC, you should use the hostname where
    the dbt Cloud application is deployed instead of `https://cloud.getdbt.com` in
    the _Authorized Javascript origins_ and _Authorized Redirect URIs_ configurations.
    :::

    - **Application type**: Web application
    - **Name**: dbt Cloud
    - **Authorized Javascript origins**: `https://cloud.getdbt.com`
    - **Authorized Redirect URIs**: `https://cloud.getdbt.com/complete/gsuite`
    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-credentials.png" title="GSuite Credentials configuration"/>
1. Press "Create" to create your new credentials. A popup will appear
with a **Client ID** and **Client Secret**. Write these down as you will need them later!

### Enabling the Admin SDK

dbt Cloud requires that the Admin SDK is enabled in this application to request
Group Membership information from the GSuite API. To enable the Admin SDK for
this project, navigate to the [Admin SDK Settings page](https://console.developers.google.com/apis/api/admin.googleapis.com/overview)
and ensure that the API is enabled.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/7f36f50-Screen_Shot_2019-12-03_at_10.15.01_AM.png" title="The 'Admin SDK' page"/>

## Configuration in dbt Cloud

To complete setup, follow the steps below in the dbt Cloud application.

### Enable GSuite Native Auth (beta)

- For users accessing dbt Cloud at cloud.getdbt.com, contact your account manager to
  gain access to the GSuite Native auth configuration UI
- For users accessing dbt Cloud deployed in a VPC, enable the `native_gsuite`
  feature flag in the dbt Cloud admin backend.

### Supply your OAuth Client ID and Client Secret

1. Navigate to the **Enterprise &gt; Single Sign On** page under Account
Settings.
2. Click the **Edit** button and supply the following SSO details:
    - **Log in with**: GSuite
    - **Client ID**: Paste the Client ID generated in the steps above
    - **Client Secret**: Paste the Client Secret generated in the steps above
    - **Domain in GSuite**: Enter the domain name for your GSuite account (eg. `fishtownanalytics.com`).
      Only users with an email address from this domain will be able to log into your dbt Cloud
      account using GSuite auth.
    - **Slug**: Enter your desired login slug. Users will be able to log into dbt
      Cloud by navigating to `https://cloud.getdbt.com/enterprise-login/<login-slug>`. Login slugs must
      be unique across all dbt Cloud accounts, so pick a slug that uniquely
      identifies your company.
    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-cloud-config.png" title="GSuite SSO Configuration"/>
3. Click **Save &amp; Authorize** to authorize your credentials. You should be
   dropped into the GSuite oauth flow and prompted to log into dbt Cloud with
   your work email address. If authentication is successful, you will be
   redirected back to the dbt Cloud application.
4. On the **Verify SSO Credentials** page, verify that a `groups` entry is
   present, and that it reflects the groups you are a member of in GSuite. If
   you do not see a `groups` entry in the IdP attribute list, consult the
   Troubleshooting steps below.
    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/gsuite-sso-cloud-verify.png" title="GSuite SSO Verification"/>

If the verification information looks appropriate, then you have completed
the configuration of GSuite SSO. Members of your team should now be able to log
into the dbt Cloud application at `https://cloud.getdbt.com/enterprise-login/<login-slug>`.

## Troubleshooting


### OAuth errors

If OAuth verification does not complete successfully, double check that:
 - The Admin SDK is enabled in your GCP project
 - The Client ID and Client Secret provided match the values generated in the
   GCP Credentials page
 - An Authorized Domain was provided in the OAuth Consent Screen configuration

### Missing groups

If authentication with the GSuite API succeeds but you do not see a
`groups` entry on the **Verify SSO Credentials** page, then you may not have
permissions to access Groups in your GSuite account. Either request that your
GSuite user is granted the ability to request groups from an administrator, or
have an administrator log into dbt Cloud and authorize the GSuite integration.
