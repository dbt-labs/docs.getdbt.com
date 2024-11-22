---
title: "Set up Databricks OAuth"
description: "Learn how dbt Cloud administrators can use Databricks OAuth to control access in a dbt Cloud account."
id: "set-up-databricks-oauth"
---

# Set up Databricks OAuth <Lifecycle status="enterprise" />

dbt Cloud supports developer OAuth ([OAuth for partner solutions](https://docs.databricks.com/en/integrations/manage-oauth.html)) with Databricks, providing an additional layer of security for dbt enterprise users. When you enable Databricks OAuth for a dbt Cloud project, all dbt Cloud developers must authenticate with Databricks in order to use the dbt Cloud IDE. The project's deployment environments will still leverage the Databricks authentication method set at the environment level.


Current limitation:
- The current experience requires the IDE to be restarted every hour (access tokens expire after 1 hour - [workaround](https://docs.databricks.com/en/integrations/manage-oauth.html#override-the-default-token-lifetime-policy-for-dbt-core-power-bi-or-tableau-desktop))
 

### Configure Databricks OAuth (Databricks admin)

To get started, you will need to [add dbt as an OAuth application](https://docs.databricks.com/en/integrations/configure-oauth-dbt.html) with Databricks. There are two ways of configuring this application (CLI or Databricks UI). Here's how you can set this up in the Databricks UI:

1. Log in to the [account console](https://accounts.cloud.databricks.com/?_ga=2.255771976.118201544.1712797799-1002575874.1704693634) and click the **Settings** icon in the sidebar.

2. On the **App connections** tab, click **Add connection**.

3. Enter the following details:
   - A name for your connection.
   - The redirect URLs for your OAuth connection, which you can find in the table later in this section.
   - For Access scopes, the APIs the application should have access to:
      - For BI applications, the SQL scope is required to allow the connected app to access Databricks SQL APIs (this is required for SQL models).
      - For applications that need to access Databricks APIs for purposes other than querying, the ALL APIs scope is required (this is required if running Python models).
   - The access token time-to-live (TTL) in minutes. Default: 60.
   - The refresh token time-to-live (TTL) in minutes. Default: 10080.
4. Select **Generate a client secret**. Copy and securely store the client secret. The client secret will not be available later.

You can use the following table to set up the redirect URLs for your application with dbt Cloud:

| Region | Redirect URLs |
| ------ | ----- |
| **US multi-tenant** | https://cloud.getdbt.com/callback <br /> https://cloud.getdbt.com/complete/databricks |
| **US cell 1** | https://us1.dbt.com/callback <br /> https://us1.dbt.com/complete/databricks |
| **EMEA** | https://emea.dbt.com/callback <br /> https://emea.dbt.com/complete/databricks |
| **APAC** | https://au.dbt.com/callback <br /> https://au.dbt.com/complete/databricks |
| **Single tenant** | https://INSTANCE_NAME.getdbt.com/callback <br /> https://INSTANCE_NAME.getdbt.com/complete/databricks


### Configure the Connection in dbt Cloud (dbt Cloud project admin)

Now that you have an OAuth app set up in Databricks, you'll need to add the client ID and secret to dbt Cloud. To do so:
 - From dbt Cloud, click on your account name in the left side menu and select **Account settings**
 - Select **Projects** from the menu
 - Choose your project from the list
 - Select **Connection** to edit the connection details
 - Add the `OAuth Client ID` and `OAuth Client Secret` from the Databricks OAuth app under the **Optional Settings** section

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/DBX-auth/dbt-databricks-oauth.png" title="Adding Databricks OAuth application client ID and secret to dbt Cloud" />

### Authenticating to Databricks (dbt Cloud IDE developer)

Once the Databricks connection via OAuth is set up for a dbt Cloud project, each dbt Cloud user will need to authenticate with Databricks in order to use the IDE. To do so:

- From dbt Cloud, click on your account name in the left side menu and select **Account settings**
- Select **Profile settings**.
- Select **Credentials**.
- Choose your project from the list
- Select `OAuth` as the authentication method, and click **Save**
- Finalize by clicking the **Connect Databricks Account** button

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/DBX-auth/dbt-databricks-oauth-user.png" title="Connecting to Databricks from an IDE user profile" />

You will then be redirected to Databricks and asked to approve the connection. This redirects you back to dbt Cloud. You should now be an authenticated Databricks user, ready to use the dbt Cloud IDE.
