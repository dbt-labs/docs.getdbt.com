---
title: "Setting up SSO with Okta"
id: "setting-up-sso-with-okta"
---

:::info Enterprise Feature

This guide describes a feature of the dbt Cloud Enterprise plan. If you’re interested in learning more about an Enterprise plan, contact us at sales@getdbt.com.

:::

_To view setup instructions for Okta SSO
using Auth0, see [here](setting-up-sso-with-okta-deprecated)._

## Okta SSO

dbt Cloud Enterprise supports single-sign on via Okta (using SAML). Currently supported features include:

* IdP-initiated SSO
* SP-initiated SSO
* Just-in-time provisioning

This guide outlines the setup process for authenticating to dbt Cloud with Okta.
If you have any questions during the setup process, please contact support
(support@getdbt.com) for assistance.

## Configuration in Okta

### Create a new application

Note: You'll need administrator access to your Okta organization to follow this guide.

First, log into your Okta account. Using the Admin dashboard, create a new app.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app.png"
    title="Create a new app"
/>

On the following screen, select the following configurations:
- **Platform**: Web
- **Sign on method**: SAML 2.0

Click **Create** to continue the setup process.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app-create.png"
    title="Configure a new app"
/>

### Configure the Okta application

On the **General Settings** page, enter the following details::

* **App name**: dbt Cloud
* **App logo** (optional): You can optionally [download the dbt logo](https://drive.google.com/file/d/1w_Yj7QK-ULP4ebtKbrbvGo04pWlg0Y7S/view),
  and upload it to Okta to use as the logo for this app.

Click **Next** to continue.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-2-general-settings.png"
    title="Configure the app's General Settings"
/>

### Configure SAML Settings

The SAML Settings page configures how Okta and dbt Cloud communicate. If your
dbt Cloud instance is _not_ running at `cloud.getdbt.com`, you will want to replace
the domain names shown below with the domain name where your instance is running. If you
aren't sure which values you should use, please contact support (support@getdbt.com).

To complete this section, you will need a _login slug_. This slug controls the
URL where users on your account can log into your application via Okta. Login
slugs are typically the lowercased name of your organization separated with
dashes. For example, the _login slug_ for Fishtown Analytics would be
`fishtown-analytics`. Login slugs must be unique across all dbt Cloud accounts,
so pick a slug that uniquely identifies your company.

On the **SAML Settings** page, enter the following values:

* **Single sign on URL**: `https://cloud.getdbt.com/complete/okta`
* **Audience URI (SP Entity ID)**: `https://cloud.getdbt.com/`
* **Relay State**: `<login slug>`

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-top.png"
    title="Configure the app's SAML Settings"
/>

<!-- TODO : Will users need to change the Name ID format and Application
username on this screen? -->

:::caution User and Group Attributes

dbt Cloud uses SAML settings provided by Okta to enforce role-based access
control. If the Group Attribute statements shown below are misconfigured, then
users may not be permissioned to projects correctly in dbt Cloud.

:::

Under **Attribute Statements**, enter the following:

* **Name**: email
* **Name format**: Unspecified
* **Value**: `${user.email}`

Under **Group Attribute Statments**, enter the following:

* **Name**: groups
* **Name format**: Unspecified
* **Filter**: Matches regex
* **Value**: `.*`

**Note:** You may use a more restrictive Group Attribute Statement than the
example shown above. For example, if all of your dbt Cloud groups start with
`DBT_CLOUD_`, you may use a filter like `Starts With: DBT_CLOUD_`. **Okta
only returns 100 groups for each user, so if your users belong to more than 100
IdP groups, you will need to use a more restrictive filter**. Please contact
support if you have any questions.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-bottom.png"
    title="Configure the app's User and Group Attribute Statements"
/>

Click **Next** to continue.

### Finish Okta setup

Select *I'm an Okta customer adding an internal app*, and select *This is an
internal app that we have created*. Click **Finish** to finish setting up the
app.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-4-feedback.png"
    title="Finishing setup in Okta"
/>

### View setup instructions

On the next page, click **View Setup Instructions**. In the steps below,
you'll supply these values in your dbt Cloud Account Settings to complete
the integration between Okta and dbt Cloud.

<Lightbox
    collapsed={true}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-5-view-instructions.png"
    title="Viewing the configured application"
/>

<Lightbox
    collapsed={true}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-5-instructions.png"
    title="Application setup instructions"
/>

## Configuration in dbt Cloud

To complete setup, follow the steps below in dbt Cloud.

### Enable Okta Native Auth (beta)

- For users accessing dbt Cloud at cloud.getdbt.com, contact your account manager to
  gain access to the Okta configuration UI
- For users accessing dbt Cloud deployed in a VPC, enable the `native_okta`
  feature flag in the dbt Cloud admin backend.

### Supplying credentials

First, navigate to the **Enterprise &gt; Single Sign On** page under Account
Settings. Next, click the **Edit** button and supply the following SSO details:

:::note Login Slugs

The slug configured here should have the same value as the  **Okta RelayState**
configured in the steps above.

:::

| Field | Value |
| ----- | ----- |
| **Log&nbsp;in&nbsp;with** | Okta |
| **Identity&nbsp;Provider&nbsp;SSO&nbsp;Url** | Paste the **Identity Provider Single Sign-On URL** shown in the Okta setup instructions |
| **Identity&nbsp;Provider&nbsp;Issuer** | Paste the **Identity Provider Issuer** shown in the Okta setup instructions |
| **X.509&nbsp;Certificate** | Paste the **X.509 Certificate** shown in the Okta setup instructions |
| **Slug** | Enter your desired login slug. Users will be able to log into dbt Cloud by navigating to `https://cloud.getdbt.com/enterprise-login/<login-slug>`. Login slugs must be unique across all dbt Cloud accounts, so pick a slug that uniquely identifies your company. |

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-6-setup-integration.png"
    title="Configuring the application in dbt Cloud"
/>

21. Click **Save** to complete setup for the Okta integration. From
    here, you can navigate to the URL generated for your account's _slug_ to
    test logging in with Okta. Additionally, users added the the Okta app
    will be able to log in to dbt Cloud from Okta directly.

:::success Logging in
Users in your Okta account will now be able to log into the application
by navigating to the URL:

`https://cloud.getdbt.com/enterprise-login/<login-slug>`
