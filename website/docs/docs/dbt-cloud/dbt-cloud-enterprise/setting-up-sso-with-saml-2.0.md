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
* **App logo** (optional): You can optionally [download the dbt logo](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing),
  and upload it to Okta to use as the logo for this app.

Click **Next** to continue.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-2-general-settings.png"
    title="Configure the app's General Settings"
/>

### Configure SAML Settings

On the **SAML Settings** page, enter the following values:

* **Single sign on URL**: `https://cloud.getdbt.com/complete/okta`
* **Audience URI (SP Entity ID)**: `https://cloud.getdbt.com/`
* **Relay State**: `<login slug>`

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-3-saml-settings-top.png"
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

### Finish setup

After creating the Okta application, follow the instructions in the [dbt Cloud Setup](#dbt-cloud-setup)
section to complete the integration.

## Azure integration

_Use this section if you are configuring Azure AD as your identity provider_.

### Enable single sign-on for an app

First, log into your Azure account. Follow the steps below to set up single sign-on with dbt Cloud.

- In the Azure AD portal, choose **Enterprise applications**. Then find and select dbt Cloud to set up for single sign-on.
- In the **Manage** section, select **Single sign-on** to open the **Single sign-on** pane for editing.
- Select **SAML** to open the SSO configuration page. After dbt Cloud is set up, your users can sign in to dbt Clud by using their credentials from your Azure AD tenant.

### Configuration

dbt Cloud supports both single tenant and multitenant Azure Active Directory SSO
Connections. For most Enterprise purposes, you will want to use the single
tenant flow when creating an Azure AD Application.

#### Creating an application

Log into the Azure portal for your organization. Using the **Azure Active Directory** page, you will
need to select the appropriate directory and then register a new application.

1. Under **Manage**, select **App registrations**
2. Click **+ New Registration** to begin creating a new application
3. Supply configurations for the **Name** and **Supported account types**
   fields as shown in the table below.

| Field | Value |
| ----- | ----- |
| **Name** | dbt Cloud |
| **Supported account types** | Accounts in this organizational directory only _(single tenant)_ |

4. Configure the **Redirect URI**. The table below shows the appropriate
   Redirect URI values for single-tenant and multi-tenant deployments. For most
   enterprise use-cases, you will want to use the single-tenant Redirect URI.

:::note VPC Deployment
If you are deploying dbt Cloud into a VPC, you should use the hostname where
the dbt Cloud application is deployed instead of `https://cloud.getdbt.com` in
the **Redirect URI** input.
:::

| Application Type | Redirect URI |
| ----- | ----- |
| Single-Tenant _(recommended)_ | `https://cloud.getdbt.com/complete/azure_single_tenant` |
| Multi-Tenant | `https://cloud.getdbt.com/complete/azure_multi_tenant` |

5. Save the App registration to continue setting up Azure AD SSO

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-app-registration-empty.png" title="Creating a new app registration"/>
<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-new-application-alternative.png" title="Configuring a new app registration"/>


**Configuration with the new Azure AD interface (optional)**

Depending on your Azure AD settings, your App Registration page might look
different than the screenshots shown above. If you are _not_ prompted to
configure a Redirect URI on the **New Registration** page, then follow steps 6
and 7 below after creating your App Registration. If you were able to set up
the Redirect URI in the steps above, then skip ahead to step 8.

6. After registering the new application without specifying a Redirect URI,
   navigate to the **Authentication** tab for the new application.

7. Click **+ Add platform** and enter a Redirect URI for your application. See
   step 4 above for more information on the correct Redirect URI value for your
   dbt Cloud application.

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-redirect-uri.png" title="Configuring a Redirect URI"/>

#### Azure <-> dbt Cloud User and Group mapping 

The Azure users and groups you will create in the following steps are mapped to groups created in dbt Cloud based on the group name. Reference the docs on [enterprise permissions](enterprise-permissions) for additional information on how users, groups, and permission sets are configured in dbt Cloud.

#### Adding Users to an Enterprise Application

Once you've registered the application, the next step is to assign users to it. Add the users you want to be viewable to dbt with the following steps:

8. From the **Default Directory** click **Enterprise Applications**
9. Click the name of the application you created earlier
10. Click **Assign Users and Groups**
11. Click **Add User/Group**
12. Assign additional users and groups as-needed

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-enterprise-app-users.png" title="Adding Users to an Enterprise Application a Redirect URI"/>

:::info User assignment required?
Under **Properties** check the toggle setting for **User assignment required?** and confirm it aligns to your requirements. Most customers will want this toggled to **Yes** so that only users/groups explicitly assigned to dbt Cloud will be able to sign in. If this setting is toggled to **No** any user will be able to access the application if they have a direct link to the application per [Azure AD Documentation](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/assign-user-or-group-access-portal#configure-an-application-to-require-user-assignment)
::: 

#### Configuring permissions

13. Under **Manage**, click **API Permissions**
14. Click **+Add a permission** and add the permissions shown below

| API Name | Type | Permission |
| -------- | ---- | ---------- |
| Microsoft Graph | Delegated | `Directory.AccessAsUser.All` |
| Microsoft Graph | Delegated | `Directory.Read.All` |
| Microsoft Graph | Delegated | `User.Read` |

15. Save these permissions, then click **Grant admin consent** to grant admin
   consent for this directory on behalf of all of your users.

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-permissions-overview.png" title="Configuring application permissions" />

#### Creating a client secret

16. Under **Manage**, click **Certificates & secrets**
17. Click **+New client secret**
18. Name the client secret "dbt Cloud" (or similar) to identify the secret
19. Select **Never** as the expiration value for this secret
20. Click **Add** to finish creating the client secret
21. Record the generated client secret somewhere safe. Later in the setup process,
   we'll use this client secret in dbt Cloud to finish configuring the
   integration.

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-secret-config.png" title="Configuring certificates & secrets" />
<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-secret-saved.png" title="Recording the client secret" />

#### Collect client credentials

22. Navigate to the **Overview** page for the app registration
23. Note the **Application (client) ID** and **Directory (tenant) ID** shown in
   this form and record them along with your client secret. We'll use these keys
   in the steps below to finish configuring the integration in dbt Cloud.

<Lightbox collapsed="true" src="/img/docs/dbt-cloud/dbt-cloud-enterprise/azure/azure-overview.png" title="Collecting credentials. Store these somewhere safe!" />

#### Configure Azure AD for SAML-based SSO

On the **General Settings** page, enter the following details::

* **App name**: dbt Cloud
* **App logo** (optional): You can optionally [download the dbt logo](https://drive.google.com/file/d/1fnsWHRu2a_UkJBJgkZtqt99x5bSyf3Aw/view?usp=sharing),
  and upload it to Okta to use as the logo for this app.

1. In the Azure portal, on the **dbt Cloud** application integration page, find the **Manage** section and select **single sign-on**
2. On the **Select a single sign-on method** page, select **SAML**.
3. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

#### Configure SAML Settings

For **Basic SAML Configuration** , enter the following values:

* **Identifier (EnityID)**: `https://cloud.getdbt.com/`
* **Reply URL (Assertion Consumer Service URL)**: `https://cloud.getdbt.com/complete/saml`
* **Relay State**: `<login slug>`

Expected **User Attributes & Claims**:

| Name                         | Name format | Value                   | Description                |
| --------------               | ----------- | --------------------    | -------------------------- |
| `email`                      | Unspecified | `user.userprincipalname`| _The user's email address_ |
| `first_name`                 | Unspecified | `user.givenname`        | _The user's first name_    |
| `last_name`                  | Unspecified | `user.surname`          | _The user's last name_     |
| `groups`                     | Unspecified | `groups`                | _The user's groups_        |
| `Unique User Identifier`     | Unspecified | `user.userprincipalname`| _The user's email address_ |



### Finish setup

After creating the Azure application, follow the instructions in the [dbt Cloud Setup](#dbt-cloud-setup)
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
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/okta/okta-6-setup-integration.png"
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
