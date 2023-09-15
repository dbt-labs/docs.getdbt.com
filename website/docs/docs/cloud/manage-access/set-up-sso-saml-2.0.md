---
title: "Set up SSO with SAML 2.0"
id: "set-up-sso-saml-2.0"
---

import SetUpPages from '/snippets/_sso-docs-mt-available.md';

<SetUpPages features={'/snippets/_sso-docs-mt-available.md'}/>

dbt Cloud Enterprise supports single-sign on (SSO) for any SAML 2.0-compliant identity provider (IdP).
Currently supported features include:
* IdP-initiated SSO
* SP-initiated SSO
* Just-in-time provisioning

This document details the steps to integrate dbt Cloud with an identity
provider in order to configure Single Sign On and [role-based access control](/docs/cloud/manage-access/about-user-access#role-based-access-control).

## Auth0 Multi-tenant URIs

<Snippet path="auth0-uri" />

## Generic SAML 2.0 integrations

If your SAML identity provider is one of Okta, Google, Azure or OneLogin, navigate to the relevant section further down this page. For all other SAML compliant identity providers, you can use the instructions in this section to configure that identity provider.

### Configure your identity provider

You'll need administrator access to your SAML 2.0 compliant identity provider to configure the identity provider. You can use the following instructions with any SAML 2.0 compliant identity provider.

### Creating the application

1. Log into your SAML 2.0 identity provider and create a new application.
2. When promoted, configure the application with the following details:
   - **Platform:** Web
   - **Sign on method:** SAML 2.0
   - **App name:** dbt Cloud
   - **App logo (optional):** You can optionally [download the dbt logo](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing), and use as the logo for this app.

#### Configuring the application

<Snippet path="access_url" />

To complete this section, you will need to create a login slug. This slug controls the URL where users on your account can log into your application. Login slugs are typically the lowercased name of your organization. It should contain only letters, numbers, and dashes.
separated with dashes. For example, the login slug for dbt Labs would be `dbt-labs`.
Login slugs must be unique across all dbt Cloud accounts, so pick a slug that uniquely identifies your company.

When prompted for the SAML 2.0 application configurations, supply the following values:

* Single sign on URL: `https://YOUR_AUTH0_URI/login/callback?connection=<login slug>`
* Audience URI (SP Entity ID): `urn:auth0:<YOUR_AUTH0_ENTITYID>:{login slug}`
- Relay State: `<login slug>`

Additionally, you may configure the IdP attributes passed from your identity provider into dbt Cloud. We recommend using the following values:


| name | name format | value | description |
| ---- | ----------- | ----- | ----------- |
| email | Unspecified | user.email | The user's email address |
| first_name | Unspecified | user.first_name | The user's first name |
| last_name | Unspecified | user.last_name | The user's last name |
| NameID (if applicable) | Unspecified | user.email | The user's email address |

dbt Cloud's [role-based access control](/docs/cloud/manage-access/about-user-access#role-based-access-control) relies
on group mappings from the IdP to assign dbt Cloud users to dbt Cloud groups. To
use role-based access control in dbt Cloud, also configure your identity
provider to provide group membership information in user attribute called
`groups`:

| name | name format | value | description |
| ---- | ----------- | ----- | ----------- |
| groups | Unspecified | `<IdP-specific>` | The groups a user belongs to in the IdP |

:::info Note
You may use a restricted group attribute statement to limit the groups set
to dbt Cloud for each authenticated user. For example, if all of your dbt Cloud groups start
with `DBT_CLOUD_...`, you may optionally apply a filter like `Starts With: DBT_CLOUD_`.
Please contact support if you have any questions.
:::

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
You can use the instructions in this section to configure Okta as your identity provider.

1. Log into your Okta account. Using the Admin dashboard, create a new app.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app.png"
    title="Create a new app"
/>

2. Select the following configurations:
   - **Platform**: Web
   - **Sign on method**: SAML 2.0

3. Click **Create** to continue the setup process.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-1-new-app-create.png"
    title="Configure a new app"
/>

### Configure the Okta application

<Snippet path="access_url" />

To complete this section, you will need to create a login slug. This slug controls the URL where users on your account can log into your application. Login slugs are typically the lowercased name of your organization. It should contain only letters, numbers, and dashes.
separated with dashes. For example, the login slug for dbt Labs would be `dbt-labs`.
Login slugs must be unique across all dbt Cloud accounts, so pick a slug that uniquely identifies your company.

1. On the **General Settings** page, enter the following details:

   * **App name**: dbt Cloud
   * **App logo** (optional): You can optionally [download the dbt logo](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing),
     and upload it to Okta to use as the logo for this app.

2. Click **Next** to continue.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-2-general-settings.png"
    title="Configure the app's General Settings"
/>

### Configure SAML Settings

1. On the **SAML Settings** page, enter the following values:

   * **Single sign on URL**: `https://YOUR_AUTH0_URI/login/callback?connection=<login slug>`
   * **Audience URI (SP Entity ID)**: `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login slug>`
   * **Relay State**: `<login slug>`

  <Lightbox collapsed={false} src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-top.png" title="Configure the app's SAML Settings"/>

2. Map your organization's Okta User and Group Attributes to the format that
dbt Cloud expects by using the Attribute Statements and Group Attribute Statements forms.

3. The following table illustrates expected User Attribute Statements:

   | Name           | Name format | Value                | Description                |
   | -------------- | ----------- | -------------------- | -------------------------- |
   | `email`        | Unspecified | `user.email`      | _The user's email address_ |
   | `first_name`   | Unspecified | `user.firstName`  | _The user's first name_    |
   | `last_name`    | Unspecified | `user.lastName`   | _The user's last name_     |

4. The following table illustrates expected **Group Attribute Statements**:

   | Name     | Name format | Filter        | Value | Description                           |
   | -------- | ----------- | ------------- | ----- | ------------------------------------- |
   | `groups` | Unspecified | Matches regex | `.*`  | _The groups that the user belongs to_ |


You can instead use a more restrictive Group Attribute Statement than the
example shown in the previous steps. For example, if all of your dbt Cloud groups start with
`DBT_CLOUD_`, you may use a filter like `Starts With: DBT_CLOUD_`. **Okta
only returns 100 groups for each user, so if your users belong to more than 100
IdP groups, you will need to use a more restrictive filter**. Please contact
support if you have any questions.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-bottom.png"
    title="Configure the app's User and Group Attribute Statements"
/>

5. Click **Next** to continue.

### Finish Okta setup

1. Select *I'm an Okta customer adding an internal app*.
2. Select *This is an internal app that we have created*.
3. Click **Finish** to finish setting up the
app.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-4-feedback.png"
    title="Finishing setup in Okta"
/>

### View setup instructions

1. On the next page, click **View Setup Instructions**.
2. In the steps below, you'll supply these values in your dbt Cloud Account Settings to complete
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

3. After creating the Okta application, follow the instructions in the [dbt Cloud Setup](#dbt-cloud-setup)
section to complete the integration.

## Google integration

Use this section if you are configuring Google as your identity provider.

### Configure the Google application

<Snippet path="access_url" />

To complete this section, you will need to create a login slug. This slug controls the URL where users on your account
can log into your application. Login slugs are typically the lowercased name of your organization
separated with dashes. It should contain only letters, numbers, and dashes. For example, the login slug for dbt Labs would be `dbt-labs`.
Login slugs must be unique across all dbt Cloud accounts, so pick a slug that uniquely identifies your company.

1. Sign into your **Google Admin Console** via an account with super administrator privileges.
2. From the Admin console Home page, go to **Apps** and then click **Web and mobile apps**.
3. Click **Add**, then click **Add custom SAML app**.
4. Click **Next** to continue.
5. Make these changes on the App Details page:
    - Name the custom app
    - Upload an app logo (optional)
    - Click **Continue**.

### Configure SAML Settings

1. Go to the **Google Identity Provider details** page.
2. Download the **IDP metadata**.
3. Copy the **SSO URL** and **Entity ID** and download the **Certificate** (or **SHA-256 fingerprint**, if needed).
4. Enter the following values on the **Service Provider Details** window:
   * **ACS URL**: `https://YOUR_AUTH0_URI/login/callback?connection=<login slug>`
   * **Audience URI (SP Entity ID)**: `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login slug>`
   - **Start URL**: `<login slug>`
5. Select the **Signed response** checkbox.
6. The default **Name ID** is the primary email. Multi-value input is not supported.
7. Use the **Attribute mapping** page to map your organization's Google Directory Attributes to the format that
dbt Cloud expects.
8. Click **Add another mapping** to map additional attributes.

Expected **Attributes**:

| Name           | Name format | Value                | Description                |
| -------------- | ----------- | -------------------- | -------------------------- |
| `First name`   | Unspecified | `first_name`         | The user's first name.  |
| `Last name`    | Unspecified | `last_name`          | The user's last name.     |
| `Primary email`| Unspecified | `email`              |  The user's email address. |

9. To use [role-based access control](/docs/cloud/manage-access/about-user-access#role-based-access-control) in dbt Cloud,  enter the groups in the **Group membership** field during configuration:

| Google groups  | App attributes |
| -------------- | -------------- |
| Name of groups | `MemberOf` |

10. Click **Finish** to continue.


### Finish Google setup

1. From the Admin console Home page, go to **Apps** and then click **Web and mobile apps**.
2. Select your SAML app.
3. Click **User access**.
4. To turn on or off a service for everyone in your organization, click **On for everyone** or **Off for everyone**, and then click **Save**.
5. Ensure that the email addresses your users use to sign in to the SAML app match the email addresses they use to sign in to your Google domain.

**Note:** Changes typically take effect in minutes, but can take up to 24 hours.

### Finish setup

After creating the Google application, follow the instructions in the [dbt Cloud Setup](#dbt-cloud-setup)

## Azure integration

If you're using Azure Active Directory (Azure AD), the instructions below will help you configure it as your identity provider.

### Create Azure AD Enterprise application

<Snippet path="access_url" />

To complete this section, you will need to create a login slug. This slug controls the URL where users on your account can log into your application. Login slugs are typically the lowercased name of your organization
separated with dashes. It should contain only letters, numbers, and dashes. For example, the login slug for dbt Labs would be `dbt-labs`.
Login slugs must be unique across all dbt Cloud accounts, so pick a slug that uniquely identifies your company.

Follow these steps to set up single sign-on (SSO) with dbt Cloud:

1. Log into your Azure account.
2. In the Azure AD portal, select **Enterprise applications** and click **+ New application**.
3. Select **Create your own application**.
4. Name the application "dbt Cloud" or another descriptive name.
5. Select **Integrate any other application you don't find in the gallery (Non-gallery)** as the application type.
6. Click **Create**.
7. You can find the new application by clicking **Enterprise applications** and selecting **All applications**.
8. Click the application you just created.
9. Select **Single sign-on** under Manage in the left navigation.
10. Click **Set up single sign on** under Getting Started.
11. Click **SAML** in "Select a single sign-on method" section.
12. Click **Edit** in the Basic SAML Configuration section.
13. Use the following table to complete the required fields and connect to dbt:

   | Field | Value |
   | ----- | ----- |
   | **Identifier (Entity ID)** | Use `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login slug>`. |
   | **Reply URL (Assertion Consumer Service URL)** | Use `https://YOUR_AUTH0_URI/login/callback?connection=<login slug>`. |
   | **Relay State** | `<login slug>` |
14. Click **Save** at the top of the form.

### Creating SAML settings

From the Set up Single Sign-On with SAML page:

1. Click **Edit** in the User Attributes & Claims section.
2. Leave the claim under "Required claim" as is.
3. Delete all claims under "Additional claims."
4. Click **Add new claim** and add these three new claims:

   | Name | Source attribute |
   | ----- | ----- |
   | **email** | user.mail |
   | **first_name** | user.givenname |
   | **last_name** | user.surname |

5. Click **Add a group claim** from User Attributes and Claims.
6. If you'll assign users directly to the enterprise application, select **Security Groups**. If not, select **Groups assigned to the application**.
7. Set **Source attribute** to **Group ID**.
8. Under **Advanced options**, check **Customize the name of the group claim** and specify **Name** to **groups**.

**Note:** Keep in mind that the Group ID in Azure AD maps to that group's GUID. It should be specified in lowercase for the mappings to work as expected. The Source Attribute field alternatively can be set to a different value of your preference.

### Finish setup

9. After creating the Azure application, follow the instructions in the [dbt Cloud Setup](#dbt-cloud-setup) section to complete the integration.


## OneLogin integration

Use this section if you are configuring OneLogin as your identity provider.

To configure OneLogin, you will need **Administrator** access.

### Configure the OneLogin application

<Snippet path="access_url" />

To complete this section, you will need to create a login slug. This slug controls the URL where users on your account can log into your application. Login slugs are typically the lowercased name of your organization
separated with dashes. It should contain only letters, numbers, and dashes. For example, the login slug for dbt Labs would be `dbt-labs`.
Login slugs must be unique across all dbt Cloud accounts, so pick a slug that uniquely identifies your company.

1. Log into OneLogin, and add a new SAML 2.0 Application.
2. Configure the application with the following details:
   - **Platform:** Web
   - **Sign on method:** SAML 2.0
   - **App name:** dbt Cloud
   - **App logo (optional):** You can optionally [download the dbt logo](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing), and use as the logo for this app.

### Configure SAML settings

3. Under the **Configuration tab**, input the following values:

   - **RelayState:** `<login slug>`
   - **Audience (EntityID):** `urn:auth0:<YOUR_AUTH0_ENTITYID>:<login slug>`
   - **ACS (Consumer) URL Validator:** `https://YOUR_AUTH0_URI/login/callback?connection=<login slug>`
   - **ACS (Consumer) URL:** `https://YOUR_AUTH0_URI/login/callback?connection=<login slug>`

4. Next, go to the **Parameters tab**. You must have a parameter for the Email, First Name, and Last Name attributes and include all parameters in the SAML assertions. When you add the custom parameters, make sure you select the **Include in SAML assertion** checkbox.

We recommend using the following values:

| name | name format | value |
| ---- | ----------- | ----- |
| NameID | Unspecified | Email |
| email | Unspecified | Email |
| first_name | Unspecified | First Name |
| last_name | Unspecified | Last Name |

dbt Cloud's [role-based access control](/docs/cloud/manage-access/about-user-access#role-based-access-control) relies
on group mappings from the IdP to assign dbt Cloud users to dbt Cloud groups. To
use role-based access control in dbt Cloud, also configure OneLogin to provide group membership information in user attribute called
`groups`:

| name | name format | value | description |
| ---- | ----------- | ----- | ----------- |
| groups | Unspecified | Series of groups to be used for your organization | The groups a user belongs to in the IdP |


### Collect integration secrets

5. After confirming your details, go to the **SSO tab**. OneLogin should show you the following values for
the new integration. Keep these values somewhere safe, as you will need them to complete setup in dbt Cloud.

- Issuer URL
- SAML 2.0 Endpoint (HTTP)
- X.509 Certificate

### Finish setup

6. After creating the OneLogin application, follow the instructions in the [dbt Cloud Setup](#dbt-cloud-setup)
section to complete the integration.

## dbt Cloud Setup

### Providing IdP values to dbt Cloud

To complete setup, follow the steps below in dbt Cloud:

1. Navigate to the **Account Settings** and then click on **Single Sign On**.
2. Click **Edit** on the upper right corner.
3. Provide the following SSO details:

   | Field | Value |
   | ----- | ----- |
   | Log&nbsp;in&nbsp;with | SAML 2.0 |
   | Identity&nbsp;Provider&nbsp;SSO&nbsp;Url | Paste the **Identity Provider Single Sign-On URL** shown in the IdP setup instructions |
   | Identity&nbsp;Provider&nbsp;Issuer | Paste the **Identity Provider Issuer** shown in the IdP setup instructions |
   | X.509&nbsp;Certificate | Paste the **X.509 Certificate** shown in the IdP setup instructions |
   | Slug | Enter your desired login slug. |
    <Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-6-setup-integration.png"
        title="Configuring the application in dbt Cloud" />

4. Click **Save** to complete setup for the SAML 2.0 integration.
5. After completing the setup, you can navigate to the URL generated for your account's _slug_ to test logging in with your identity provider. Additionally, users added the the SAML 2.0 app will be able to log in to dbt Cloud from the IdP directly.


<Snippet path="login_url_note" />

### Setting up RBAC

After configuring an identity provider, you will be able to set up [role-based
access control](/docs/cloud/manage-access/enterprise-permissions) for your account.
