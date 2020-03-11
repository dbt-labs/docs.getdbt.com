---
title: "Setting up SSO with Azure Active Directory"
id: "setting-up-enterprise-sso-with-azure-active-directory"
---


<Callout type="info" title="Enterprise Feature">

This guide describes a feature of the dbt Cloud Enterprise plan. If you’re interested in learning more about an Enterprise plan, contact us at sales@getdbt.com.

</Callout>

dbt Cloud Enterprise supports single-sign on via Azure Active Directory (AD). You will need permissions to create and manage a new Azure AD application. Currently supported features include:

* IdP-initiated SSO
* SP-initiated SSO
* Just-in-time provisioning

This guide outlines the setup process for authenticating to dbt Cloud with Azure AD. After following the steps below, please contact support (support@getdbt.com) to complete the setup process.

## Configuration

Log into your Azure portal. Using the **Azure Active Directory** page, you will need to select the appropriate directory, and then register a new application. 

Under **Manage**, select **App registrations**. Click **+ New Registration** to start creating the app. 

On the **Register an application** page, configure the new application using the following settings:

- **Name**: dbt Cloud
- **Supported account types**: choose an appropriate setting. If you aren't sure, choose "Accounts in this organizational directory only"
- **Redirect URI**: select "Web", and then enter `https://auth.getdbt.com/login/callback?connection=<your-deployment-id>` (replace `<your-deployment-id>` with the deployment id you received with your setup instructions.)

Click "Register" to continue.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/21ea0d3-Screen_Shot_2019-07-25_at_9.31.26_AM.png" title="The 'Register an application' page"/>

Next, you will need to configure permissions. Under **Manage**, select **API permissions**. Click **+Add a permission** and add the following permissions:

- Under **Azure Active Directory Graph**, select **Delegated permissions**. Then under "User", select **User.Read**, and under **Directory**, choose **Directory.AccessAsUser.All**.
- Under **Microsoft Graph**, select **Delegated permissions**. Then under **Directory**, choose **Directory.AccessAsUser.All**.

Save these permissions, and then press **Grant admin consent** at the bottom of the page to grant admin consent for this directory on behalf of all of your users.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/3b9da88-Screen_Shot_2019-07-25_at_9.54.53_AM.png" title="'API permissions' page after configuration"/>

Next you will need to create a client secret for the dbt Cloud application. Under **Manage**, choose **Certificates & secrets**. Click **+ New client secret**, under **Description** choose "dbt Cloud", and under **Expires**, choose "Never".

Copy the generated value. You will need it later.

To finish your setup, you will need to provide support the following values:

- The **Application (client) ID** of your new application (you can find this by clicking **Overview** under **Manage** on your new application).
- The **Client Secret** you generated in the last step.
- The domain of your Azure AD directory (you can find this on the Directory **Overview** page above the name of the directory)

Send these values to us via support (either in-app via Intercom, or via email at support@getdbt.com), and we'll get back to you when the Azure AD integration is ready to use.
