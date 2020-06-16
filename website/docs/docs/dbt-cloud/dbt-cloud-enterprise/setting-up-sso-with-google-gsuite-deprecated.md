---
title: "Setting up SSO with Google GSuite (Deprecated)"
id: "setting-up-sso-with-google-gsuite-deprecated"
---


:::info dbt Cloud Enterprise
This guide describes a feature of the dbt Cloud Enterprise plan. If you’re interested in learning more about an Enterprise plan, contact us at sales@getdbt.com.
:::

dbt Cloud Enterprise supports single-sign on via Google GSuite. You will need permissions to create and manage a new Google OAuth2 application, as well as access to enable the Google Admin SDK. Currently supported features include:

* SP-initiated SSO
* Just-in-time provisioning

This guide outlines the setup process for authenticating to dbt Cloud with Google GSuite. After following the steps below, please contact your account manager or support (support@getdbt.com) to complete the setup process.

## Configuration

Log into the Google Developer Console. Create a new project or use an existing project. Navigate to **APIs & Services** &gt; **Credentials**.

On the **Credentials** page you will need to create a new set of credentials to allow dbt Cloud to authenticate with your GSuite org. Click **Create Credentials**, and then select "OAuth Client ID". Select "Web Application" as the Application type.

On the **Create OAuth client ID** page, enter the following:

- **Name**: dbt Cloud
- **Authorized Javascript Origins**: https://cloud.getdbt.com
- **Authorized Redirect URIs**: https://auth.getdbt.com/login/callback

Press "Create". A popup will appear with a **Client ID** and **Client Secret**. Write these down, you will need them later!

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/0ccb854-Screen_Shot_2019-12-03_at_10.11.15_AM.png" title="The 'Create Oauth client ID' page"/>

Next, you will need to enable the Admin SDK for this application so that dbt Cloud can request information about your GSuite users. In the search bar, search for the "Admin SDK" API. Select it, and press "Enable" to enable it for this project.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/7f36f50-Screen_Shot_2019-12-03_at_10.15.01_AM.png" title="The 'Admin SDK' page"/>

To finish your setup, you will need to provide support the following values:

- The **Client ID** you generated on the "Create Oauth client ID" page.
- The **Client Secret** you generated on the "Create Oauth client ID" page.
- The domain of your Google GSuite domain.

Send these values to your account manager, or via support (either in-app via Intercom, or via email at support@getdbt.com), and we'll get back to you when the integration is ready to use.
