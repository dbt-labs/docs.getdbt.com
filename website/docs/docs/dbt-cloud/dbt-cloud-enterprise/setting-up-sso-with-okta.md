---
title: "Setting up SSO with Okta"
id: "setting-up-sso-with-okta"
---


<Callout type="info" title="Enterprise Feature">

This guide describes a feature of the dbt Cloud Enterprise plan. If you’re interested in learning more about an Enterprise plan, contact us at sales@getdbt.com.

</Callout>

dbt Cloud Enterprise supports single-sign on via Okta (using SAML). Currently supported features include:

* IdP-initiated SSO
* SP-initiated SSO
* Just-in-time provisioning

This guide outlines the setup process for authenticating to dbt Cloud with Okta. After following the steps below, please contact support (support@getdbt.com) to complete the setup process.

## Configuration

Log into your Okta account. You'll need administrator access to your Okta organization to follow this guide.

Using the Admin dashboard, you need to create a new app. To do this, first go to the Okta dashboard. Click **Admin** to go to the admin dashboard. Click **+ Add Applications** on the right side of the screen. Finally, click **Create New App**.

Next, you'll configure the dbt Cloud application. On the **Create a New Application Integration** modal, select *Web* as the **Platform**, and *SAML 2.0* as the **Sign on method**. Click Create to continue.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/137b611-Screen_Shot_2019-04-25_at_6.10.43_PM.png" title="The 'Create a New Application Integration' modal"/>

On the *General Settings* page, enter the following:

* **App name**: dbt Cloud
* **App logo** (optional): You can optionally [download this dbt logo](https://raw.githubusercontent.com/fishtown-analytics/corp/master/assets/dbt/dbt-logo-75x75.png), and upload it to Okta to use as the logo for this app.

Click **Next** to continue.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/ae2045a-Screen_Shot_2019-04-25_at_6.05.12_PM.png" title="The 'General Settings' page"/>

On the **SAML Settings** page, enter the following values:

* **Single sign on URL**: `https://auth.getdbt.com/login/callback?connection=<your-deployment-id>`
* **Audience URI (SP Entity ID)**: `urn:auth0:dbt-cloud:<your-deployment-id>`

Replace `<your-deployment-id>` with your dbt Cloud deployment ID. If you aren't sure what value you should use, please contact support (support@getdbt.com).

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/61d2b48-Screen_Shot_2019-04-25_at_6.05.23_PM.png" title="The 'SAML Settings' page"/>

Under **Attribute Statements**, enter the following:

* **Name**: email
* **Name format**: Unspecified
* **Value**: `${user.email}`

Click **Next** to continue.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/51f1bb7-Screen_Shot_2019-04-25_at_6.05.32_PM.png" title="Attribute Statements on the 'SAML Settings' page"/>

Lastly, select *I'm an Okta customer adding an internal app*, and select *This is an internal app that we have created*. Click **Finish** to finish setting up the app.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/41b00ff-Screen_Shot_2019-04-25_at_6.06.08_PM.png" title="Final Setup"/>

On the next page, click **View Setup Instructions**. There are three values here that you'll need to provide us to complete your account setup: *Identity Provider Single Sign-On URL*, *Identity Provider Issuer*, and *X.509 Certificate*. Send these values to us via support (either in-app via Intercom, or via email at support@getdbt.com), and we'll get back to you when the Okta integration is ready to use.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/2be2b70-Screen_Shot_2019-04-25_at_6.06.31_PM.png" title="SAML Credentials"/>
