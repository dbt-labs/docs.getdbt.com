---
title: "Setting up SSO with SAML 2.0"
id: "setting-up-sso-with-saml-2.0"
---

:::info Enterprise Feature

This guide describes a feature of the dbt Cloud Enterprise plan. If you’re interested in learning
more about an Enterprise plan, contact us at sales@getdbt.com.

:::

dbt Cloud Enterprise supports single-sign on (SSO) for any SAML 2.0-compliant identity provider (IdP).
Currently supported features include:
* IdP-initiated SSO
* SP-initiated SSO
* Just-in-time provisioning

This document details the steps to integrate dbt Cloud with an identity
provider in order to configure Single Sign On and [role-based access control](access-control-overview#role-based-access-control).

## Generic SAML 2.0 integrations

_Use this section if you are configuring an identity provider besides Okta._

### Configuration in your identity provider

_Note: You'll need administrator access to your SAML 2.0 compliant identity provider to follow this guide.
This approach will work with any SAML 2.0 compliant identity provider._

### Creating the application

First, log into your SAML 2.0 identity provider and create a new application.
When promoted, configure the application with the following details:
 - **Platform:** Web
 - **Sign on method:** SAML 2.0
 - **App name:** dbt Cloud
 - **App logo (optional):** You can optionally [download the dbt logo](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing), and use as the logo for this app.

#### Configuring the application

:::info

This guide assumes that your dbt Cloud instance is running at
https://cloud.getdbt.com. If your deployment is running at a different url, then
substitute cloud.getdbt.com for the url of your instance.

:::

To complete this section, you will need to create a login slug. This slug controls the URL where users on your account
can log into your application. Login slugs are typically the lowercased name of your organization
separated with dashes. For example, the login slug for _dbt Labs_ would be _dbt-labs_.
Login slugs must be unique across all dbt Cloud accounts, so pick a slug that uniquely identifies your company.

When prompted for the SAML 2.0 application configurations, supply the following
values:

- Single sign on URL: `https://cloud.getdbt.com/complete/saml`
- Audience URI (SP Entity ID): `https://cloud.getdbt.com/`
- Relay State: `<login slug>`

Additionally, you may configure the IdP attributes passed from your identity
provider into dbt Cloud. We recommend using the following values:


| name | name format | value | description |
| ---- | ----------- | ----- | ----------- |
| email | Unspecified | ${user.email} | The user's email address |
| first_name | Unspecified | ${user.first_name} | The user's first name |
| last_name | Unspecified | ${user.last_name} | The user's last name |

dbt Cloud's [role-based access control](access-control-overview#role-based-access-control) relies
on group mappings from the IdP to assign dbt Cloud users to dbt Cloud groups. To
use role-based access control in dbt Cloud, also configure your identity
provider to provide group membership information in user attribute called
`groups`:


| name | name format | value | description |
| ---- | ----------- | ----- | ----------- |
| groups | Unspecified | `<IdP-specific>` | The groups a user belongs to in the IdP |

Note: You may use a restricted group attribute statement to limit the groups set
to dbt Cloud for each authenticated user. For example, if all of your dbt Cloud groups start
with `DBT_CLOUD_...`, you may optionally apply a filter like `Starts With: DBT_CLOUD_`.
Please contact support if you have any questions.

### Collect integration secrets

After confirming your details, the IdP should show you the following values for
the new SAML 2.0 integration. Keep these values somewhere safe, as you will need
them to complete setup in dbt Cloud.

- Identity Provider Issuer
- Identity Provider SSO Url
- X.509 Certificate

### Finish setup

After creating the Okta application, follow the instructions in the [dbt Cloud Setup](#dbt-cloud-setup)
section to complete the integration.

## Okta integration

_Use this section if you are configuring Okta as your identity provider_.

First, log into your Okta account. Using the Admin dashboard, create a new app.

<Lightbox
    collapsed={false}
    src="/img-next/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app.png"
    title="Create a new app"
/>

On the following screen, select the following configurations:
- **Platform**: Web
- **Sign on method**: SAML 2.0

Click **Create** to continue the setup process.

<Lightbox
    collapsed={false}
    src="/img-next/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app-create.png"
    title="Configure a new app"
/>

### Configure the Okta application

On the **General Settings** page, enter the following details::

* **App name**: dbt Cloud
* **App logo** (optional): You can optionally [download the dbt logo](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing),
  and upload it to Okta to use as the logo for this app.

Click **Next** to continue.

<Lightbox
    collapsed={false}
    src="/img-next/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-2-general-settings.png"
    title="Configure the app's General Settings"
/>

### Configure SAML Settings

On the **SAML Settings** page, enter the following values:

* **Single sign on URL**: `https://cloud.getdbt.com/complete/okta`
* **Audience URI (SP Entity ID)**: `https://cloud.getdbt.com/`
* **Relay State**: `<login slug>`

<Lightbox
    collapsed={false}
    src="/img-next/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-top.png"
    title="Configure the app's SAML Settings"
/>

Use the **Attribute Statements** and **Group Attribute Statements** forms to
map your organization's Okta User and Group Attributes to the format that
dbt Cloud expects.

Expected **User Attribute Statements**:

| Name           | Name format | Value                | Description                |
| -------------- | ----------- | -------------------- | -------------------------- |
| `email`        | Unspecified | `${user.email}`      | _The user's email address_ |
| `first_name`   | Unspecified | `${user.firstName}`  | _The user's first name_    |
| `last_name`    | Unspecified | `${user.lastName}`   | _The user's last name_     |


Expected **Group Attribute Statements**:

| Name     | Name format | Filter        | Value | Description                           |
| -------- | ----------- | ------------- | ----- | ------------------------------------- |
| `groups` | Unspecified | Matches regex | `.*`  | _The groups that the user belongs to_ |


**Note:** You may use a more restrictive Group Attribute Statement than the
example shown above. For example, if all of your dbt Cloud groups start with
`DBT_CLOUD_`, you may use a filter like `Starts With: DBT_CLOUD_`. **Okta
only returns 100 groups for each user, so if your users belong to more than 100
IdP groups, you will need to use a more restrictive filter**. Please contact
support if you have any questions.

<Lightbox
    collapsed={false}
    src="/img-next/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-bottom.png"
    title="Configure the app's User and Group Attribute Statements"
/>

Click **Next** to continue.

### Finish Okta setup

Select *I'm an Okta customer adding an internal app*, and select *This is an
internal app that we have created*. Click **Finish** to finish setting up the
app.

<Lightbox
    collapsed={false}
    src="/img-next/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-4-feedback.png"
    title="Finishing setup in Okta"
/>

### View setup instructions

On the next page, click **View Setup Instructions**. In the steps below,
you'll supply these values in your dbt Cloud Account Settings to complete
the integration between Okta and dbt Cloud.

<Lightbox
    collapsed={true}
    src="/img-next/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-5-view-instructions.png"
    title="Viewing the configured application"
/>

<Lightbox
    collapsed={true}
    src="/img-next/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-5-instructions.png"
    title="Application setup instructions"
/>

### Finish setup

After creating the Okta application, follow the instructions in the [dbt Cloud Setup](#dbt-cloud-setup)
section to complete the integration.


## dbt Cloud Setup

### Providing IdP values


To complete setup, follow the steps below in dbt Cloud. First, navigate to the
**Enterprise &gt; Single Sign On** page under Account Settings. Next, click
the **Edit** button and supply the following SSO details:

| Field | Value |
| ----- | ----- |
| Log&nbsp;in&nbsp;with | SAML 2.0 |
| Identity&nbsp;Provider&nbsp;SSO&nbsp;Url | Paste the **Identity Provider Single Sign-On URL** shown in the IdP setup instructions |
| Identity&nbsp;Provider&nbsp;Issuer | Paste the **Identity Provider Issuer** shown in the IdP setup instructions |
| X.509&nbsp;Certificate | Paste the **X.509 Certificate** shown in the IdP setup instructions |
| Slug | Enter your desired login slug. |

<Lightbox
    collapsed={false}
    src="/img-next/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-6-setup-integration.png"
    title="Configuring the application in dbt Cloud"
/>

Click **Save** to complete setup for the SAML 2.0 integration.

### Test the integration
After setup is complete, you can navigate to the URL generated for your account's _slug_ to
test logging in with your identity provider. Additionally, users added the the SAML 2.0 app
will be able to log in to dbt Cloud from the IdP directly.

Users in your IdP will now be able to log into the application by navigating to the URL:

`https://cloud.getdbt.com/enterprise-login/<login-slug>`

### Setting up RBAC
After configuring an identity provider, you will be able to set up [role-based
access control](/access-control/enterprise-permissions) for your account.
