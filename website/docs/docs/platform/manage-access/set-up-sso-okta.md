---
title: "Set up SSO with Okta"
id: "set-up-sso-okta"
---

# Set up SSO with Okta <Lifecycle status="managed, managed_plus" />

<Constant name="dbt" /> Enterprise-tier plans support single-sign on via Okta (using SAML).

:::info SCIM available for Okta
After setting up single sign-on (SSO), you can [set up System for Cross-Domain Identity Management (SCIM)](/docs/platform/manage-access/scim-okta) with Okta to automate user and group provisioning, and license assignment. 
:::

Currently supported SSO features include:

* IdP-initiated SSO
* SP-initiated SSO
* Just-in-time provisioning

This guide outlines the setup process for authenticating to <Constant name="dbt" /> with Okta.

## Configuration in Okta

### Create a new application

Note: You'll need administrator access to your Okta organization to follow this guide.

First, log into your Okta account. Using the Admin dashboard, create a new app.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-1-new-app.png"
    title="Create a new app"
/>

On the following screen, select the following configurations:
- **Platform**: Web
- **Sign on method**: SAML 2.0

Click **Create** to continue the setup process.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-1-new-app-create.png"
    title="Configure a new app"
/>

### Configure the Okta application

On the **General Settings** page, enter the following details::

* **App name**: <Constant name="dbt" />
* **App logo** (optional): You can optionally [download the dbt logo](https://cdn.sanity.io/images/wl0ndo6t/main/333fef4fc72db6f1ce4d1bc0789f355b4f0bbaa2-1280x1280.png),
  and upload it to Okta to use as the logo for this app.

Click **Next** to continue.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-2-general-settings.png"
    title="Configure the app's General Settings"
/>

### Configure SAML Settings

The SAML Settings page configures how Okta and <Constant name="dbt" /> communicate. You will want to use an [appropriate Access URL](/docs/platform/about-platform/access-regions-ip-addresses) for your region and plan.

import LoginSlug from '/snippets/_login-slug.md';

<LoginSlug />

<Snippet path="access_url" />

* **Single sign on URL**: `https://YOUR_AUTH0_URI/login/callback?connection=<login URL slug>`
* **Audience URI (SP Entity ID)**: `urn:auth0:<YOUR_AUTH0_ENTITYID>:{login URL slug}`
* **Relay State**: `<login URL slug>`
* **Name ID format**: `Unspecified`
* **Application username**: `Custom` / `user.getInternalProperty("id")`
* **Update Application username on**: `Create and update`

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-3-saml-settings-top.png"
    title="Configure the app's SAML Settings"
/>

:::info Application username configuration
The **Application username** setting depends on whether you plan to use SCIM or not:
- **SSO only:** Use a unique value such as `Custom` / `user.getInternalProperty("id")` (recommended in earlier steps).
- **SSO and SCIM:** Use **Email** format. SCIM requires the username to be in email address format and to be the same value as the email attribute.
:::

Use the **Attribute Statements** and **Group Attribute Statements** forms to
map your organization's Okta User and Group Attributes to the format that
<Constant name="dbt" /> expects.

Expected **User Attribute Statements**:

| Name           | Name format | Value                | Description                |
| -------------- | ----------- | -------------------- | -------------------------- |
| `email`        | Unspecified | `user.email`      | _The user's email address_ |
| `first_name`   | Unspecified | `user.firstName`  | _The user's first name_    |
| `last_name`    | Unspecified | `user.lastName`   | _The user's last name_     |


Expected **Group Attribute Statements**:

| Name     | Name format | Filter        | Value | Description                           |
| -------- | ----------- | ------------- | ----- | ------------------------------------- |
| `groups` | Unspecified | Matches regex | `.*`  | _The groups that the user belongs to_ |


**Note:** You may use a more restrictive Group Attribute Statement than the
example shown above. For example, if all of your <Constant name="dbt" /> groups start with
`DBT_CLOUD_`, you may use a filter like `Starts With: DBT_CLOUD_`. **Okta
only returns 100 groups for each user, so if your users belong to more than 100
IdP groups, you will need to use a more restrictive filter**. Please contact
support if you have any questions.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-3-saml-settings-bottom.png"
    title="Configure the app's User and Group Attribute Statements"
/>

Click **Next** to continue.

### Finish Okta setup

Select *I'm an Okta customer adding an internal app*, and select *This is an
internal app that we have created*. Click **Finish** to finish setting up the
app.

<Lightbox
    collapsed={false}
    src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-4-feedback.png"
    title="Finishing setup in Okta"
/>

### View setup instructions

On the next page, click **View Setup Instructions**. In the steps below,
you'll supply these values in your <Constant name="dbt" /> Account Settings to complete
the integration between Okta and <Constant name="dbt" />.

<Lightbox
    collapsed={true}
    src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-5-view-instructions.png"
    title="Viewing the configured application"
/>

<Lightbox
    collapsed={true}
    src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-5-instructions.png"
    title="Application setup instructions"
/>

## Configuration in dbt

To complete setup, follow the steps below in <Constant name="dbt" />.

### Supplying credentials

First, navigate to the **Enterprise &gt; Single Sign On** page under Account
Settings. Next, click the **Edit** button and supply the following SSO details:


| Field | Value |
| ----- | ----- |
| **Log&nbsp;in&nbsp;with** | Okta |
| **Identity&nbsp;Provider&nbsp;SSO&nbsp;Url** | Paste the **Identity Provider Single Sign-On URL** shown in the Okta setup instructions |
| **Identity&nbsp;Provider&nbsp;Issuer** | Paste the **Identity Provider Issuer** shown in the Okta setup instructions |
| **X.509&nbsp;Certificate** | Paste the **X.509 Certificate** shown in the Okta setup instructions; <br />**Note:** When the certificate expires, an Okta admin will have to generate a new one to be pasted into <Constant name="dbt" /> for uninterrupted application access. |


<Lightbox
    collapsed={false}
    src="/img/docs/dbt-platform/dbt-platform-enterprise/okta/okta-6-setup-integration.png"
    title="Configuring the application in dbt"
/>

21. Click **Save** to complete setup for the Okta integration. From
    here, you can navigate to the URL generated for your account's _slug_ to
    test logging in with Okta. Additionally, users added the Okta app
    will be able to log in to <Constant name="dbt" /> from Okta directly.

<Snippet path="login_url_note" />


## Setting up RBAC
Now you have completed setting up SSO with Okta, the next steps will be to set up
[RBAC groups](/docs/platform/manage-access/about-user-access#role-based-access-control-) to complete your access control configuration.

:::tip Set up SCIM
Now that you've set up SSO with Okta, you can [set up SCIM](/docs/platform/manage-access/scim-okta) to automate user and group provisioning (and license assignment for Okta).
:::

## FAQ and troubleshooting

For common questions and troubleshooting guidance — including issues with email verification, MFA prompts, and SSO group mapping behavior — refer to [SSO FAQs and troubleshooting](/docs/platform/manage-access/sso-faq).

## Learn more

<WistiaVideo id="xtmk0rrk5k" paddingTweak="62.25%" />
