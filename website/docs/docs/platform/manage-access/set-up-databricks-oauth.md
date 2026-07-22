---
title: "Set up Databricks OAuth"
description: "Learn how dbt administrators and users can use Databricks OAuth to control access in a dbt account."
id: "set-up-databricks-oauth"
---

# Set up Databricks OAuth <Lifecycle status="managed, managed_plus" />

<Constant name="dbt_platform" /> accounts on Enterprise and Enterprise+ plans support developer OAuth ([OAuth for partner solutions](https://docs.databricks.com/en/integrations/manage-oauth.html)) with Databricks. When you enable Databricks OAuth for a <Constant name="dbt" /> project, all developers must authenticate with Databricks in order to use the <Constant name="studio_ide" />.

### Development and deployment authentication

Databricks OAuth uses user-to-machine (U2M) authentication for interactive development in the <Constant name="studio_ide" />. It applies to development credentials only.

Deployment environments use separate credentials configured at the environment level. They do not use developer OAuth. For deployment and batch jobs, configure token-based credentials in a [deployment connection profile](/docs/platform/about-profiles). A [service principal](https://docs.databricks.com/en/admin/users-groups/service-principals.html) token is recommended for production and non-production jobs.

For setup steps, refer to [Defining your dbt deployment environment](/guides/set-up-your-databricks-dbt-project#defining-your-dbt-deployment-environment). For more information on deployment environments, refer to [Deploy environments](/docs/deploy/deploy-environments).

### Configure Databricks OAuth (Databricks admin)

To get started, add dbt as a custom OAuth application in Databricks.

The following steps use the Databricks UI. Alternatively, use the [Databricks CLI](https://docs.databricks.com/en/integrations/enable-disable-oauth.html#enable-custom-oauth-applications-using-the-cli). Use the [redirect URLs for your region](#redirect-urls-by-region) for either method.

1. Log in to the [account console](https://accounts.cloud.databricks.com/?_ga=2.255771976.118201544.1712797799-1002575874.1704693634) and click the **Settings** icon in the sidebar.

2. On the **App connections** tab, click **Add connection**.

3. Enter the following details:
   - A name for your connection.
   - The redirect URLs for your OAuth connection. Use both URLs listed for your account region.
   - For Access scopes, the APIs the application should have access to:
      - For BI applications, the SQL scope is required to allow the connected app to access Databricks SQL APIs (this is required for SQL models).
      - For applications that need to access Databricks APIs for purposes other than querying, the ALL APIs scope is required (this is required if running Python models).
   - The access token time-to-live (TTL) in minutes. Default: 60.
   - The refresh token time-to-live (TTL) in minutes. Default: 10080.
4. Select **Generate a client secret**. Copy and securely store the client secret. The client secret will not be available later.

#### Redirect URLs by region

Use the redirect URLs that correspond to your dbt account region when configuring Databricks OAuth.

<!-- we'll want to remove this callout sometime in 2027 -->
:::info
As part of the account-specific URL migration, some customers should update OAuth redirect URLs and other integration settings. Existing getdbt.com region URLs continue to support integrations until November 1st, 2026, unless otherwise specified. For more migration timing and account-specific URL guidance, refer to the [account URL migration documentation](/docs/platform/about-platform/account-url-migration).
:::

<SimpleTable>

| Region | Redirect URLs |
| ------ | ----- |
| **US multi-tenant** | https://cloud.getdbt.com/callback <br /> https://cloud.getdbt.com/complete/databricks |
| **US cell 1** | https://us1.dbt.com/callback <br /> https://us1.dbt.com/complete/databricks |
| **EMEA** | https://emea.dbt.com/callback <br /> https://emea.dbt.com/complete/databricks |
| **APAC** | https://au.dbt.com/callback <br /> https://au.dbt.com/complete/databricks |
| **Single tenant** | https://INSTANCE_NAME.getdbt.com/callback <br /> https://INSTANCE_NAME.getdbt.com/complete/databricks

</SimpleTable>

### Configure the Connection in dbt (dbt project admin)

Now that you have an OAuth app set up in Databricks, you'll need to add the client ID and secret to <Constant name="dbt" />. To do so:

1. From <Constant name="dbt" />, click on your account name in the left side menu and select **Account settings**.
2. Select **Projects** from the menu.
3. Choose your project from the list.
4. Click **Connections** and select the Databricks connection.
5. Click **Edit**.
6. Under the **Optional settings** section, add the **OAuth Client ID** and **OAuth Client Secret** from the Databricks OAuth app.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dbt-platform-enterprise/DBX-auth/dbt-databricks-oauth.png" title="Add Databricks OAuth credentials to the connection" />

### Authenticating to Databricks (Studio IDE developer)

Once the Databricks OAuth connection is set up for a <Constant name="dbt" /> project, each <Constant name="dbt" /> user will need to authenticate with Databricks in order to use the <Constant name="studio_ide" />. To do so:

1. From <Constant name="dbt" />, click on your account name in the left side menu and select **Account settings**.
2. Under **Your profile**, select **Credentials**.
3. Choose your project from the list and click **Edit**.
4. Select **OAuth** as the authentication method, and click **Save**.
5. Finalize by clicking the **Connect Databricks Account** button.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dbt-platform-enterprise/DBX-auth/dbt-databricks-oauth-user.png" title="Connect your Databricks account from development credentials" />

You will then be redirected to Databricks and asked to approve the connection. This redirects you back to <Constant name="dbt" />. You should now be an authenticated Databricks user, ready to use the <Constant name="studio_ide" />.

### Studio OAuth flow

Once a user has authorized <Constant name="dbt" /> with Databricks, Databricks returns a refresh token to the <Constant name="dbt" /> application.

At the start of each <Constant name="studio_ide" /> session, <Constant name="dbt" /> exchanges the refresh token for an access token, which it uses to connect to Databricks and execute queries on the user's behalf. <Constant name="dbt" /> does not fetch new access tokens during an active session. When the access token expires (default: 60 minutes), the user must restart the <Constant name="studio_ide" /> to continue development.

The refresh token lifetime is set when you configure the OAuth app in Databricks (default refresh token TTL: 10080 minutes). When a user's refresh token expires, they must click **Connect Databricks Account** again to re-authenticate.
